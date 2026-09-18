"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  BriefcaseIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import { CalendlyModal } from "@/components/calendly-modal";
import { fadeInUp, staggerContainer, staggerItem, transitions, VIEWPORT } from "@/lib/motion";

const trustChips = [
  { label: "ICICI Bank escrow",          Icon: ShieldCheckIcon },
  { label: "Digital process",         Icon: BriefcaseIcon },
  { label: "Fixed, transparent pricing", Icon: CurrencyRupeeIcon },
];

export function HeroSection() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <>
      <CalendlyModal open={calendlyOpen} onOpenChange={setCalendlyOpen} />

      <section className="relative min-h-[92vh] flex items-center pt-16 overflow-hidden bg-stripe-mesh">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e6ebf1 1px, transparent 1px), linear-gradient(to bottom, #e6ebf1 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.25,
          }}
        />

        <div className="container-lg px-6 md:px-8 relative z-10 py-24 md:py-32">
          <div className="max-w-3xl">

            {/* Eyebrow */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transitions.fadeInUp, delay: 0.05 }}
            >
              <span className="eyebrow">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] inline-block" />
                Trusted by 100+ home buyers
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight text-balance"
              style={{ fontFamily: "var(--font-display)" }}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transitions.fadeInUp, delay: 0.12 }}
            >
              Buy your resale home{" "}
              <span className="italic text-[var(--primary)]">
                with safety
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl text-pretty"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transitions.fadeInUp, delay: 0.2 }}
            >
              Legal diligence, escrow-protected payments, title transfer. Done from the comfort of your phone.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-start gap-3"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ ...transitions.fadeInUp, delay: 0.28 }}
            >
              <button
                type="button"
                onClick={() => setCalendlyOpen(true)}
                className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                Talk to an expert
              </button>
            </motion.div>

            {/* Trust chips */}
            <motion.div
              className="mt-10 flex flex-wrap gap-2"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: 0.38, staggerChildren: 0.06 }}
            >
              {trustChips.map(({ label, Icon }) => (
                <motion.span
                  key={label}
                  variants={staggerItem}
                  transition={transitions.staggerItem}
                  className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] bg-white rounded-full px-3 py-1.5"
                >
                  <Icon className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg border-t border-[var(--border)] pt-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: 0.5, staggerChildren: 0.08 }}
          >
            {[
              { value: "₹0",   label: "Lost to fraud" },
              { value: "21",   label: "Days to transfer" },
              { value: "90+",  label: "Bank partners" },
            ].map(({ value, label }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                transition={transitions.staggerItem}
              >
                <p
                  className="text-3xl font-bold text-foreground tracking-tight"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {value}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
