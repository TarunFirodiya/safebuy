// POST /api/razorpay/webhook
//
// Receives Razorpay webhook events. Performs:
//   1. HMAC-SHA256 signature verification against the raw body
//   2. Idempotency dedupe via `webhook_events` (x-razorpay-event-id)
//   3. Order + payment state updates in D1
//   4. Side-effect fan-out (email, WhatsApp, getform push) — TODO(phase2)
//
// Configure the endpoint in Razorpay Dashboard → Settings → Webhooks:
//   URL:      https://<your-domain>/api/razorpay/webhook
//   Events:   payment.captured, payment.failed, payment.authorized,
//             order.paid, refund.processed
//   Secret:   run `pnpm wrangler secret put RAZORPAY_WEBHOOK_SECRET`

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  claimWebhookEvent,
  getDb,
  getOrderById,
  markOrderFailed,
  markOrderFulfilled,
  markOrderPaid,
  markWebhookEventProcessed,
  upsertPayment,
  type PaymentStatus,
} from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";

interface RazorpayWebhookPayload {
  entity: "event";
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        method?: string;
        status: string;
        email?: string;
        contact?: string;
        error_code?: string;
        error_description?: string;
      };
    };
    order?: {
      entity: {
        id: string;
        amount: number;
        amount_paid: number;
        status: string;
      };
    };
    refund?: {
      entity: {
        id: string;
        payment_id: string;
        amount: number;
        status: string;
      };
    };
  };
  created_at: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.RAZORPAY_WEBHOOK_SECRET) {
    console.error("[webhook] RAZORPAY_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const signatureHeader = req.headers.get("x-razorpay-signature");
  const eventId = req.headers.get("x-razorpay-event-id");
  const rawBody = await req.text();

  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const signatureValid = await verifyWebhookSignature(
    env.RAZORPAY_WEBHOOK_SECRET,
    rawBody,
    signatureHeader,
  );
  if (!signatureValid) {
    console.warn("[webhook] signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: RazorpayWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Some Razorpay test events don't carry an event id header. Fall back to a
  // synthetic key derived from (event, entity id, timestamp).
  const idempotencyKey =
    eventId ?? deriveSyntheticEventId(payload);

  const db = await getDb();
  const firstSeen = await claimWebhookEvent(
    db,
    idempotencyKey,
    payload.event,
    rawBody,
  );
  if (!firstSeen) {
    // Already processed in an earlier delivery. Ack with 200 so Razorpay
    // stops retrying.
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    await handleEvent(db, payload, env);
    await markWebhookEventProcessed(db, idempotencyKey);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[webhook] handler error", message, e);
    await markWebhookEventProcessed(db, idempotencyKey, message);
    // Return 500 so Razorpay retries. Our idempotency log is keyed on event
    // id, so the retry will find `processed_at IS NOT NULL` and bail out if
    // we eventually succeed; for now every retry re-runs.
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function deriveSyntheticEventId(payload: RazorpayWebhookPayload): string {
  const entityId =
    payload.payload.payment?.entity.id ??
    payload.payload.order?.entity.id ??
    payload.payload.refund?.entity.id ??
    "unknown";
  return `${payload.event}:${entityId}:${payload.created_at}`;
}

async function handleEvent(
  db: D1Database,
  payload: RazorpayWebhookPayload,
  env: CloudflareEnv,
): Promise<void> {
  const event = payload.event;
  const payment = payload.payload.payment?.entity;
  const order = payload.payload.order?.entity;
  const refund = payload.payload.refund?.entity;

  if (event === "payment.authorized" && payment) {
    await upsertPayment(db, {
      id: payment.id,
      order_id: payment.order_id,
      razorpay_payment_id: payment.id,
      amount_paise: payment.amount,
      currency: payment.currency ?? "INR",
      method: payment.method ?? null,
      status: mapPaymentStatus(payment.status),
      email: payment.email ?? null,
      contact: payment.contact ?? null,
      error_code: null,
      error_description: null,
      raw_payload: JSON.stringify(payment),
      created_at: Date.now(),
    });
    return;
  }

  if (event === "payment.captured" && payment) {
    await upsertPayment(db, {
      id: payment.id,
      order_id: payment.order_id,
      razorpay_payment_id: payment.id,
      amount_paise: payment.amount,
      currency: payment.currency ?? "INR",
      method: payment.method ?? null,
      status: "captured",
      email: payment.email ?? null,
      contact: payment.contact ?? null,
      error_code: null,
      error_description: null,
      raw_payload: JSON.stringify(payment),
      created_at: Date.now(),
    });
    await markOrderPaid(db, payment.order_id, Date.now());
    await fulfillOrder(db, payment.order_id, env);
    return;
  }

  if (event === "order.paid" && order) {
    // Redundant with payment.captured in most cases, but harmless thanks to
    // the paid-status guard in markOrderPaid.
    await markOrderPaid(db, order.id, Date.now());
    await fulfillOrder(db, order.id, env);
    return;
  }

  if (event === "payment.failed" && payment) {
    await upsertPayment(db, {
      id: payment.id,
      order_id: payment.order_id,
      razorpay_payment_id: payment.id,
      amount_paise: payment.amount,
      currency: payment.currency ?? "INR",
      method: payment.method ?? null,
      status: "failed",
      email: payment.email ?? null,
      contact: payment.contact ?? null,
      error_code: payment.error_code ?? null,
      error_description: payment.error_description ?? null,
      raw_payload: JSON.stringify(payment),
      created_at: Date.now(),
    });
    await markOrderFailed(db, payment.order_id);
    return;
  }

  if (event === "refund.processed" && refund) {
    await db
      .prepare(
        `UPDATE payments SET status = 'refunded'
         WHERE razorpay_payment_id = ?1`,
      )
      .bind(refund.payment_id)
      .run();
    await db
      .prepare(
        `UPDATE orders SET status = 'refunded'
         WHERE id = (SELECT order_id FROM payments
                     WHERE razorpay_payment_id = ?1 LIMIT 1)`,
      )
      .bind(refund.payment_id)
      .run();
    return;
  }

  // Unhandled event types are logged but acked so Razorpay stops retrying.
  console.info("[webhook] no handler for", event);
}

function mapPaymentStatus(status: string): PaymentStatus {
  switch (status) {
    case "authorized":
      return "authorized";
    case "captured":
      return "captured";
    case "failed":
      return "failed";
    case "refunded":
      return "refunded";
    default:
      return "created";
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Fulfillment fan-out
// ──────────────────────────────────────────────────────────────────────────

/**
 * Triggers downstream side effects once an order is paid. Uses `fulfilled_at`
 * as a guard so retries and duplicate `order.paid`/`payment.captured` events
 * can't double-send notifications.
 *
 * Phase 2 wires these up:
 *   - Customer email via Resend
 *   - Ops email via Resend
 *   - WhatsApp via Kapso
 *   - Lead push to getform.io (getform endpoint)
 *   - GST invoice via Razorpay Invoices API
 */
async function fulfillOrder(
  db: D1Database,
  orderId: string,
  env: CloudflareEnv,
): Promise<void> {
  const order = await getOrderById(db, orderId);
  if (!order) {
    console.warn("[fulfill] order not found", orderId);
    return;
  }
  if (order.fulfilled_at) {
    return; // already fulfilled, skip
  }

  // ── Phase 2 integration points ───────────────────────────────────────
  // if (env.RESEND_API_KEY) { await sendCustomerEmail(order, env); }
  // if (env.RESEND_API_KEY) { await sendOpsEmail(order, env); }
  // if (env.KAPSO_API_KEY)  { await sendWhatsApp(order, env); }
  // if (env.GETFORM_PAYMENT_ENDPOINT) { await pushToGetform(order, env); }
  // await createGstInvoice(order, env);
  void env; // suppress unused-arg lint until phase 2 wires these in

  await markOrderFulfilled(db, order.id, Date.now());
}
