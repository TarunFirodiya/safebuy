"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  HomeModernIcon,
  DocumentMagnifyingGlassIcon,
  DocumentCheckIcon,
  KeyIcon,
  ArrowRightIcon,
  CheckIcon,
  CheckBadgeIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { fadeInUp, staggerContainer, staggerItem, transitions, VIEWPORT } from "@/lib/motion";

type Step = {
  step: string;
  label: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  colorSubtle: string;
};

const steps: Step[] = [
  {
    step: "Step 1",
    label: "01",
    title: "Lock in the home",
    description:
      "Confirm the terms and park your token in a Jumbo SafeBuy escrow account. Fully refundable until legal diligence clears — so your money moves only when the deal is safe.",
    Icon: HomeModernIcon,
    color: "var(--primary)",
    colorSubtle: "var(--accent)",
  },
  {
    step: "Step 2",
    label: "02",
    title: "We verify everything",
    description:
      "Our lawyers pull the encumbrance certificate, trace ownership back 30 years, and verify khata, tax receipts, and sanctioned plans. You get a plain-English report with every risk flagged — and a written legal opinion.",
    Icon: DocumentMagnifyingGlassIcon,
    color: "var(--warning)",
    colorSubtle: "var(--warning-subtle)",
  },
  {
    step: "Step 3",
    label: "03",
    title: "Sign the paperwork online",
    description:
      "We draft the sale agreement, run it by both parties, and collect e-signatures. No printouts, no back-and-forth — just a clean, witnessed agreement in hours, not weeks.",
    Icon: DocumentCheckIcon,
    color: "var(--primary)",
    colorSubtle: "var(--accent)",
  },
  {
    step: "Step 4",
    label: "04",
    title: "Transfer and move in",
    description:
      "We draft the sale deed, calculate stamp duty, coordinate the sub-registrar appointment, and transfer khata and utilities to your name. 21 days, door to door.",
    Icon: KeyIcon,
    color: "var(--success)",
    colorSubtle: "var(--success-subtle)",
  },
];

// ─── Per-step scenes ──────────────────────────────────────────────────────

function SceneCard({
  children,
  step,
}: {
  children: React.ReactNode;
  step: Step;
}) {
  return (
    <div
      className="relative w-full aspect-square max-w-sm rounded-2xl border border-[var(--border)] overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${step.colorSubtle} 0%, #ffffff 65%)`,
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e6ebf1 1px, transparent 1px), linear-gradient(to bottom, #e6ebf1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.35,
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      <div className="relative w-full h-full flex items-center justify-center p-10">
        {children}
      </div>
    </div>
  );
}

function Scene1({ step }: { step: Step }) {
  return (
    <SceneCard step={step}>
      <div className="w-full max-w-[16rem] flex flex-col items-stretch gap-3">
        {/* Property card */}
        <div
          className="rounded-xl border border-[var(--border)] bg-white p-4 flex items-center gap-3"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: step.colorSubtle }}
          >
            <HomeModernIcon className="w-5 h-5" style={{ color: step.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Property
            </p>
            <p className="text-sm font-semibold text-foreground truncate">
              HSR Layout, Bangalore
            </p>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center">
          <div className="w-px h-5 bg-[var(--border-strong)]" />
        </div>

        {/* Escrow card */}
        <div
          className="rounded-xl border border-[var(--border)] bg-white p-4 flex items-center gap-3"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "var(--success-subtle)" }}
          >
            <BanknotesIcon className="w-5 h-5" style={{ color: "var(--success)" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Escrow
            </p>
            <p
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ₹1,00,000 locked
            </p>
          </div>
          <CheckBadgeIcon className="w-5 h-5 shrink-0" style={{ color: "var(--success)" }} />
        </div>
      </div>
    </SceneCard>
  );
}

function Scene2({ step }: { step: Step }) {
  const items = [
    { label: "Encumbrance certificate", done: true },
    { label: "Ownership chain — 30 yrs", done: true },
    { label: "Khata & tax receipts", done: true },
    { label: "Sanctioned plan", done: false },
  ];
  return (
    <SceneCard step={step}>
      <div
        className="w-full max-w-[16rem] rounded-xl border border-[var(--border)] bg-white p-4"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--border)]">
          <DocumentMagnifyingGlassIcon
            className="w-4 h-4"
            style={{ color: step.color }}
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Legal report
          </p>
        </div>
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.label} className="flex items-center gap-2.5 text-xs">
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: it.done ? "var(--success)" : "var(--warning-subtle)",
                  border: it.done
                    ? "none"
                    : "1px solid color-mix(in srgb, var(--warning) 40%, transparent)",
                }}
              >
                {it.done ? (
                  <CheckIcon className="w-2.5 h-2.5 text-white" />
                ) : (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--warning)" }}
                  />
                )}
              </span>
              <span className="text-foreground font-medium truncate">{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </SceneCard>
  );
}

