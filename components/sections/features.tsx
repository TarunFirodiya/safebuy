"use client";

import { motion } from "framer-motion";
import {
  BuildingLibraryIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { fadeInUp, staggerContainer, staggerItem, transitions, VIEWPORT } from "@/lib/motion";

const features = [
  {
    Icon: ShieldCheckIcon,
    stat: "₹0",
    statLabel: "lost to fraud",
    title: "Zero fraud, across every rupee",
    description:
      "Every transaction we've processed has cleared without a single rupee of fraud loss. That's not luck — it's escrow, legal diligence, and 21 days of structured transfer.",
    accent: "var(--success)",
    accentSubtle: "var(--success-subtle)",
  },
  {
    Icon: BuildingLibraryIcon,
    stat: null as string | null,
    statLabel: null as string | null,
    title: "Your money sits with ICICI, not us",
    description:
      "All payments flow through a Jumbo SafeBuy escrow account held at ICICI Bank. Funds are released to the seller only after legal milestones are signed off — never before.",
    accent: "var(--primary)",
    accentSubtle: "var(--accent)",
  },
  {
    Icon: DevicePhoneMobileIcon,
    stat: null as string | null,
    statLabel: null as string | null,
    title: "Handled from your phone",
    description:
      "We run the paperwork, bank calls, and sub-registrar coordination. You show up once — to sign at the SRO, as the law requires. Everything else happens over WhatsApp and email.",
    accent: "var(--primary)",
    accentSubtle: "var(--accent)",
  },
  {
    Icon: BanknotesIcon,
    stat: "90+",
    statLabel: "bank partners",
    title: "Home loans from 90+ banks",
    description:
      "We pre-negotiate rates and surface your best offer in 48 hours — without the usual broker runaround. Pick the terms that suit you; we handle approvals.",
    accent: "var(--warning)",
    accentSubtle: "var(--warning-subtle)",
  },
  {
    Icon: UsersIcon,
    stat: null as string | null,
    statLabel: null as string | null,
    title: "Trusted across Bangalore",
    description:
      "Families in Whitefield, HSR Layout, Koramangala, Indiranagar, and Sarjapur have transferred safely with Jumbo SafeBuy. Fixed prices, no hidden commissions.",
    accent: "var(--primary)",
    accentSubtle: "var(--accent)",
  },
];

function FeatureIcon({
  f,
}: {
  f: (typeof features)[number];
}) {
  const Icon = f.Icon;
  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center mb-6"
      style={{ background: f.accentSubtle }}
    >
      <Icon className="w-5 h-5" style={{ color: f.accent }} />
    </div>
  );
}

function FeatureIconInline({ f }: { f: (typeof features)[number] }) {
  const Icon = f.Icon;
  return (
    <div
      className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ background: f.accentSubtle }}
    >
      <Icon className="w-5 h-5" style={{ color: f.accent }} />
    </div>
  );
}

export function FeaturesSection() {
  const [f0, ...rest] = features;
  const top = rest.slice(0, 2);
  const bottom = rest.slice(2);

  return (
    <section id="features" className="section-wrapper">
      <div className="container-lg px-6 md:px-8">

        {/* Header */}
        <motion.div
          className="mb-14"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={transitions.fadeInUp}
        >
          <span className="eyebrow">Why SafeBuy</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance max-w-2xl">
            The guardrails your biggest purchase deserves
          </h2>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* Card 0 — stat card, spans 2 cols */}
          <motion.div
            variants={staggerItem}
            transition={transitions.staggerItem}
            className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-white p-7 flex flex-col justify-between"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <FeatureIcon f={f0} />
            <div>
              {f0.stat && (
                <p
                  className="text-5xl font-bold tracking-tight mb-1"
                  style={{ color: f0.accent, fontFamily: "var(--font-mono)" }}
                >
                  {f0.stat}
                  <span className="text-2xl ml-1 text-[var(--text-muted)] font-medium">
                    {f0.statLabel}
                  </span>
                </p>
              )}
              <h3 className="text-base font-semibold text-foreground tracking-tight mt-2">
                {f0.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {f0.description}
              </p>
            </div>
          </motion.div>

          {/* Cards 1 & 2 — span 2 cols each */}
          {top.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              transition={transitions.staggerItem}
              className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-white p-7 flex flex-col"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <FeatureIcon f={f} />
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}

          {/* Cards 3 & 4 — bottom row, span 3 cols each */}
          {bottom.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              transition={transitions.staggerItem}
              className="lg:col-span-3 rounded-xl border border-[var(--border)] bg-white p-7 flex flex-col sm:flex-row sm:items-start gap-5"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <FeatureIconInline f={f} />
              <div>
                {f.stat && (
                  <p
                    className="text-3xl font-bold tracking-tight mb-0.5"
                    style={{ color: f.accent, fontFamily: "var(--font-mono)" }}
                  >
                    {f.stat}
                    <span className="text-base ml-1 text-[var(--text-muted)] font-medium">
                      {f.statLabel}
                    </span>
                  </p>
                )}
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
