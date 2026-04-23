// Razorpay client for Cloudflare Workers.
//
// We use fetch + Web Crypto (HMAC-SHA256) rather than the `razorpay` npm SDK
// because the SDK pulls in Node-only transitive deps that bloat the Worker
// bundle and occasionally break on the V8 isolate runtime. Everything here is
// edge-safe.

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

export interface RazorpayCredentials {
  keyId: string;
  keySecret: string;
}

export interface CreateOrderInput {
  /** Amount in paise. 1 INR = 100 paise. Always integer. */
  amountPaise: number;
  /** Short (<= 40 chars) merchant-side identifier surfaced on statements. */
  receipt: string;
  /** Up to 15 key/value pairs, each ≤ 256 chars. Kept server-side only. */
  notes?: Record<string, string>;
  currency?: "INR";
}

export interface RazorpayOrder {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayApiError {
  error: {
    code: string;
    description: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Core
// ──────────────────────────────────────────────────────────────────────────

function authHeader({ keyId, keySecret }: RazorpayCredentials): string {
  // Workers runtime exposes `btoa`.
  return `Basic ${btoa(`${keyId}:${keySecret}`)}`;
}

export async function createOrder(
  creds: RazorpayCredentials,
  input: CreateOrderInput,
): Promise<RazorpayOrder> {
  const body = {
    amount: input.amountPaise,
    currency: input.currency ?? "INR",
    receipt: input.receipt,
    notes: input.notes ?? {},
    // `payment_capture: 1` is default for v1; kept explicit for clarity.
    payment_capture: 1,
  };

  const res = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: "POST",
    headers: {
      Authorization: authHeader(creds),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as RazorpayApiError | null;
    throw new Error(
      `Razorpay createOrder failed (${res.status}): ${
        err?.error?.description ?? (await res.text().catch(() => "unknown"))
      }`,
    );
  }

  return (await res.json()) as RazorpayOrder;
}

// ──────────────────────────────────────────────────────────────────────────
// Signature verification (HMAC-SHA256, constant-time compare)
// ──────────────────────────────────────────────────────────────────────────

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Constant-time string comparison. A short-circuit `===` would leak signature
 * bytes via timing on a tight attack loop.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verifies the signature returned by the checkout modal after a successful
 * payment. See https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/#16-verify-payment-signature
 */
export async function verifyCheckoutSignature(
  keySecret: string,
  params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
): Promise<boolean> {
  const expected = await hmacSha256Hex(
    keySecret,
    `${params.razorpayOrderId}|${params.razorpayPaymentId}`,
  );
  return timingSafeEqual(expected, params.razorpaySignature);
}

/**
 * Verifies the `X-Razorpay-Signature` header on incoming webhook requests.
 * The message is the raw request body, not a parsed/re-stringified JSON.
 */
export async function verifyWebhookSignature(
  webhookSecret: string,
  rawBody: string,
  signatureHeader: string,
): Promise<boolean> {
  const expected = await hmacSha256Hex(webhookSecret, rawBody);
  return timingSafeEqual(expected, signatureHeader);
}
