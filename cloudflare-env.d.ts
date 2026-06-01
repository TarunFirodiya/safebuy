// Augments the `CloudflareEnv` type that `@opennextjs/cloudflare` exposes
// through `getCloudflareContext()`. Add every binding, secret, and plain var
// declared in `wrangler.jsonc` or provisioned with `wrangler secret put`.
// Wrangler’s optional peer — list explicitly so CI / `next build` see D1, KV, etc.

/// <reference types="@cloudflare/workers-types" />

import "@opennextjs/cloudflare";

declare global {
  interface CloudflareEnv {
    // ── D1 binding ───────────────────────────────────────────────────────
    DB: D1Database;

    // ── R2 bucket (private) — onboarding document uploads ────────────────
    DOCUMENTS: R2Bucket;

    // ── Public vars (wrangler.jsonc → vars) ──────────────────────────────
    NEXT_PUBLIC_SITE_URL: string;
    /** "test" | "live" — controls which Razorpay mode the app runs in. */
    RAZORPAY_ENV: "test" | "live";

    // ── Secrets (wrangler secret put) ────────────────────────────────────
    RAZORPAY_KEY_ID: string;
    RAZORPAY_KEY_SECRET: string;
    /** Configure in Razorpay dashboard → Settings → Webhooks, then copy here. */
    RAZORPAY_WEBHOOK_SECRET: string;

    // Phase 2 (stubbed for now; can be added when we wire Resend/Kapso).
    RESEND_API_KEY?: string;
    KAPSO_API_KEY?: string;
    GETFORM_PAYMENT_ENDPOINT?: string;
  }
}

export {};