function Scene3({ step }: { step: Step }) {
  return (
    <SceneCard step={step}>
      <div className="w-full max-w-[16rem] flex flex-col gap-2">
        {/* Incoming message */}
        <div
          className="self-start max-w-[80%] rounded-2xl rounded-bl-md bg-white border border-[var(--border)] px-3.5 py-2.5"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <ChatBubbleLeftRightIcon
              className="w-3 h-3"
              style={{ color: step.color }}
            />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              SafeBuy
            </p>
          </div>
          <p className="text-xs text-foreground leading-snug">
            Sale agreement ready — tap to review and sign.
          </p>
        </div>

        {/* Document bubble */}
        <div
          className="self-start max-w-[80%] rounded-xl bg-white border border-[var(--border)] p-3 flex items-center gap-2.5"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: step.colorSubtle }}
          >
            <DocumentCheckIcon className="w-4 h-4" style={{ color: step.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              Sale-Agreement.pdf
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">3 pages · e-sign</p>
          </div>
        </div>

        {/* Outgoing signed confirmation */}
        <div
          className="self-end max-w-[80%] rounded-2xl rounded-br-md px-3.5 py-2.5 flex items-center gap-1.5"
          style={{
            background: "var(--success-subtle)",
            border: "1px solid color-mix(in srgb, var(--success) 20%, transparent)",
          }}
        >
          <CheckBadgeIcon className="w-3.5 h-3.5" style={{ color: "var(--success)" }} />
          <p className="text-xs font-semibold" style={{ color: "var(--success)" }}>
            Signed
          </p>
        </div>
      </div>
    </SceneCard>
  );
}

function Scene4({ step }: { step: Step }) {
  return (
    <SceneCard step={step}>
      <div className="w-full max-w-[16rem] flex flex-col gap-3">
        {/* Countdown card */}
        <div
          className="rounded-xl border border-[var(--border)] bg-white p-4 flex items-center gap-3"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: step.colorSubtle }}
          >
            <CalendarDaysIcon className="w-5 h-5" style={{ color: step.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Door to door
            </p>
            <p
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              21 days
            </p>
          </div>
        </div>

        {/* Milestones */}
        <div
          className="rounded-xl border border-[var(--border)] bg-white p-4"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <ul className="space-y-2">
            {[
              { label: "Sale deed drafted", done: true },
              { label: "Stamp duty paid", done: true },
              { label: "SRO appointment", done: true },
              { label: "Khata transferred", done: true },
            ].map((m) => (
              <li key={m.label} className="flex items-center gap-2.5 text-xs">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--success)" }}
                >
                  <CheckIcon className="w-2.5 h-2.5 text-white" />
                </span>
                <span className="text-foreground font-medium truncate">{m.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Keys badge */}
        <div
          className="self-center inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            background: "var(--success-subtle)",
            border: "1px solid color-mix(in srgb, var(--success) 20%, transparent)",
          }}
        >
          <KeyIcon className="w-3.5 h-3.5" style={{ color: "var(--success)" }} />
          <p className="text-[11px] font-semibold" style={{ color: "var(--success)" }}>
            Keys in hand
          </p>
        </div>
      </div>
    </SceneCard>
  );
}

const scenes = [Scene1, Scene2, Scene3, Scene4];

function StepVisual({ index, step }: { index: number; step: Step }) {
  const Scene = scenes[index] ?? Scene1;
  return (
    <motion.div
      key={step.title}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full h-full flex items-center justify-center"
    >
      <Scene step={step} />
    </motion.div>
  );
}

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return prefers;
}

export function HowItWorks() {
  const [current, setCurrent] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % steps.length), 4500);
    return () => clearInterval(t);
  }, [reduced]);

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
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance max-w-2xl mx-auto">
            From lock-in to{" "}
            <span className="text-[var(--primary)]">keys in hand</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl mx-auto text-balance">
            Four clear steps, 21 days door to door. Start with the full
            journey, or pick a single service for one step.
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
                    <p
                      className="text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-0.5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {s.label}
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
              <StepVisual key={current} index={current} step={steps[current]} />
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
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
