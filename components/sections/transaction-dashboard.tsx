"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  LockClosedIcon,
  DocumentCheckIcon,
  KeyIcon,
  HomeModernIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { fadeInUp, transitions, VIEWPORT } from "@/lib/motion";

// ─── Tokens ────────────────────────────────────────────────────────────────

const T = {
  primary: "var(--primary)",
  primaryMuted: "color-mix(in srgb, var(--primary) 14%, transparent)",
  primaryStrong: "color-mix(in srgb, var(--primary) 92%, black)",
  success: "var(--success)",
  successMuted: "var(--success-subtle)",
  warning: "var(--warning)",
  warningMuted: "var(--warning-subtle)",
  surface: "#ffffff",
  background: "var(--surface)",
  border: "var(--border)",
  textPrimary: "var(--foreground)",
  textSecondary: "var(--text-secondary)",
  textTertiary: "var(--text-muted)",
} as const;

const SCREEN_DURATION_MS = 4500;

// ─── Shared micro-components ───────────────────────────────────────────────

function Pill({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "muted";
}) {
  const colors = {
    primary: { bg: T.primaryMuted, fg: T.primary, ring: "color-mix(in srgb, var(--primary) 22%, transparent)" },
    success: { bg: T.successMuted, fg: T.success, ring: "color-mix(in srgb, var(--success) 22%, transparent)" },
    warning: { bg: T.warningMuted, fg: T.warning, ring: "color-mix(in srgb, var(--warning) 24%, transparent)" },
    muted:   { bg: T.background,   fg: T.textTertiary, ring: T.border },
  }[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: colors.bg,
        color: colors.fg,
        border: `1px solid ${colors.ring}`,
        borderRadius: 999,
        padding: "2px 9px",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function ConditionRow({
  state,
  label,
}: {
  state: "done" | "active" | "pending";
  label: string;
}) {
  const color =
    state === "done" ? T.success : state === "active" ? T.warning : T.textTertiary;
  const bg =
    state === "done"
      ? T.successMuted
      : state === "active"
      ? T.warningMuted
      : T.background;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 10,
        border: `1px solid ${T.border}`,
        background: T.surface,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: bg,
          border: `1.5px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {state === "done" ? (
          <CheckCircleIcon style={{ width: 12, height: 12, color }} />
        ) : state === "active" ? (
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: 999, background: color }}
          />
        ) : null}
      </div>
      <span
        style={{
          fontSize: 11.5,
          fontWeight: state === "pending" ? 500 : 600,
          color: state === "pending" ? T.textTertiary : T.textPrimary,
          letterSpacing: "-0.005em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Screen shared shell ───────────────────────────────────────────────────

const screenFade: Variants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function ScreenShell({
  eyebrow,
  title,
  accent = T.primary,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={screenFade}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "8px 14px 12px",
        minHeight: 0,
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <p
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: accent,
            margin: 0,
          }}
        >
          {eyebrow}
        </p>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: T.textPrimary,
            margin: "2px 0 0",
            letterSpacing: "-0.01em",
            lineHeight: 1.25,
          }}
        >
          {title}
        </h3>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Screen 1: Initiated ───────────────────────────────────────────────────

function ScreenInitiated() {
  return (
    <ScreenShell
      eyebrow="Step 1 of 4 · Initiated"
      title="Deal locked in"
      accent={T.primary}
    >
      {/* Property card */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: 12,
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: T.primaryMuted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <HomeModernIcon style={{ width: 22, height: 22, color: T.primary }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, margin: 0 }}>
            3 BHK · Prestige Park Grove
          </p>
          <p style={{ fontSize: 10.5, color: T.textSecondary, margin: "2px 0 0" }}>
            Whitefield, Bengaluru
          </p>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.primary, fontFamily: "monospace" }}>
          ₹1.5Cr
        </span>
      </div>

      {/* Parties */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { role: "Buyer", name: "Rahul Sharma" },
          { role: "Seller", name: "Priya Singh" },
        ].map(({ role, name }, i) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "10px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: T.primaryMuted,
                border: `2px solid ${T.success}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: T.primary }}>
                {name.charAt(0)}
              </span>
              <div
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: T.success,
                  border: "2px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleIcon style={{ width: 8, height: 8, color: "#fff" }} />
              </div>
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, margin: "2px 0 0" }}>
              {name}
            </p>
            <p style={{ fontSize: 9.5, color: T.textTertiary, margin: 0, letterSpacing: "0.03em", textTransform: "uppercase", fontWeight: 600 }}>
              {role} · Verified
            </p>
          </motion.div>
        ))}
      </div>

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          background: T.primaryMuted,
          border: `1px solid color-mix(in srgb, var(--primary) 22%, transparent)`,
          borderRadius: 12,
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <SparklesIcon style={{ width: 16, height: 16, color: T.primary, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: T.primary, margin: 0 }}>
            Both parties KYC verified
          </p>
          <p style={{ fontSize: 10, color: T.textSecondary, margin: "1px 0 0" }}>
            Ready to move funds into escrow
          </p>
        </div>
      </motion.div>

      {/* Spacer + CTA */}
      <div style={{ flex: 1 }} />

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        style={{
          padding: "12px",
          borderRadius: 12,
          border: "none",
          background: T.primary,
          fontSize: 13,
          fontWeight: 700,
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          boxShadow:
            "0 1px 2px rgb(10 37 64 / 0.08), 0 6px 16px color-mix(in srgb, var(--primary) 32%, transparent)",
        }}
      >
        Fund Escrow
        <ArrowRightIcon style={{ width: 14, height: 14 }} />
      </motion.button>
    </ScreenShell>
  );
}

