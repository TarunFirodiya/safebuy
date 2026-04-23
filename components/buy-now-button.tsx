"use client";

// BuyNowButton renders a primary CTA that opens a minimal collect-customer
// modal, creates a Razorpay order on our server, loads the Razorpay checkout
// JS SDK (once, lazily), and hands off to the modal. On success we re-verify
// the signature on our server, then redirect to /checkout/success. Payment
// fulfillment side effects happen from the webhook, not here.

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatINR } from "@/lib/utils";

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

interface BuyNowButtonProps {
  skuType: "service" | "bundle";
  skuSlug: string;
  skuName: string;
  amountRupees: number;
  /** Visual variant — primary = filled button, outline = bordered. */
  variant?: "primary" | "outline";
  /** Optional classname override for the trigger button. */
  className?: string;
  /** Label shown on the trigger. Defaults to "Buy now". */
  label?: string;
  /** Hides the trailing arrow on the button. */
  hideArrow?: boolean;
}

interface CreateOrderResponse {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amountPaise: number;
  currency: "INR";
  skuName: string;
  receipt: string;
  customer: { name: string; email: string; phone: string };
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Razorpay's window global typed loosely; the SDK is injected imperatively.
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  notes: Record<string, string>;
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Razorpay SDK failed to load")),
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Razorpay SDK failed to load"));
    document.body.appendChild(script);
  });
}

export function BuyNowButton({
  skuType,
  skuSlug,
  skuName,
  amountRupees,
  variant = "primary",
  className,
  label = "Buy now",
  hideArrow = false,
}: BuyNowButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerClasses = cn(
    "inline-flex items-center justify-center gap-2 w-full h-11 rounded-md text-sm font-semibold transition-opacity",
    variant === "primary"
      ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
      : "border border-[var(--border)] text-foreground hover:bg-[var(--surface)]",
    className,
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSubmitting(true);

      try {
        const res = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skuType,
            skuSlug,
            customer: form,
          }),
        });

        const payload = (await res.json().catch(() => ({}))) as
          | CreateOrderResponse
          | { error?: string };

        if (!res.ok || !("razorpayOrderId" in payload)) {
          const message =
            "error" in payload && payload.error
              ? payload.error
              : "Couldn't start checkout. Please try again.";
          setError(message);
          setSubmitting(false);
          return;
        }

        await loadRazorpayScript();
        if (!window.Razorpay) {
          setError("Payment gateway failed to load. Please retry.");
          setSubmitting(false);
          return;
        }

        const rzp = new window.Razorpay({
          key: payload.razorpayKeyId,
          amount: payload.amountPaise,
          currency: payload.currency,
          name: "Jumbo SafeBuy",
          description: payload.skuName,
          order_id: payload.razorpayOrderId,
          prefill: {
            name: payload.customer.name,
            email: payload.customer.email,
            contact: payload.customer.phone,
          },
          notes: {
            sku_type: skuType,
            sku_slug: skuSlug,
          },
          theme: { color: "#0B6E4F" },
          handler: async (response) => {
            try {
              const verifyRes = await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const verifyPayload = (await verifyRes.json().catch(() => ({}))) as {
                ok?: boolean;
                redirect?: string;
                error?: string;
              };
              if (!verifyRes.ok || !verifyPayload.ok) {
                router.push(
                  `/checkout/failure?reason=${encodeURIComponent(
                    verifyPayload.error ?? "verification_failed",
                  )}`,
                );
                return;
              }
              router.push(verifyPayload.redirect ?? "/checkout/success");
            } catch (err) {
              console.error("[buy-now] verify-payment failed", err);
              router.push(
                `/checkout/failure?reason=${encodeURIComponent("verification_error")}`,
              );
            }
          },
          modal: {
            ondismiss: () => {
              setSubmitting(false);
            },
          },
        });

        setOpen(false);
        rzp.open();
      } catch (err) {
        console.error("[buy-now] unexpected error", err);
        setError("Something went wrong. Please try again.");
        setSubmitting(false);
      }
    },
    [form, router, skuSlug, skuType],
  );

  return (
    <>
      <button
        type="button"
        className={triggerClasses}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        {label}
        {!hideArrow && <ArrowRightIcon className="w-4 h-4" />}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Complete your details
            </DialogTitle>
            <DialogDescription>
              {skuName} · <span className="font-medium">{formatINR(amountRupees)}</span>
              <br />
              We'll send confirmation and next steps to your email and WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Full name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                autoComplete="name"
                className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                autoComplete="email"
                className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Phone (with country code if outside India)
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                autoComplete="tel"
                placeholder="9876543210"
                className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-white text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-md bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Opening checkout…"
                : `Pay ${formatINR(amountRupees)}`}
            </button>

            <p className="text-[10px] text-[var(--text-muted)] text-center leading-relaxed">
              By continuing you agree to our{" "}
              <a
                href="/terms"
                target="_blank"
                className="underline hover:text-foreground"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="/refund-policy"
                target="_blank"
                className="underline hover:text-foreground"
              >
                Refund Policy
              </a>
              .
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
