"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckBadgeIcon,
  ClockIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Stepper } from "@/components/onboarding/stepper";
import { BuyNowButton } from "@/components/buy-now-button";
import { BookCalendlyButton } from "@/components/book-calendly-button";
import { formatINR } from "@/lib/utils";

export interface ReviewSku {
  type: "service" | "bundle";
  slug: string;
  name: string;
  price: number;
  priceNote?: string;
  deliveryTime: string;
  result: string;
  buyable: boolean;
}

export interface ReviewContact {
  name?: string;
  email?: string;
  phone?: string;
}

interface ReviewClientProps {
  applicationId: string;
  accessToken: string;
  sku: ReviewSku;
  contact: ReviewContact;
  documentsUploaded: number;
  documentsTotal: number;
  /** Prefilled Calendly link for the consult path. */
  calendlyUrl: string;
}

export function ReviewClient({
  applicationId,
  accessToken,
  sku,
  contact,
  documentsUploaded,
  documentsTotal,
  calendlyUrl,
}: ReviewClientProps) {
  const router = useRouter();

  // Record that the applicant reached review so the tracker advances to
  // payment_pending / awaiting_consult. Fire-and-forget; the page is still
  // useful if this fails.
  useEffect(() => {
    fetch(`/api/applications/${applicationId}/review`, {
      method: "POST",
    }).catch(() => {});
  }, [applicationId]);

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-8">
        <Stepper current={4} total={4} label="Review" />
        <button
          type="button"
          onClick={() => router.push(`/apply/${applicationId}/documents`)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to documents
        </button>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Review &amp; {sku.buyable ? "pay" : "confirm"}
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {sku.buyable
          ? "One fixed price, no surprises. After payment you can track every step."
          : "Because scope varies, an advisor confirms the details before any payment."}
      </p>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">{sku.name}</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{sku.result}</p>
          </div>
          <span
            className="shrink-0 text-right text-lg font-bold tabular-nums text-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {sku.priceNote ?? formatINR(sku.price)}
          </span>
        </div>

        <dl className="mt-4 space-y-2 border-t border-[var(--border)] pt-4 text-sm">
          <Row icon={<ClockIcon className="h-4 w-4" />} label="Timeline">
            {sku.deliveryTime}
          </Row>
          <Row
            icon={<CheckBadgeIcon className="h-4 w-4" />}
            label="Documents"
          >
            {documentsTotal === 0
              ? "None needed upfront"
              : `${documentsUploaded} of ${documentsTotal} uploaded`}
          </Row>
          {contact.name && (
            <Row icon={<ShieldCheckIcon className="h-4 w-4" />} label="Contact">
              {contact.name}
            </Row>
          )}
        </dl>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <LockClosedIcon className="h-3.5 w-3.5" />
          Secure payment via Razorpay
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheckIcon className="h-3.5 w-3.5" />
          Fixed price, refundable per policy
        </span>
      </div>

      <div className="mt-6">
        {sku.buyable ? (
          <BuyNowButton
            skuType={sku.type}
            skuSlug={sku.slug}
            skuName={sku.name}
            amountRupees={sku.price}
            applicationId={applicationId}
            prefill={contact}
            label={`Pay ${formatINR(sku.price)}`}
          />
        ) : (
          <BookCalendlyButton
            url={calendlyUrl}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-dark)]"
          >
            Book your advisor call
          </BookCalendlyButton>
        )}
      </div>

      <button
        type="button"
        onClick={() => router.push(`/track/${accessToken}`)}
        className="mt-3 block w-full text-center text-xs font-medium text-[var(--text-muted)] hover:text-foreground"
      >
        View application status
      </button>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="inline-flex items-center gap-2 text-[var(--text-secondary)]">
        <span className="text-[var(--text-muted)]">{icon}</span>
        {label}
      </dt>
      <dd className="text-right font-medium text-foreground">{children}</dd>
    </div>
  );
}
