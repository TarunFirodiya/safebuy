"use client";

import {
  ArrowRightIcon,
  ClockIcon,
  CheckBadgeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { cn, formatINR } from "@/lib/utils";
import type { RecommendationItem } from "@/lib/recommendations";

interface EligibilityCardProps {
  item: RecommendationItem;
  /** Visually emphasise the primary recommendation. */
  primary?: boolean;
  /** Fires when the user chooses to start an application for this SKU. */
  onStart: (item: RecommendationItem) => void;
  starting?: boolean;
}

/**
 * Atlys-style "you're eligible" card: name, fixed price, delivery time, the
 * outcome the customer walks away with, and a single primary CTA.
 */
export function EligibilityCard({
  item,
  primary = false,
  onStart,
  starting = false,
}: EligibilityCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border bg-white p-5",
        primary ? "border-[var(--primary)]" : "border-[var(--border)]",
      )}
      style={primary ? { boxShadow: "var(--shadow-md)" } : undefined}
    >
      {primary && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-foreground)]">
          <SparklesIcon className="h-3.5 w-3.5" />
          Recommended for you
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground">
            {item.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {item.shortDescription}
          </p>
        </div>
        <span
          className="shrink-0 text-right text-lg font-bold tabular-nums text-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {item.priceNote ?? formatINR(item.price)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <ClockIcon className="h-3.5 w-3.5" />
          {item.deliveryTime}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckBadgeIcon className="h-3.5 w-3.5" />
          {item.type === "bundle" ? "Bundle" : "Fixed-price service"}
        </span>
      </div>

      <p className="mt-3 rounded-md bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-secondary)]">
        {item.result}
      </p>

      <button
        type="button"
        disabled={starting}
        onClick={() => onStart(item)}
        className={cn(
          "mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70",
          primary
            ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
            : "border border-[var(--border)] text-foreground hover:bg-[var(--surface)]",
        )}
      >
        {starting ? "Starting…" : "Start application"}
        {!starting && <ArrowRightIcon className="h-4 w-4" />}
      </button>

      {!item.buyable && (
        <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">
          Scope-dependent — we&apos;ll confirm price and timeline on a quick call.
        </p>
      )}
    </div>
  );
}
