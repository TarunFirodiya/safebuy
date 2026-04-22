"use client";

import { useState } from "react";
import type { Service } from "@/lib/services";
import { formatINR } from "@/lib/utils";

export function PriceBlock({ service }: { service: Service }) {
  const alternates = service.priceAlternates ?? [];
  const [selected, setSelected] = useState(0);
  const activePrice = alternates[selected]?.price ?? service.price;

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">
        {alternates.length > 0 ? "Starting from" : "Fixed price"}
      </p>
      <p
        className="text-4xl font-bold text-foreground tabular-nums"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {formatINR(activePrice)}
      </p>
      {service.priceNote && !alternates.length && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">{service.priceNote}</p>
      )}

      {alternates.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {alternates.map((alt, i) => (
            <button
              key={alt.label}
              onClick={() => setSelected(i)}
              className={`text-left rounded-md border px-3 py-2 text-xs transition-colors ${
                selected === i
                  ? "border-[var(--primary)] bg-[var(--accent)] text-foreground"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className="font-semibold">{alt.label}</div>
              <div
                className="tabular-nums text-[11px] text-[var(--text-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {formatINR(alt.price)}
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        No hidden fees. No surprises.
      </p>
    </>
  );
}
