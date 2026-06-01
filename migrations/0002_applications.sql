-- SafeBuy applications schema (Atlys-style onboarding)
-- Apply locally:  pnpm wrangler d1 execute safebuy --local  --file=./migrations/0002_applications.sql
-- Apply remote:   pnpm wrangler d1 execute safebuy --remote --file=./migrations/0002_applications.sql
--
-- An "application" is a guest-first onboarding object. It is created when a
-- visitor clicks "Start application" on /start (no account, no contact yet) and
-- carries the chosen SKU + journey answers through the wizard to payment and the
-- status tracker. Contact details (customer_id) are attached near the end of the
-- funnel; an order_id links the application to a paid Razorpay order.

CREATE TABLE IF NOT EXISTS applications (
  id            TEXT PRIMARY KEY,            -- app_<uuid> — used for wizard mutations
  access_token  TEXT UNIQUE NOT NULL,        -- unguessable UUID — auth boundary for /track
  customer_id   TEXT,                        -- nullable until the contact step
  sku_type      TEXT NOT NULL CHECK (sku_type IN ('service', 'bundle')),
  sku_slug      TEXT NOT NULL,
  sku_name      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
                  'draft',
                  'documents_pending',
                  'documents_review',
                  'payment_pending',
                  'awaiting_consult',
                  'paid',
                  'in_progress',
                  'delivered',
                  'action_required',
                  'cancelled'
                )),
  property_json TEXT,                         -- JSON: address, ward, parties, etc.
  journey_json  TEXT,                         -- JSON: quiz answers (role, stage, goal, urgency)
  order_id      TEXT,                         -- nullable FK to orders(id) once paid
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX IF NOT EXISTS idx_applications_token    ON applications(access_token);
CREATE INDEX IF NOT EXISTS idx_applications_customer ON applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_applications_order    ON applications(order_id);
CREATE INDEX IF NOT EXISTS idx_applications_status   ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created  ON applications(created_at DESC);

-- One row per required document (seeded from service.requirements[]) plus any
-- extras the customer uploads. storage_key is the R2 object key once uploaded.
CREATE TABLE IF NOT EXISTS application_documents (
  id                 TEXT PRIMARY KEY,        -- doc_<uuid>
  application_id     TEXT NOT NULL,
  requirement_key    TEXT NOT NULL,           -- stable slug of the requirement
  requirement_label  TEXT NOT NULL,           -- human label shown in the UI
  storage_key        TEXT,                    -- R2 object key (null until uploaded)
  filename           TEXT,
  content_type       TEXT,
  size_bytes         INTEGER,
  upload_status      TEXT NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploaded')),
  review_status      TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'accepted', 'rejected')),
  reviewer_note      TEXT,
  created_at         INTEGER NOT NULL,
  updated_at         INTEGER NOT NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id)
);

CREATE INDEX IF NOT EXISTS idx_app_docs_application ON application_documents(application_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_app_docs_unique_req
  ON application_documents(application_id, requirement_key);

-- Append-only audit log that powers the status timeline on /track.
CREATE TABLE IF NOT EXISTS application_events (
  id              TEXT PRIMARY KEY,           -- evt_<uuid>
  application_id  TEXT NOT NULL,
  type            TEXT NOT NULL,              -- 'status_change' | 'document' | 'note' | 'payment'
  message         TEXT NOT NULL,              -- customer-visible line
  meta_json       TEXT,                       -- optional structured detail
  created_at      INTEGER NOT NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id)
);

CREATE INDEX IF NOT EXISTS idx_app_events_application ON application_events(application_id, created_at);

-- Link payments back to applications: orders gains a nullable application_id so
-- the webhook can flip the application to `paid` when fulfillment completes.
ALTER TABLE orders ADD COLUMN application_id TEXT REFERENCES applications(id);

CREATE INDEX IF NOT EXISTS idx_orders_application ON orders(application_id);
