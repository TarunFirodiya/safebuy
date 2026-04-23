// Server-side checkout helpers shared by the create-order and webhook routes.
// Concentrates all per-SKU pricing/validation logic in one place so the
// webhook never has to re-derive prices from client input.

import {
  bundles,
  isBundleBuyable,
  isServiceBuyable,
  services,
  type Bundle,
  type Service,
} from "@/lib/services";

export type SkuType = "service" | "bundle";

export interface ResolvedSku {
  type: SkuType;
  slug: string;
  name: string;
  amountPaise: number;
  /** Reference to the catalogue entry, in case we need more fields later. */
  source: Service | Bundle;
}

/**
 * Resolves a `{type, slug}` pair to a canonical SKU with server-authoritative
 * pricing. Throws if the SKU doesn't exist or isn't currently buyable so the
 * caller can surface a 400 without leaking catalogue details.
 */
export function resolveSku(type: SkuType, slug: string): ResolvedSku {
  if (type === "service") {
    const svc = services.find((s) => s.slug === slug);
    if (!svc) throw new SkuLookupError(`Unknown service: ${slug}`);
    if (!isServiceBuyable(svc)) {
      throw new SkuLookupError(
        `${svc.name} is not currently available for online checkout.`,
      );
    }
    return {
      type: "service",
      slug: svc.slug,
      name: svc.name,
      amountPaise: rupeesToPaise(svc.price),
      source: svc,
    };
  }

  const bundle = bundles.find((b) => b.slug === slug);
  if (!bundle) throw new SkuLookupError(`Unknown bundle: ${slug}`);
  if (!isBundleBuyable(bundle)) {
    throw new SkuLookupError(
      `${bundle.name} is not currently available for online checkout.`,
    );
  }
  return {
    type: "bundle",
    slug: bundle.slug,
    name: bundle.name,
    amountPaise: rupeesToPaise(bundle.price),
    source: bundle,
  };
}

export class SkuLookupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SkuLookupError";
  }
}

function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees) || rupees <= 0) {
    throw new SkuLookupError("Invalid price in catalogue");
  }
  return Math.round(rupees * 100);
}

// ──────────────────────────────────────────────────────────────────────────
// Input validation
// ──────────────────────────────────────────────────────────────────────────

export interface CheckoutCustomerInput {
  name: string;
  email: string;
  phone: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// E.164-ish: optional +, 7–15 digits. Stricter than Razorpay's own requirement.
const PHONE_RE = /^\+?[0-9]{7,15}$/;

export function validateCustomerInput(input: unknown): CheckoutCustomerInput {
  if (!input || typeof input !== "object") {
    throw new CheckoutValidationError("Missing customer details.");
  }
  const record = input as Record<string, unknown>;

  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const phoneRaw =
    typeof record.phone === "string" ? record.phone.trim() : "";
  const phone = phoneRaw.replace(/[\s-]/g, "");

  if (name.length < 2 || name.length > 80) {
    throw new CheckoutValidationError(
      "Please enter your full name (2–80 characters).",
    );
  }
  if (!EMAIL_RE.test(email) || email.length > 120) {
    throw new CheckoutValidationError(
      "Please enter a valid email address.",
    );
  }
  if (!PHONE_RE.test(phone)) {
    throw new CheckoutValidationError(
      "Please enter a valid phone number (digits only, country code optional).",
    );
  }

  return { name, email: email.toLowerCase(), phone };
}

export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Receipt generator
// ──────────────────────────────────────────────────────────────────────────

/**
 * Builds a short, human-friendly receipt id — "SB-YYMMDD-<6hex>".
 * Razorpay caps `receipt` at 40 chars.
 */
export function buildReceiptId(): string {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `SB-${yy}${mm}${dd}-${suffix}`;
}
