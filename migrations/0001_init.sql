-- SafeBuy payments schema
-- Apply locally:  pnpm wrangler d1 execute safebuy --local  --file=./migrations/0001_init.sql
-- Apply remote:   pnpm wrangler d1 execute safebuy --remote --file=./migrations/0001_init.sql

CREATE TABLE IF NOT EXISTS customers (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Every "Buy now" click produces a row here, whether or not payment succeeds.
-- razorpay_order_id is our business key; internal id is the same for simplicity.
CREATE TABLE IF NOT EXISTS orders (
  id                  TEXT PRIMARY KEY,          -- mirrors razorpay_order_id
  razorpay_order_id   TEXT UNIQUE NOT NULL,
  customer_id         TEXT NOT NULL,
  sku_type            TEXT NOT NULL CHECK (sku_type IN ('service', 'bundle')),
  sku_slug            TEXT NOT NULL,
  sku_name            TEXT NOT NULL,
  amount_paise        INTEGER NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'INR',
  status              TEXT NOT NULL CHECK (status IN ('created', 'attempted', 'paid', 'failed', 'refunded')),
  coupon_code         TEXT,
  discount_paise      INTEGER NOT NULL DEFAULT 0,
  notes               TEXT,                       -- JSON
  receipt             TEXT NOT NULL,              -- human-readable receipt id
  fulfilled_at        INTEGER,                    -- set when side effects succeed
  created_at          INTEGER NOT NULL,
  paid_at             INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created  ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status   ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_sku      ON orders(sku_type, sku_slug);

CREATE TABLE IF NOT EXISTS payments (
  id                    TEXT PRIMARY KEY,          -- razorpay_payment_id
  order_id              TEXT NOT NULL,
  razorpay_payment_id   TEXT NOT NULL,
  amount_paise          INTEGER NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'INR',
  method                TEXT,                      -- 'card' | 'upi' | 'netbanking' | 'wallet' | 'emi'
  status                TEXT NOT NULL CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
  email                 TEXT,
  contact               TEXT,
  error_code            TEXT,
  error_description     TEXT,
  raw_payload           TEXT NOT NULL,             -- full webhook JSON
  created_at            INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Idempotency log for webhooks. Razorpay may retry the same event multiple
-- times; the primary key prevents double-processing.
CREATE TABLE IF NOT EXISTS webhook_events (
  id             TEXT PRIMARY KEY,                -- x-razorpay-event-id header
  event          TEXT NOT NULL,
  received_at    INTEGER NOT NULL,
  processed_at   INTEGER,
  error          TEXT,
  payload        TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event ON webhook_events(event);
