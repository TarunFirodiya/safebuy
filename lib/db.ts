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
  application_id: string | null;
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

export async function getCustomerById(
  db: D1Database,
  id: string,
): Promise<CustomerRow | null> {
  return await db
    .prepare("SELECT * FROM customers WHERE id = ?1 LIMIT 1")
    .bind(id)
    .first<CustomerRow>();
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
         receipt, application_id, created_at)
       VALUES
        (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)`,
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
      row.application_id,
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

// ──────────────────────────────────────────────────────────────────────────
// Applications (Atlys-style onboarding) — match migrations/0002_applications.sql
// ──────────────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "draft"
  | "documents_pending"
  | "documents_review"
  | "payment_pending"
  | "awaiting_consult"
  | "paid"
  | "in_progress"
  | "delivered"
  | "action_required"
  | "cancelled";

export interface ApplicationRow {
  id: string;
  access_token: string;
  customer_id: string | null;
  sku_type: "service" | "bundle";
  sku_slug: string;
  sku_name: string;
  status: ApplicationStatus;
  property_json: string | null;
  journey_json: string | null;
  order_id: string | null;
  created_at: number;
  updated_at: number;
}

export type DocumentUploadStatus = "pending" | "uploaded";
export type DocumentReviewStatus = "pending" | "accepted" | "rejected";

export interface ApplicationDocumentRow {
  id: string;
  application_id: string;
  requirement_key: string;
  requirement_label: string;
  storage_key: string | null;
  filename: string | null;
  content_type: string | null;
  size_bytes: number | null;
  upload_status: DocumentUploadStatus;
  review_status: DocumentReviewStatus;
  reviewer_note: string | null;
  created_at: number;
  updated_at: number;
}

export interface ApplicationEventRow {
  id: string;
  application_id: string;
  type: string;
  message: string;
  meta_json: string | null;
  created_at: number;
}

export async function createApplication(
  db: D1Database,
  input: {
    skuType: "service" | "bundle";
    skuSlug: string;
    skuName: string;
    journeyJson?: string | null;
    status?: ApplicationStatus;
  },
): Promise<ApplicationRow> {
  const now = Date.now();
  const id = `app_${crypto.randomUUID().replace(/-/g, "")}`;
  const accessToken = crypto.randomUUID();
  const status = input.status ?? "draft";

  await db
    .prepare(
      `INSERT INTO applications
        (id, access_token, sku_type, sku_slug, sku_name, status,
         journey_json, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?8)`,
    )
    .bind(
      id,
      accessToken,
      input.skuType,
      input.skuSlug,
      input.skuName,
      status,
      input.journeyJson ?? null,
      now,
    )
    .run();

  return {
    id,
    access_token: accessToken,
    customer_id: null,
    sku_type: input.skuType,
    sku_slug: input.skuSlug,
    sku_name: input.skuName,
    status,
    property_json: null,
    journey_json: input.journeyJson ?? null,
    order_id: null,
    created_at: now,
    updated_at: now,
  };
}

export async function getApplicationById(
  db: D1Database,
  id: string,
): Promise<ApplicationRow | null> {
  return await db
    .prepare("SELECT * FROM applications WHERE id = ?1 LIMIT 1")
    .bind(id)
    .first<ApplicationRow>();
}

export async function getApplicationByToken(
  db: D1Database,
  token: string,
): Promise<ApplicationRow | null> {
  return await db
    .prepare("SELECT * FROM applications WHERE access_token = ?1 LIMIT 1")
    .bind(token)
    .first<ApplicationRow>();
}

export async function updateApplicationProperty(
  db: D1Database,
  id: string,
  propertyJson: string,
): Promise<void> {
  await db
    .prepare(
      "UPDATE applications SET property_json = ?2, updated_at = ?3 WHERE id = ?1",
    )
    .bind(id, propertyJson, Date.now())
    .run();
}

export async function attachCustomerToApplication(
  db: D1Database,
  id: string,
  customerId: string,
): Promise<void> {
  await db
    .prepare(
      "UPDATE applications SET customer_id = ?2, updated_at = ?3 WHERE id = ?1",
    )
    .bind(id, customerId, Date.now())
    .run();
}

export async function setApplicationStatus(
  db: D1Database,
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  await db
    .prepare(
      "UPDATE applications SET status = ?2, updated_at = ?3 WHERE id = ?1",
    )
    .bind(id, status, Date.now())
    .run();
}

export async function linkApplicationOrder(
  db: D1Database,
  id: string,
  orderId: string,
): Promise<void> {
  await db
    .prepare(
      "UPDATE applications SET order_id = ?2, updated_at = ?3 WHERE id = ?1",
    )
    .bind(id, orderId, Date.now())
    .run();
}

/** Looks up the application linked to a paid order (used by the webhook). */
export async function getApplicationByOrderId(
  db: D1Database,
  orderId: string,
): Promise<ApplicationRow | null> {
  return await db
    .prepare("SELECT * FROM applications WHERE order_id = ?1 LIMIT 1")
    .bind(orderId)
    .first<ApplicationRow>();
}

// ── Documents ───────────────────────────────────────────────────────────────

/**
 * Seeds the document checklist for an application from a list of
 * (key, label) requirements. Idempotent — existing rows are left untouched
 * thanks to the unique (application_id, requirement_key) index.
 */
export async function seedApplicationDocuments(
  db: D1Database,
  applicationId: string,
  requirements: { key: string; label: string }[],
): Promise<void> {
  if (requirements.length === 0) return;
  const now = Date.now();
  const statements = requirements.map((req) =>
    db
      .prepare(
        `INSERT INTO application_documents
          (id, application_id, requirement_key, requirement_label,
           upload_status, review_status, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, 'pending', 'pending', ?5, ?5)
         ON CONFLICT(application_id, requirement_key) DO NOTHING`,
      )
      .bind(
        `doc_${crypto.randomUUID().replace(/-/g, "")}`,
        applicationId,
        req.key,
        req.label,
        now,
      ),
  );
  await db.batch(statements);
}

export async function getApplicationDocuments(
  db: D1Database,
  applicationId: string,
): Promise<ApplicationDocumentRow[]> {
  const res = await db
    .prepare(
      "SELECT * FROM application_documents WHERE application_id = ?1 ORDER BY created_at",
    )
    .bind(applicationId)
    .all<ApplicationDocumentRow>();
  return res.results ?? [];
}

export async function recordDocumentUpload(
  db: D1Database,
  input: {
    applicationId: string;
    requirementKey: string;
    storageKey: string;
    filename: string;
    contentType: string;
    sizeBytes: number;
  },
): Promise<void> {
  await db
    .prepare(
      `UPDATE application_documents
         SET storage_key = ?3, filename = ?4, content_type = ?5,
             size_bytes = ?6, upload_status = 'uploaded',
             review_status = 'pending', reviewer_note = NULL, updated_at = ?7
       WHERE application_id = ?1 AND requirement_key = ?2`,
    )
    .bind(
      input.applicationId,
      input.requirementKey,
      input.storageKey,
      input.filename,
      input.contentType,
      input.sizeBytes,
      Date.now(),
    )
    .run();
}

export async function setDocumentReview(
  db: D1Database,
  documentId: string,
  reviewStatus: DocumentReviewStatus,
  note?: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE application_documents
         SET review_status = ?2, reviewer_note = ?3, updated_at = ?4
       WHERE id = ?1`,
    )
    .bind(documentId, reviewStatus, note ?? null, Date.now())
    .run();
}

// ── Events ────────────────────────────────────────────────────────────────

export async function addApplicationEvent(
  db: D1Database,
  input: {
    applicationId: string;
    type: string;
    message: string;
    metaJson?: string | null;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO application_events
        (id, application_id, type, message, meta_json, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
    )
    .bind(
      `evt_${crypto.randomUUID().replace(/-/g, "")}`,
      input.applicationId,
      input.type,
      input.message,
      input.metaJson ?? null,
      Date.now(),
    )
    .run();
}

export async function getApplicationEvents(
  db: D1Database,
  applicationId: string,
): Promise<ApplicationEventRow[]> {
  const res = await db
    .prepare(
      "SELECT * FROM application_events WHERE application_id = ?1 ORDER BY created_at",
    )
    .bind(applicationId)
    .all<ApplicationEventRow>();
  return res.results ?? [];
}
