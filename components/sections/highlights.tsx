"use client";

import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  ScaleIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { fadeInUp, staggerContainer, staggerItem, transitions, VIEWPORT } from "@/lib/motion";

const highlights = [
  {
    Icon: ShieldCheckIcon,
    eyebrow: "Engineered for safety",
    title: "Your money sits in escrow",
    description:
      "Every rupee flows through an ICICI Bank escrow account. Funds release to the seller only after each legal milestone clears — never before.",
    accent: "var(--primary)",
    accentSubtle: "var(--accent)",
  },
  {
    Icon: ScaleIcon,
    eyebrow: "Built on legal diligence",
    title: "Every document, verified",
    description:
      "Our lawyers trace ownership back 30 years, pull the encumbrance certificate, and verify khata, tax, and sanctioned plans — in a plain-English report.",
    accent: "var(--warning)",
    accentSubtle: "var(--warning-subtle)",
  },
  {
    Icon: DevicePhoneMobileIcon,
    eyebrow: "Designed for simplicity",
    title: "Closed from your phone",
    description:
      "We run the paperwork, bank calls, and sub-registrar coordination over WhatsApp. You show up once — to sign at the SRO, as the law requires.",
    accent: "var(--success)",
    accentSubtle: "var(--success-subtle)",
  },
];

function HighlightGraphic({ h }: { h: (typeof highlights)[number] }) {
  const Icon = h.Icon;
  return (
    <div
      className="relative w-full h-32 rounded-xl border border-[var(--border)] flex items-center justify-center overflow-hidden mb-6"
      style={{
        background: `linear-gradient(135deg, ${h.accentSubtle} 0%, #ffffff 75%)`,
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e6ebf1 1px, transparent 1px), linear-gradient(to bottom, #e6ebf1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.35,
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div
        className="relative w-14 h-14 rounded-xl flex items-center justify-center"
        style={{
          background: "#ffffff",
          border: `1px solid color-mix(in srgb, ${h.accent} 20%, transparent)`,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <Icon className="w-7 h-7" style={{ color: h.accent }} />
      </div>
    </div>
  );
}

export function Highlights() {
  return (
    <section className="section-wrapper">
      <div className="container-lg px-6 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={transitions.fadeInUp}
        >
          <span className="eyebrow">Highlights</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance max-w-2xl mx-auto">
            The safest way to close a resale home
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl mx-auto text-balance">
            SafeBuy is built for Indian resale: escrow-protected payments,
            lawyer-led diligence, and a door-to-door closing handled online.
          </p>
        </motion.div>

        {/* Pillars */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {highlights.map((h) => (
            <motion.div
              key={h.title}
              variants={staggerItem}
              transition={transitions.staggerItem}
              className="rounded-xl border border-[var(--border)] bg-white p-7 flex flex-col"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <HighlightGraphic h={h} />
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                {h.eyebrow}
              </p>
              <h3 className="text-lg font-semibold text-foreground tracking-tight">
                {h.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {h.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
