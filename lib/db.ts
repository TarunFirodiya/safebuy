// Thin typed wrapper around the D1 binding. Route handlers should call
// `getDb()` instead of reaching into `getCloudflareContext()` directly.

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getDb(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) {
    throw new Error(
      "D1 binding `DB` is not configured. Did you paste the database_id " +
        "into wrangler.jsonc and run `wrangler d1 execute safebuy ...`?",
    );
  }
  return env.DB;
}

// ──────────────────────────────────────────────────────────────────────────
// Row shapes (match migrations/0001_init.sql exactly)
// ──────────────────────────────────────────────────────────────────────────

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: number;
  updated_at: number;
}

export type OrderStatus =
  | "created"
  | "attempted"
  | "paid"
  | "failed"
  | "refunded";

export interface OrderRow {
  id: string;
  razorpay_order_id: string;
  customer_id: string;
  sku_type: "service" | "bundle";
  sku_slug: string;
  sku_name: string;
  amount_paise: number;
  currency: string;
  status: OrderStatus;
  coupon_code: string | null;
  discount_paise: number;
  notes: string | null;
  receipt: string;
  fulfilled_at: number | null;
  created_at: number;
  paid_at: number | null;
}

export type PaymentStatus =
  | "created"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded";

export interface PaymentRow {
  id: string;
  order_id: string;
  razorpay_payment_id: string;
  amount_paise: number;
  currency: string;
  method: string | null;
  status: PaymentStatus;
  email: string | null;
  contact: string | null;
  error_code: string | null;
  error_description: string | null;
  raw_payload: string;
  created_at: number;
}

// ──────────────────────────────────────────────────────────────────────────
// Customer helpers
// ──────────────────────────────────────────────────────────────────────────

/**
 * Upserts by (email, phone). If an existing match is found, it is updated with
 * the latest name (users sometimes correct typos across sessions).
 */
export async function upsertCustomer(
  db: D1Database,
  input: { name: string; email: string; phone: string },
): Promise<CustomerRow> {
  const now = Date.now();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const name = input.name.trim();

  const existing = await db
    .prepare(
      "SELECT * FROM customers WHERE email = ?1 AND phone = ?2 LIMIT 1",
    )
    .bind(email, phone)
    .first<CustomerRow>();

  if (existing) {
    await db
      .prepare(
        "UPDATE customers SET name = ?1, updated_at = ?2 WHERE id = ?3",
      )
      .bind(name, now, existing.id)
      .run();
    return { ...existing, name, updated_at: now };
  }

  const id = `cus_${crypto.randomUUID().replace(/-/g, "")}`;
  await db
    .prepare(
      `INSERT INTO customers (id, name, email, phone, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?5)`,
    )
    .bind(id, name, email, phone, now)
    .run();

  return { id, name, email, phone, created_at: now, updated_at: now };
}

// ──────────────────────────────────────────────────────────────────────────
// Order helpers
// ──────────────────────────────────────────────────────────────────────────

export async function insertOrder(
  db: D1Database,
  row: Omit<OrderRow, "fulfilled_at" | "paid_at">,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO orders
        (id, razorpay_order_id, customer_id, sku_type, sku_slug, sku_name,
         amount_paise, currency, status, coupon_code, discount_paise, notes,
         receipt, created_at)
       VALUES
        (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)`,
    )
    .bind(
      row.id,
      row.razorpay_order_id,
      row.customer_id,
      row.sku_type,
      row.sku_slug,
      row.sku_name,
      row.amount_paise,
      row.currency,
      row.status,
      row.coupon_code,
      row.discount_paise,
      row.notes,
      row.receipt,
      row.created_at,
    )
    .run();
}

export async function getOrderById(
  db: D1Database,
  id: string,
): Promise<OrderRow | null> {
  return await db
    .prepare("SELECT * FROM orders WHERE id = ?1 LIMIT 1")
    .bind(id)
    .first<OrderRow>();
}

export async function markOrderPaid(
  db: D1Database,
  id: string,
  paidAt: number,
): Promise<void> {
  await db
    .prepare(
      `UPDATE orders
         SET status = 'paid',
             paid_at = COALESCE(paid_at, ?2)
       WHERE id = ?1 AND status != 'paid'`,
    )
    .bind(id, paidAt)
    .run();
}

export async function markOrderFailed(
  db: D1Database,
  id: string,
): Promise<void> {
  await db
    .prepare(
      "UPDATE orders SET status = 'failed' WHERE id = ?1 AND status = 'created'",
    )
    .bind(id)
    .run();
}

export async function markOrderFulfilled(
  db: D1Database,
  id: string,
  fulfilledAt: number,
): Promise<void> {
  await db
    .prepare(
      "UPDATE orders SET fulfilled_at = ?2 WHERE id = ?1 AND fulfilled_at IS NULL",
    )
    .bind(id, fulfilledAt)
    .run();
}

// ──────────────────────────────────────────────────────────────────────────
// Payment helpers
// ──────────────────────────────────────────────────────────────────────────

export async function upsertPayment(
  db: D1Database,
  row: PaymentRow,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO payments
        (id, order_id, razorpay_payment_id, amount_paise, currency, method,
         status, email, contact, error_code, error_description, raw_payload,
         created_at)
       VALUES
        (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)
       ON CONFLICT(id) DO UPDATE SET
         status            = excluded.status,
         method            = excluded.method,
         email             = excluded.email,
         contact           = excluded.contact,
         error_code        = excluded.error_code,
         error_description = excluded.error_description,
         raw_payload       = excluded.raw_payload`,
    )
    .bind(
      row.id,
      row.order_id,
      row.razorpay_payment_id,
      row.amount_paise,
      row.currency,
      row.method,
      row.status,
      row.email,
      row.contact,
      row.error_code,
      row.error_description,
      row.raw_payload,
      row.created_at,
    )
    .run();
}

// ──────────────────────────────────────────────────────────────────────────
// Webhook idempotency
// ──────────────────────────────────────────────────────────────────────────

/**
 * Atomically records a webhook event. Returns true if this is the first time
 * we've seen `eventId`; false if it was already logged (caller should ack
 * without reprocessing).
 */
export async function claimWebhookEvent(
  db: D1Database,
  eventId: string,
  eventName: string,
  payload: string,
): Promise<boolean> {
  try {
    await db
      .prepare(
        `INSERT INTO webhook_events (id, event, received_at, payload)
         VALUES (?1, ?2, ?3, ?4)`,
      )
      .bind(eventId, eventName, Date.now(), payload)
      .run();
    return true;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("UNIQUE") || msg.includes("constraint")) return false;
    throw e;
  }
}

export async function markWebhookEventProcessed(
  db: D1Database,
  eventId: string,
  error?: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE webhook_events
         SET processed_at = ?2, error = ?3
       WHERE id = ?1`,
    )
    .bind(eventId, Date.now(), error ?? null)
    .run();
}