// ─── Screen 2: Escrow (the hero visual) ────────────────────────────────────

function ScreenEscrow() {
  const amount = "₹15,00,000";

  return (
    <ScreenShell
      eyebrow="Step 2 of 4 · Funds Secured"
      title="Safely held in escrow"
      accent={T.primary}
    >
      {/* Vault visual */}
      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(155deg, color-mix(in srgb, var(--primary) 10%, #ffffff) 0%, #ffffff 65%)",
          border: `1px solid color-mix(in srgb, var(--primary) 18%, transparent)`,
          borderRadius: 16,
          padding: "18px 14px 16px",
          overflow: "hidden",
          boxShadow:
            "0 1px 2px rgb(10 37 64 / 0.04), 0 12px 32px -16px color-mix(in srgb, var(--primary) 28%, transparent)",
        }}
      >
        {/* Grid backdrop */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(10,37,64,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,37,64,0.04) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at center top, black 0%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center top, black 0%, transparent 75%)",
          }}
        />

        {/* Shield + lock stack */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ position: "relative", width: 72, height: 72 }}>
            {/* Concentric pulse */}
            <motion.div
              aria-hidden
              animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `2px solid ${T.primary}`,
              }}
            />
            <motion.div
              aria-hidden
              animate={{ scale: [1, 1.55], opacity: [0.25, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `2px solid ${T.primary}`,
              }}
            />

            {/* Shield */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: `linear-gradient(155deg, ${T.primary} 0%, ${T.primaryStrong} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 8px 20px -6px color-mix(in srgb, var(--primary) 55%, transparent), inset 0 1px 0 rgb(255 255 255 / 0.25)",
              }}
            >
              <ShieldCheckIcon style={{ width: 36, height: 36, color: "#fff" }} />
              {/* Lock overlay */}
              <motion.div
                initial={{ y: -4, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.35 }}
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: T.success,
                  border: "3px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgb(0 0 0 / 0.15)",
                }}
              >
                <LockClosedIcon style={{ width: 12, height: 12, color: "#fff" }} />
              </motion.div>
            </motion.div>
          </div>

          {/* Amount */}
          <div style={{ textAlign: "center", marginTop: 4 }}>
            <p
              style={{
                fontSize: 10,
                color: T.textTertiary,
                margin: 0,
                letterSpacing: "0.06em",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Held in escrow
            </p>
            <p
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: T.textPrimary,
                margin: "2px 0 0",
                letterSpacing: "-0.02em",
                fontFamily: "monospace",
              }}
            >
              {amount}
            </p>
          </div>

          {/* Partner line */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 999,
              padding: "4px 10px",
              marginTop: 2,
            }}
          >
            <BuildingLibraryIcon style={{ width: 11, height: 11, color: T.primary }} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: T.textSecondary,
                letterSpacing: "0.01em",
              }}
            >
              Jumbo SafeBuy · RBI-licensed partner
            </span>
          </div>
        </div>
      </div>

      {/* Release conditions */}
      <div>
        <p
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            color: T.textTertiary,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 6px",
          }}
        >
          Release conditions
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <ConditionRow state="done" label="Both parties verified" />
          <ConditionRow state="done" label="Title check complete" />
          <ConditionRow state="active" label="Sale agreement signed" />
          <ConditionRow state="pending" label="Sub-registrar filing" />
        </div>
      </div>

      {/* Trust footer */}
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 10px",
          background: T.successMuted,
          border: `1px solid color-mix(in srgb, var(--success) 22%, transparent)`,
          borderRadius: 10,
        }}
      >
        <LockClosedIcon style={{ width: 13, height: 13, color: T.success, flexShrink: 0 }} />
        <p style={{ fontSize: 10.5, color: T.success, margin: 0, fontWeight: 600, lineHeight: 1.3 }}>
          Funds release only when every condition clears
        </p>
      </div>
    </ScreenShell>
  );
}

// ─── Screen 3: Agreement ───────────────────────────────────────────────────

function ScreenAgreement() {
  return (
    <ScreenShell
      eyebrow="Step 3 of 4 · Agreement"
      title="Signed, witnessed, timestamped"
      accent={T.primary}
    >
      {/* Document */}
      <div
        style={{
          position: "relative",
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "14px 14px 12px",
          boxShadow: "var(--shadow-sm)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          minHeight: 0,
        }}
      >
        {/* Doc header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: T.primaryMuted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <DocumentCheckIcon style={{ width: 16, height: 16, color: T.primary }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, margin: 0 }}>
              Sale Agreement
            </p>
            <p style={{ fontSize: 10, color: T.textTertiary, margin: "1px 0 0", fontFamily: "monospace" }}>
              DOC-2024-09821
            </p>
          </div>
          <Pill variant="success">Signed</Pill>
        </div>

        {/* Doc body (simulated lines) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[100, 92, 96, 78, 88].map((w, i) => (
            <div
              key={i}
              style={{
                height: 4,
                width: `${w}%`,
                background: T.border,
                borderRadius: 2,
              }}
            />
          ))}
        </div>

        {/* Signatures */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
          {[
            { role: "Buyer", name: "Rahul Sharma", delay: 0.2 },
            { role: "Seller", name: "Priya Singh", delay: 0.55 },
          ].map(({ role, name, delay }) => (
            <motion.div
              key={role}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay }}
              style={{
                background: T.background,
                border: `1px dashed color-mix(in srgb, var(--primary) 35%, transparent)`,
                borderRadius: 10,
                padding: "8px 10px",
                position: "relative",
              }}
            >
              <p style={{ fontSize: 9, color: T.textTertiary, margin: 0, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {role}
              </p>
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.15 }}
                style={{
                  fontSize: 15,
                  margin: "2px 0 0",
                  color: T.primary,
                  fontFamily: "cursive",
                  fontStyle: "italic",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {name.split(" ")[0]} {name.split(" ")[1]?.[0]}.
              </motion.p>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: delay + 0.3, type: "spring", stiffness: 300, damping: 18 }}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: T.success,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleIcon style={{ width: 10, height: 10, color: "#fff" }} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Witness / timestamp */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderTop: `1px solid ${T.border}`,
            paddingTop: 8,
            marginTop: "auto",
          }}
        >
          <ClockIcon style={{ width: 11, height: 11, color: T.textTertiary }} />
          <span style={{ fontSize: 10, color: T.textTertiary }}>
            Oct 14, 2025 · 11:42 IST · Witnessed by SafeBuy
          </span>
        </div>
      </div>
    </ScreenShell>
  );
}

// ─── Screen 4: Closed ──────────────────────────────────────────────────────

function ScreenClosed() {
  return (
    <ScreenShell
      eyebrow="Step 4 of 4 · Closed"
      title="Keys in hand."
      accent={T.success}
    >
      {/* Success burst */}
      <div
        style={{
          background:
            "linear-gradient(155deg, var(--success-subtle) 0%, #ffffff 70%)",
          border: `1px solid color-mix(in srgb, var(--success) 22%, transparent)`,
          borderRadius: 16,
          padding: "20px 14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 16 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: `linear-gradient(155deg, ${T.success} 0%, color-mix(in srgb, var(--success) 88%, black) 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 8px 20px -6px color-mix(in srgb, var(--success) 55%, transparent), inset 0 1px 0 rgb(255 255 255 / 0.25)",
          }}
        >
          <KeyIcon style={{ width: 30, height: 30, color: "#fff" }} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.textPrimary,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Transaction complete
        </motion.p>
        <p style={{ fontSize: 10.5, color: T.textSecondary, margin: 0, textAlign: "center", lineHeight: 1.4 }}>
          Sale deed registered. Khata transferred.
          <br />
          Funds released to seller.
        </p>
      </div>

      {/* Receipt */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: 12,
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.textTertiary, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
            Closing summary
          </p>
          <Pill variant="success">Settled</Pill>
        </div>
        {[
          { label: "Sale price", value: "₹1,50,00,000" },
          { label: "Stamp duty paid", value: "₹9,00,000" },
          { label: "Registration fee", value: "₹1,50,000" },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T.textSecondary }}>{label}</span>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: T.textPrimary, fontFamily: "monospace" }}>
              {value}
            </span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px dashed ${T.border}`,
            marginTop: 4,
            paddingTop: 6,
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: T.textPrimary }}>Possession date</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: T.success }}>
            Nov 04, 2025
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <button
        style={{
          padding: "11px",
          borderRadius: 12,
          border: `1px solid ${T.border}`,
          background: T.surface,
          fontSize: 12.5,
          fontWeight: 600,
          color: T.textSecondary,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <DocumentCheckIcon style={{ width: 14, height: 14 }} />
        Download closing packet
      </button>
    </ScreenShell>
  );
}

// ─── Screens config ────────────────────────────────────────────────────────

type ScreenDef = {
  id: string;
  navLabel: string;
  narrativeEyebrow: string;
  narrativeTitle: string;
  narrativeBody: string;
  accent: string;
  Render: () => React.ReactElement;
};

const SCREENS: ScreenDef[] = [
  {
    id: "initiated",
    navLabel: "Initiated",
    narrativeEyebrow: "01 · Deal initiated",
    narrativeTitle: "Buyer and seller, verified and locked in",
    narrativeBody:
      "Both parties complete KYC in under a minute. We pull the property listing, confirm terms, and prep the escrow rails.",
    accent: "var(--primary)",
    Render: ScreenInitiated,
  },
  {
    id: "escrow",
    navLabel: "Escrow",
    narrativeEyebrow: "02 · Funds in escrow",
    narrativeTitle: "Your money sits with an RBI-licensed partner",
    narrativeBody:
      "Zero release until every condition clears — title check, agreement signed, sub-registrar filing. Refundable if anything falls through.",
    accent: "var(--primary)",
    Render: ScreenEscrow,
  },
  {
    id: "agreement",
    navLabel: "Agreement",
    narrativeEyebrow: "03 · Agreement signed",
    narrativeTitle: "Drafted, reviewed, and e-signed in hours",
    narrativeBody:
      "Our lawyers draft the sale agreement. Both parties sign online with witnessed timestamps. No printouts, no back-and-forth.",
    accent: "var(--primary)",
    Render: ScreenAgreement,
  },
  {
    id: "closed",
    navLabel: "Closed",
    narrativeEyebrow: "04 · Deal closed",
    narrativeTitle: "Registration filed. Keys handed over.",
    narrativeBody:
      "We draft the sale deed, pay stamp duty, coordinate the sub-registrar, and transfer khata. Funds release to seller on your signal.",
    accent: "var(--success)",
    Render: ScreenClosed,
  },
];

// ─── Phone chrome ──────────────────────────────────────────────────────────

function PhoneFrame({
  activeIdx,
  onJumpTo,
  paused,
  progress,
  children,
}: {
  activeIdx: number;
  onJumpTo: (idx: number) => void;
  paused: boolean;
  progress: number; // 0-1 for current segment
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative w-full max-w-[320px] rounded-[2.6rem] p-[10px]"
      style={{
        background:
          "linear-gradient(155deg, #454548 0%, #2c2c2e 28%, #1a1a1c 62%, #0d0d0f 100%)",
        boxShadow: `
          0 2px 0 rgb(255 255 255 / 0.14) inset,
          0 -1px 0 rgb(0 0 0 / 0.45) inset,
          0 55px 100px -25px rgb(10 37 64 / 0.28),
          0 35px 70px -35px rgb(0 0 0 / 0.45),
          0 0 0 1px rgb(0 0 0 / 0.35)
        `,
      }}
    >
      {/* Bezel glint */}
      <div
        className="pointer-events-none absolute inset-[2px] rounded-[2.45rem] opacity-[0.14]"
        style={{
          background:
            "linear-gradient(125deg, rgb(255 255 255 / 0.55) 0%, transparent 42%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Screen — locked to iPhone 16 Pro aspect 9:19.5 */}
      <div
        className="relative overflow-hidden rounded-[2.1rem] bg-[var(--background)] font-sans antialiased flex flex-col"
        style={{
          aspectRatio: "9 / 19.5",
          boxShadow: `
            inset 0 0 0 1px rgb(10 37 64 / 0.06),
            inset 0 1px 0 rgb(255 255 255 / 0.75)
          `,
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute left-1/2 top-[9px] z-20 h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-black"
          style={{
            boxShadow:
              "0 4px 12px rgb(0 0 0 / 0.35), inset 0 1px 0 rgb(255 255 255 / 0.08)",
          }}
          aria-hidden
        />

        {/* Status bar */}
        <div
          className="relative z-10 flex items-center justify-between px-5 pt-[14px] pb-[6px]"
        >
          <span
            className="text-[11px] font-semibold tabular-nums tracking-tight"
            style={{ color: T.textPrimary }}
          >
            9:41
          </span>
          <div className="flex items-center gap-1">
            <div className="flex gap-[2px]" style={{ color: T.textPrimary }} aria-hidden>
              {[0.35, 0.55, 0.85, 1].map((op, i) => (
                <div
                  key={i}
                  className="w-[2.5px] rounded-[1px] bg-current"
                  style={{ height: 3.5 + i * 1.8, opacity: op }}
                />
              ))}
            </div>
            <div
              className="ml-1 flex h-[9px] w-[20px] items-center justify-end rounded-[2.5px] border px-[1.5px]"
              style={{ borderColor: T.textPrimary }}
            >
              <div
                className="h-[5.5px] w-[55%] rounded-[1px]"
                style={{ background: T.textPrimary }}
              />
            </div>
          </div>
        </div>

        {/* App header: title + txn ID + progress segments */}
        <div
          style={{
            padding: "6px 14px 8px",
            borderBottom: `1px solid ${T.border}`,
            background: T.surface,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: T.primaryMuted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HomeModernIcon style={{ width: 13, height: 13, color: T.primary }} />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, margin: 0, lineHeight: 1.1 }}>
                  Transaction
                </p>
                <p style={{ fontSize: 9, color: T.textTertiary, margin: 0, fontFamily: "monospace", letterSpacing: "0.02em" }}>
                  #TXN-9821
                </p>
              </div>
            </div>
            <Pill variant={activeIdx === 3 ? "success" : "primary"}>
              {activeIdx === 3 ? "Complete" : "In Progress"}
            </Pill>
          </div>

          {/* Story-style progress segments */}
          <div style={{ display: "flex", gap: 4 }} role="tablist" aria-label="Demo steps">
            {SCREENS.map((s, i) => {
              const isActive = i === activeIdx;
              const isDone = i < activeIdx;
              const fill = isDone ? 1 : isActive ? progress : 0;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to ${s.navLabel}`}
                  onClick={() => onJumpTo(i)}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: T.border,
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${fill * 100}%`,
                      background: isDone ? T.success : T.primary,
                      transition: paused ? "none" : "width 90ms linear",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Screen content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative" }}>
          {children}
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2 pt-1" style={{ background: T.background }}>
          <div
            className="h-[4px] w-[28%] max-w-[100px] rounded-full"
            style={{
              background: "color-mix(in srgb, var(--foreground) 20%, transparent)",
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

// ─── Narrative (left column) ───────────────────────────────────────────────

function NarrativePanel({
  activeIdx,
  onJumpTo,
}: {
  activeIdx: number;
  onJumpTo: (idx: number) => void;
}) {
  return (
    <ol className="flex flex-col gap-2" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {SCREENS.map((s, i) => {
        const isActive = i === activeIdx;
        return (
          <li key={s.id}>
            <button
              onClick={() => onJumpTo(i)}
              className="w-full text-left rounded-2xl transition-all"
              style={{
                padding: "16px 18px",
                background: isActive ? T.surface : "transparent",
                border: `1px solid ${isActive ? "color-mix(in srgb, var(--primary) 20%, transparent)" : "transparent"}`,
                boxShadow: isActive ? "var(--shadow-sm)" : "none",
                cursor: "pointer",
                position: "relative",
                display: "block",
              }}
              aria-current={isActive ? "step" : undefined}
            >
              {/* Left accent */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: 16,
                  bottom: 16,
                  width: 3,
                  borderRadius: 2,
                  background: isActive ? s.accent : "transparent",
                  transition: "background 200ms ease",
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isActive ? s.accent : T.textTertiary,
                  margin: 0,
                  transition: "color 200ms ease",
                }}
              >
                {s.narrativeEyebrow}
              </p>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: isActive ? T.textPrimary : T.textSecondary,
                  margin: "4px 0 0",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.3,
                }}
              >
                {s.narrativeTitle}
              </p>
              <motion.div
                initial={false}
                animate={{
                  height: isActive ? "auto" : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ overflow: "hidden" }}
              >
                <p
                  style={{
                    fontSize: 13.5,
                    color: T.textSecondary,
                    margin: "8px 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  {s.narrativeBody}
                </p>
              </motion.div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

export function TransactionDashboard() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const paused = isHovered || !!prefersReducedMotion;

  // Drive progress + auto-advance with rAF so the phone progress bar matches the transition timing
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startRef.current = performance.now() - progress * SCREEN_DURATION_MS;

    const tick = (now: number) => {
      const start = startRef.current ?? now;
      const elapsed = now - start;
      const pct = Math.min(elapsed / SCREEN_DURATION_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        setActiveIdx((i) => (i + 1) % SCREENS.length);
        setProgress(0);
        startRef.current = performance.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, activeIdx]);

  const jumpTo = useCallback((idx: number) => {
    setActiveIdx(idx);
    setProgress(0);
    startRef.current = performance.now();
  }, []);

  const ActiveScreen = useMemo(() => SCREENS[activeIdx].Render, [activeIdx]);

  return (
    <section id="product-demo" className="section-wrapper bg-[var(--background)]">
      <div className="container-lg px-6 md:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={transitions.fadeInUp}
        >
          <span className="eyebrow">See it in action</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance max-w-2xl mx-auto">
            Your deal, live on your phone
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl mx-auto text-balance">
            From token to keys — every step tracked, every party verified,
            every rupee accounted for.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={{ ...transitions.fadeInUp, delay: 0.1 }}
          className="grid gap-10 lg:gap-16 items-center lg:grid-cols-[1fr_auto]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
        >
          {/* Narrative */}
          <div className="w-full max-w-xl mx-auto lg:mx-0">
            <NarrativePanel activeIdx={activeIdx} onJumpTo={jumpTo} />
          </div>

          {/* Phone */}
          <div className="flex justify-center lg:justify-end">
            <PhoneFrame
              activeIdx={activeIdx}
              onJumpTo={jumpTo}
              paused={paused}
              progress={progress}
            >
              <AnimatePresence mode="wait">
                <ActiveScreen key={SCREENS[activeIdx].id} />
              </AnimatePresence>
            </PhoneFrame>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
