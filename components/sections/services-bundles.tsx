"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  bundles,
  services,
  formatServicePrice,
  type Bundle,
  type Service,
} from "@/lib/services";
import { fadeInUp, staggerContainer, staggerItem, transitions, VIEWPORT } from "@/lib/motion";
import { formatINR } from "@/lib/utils";

function BundleCard({ bundle, delay = 0 }: { bundle: Bundle; delay?: number }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const included = bundle.serviceSlugOrder
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => !!s);

  return (
    <>
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {bundle.name} — what's included
            </DialogTitle>
          </DialogHeader>
          <ul className="mt-4 divide-y divide-[var(--border)]">
            {included.map((s) => (
              <li key={s.slug} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.deliveryTime}</p>
                </div>
                <p className="text-sm font-semibold text-[var(--text-secondary)] tabular-nums">
                  {formatServicePrice(s)}
                </p>
              </li>
            ))}
          </ul>
          {bundle.savingsAmount > 0 && (
            <p className="mt-3 text-sm font-medium text-[var(--success)] text-center">
              Package saves you {formatINR(bundle.savingsAmount)} vs buying individually
            </p>
          )}
        </DialogContent>
      </Dialog>

      <motion.div
        variants={staggerItem}
        transition={{ ...transitions.staggerItem, delay }}
        className={`relative flex h-full flex-col rounded-xl border p-7 ${
          bundle.badge
            ? "border-[var(--primary)] bg-white"
            : "border-[var(--border)] bg-white"
        }`}
        style={{
          boxShadow: bundle.badge ? "var(--shadow-lg)" : "var(--shadow-sm)",
        }}
      >
        {bundle.badge && (
          <div className="absolute -top-3 left-6">
            <span className="inline-flex items-center h-6 px-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {bundle.badge}
            </span>
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {bundle.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
            {bundle.shortDescription}
          </p>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-2">
            <span
              className="text-4xl font-bold tracking-tight text-foreground tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {formatINR(bundle.price)}
            </span>
            {bundle.savingsAmount > 0 && (
              <span className="text-sm text-[var(--success)] font-medium">
                Save {formatINR(bundle.savingsAmount)}
              </span>
            )}
          </div>

          {/* Features */}
          <ul className="mt-5 space-y-2.5">
            {bundle.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                <CheckIcon className="w-4 h-4 shrink-0 mt-0.5 text-[var(--success)]" />
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setDetailOpen(true)}
            className="mt-4 text-xs font-medium text-[var(--primary)] hover:underline flex items-center gap-1"
          >
            See what's included <ChevronRightIcon className="w-3 h-3" />
          </button>
        </div>

        <div className="mt-7 flex flex-col gap-2">
          <button
            onClick={() =>
              window.open(bundle.razorpayLink, "_blank", "noopener,noreferrer")
            }
            className={`w-full inline-flex items-center justify-center gap-2 h-11 rounded-md text-sm font-semibold transition-opacity ${
              bundle.badge
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "border border-[var(--border)] text-foreground hover:bg-[var(--surface)]"
            }`}
          >
            Book Now
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </>
  );
}

export function ServicesBundles() {
  return (
    <section id="pricing" className="section-wrapper">
      <div className="container-lg px-6 md:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={transitions.fadeInUp}
        >
          <span className="eyebrow">Pricing</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Transparent pricing. No hidden fees.
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-lg mx-auto text-balance">
            Secure the biggest purchase of your life with SafeBuy.
          </p>
          <div className="mt-6">
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              Browse all services <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          key="packages"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="contents"
          >
            {bundles.map((b, i) => (
              <BundleCard key={b.slug} bundle={b} delay={i * 0.05} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
