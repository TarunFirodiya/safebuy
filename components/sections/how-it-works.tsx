"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  HomeModernIcon,
  DocumentMagnifyingGlassIcon,
  KeyIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { fadeInUp, staggerContainer, staggerItem, transitions, VIEWPORT } from "@/lib/motion";

const steps = [
  {
    step: "Step 1",
    title: "Lock in the home",
    description:
      "Deposit a refundable ₹1,00,000 token into the SafeBuy escrow account at ICICI Bank. The seller stops showing the property. Your money is fully refundable until legal diligence clears.",
    Icon: HomeModernIcon,
    color: "var(--primary)",
    colorSubtle: "var(--accent)",
  },
  {
    step: "Step 2",
    title: "We verify everything",
    description:
      "Our lawyers pull the encumbrance certificate, trace ownership back 30 years, verify the khata, tax receipts, and sanctioned plans. You get a plain-English report with every risk flagged — and a written legal opinion.",
    Icon: DocumentMagnifyingGlassIcon,
    color: "var(--warning)",
    colorSubtle: "var(--warning-subtle)",
  },
  {
    step: "Step 3",
    title: "Transfer and move in",
    description:
      "We draft the sale deed, calculate stamp duty, coordinate the sub-registrar appointment, and transfer khata and utilities to your name. 21 days, door to door.",
    Icon: KeyIcon,
    color: "var(--success)",
    colorSubtle: "var(--success-subtle)",
  },
];

function StepVisual({ step }: { step: typeof steps[number] }) {
  return (
    <motion.div
      key={step.title}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full h-full flex items-center justify-center"
    >
      <div
        className="w-full aspect-square max-w-xs rounded-2xl border border-[var(--border)] flex flex-col items-center justify-center gap-6 p-10"
        style={{
          background: `linear-gradient(135deg, ${step.colorSubtle} 0%, #ffffff 60%)`,
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: step.colorSubtle, border: `1px solid color-mix(in srgb, ${step.color} 20%, transparent)` }}
        >
          <step.Icon className="w-10 h-10" style={{ color: step.color }} />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">
            {step.step}
          </p>
          <p className="text-xl font-bold tracking-tight text-foreground">
            {step.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % steps.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="how-it-works" className="section-wrapper bg-[var(--surface)]">
      <div className="container-lg px-6 md:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={transitions.fadeInUp}
        >
          <span className="eyebrow">How it works</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Two ways in.{" "}
            <span className="text-[var(--primary)]">One safe transfer.</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl mx-auto text-balance">
            Start with a bundle for the full journey, or pick a single service
            for one step.
          </p>
        </motion.div>

        {/* Track A — full journey */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16">

          {/* Steps list */}
          <motion.ol
            className="space-y-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {steps.map((s, i) => {
              const isActive = i === current;
              const isDone = i < current;
              return (
                <motion.li
                  key={s.step}
                  variants={staggerItem}
                  transition={transitions.staggerItem}
                  className={`flex items-start gap-4 p-5 rounded-xl cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-white border border-[var(--border)] shadow-[var(--shadow-md)]"
                      : "opacity-50 hover:opacity-75"
                  }`}
                  onClick={() => setCurrent(i)}
                >
                  {/* Step number / check */}
                  <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                    style={{
                      background: isActive
                        ? s.color
                        : isDone
                        ? "var(--success)"
                        : "var(--surface)",
                      border: `2px solid ${isActive ? s.color : isDone ? "var(--success)" : "var(--border)"}`,
                      color: isActive || isDone ? "#fff" : "var(--text-muted)",
                    }}
                  >
                    {isDone ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>

                  <div className="flex-1 pt-0.5 min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-0.5">
                      {s.step}
                    </p>
                    <p className="font-semibold text-foreground tracking-tight mb-1">
                      {s.title}
                    </p>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm text-[var(--text-secondary)] leading-relaxed"
                      >
                        {s.description}
                      </motion.p>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>

          {/* Visual panel */}
          <motion.div
            className="relative lg:sticky lg:top-24 flex items-center justify-center min-h-72"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            transition={{ ...transitions.fadeInUp, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              <StepVisual key={current} step={steps[current]} />
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "1.25rem" : "0.375rem",
                    background: i === current ? "var(--primary)" : "var(--border-strong)",
                  }}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Track B — single service CTA */}
        <motion.div
          className="rounded-xl border border-[var(--border)] bg-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ boxShadow: "var(--shadow-sm)" }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={transitions.fadeInUp}
        >
          <div>
            <p className="font-semibold text-foreground tracking-tight">
              Just need help with one thing?
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Browse our catalog of 20+ individual services. Fixed prices, clear
              results, no bundling required.
            </p>
          </div>
          <Link
            href="/services"
            className="shrink-0 inline-flex items-center gap-2 h-10 px-5 rounded-md border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-foreground hover:border-[var(--border-strong)] hover:bg-white transition-colors"
          >
            Browse all services
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
