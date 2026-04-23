// POST /api/razorpay/create-order
//
// Accepts the minimal checkout payload from the client, authoritatively
// resolves the SKU price server-side, creates a Razorpay Order, writes the
// customer + draft order rows to D1, and returns the Razorpay key + order id
// that the client needs to open the checkout modal.
//
// The endpoint is intentionally dumb about fulfillment — side effects (email,
// WhatsApp, getform push) only fire from the webhook handler after we receive
// `payment.captured`.

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  CheckoutValidationError,
  SkuLookupError,
  buildReceiptId,
  resolveSku,
  validateCustomerInput,
  type SkuType,
} from "@/lib/checkout";
import { getDb, insertOrder, upsertCustomer } from "@/lib/db";
import { createOrder as createRazorpayOrder } from "@/lib/razorpay";

interface CreateOrderRequest {
  skuType: SkuType;
  skuSlug: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

interface CreateOrderResponse {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amountPaise: number;
  currency: "INR";
  skuName: string;
  receipt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { env } = await getCloudflareContext({ async: true });

  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    console.error("[create-order] Razorpay credentials not configured");
    return NextResponse.json(
      { error: "Payments are temporarily unavailable. Please try again soon." },
      { status: 503 },
    );
  }

  let body: CreateOrderRequest;
  try {
    body = (await req.json()) as CreateOrderRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  // ── Validate + resolve SKU ────────────────────────────────────────────
  let sku;
  try {
    if (body.skuType !== "service" && body.skuType !== "bundle") {
      throw new SkuLookupError("Unknown SKU type.");
    }
    if (typeof body.skuSlug !== "string" || body.skuSlug.length === 0) {
      throw new SkuLookupError("Missing SKU slug.");
    }
    sku = resolveSku(body.skuType, body.skuSlug);
  } catch (e) {
    const message =
      e instanceof SkuLookupError
        ? e.message
        : "Invalid SKU.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // ── Validate customer ─────────────────────────────────────────────────
  let customer;
  try {
    customer = validateCustomerInput(body.customer);
  } catch (e) {
    const message =
      e instanceof CheckoutValidationError
        ? e.message
        : "Invalid customer details.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // ── Persist customer + call Razorpay + persist draft order ────────────
  const db = await getDb();
  const now = Date.now();
  const receipt = buildReceiptId();

  let customerRow;
  try {
    customerRow = await upsertCustomer(db, customer);
  } catch (e) {
    console.error("[create-order] upsertCustomer failed", e);
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 },
    );
  }

  let razorpayOrder;
  try {
    razorpayOrder = await createRazorpayOrder(
      { keyId: env.RAZORPAY_KEY_ID, keySecret: env.RAZORPAY_KEY_SECRET },
      {
        amountPaise: sku.amountPaise,
        receipt,
        notes: {
          sku_type: sku.type,
          sku_slug: sku.slug,
          sku_name: sku.name,
          customer_id: customerRow.id,
          customer_email: customerRow.email,
          customer_phone: customerRow.phone,
          env: env.RAZORPAY_ENV,
        },
      },
    );
  } catch (e) {
    console.error("[create-order] Razorpay createOrder failed", e);
    return NextResponse.json(
      {
        error:
          "Couldn't reach the payment gateway. Please retry in a moment.",
      },
      { status: 502 },
    );
  }

  try {
    await insertOrder(db, {
      id: razorpayOrder.id,
      razorpay_order_id: razorpayOrder.id,
      customer_id: customerRow.id,
      sku_type: sku.type,
      sku_slug: sku.slug,
      sku_name: sku.name,
      amount_paise: sku.amountPaise,
      currency: "INR",
      status: "created",
      coupon_code: null,
      discount_paise: 0,
      notes: JSON.stringify({
        razorpay_env: env.RAZORPAY_ENV,
        source: "web-checkout",
      }),
      receipt,
      created_at: now,
    });
  } catch (e) {
    // Order already exists at Razorpay — we lose D1 state but the webhook
    // will reconcile. Log and continue.
    console.error("[create-order] insertOrder failed; webhook will reconcile", e);
  }

  const response: CreateOrderResponse = {
    razorpayOrderId: razorpayOrder.id,
    razorpayKeyId: env.RAZORPAY_KEY_ID,
    amountPaise: sku.amountPaise,
    currency: "INR",
    skuName: sku.name,
    receipt,
    customer: customerRow,
  };

  return NextResponse.json(response, { status: 200 });
}
