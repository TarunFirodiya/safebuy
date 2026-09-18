"use client";

import { useState } from "react";
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { BookCalendlyButton } from "@/components/book-calendly-button";
import { BuyNowButton } from "@/components/buy-now-button";
import { isServiceBuyable, type Service } from "@/lib/services";
import { formatINR } from "@/lib/utils";

/**
 * Price display, tier selection and the pay CTA in one client component.
 *
 * These have to live together: the selected tier decides both the price shown
 * and the amount charged. When the tier lived in its own component next to the
 * button, a tiered SKU could display one price and bill another.
 */
export function PurchasePanel({ service }: { service: Service }) {
  const alternates = service.priceAlternates ?? [];
  const [selected, setSelected] = useState(0);

  const activeTier = alternates[selected];
  const activePrice = activeTier?.price ?? service.price;
  const buyable = isServiceBuyable(service);

  return (
    <div
      className="rounded-xl border border-[var(--border)] bg-white p-6"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">
        {alternates.length > 0 ? "Starting from" : "Fixed price"}
      </p>
      <p className="text-4xl font-bold text-foreground tabular-nums">
        {formatINR(activePrice)}
      </p>
      {service.priceNote && !alternates.length && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {service.priceNote}
        </p>
      )}

      {alternates.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {alternates.map((alt, i) => (
            <button
              key={alt.label}
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
              className={`text-left rounded-md border px-3 py-2 text-xs transition-colors ${
                selected === i
                  ? "border-[var(--primary)] bg-[var(--accent)] text-foreground"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className="font-semibold">{alt.label}</div>
              <div className="tabular-nums text-[11px] text-[var(--text-muted)]">
                {formatINR(alt.price)}
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        No hidden fees. No surprises.
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <ClockIcon className="w-3.5 h-3.5 shrink-0" />
        Delivery in {service.deliveryTime}
      </div>

      <div className="mt-6 space-y-3">
        {buyable ? (
          <>
            <BuyNowButton
              skuType="service"
              skuSlug={service.slug}
              skuName={service.name}
              amountRupees={activePrice}
              priceTier={activeTier?.label}
              label="Pay now"
              variant="primary"
            />
            <BookCalendlyButton className="flex items-center justify-center w-full h-10 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:text-foreground transition-colors">
              Talk to an advisor first
            </BookCalendlyButton>
          </>
        ) : (
          <>
            <BookCalendlyButton className="flex items-center justify-center gap-2 w-full h-10 rounded-md border border-[var(--border)] text-sm font-medium text-foreground hover:bg-[var(--surface)] transition-colors">
              Book a free call
            </BookCalendlyButton>
            <p className="text-center text-xs text-[var(--text-muted)]">
              Scope-dependent — we&apos;ll confirm price and timeline on the
              call, then send a payment link.
            </p>
          </>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--border)] space-y-2">
        <div className="flex items-start gap-2.5">
          <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <span className="text-xs text-[var(--text-secondary)]">
            {service.priceNote
              ? "Billed at the rate shown — confirmed before we start"
              : "Fixed price guaranteed — no hourly billing"}
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <span className="text-xs text-[var(--text-secondary)]">
            ICICI Bank escrow-protected payments
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <span className="text-xs text-[var(--text-secondary)]">
            Result delivered in {service.deliveryTime}
          </span>
        </div>
      </div>
    </div>
  );
}
