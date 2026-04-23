# Jumbo SafeBuy

The SafeBuy marketing site and checkout, running on Cloudflare Workers via OpenNext.

## Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Hosting:** Cloudflare Workers (via `@opennextjs/cloudflare`)
- **Database:** Cloudflare D1 (orders, payments, customers, webhook idempotency)
- **Payments:** Razorpay Standard Checkout (order-controlled, server-verified)
- **Email:** Resend (transactional)
- **WhatsApp:** Kapso (transactional)
- **UI:** Tailwind v4 + shadcn/ui + Heroicons + Framer Motion

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

To exercise the Cloudflare Workers runtime locally (D1, bindings, env):

```bash
npm run preview
```

## Environment variables

The app reads configuration from three places:

| Source                        | Used for                             |
| ----------------------------- | ------------------------------------ |
| `wrangler.jsonc` → `vars`     | Non-secret runtime config (site URL) |
| `wrangler secret put <NAME>`  | Secrets (API keys, webhook secrets)  |
| `.env.local` (dev only)       | `NEXT_PUBLIC_*` values for `next dev`|

### Required secrets (production)

Set these **once** per environment using `wrangler secret put`:

```bash
# Razorpay — get from https://dashboard.razorpay.com/app/keys
wrangler secret put RAZORPAY_KEY_ID
wrangler secret put RAZORPAY_KEY_SECRET
wrangler secret put RAZORPAY_WEBHOOK_SECRET

# Resend — get from https://resend.com/api-keys
wrangler secret put RESEND_API_KEY

# Kapso — get from the Kapso dashboard
wrangler secret put KAPSO_API_KEY

# getform.io endpoint (full URL including form ID)
wrangler secret put GETFORM_ENDPOINT
```

### Required `vars` (public, checked-in)

Edit `wrangler.jsonc`:

```jsonc
"vars": {
  "NEXT_PUBLIC_SITE_URL": "https://safebuy.jumbohomes.in",
  "RAZORPAY_ENV": "live"          // or "test"
}
```

### Required bindings

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "safebuy-prod",
    "database_id": "<from `wrangler d1 create`>"
  }
]
```

## Database setup

Orders, payments, customers, and webhook events are stored in Cloudflare D1.

### 1. Create the database

```bash
wrangler d1 create safebuy-prod
# Copy the returned database_id into wrangler.jsonc
```

### 2. Apply migrations

Local (for `wrangler dev` / `npm run preview`):

```bash
wrangler d1 migrations apply safebuy-prod --local
```

Production:

```bash
wrangler d1 migrations apply safebuy-prod --remote
```

Schema lives in `migrations/*.sql`. Inspect with:

```bash
wrangler d1 execute safebuy-prod --remote --command "SELECT * FROM orders ORDER BY created_at DESC LIMIT 10"
```

## Razorpay setup

### Test mode (safe for dev)

1. Sign in at <https://dashboard.razorpay.com> → **Test Mode** (toggle top-right).
2. Settings → API keys → **Generate test key**. Copy `rzp_test_*` key ID and secret.
3. Store them as secrets (see above).
4. Use any test card from <https://razorpay.com/docs/payments/payments/test-card-upi-details/> at checkout.

### Webhooks

1. Razorpay Dashboard → Settings → Webhooks → **Create new webhook**.
2. URL: `https://safebuy.jumbohomes.in/api/razorpay/webhook`
3. Secret: generate a random string, paste it, and save the same value as `RAZORPAY_WEBHOOK_SECRET` in Worker secrets.
4. Events to subscribe: `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`.

Signature verification is performed in `lib/razorpay.ts` using HMAC-SHA256 via the Web Crypto API — no Node dependencies.

### Going live

1. Complete Razorpay KYC & activation.
2. Regenerate **live** API keys (`rzp_live_*`).
3. Re-run `wrangler secret put RAZORPAY_KEY_ID` / `KEY_SECRET` with live values.
4. Set `RAZORPAY_ENV` to `"live"` in `wrangler.jsonc`.
5. Update the webhook URL in the live dashboard as well.

## Checkout architecture

```
[Service / Bundle page]
     │  BuyNowButton (client)
     ▼
POST /api/razorpay/create-order
     │  validates SKU, upserts customer, creates Razorpay order, inserts draft order row
     ▼
Razorpay Checkout modal (hosted)
     │  user pays
     ▼
client handler -> POST /api/razorpay/verify-payment
     │  verifies HMAC, optimistically marks order paid, redirects to /checkout/success
     ▼
(async, server-to-server)
Razorpay webhook -> POST /api/razorpay/webhook
     │  verifies HMAC, idempotent, source of truth for fulfillment
     ▼
Phase 2: Resend email + Kapso WhatsApp + getform push + GST invoice
```

- **Order of truth:** The webhook is the source of truth. The client-side
  `verify-payment` call is an optimistic UX hop — if it fails or is skipped,
  the webhook will still settle the order.
- **Idempotency:** Webhook events are claimed into `webhook_events` before
  any side effect runs. Duplicate deliveries from Razorpay are safe.
- **Pricing:** Prices are looked up server-side from `lib/services.ts`.
  The client never sends an amount, preventing tampering.

## Buyable vs consult-first

Services and bundles are either directly buyable or "consult first":

- **Directly buyable** — SKUs priced ≤ ₹10,000 by default, or any SKU with
  `buyable: true` set explicitly in `lib/services.ts`.
- **Consult first** — SKUs priced > ₹10,000 or `buyable: false`. The UI
  shows "Talk to an advisor" instead of the Razorpay checkout.

Rule lives in `isServiceBuyable()` / `isBundleBuyable()` — adjust the
₹10,000 threshold in one place if needed.

## Deploy

```bash
npm run deploy
```

This runs `opennextjs-cloudflare build` then `wrangler deploy`. First-time setup:

```bash
wrangler login
wrangler d1 create safebuy-prod
# Paste database_id into wrangler.jsonc, then:
wrangler d1 migrations apply safebuy-prod --remote
# Set all secrets (see above)
npm run deploy
```

## Legal pages

Scaffold checkout-required legal pages live at:

- `/terms`
- `/privacy-policy`
- `/refund-policy`
- `/shipping-policy` (service delivery)
- `/contact`

Edit copy in `app/(legal)/*/page.tsx`.

## Project structure

```
app/
  api/razorpay/         # create-order, verify-payment, webhook
  (legal)/              # terms, privacy, refund, shipping, contact
  checkout/             # success + failure pages
  services/             # service catalog + detail pages
  bundles/              # bundle detail pages
components/
  buy-now-button.tsx    # client checkout flow (modal + Razorpay SDK)
  sections/             # homepage sections
  ui/                   # shadcn primitives
lib/
  services.ts           # SKU catalog + pricing rules
  razorpay.ts           # fetch-based Razorpay client (Workers-compatible)
  db.ts                 # typed D1 helpers
  checkout.ts           # SKU resolution + input validation
migrations/             # D1 SQL migrations
```

## Common operations

**Inspect recent orders:**

```bash
wrangler d1 execute safebuy-prod --remote --command \
  "SELECT id, sku_slug, amount_paise/100.0 AS amount, status, created_at FROM orders ORDER BY created_at DESC LIMIT 20"
```

**Re-send a webhook (debug):** copy the event from Razorpay Dashboard →
Webhooks → select endpoint → Resend.

**Rotate Razorpay key:** regenerate in dashboard → `wrangler secret put
RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` → redeploy.
