"use client";

import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  WalletIcon,
  DocumentTextIcon,
  HomeIcon,
  PhoneIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { fadeInUp, staggerContainer, staggerItem, transitions, VIEWPORT } from "@/lib/motion";

// ─── Design Tokens (from frontend-design-tokens) ────────────────────────────
const T = {
  primary: "#6C63FF",
  primaryHover: "#5A52E0",
  primaryMuted: "rgba(108, 99, 255, 0.08)",
  accent: "#F07030",
  success: "#16A066",
  successMuted: "rgba(22, 160, 102, 0.10)",
  warning: "#D97706",
  warningMuted: "rgba(217, 119, 6, 0.10)",
  error: "#DC2626",
  surface: "#FFFFFF",
  background: "#FAFAFA",
  border: "#E4E4EE",
  borderActive: "#C8C8DF",
  textPrimary: "#111118",
  textSecondary: "#6B6B8A",
  textTertiary: "#A0A0BC",
} as const;

// ─── Sub-components ────────────────────────────────────────────────────────

function StatusBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        background: T.primaryMuted,
        color: T.primary,
        border: `1px solid ${T.primary}20`,
        borderRadius: 9999,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function StepIcon({
  done,
  active,
  number,
  color = T.primary,
}: {
  done?: boolean;
  active?: boolean;
  number?: number;
  color?: string;
}) {
  const size = 28;
  const bg = done ? T.success : active ? color : T.background;
  const border = done ? T.success : active ? color : T.border;
  const fg = done || active ? "#fff" : T.textTertiary;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        border: `2px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: fg,
        flexShrink: 0,
        transition: "all 0.3s ease",
      }}
    >
      {done ? (
        <CheckCircleIcon style={{ width: 14, height: 14, color: fg }} />
      ) : (
        number
      )}
    </div>
  );
}

function TimelineItem({
  done,
  active,
  icon,
  title,
  subtitle,
  badge,
  badgeVariant = "primary",
  action,
}: {
  done?: boolean;
  active?: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "primary" | "warning" | "success" | "muted";
  action?: { label: string; variant: "primary" | "ghost" };
}) {
  const badgeColors = {
    primary: { bg: T.primaryMuted, color: T.primary },
    warning: { bg: T.warningMuted, color: T.warning },
    success: { bg: T.successMuted, color: T.success },
    muted: { bg: T.background, color: T.textTertiary },
  };
  const bc = badgeColors[badgeVariant];

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        opacity: done ? 0.6 : 1,
        padding: "12px 0",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: active ? T.primaryMuted : T.background,
          border: `1px solid ${active ? T.primary : T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.textPrimary,
              margin: 0,
            }}
          >
            {title}
          </p>
          {badge && (
            <span
              style={{
                background: bc.bg,
                color: bc.color,
                borderRadius: 6,
                padding: "2px 7px",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.03em",
                whiteSpace: "nowrap",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: 12,
              color: T.textSecondary,
              margin: "2px 0 0",
            }}
          >
            {subtitle}
          </p>
        )}
        {action && (
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {action.variant === "primary" ? (
              <button
                style={{
                  background: T.primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: 7,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {action.label}
              </button>
            ) : (
              <button
                style={{
                  background: "transparent",
                  color: T.textSecondary,
                  border: `1px solid ${T.border}`,
                  borderRadius: 7,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function TransactionDashboard() {
  return (
    <section
      id="product-demo"
      style={{ background: T.background, padding: "64px 0" }}
    >
      <div className="container-lg px-6 md:px-8">
        {/* Section header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={transitions.fadeInUp}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <span className="eyebrow">See it in action</span>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              color: T.textPrimary,
              marginTop: 8,
              letterSpacing: "-0.02em",
            }}
          >
            Your deal. Live. In real-time.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: T.textSecondary,
              marginTop: 12,
              maxWidth: 440,
              margin: "12px auto 0",
              lineHeight: 1.6,
            }}
          >
            From token to keys — every step tracked, every party verified, every
            rupee protected.
          </p>
        </motion.div>

        {/* Phone frame mockup */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={{ ...transitions.fadeInUp, delay: 0.1 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 390,
              background: T.surface,
              borderRadius: 40,
              border: `2px solid ${T.border}`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)`,
              overflow: "hidden",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {/* Status bar */}
            <div
              style={{
                background: T.surface,
                padding: "12px 20px 8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <span
                style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary }}
              >
                9:41
              </span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {["full", "full", "full"].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 7,
                      borderRadius: 3,
                      border: `1px solid ${T.textPrimary}`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* App content */}
            <div style={{ padding: "16px 16px 24px" }}>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: T.primaryMuted,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HomeIcon
                      style={{ width: 16, height: 16, color: T.primary }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: T.textPrimary,
                    }}
                  >
                    Transaction Details
                  </span>
                </div>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: T.background,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <circle cx="7" cy="2" r="1" fill={T.textSecondary} />
                    <circle cx="7" cy="7" r="1" fill={T.textSecondary} />
                    <circle cx="7" cy="12" r="1" fill={T.textSecondary} />
                  </svg>
                </div>
              </div>

              {/* TXN ID + Badge */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: T.textTertiary,
                    fontFamily: "monospace",
                    letterSpacing: "0.02em",
                  }}
                >
                  TRANSACTION ID #TXN-9821
                </span>
                <StatusBadge label="In Progress" />
              </div>

              {/* Progress stepper */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  marginBottom: 8,
                }}
              >
                {[
                  { label: "Initiated", done: true, active: false, color: T.success },
                  { label: "Payment", done: false, active: true, color: T.primary },
                  { label: "Agreement", done: false, active: false, color: T.textTertiary },
                  { label: "Closed", done: false, active: false, color: T.textTertiary },
                ].map((step, i, arr) => (
                  <div key={step.label} style={{ display: "contents" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <StepIcon
                        done={step.done}
                        active={step.active}
                        number={i + 1}
                        color={step.color}
                      />
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          color: step.active
                            ? T.primary
                            : step.done
                            ? T.success
                            : T.textTertiary,
                          letterSpacing: "0.03em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        style={{
                          flex: 1,
                          height: 2,
                          background:
                            step.done
                              ? T.success
                              : T.border,
                          margin: "0 4px",
                          marginBottom: 20,
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step label */}
              <p
                style={{
                  fontSize: 11,
                  color: T.primary,
                  fontWeight: 600,
                  textAlign: "center",
                  margin: "0 0 16px",
                }}
              >
                Step 2 of 4: Payment Processing
              </p>

              {/* Commercials card */}
              <div
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: "16px",
                  marginBottom: 16,
                  boxShadow: `0 1px 3px rgba(0,0,0,0.05)`,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px 16px",
                  }}
                >
                  {[
                    { label: "Sale Price", value: "₹1,50,00,000", highlight: false },
                    { label: "Token Amount", value: "₹1,00,000", highlight: false },
                    { label: "Deposit (10%)", value: "₹15,00,000", highlight: false },
                    {
                      label: "Balance Due",
                      value: "₹1,34,00,000",
                      highlight: true,
                    },
                  ].map(({ label, value, highlight }) => (
                    <div key={label}>
                      <p
                        style={{
                          fontSize: 10,
                          color: T.textTertiary,
                          margin: 0,
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontSize: highlight ? 15 : 13,
                          fontWeight: highlight ? 700 : 600,
                          color: highlight ? T.primary : T.textPrimary,
                          margin: "3px 0 0",
                          fontFamily: "monospace",
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parties */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                {[
                  { role: "Buyer", name: "Rahul Sharma", verified: true },
                  { role: "Seller", name: "Priya Singh", verified: true },
                ].map(({ role, name, verified }) => (
                  <div
                    key={role}
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: 12,
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: `0 1px 3px rgba(0,0,0,0.04)`,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: T.primaryMuted,
                        border: `2px solid ${T.success}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 16,
                          color: T.primary,
                          fontWeight: 700,
                        }}
                      >
                        {name.charAt(0)}
                      </span>
                      {verified && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: -2,
                            right: -2,
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: T.success,
                            border: "2px solid white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CheckCircleIcon
                            style={{ width: 9, height: 9, color: "#fff" }}
                          />
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: T.textPrimary,
                          margin: 0,
                        }}
                      >
                        {name}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: T.textTertiary,
                          margin: "2px 0 0",
                        }}
                      >
                        {role}
                      </p>
                    </div>
                    <button
                      style={{
                        width: "100%",
                        padding: "5px",
                        borderRadius: 7,
                        border: `1px solid ${T.border}`,
                        background: T.background,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        cursor: "pointer",
                      }}
                    >
                      <PhoneIcon
                        style={{ width: 11, height: 11, color: T.textSecondary }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          color: T.textSecondary,
                          fontWeight: 500,
                        }}
                      >
                        Contact
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 16,
                  padding: "12px 16px",
                  boxShadow: `0 1px 3px rgba(0,0,0,0.04)`,
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: T.textTertiary,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    margin: "0 0 8px",
                  }}
                >
                  Activity
                </p>

                <TimelineItem
                  done
                  icon={
                    <DocumentTextIcon
                      style={{ width: 16, height: 16, color: T.success }}
                    />
                  }
                  title="Term Sheet Signed"
                  subtitle="Both parties have e-signed"
                  badge="Oct 12"
                  badgeVariant="success"
                  action={{ label: "View Document", variant: "ghost" }}
                />

                <div
                  style={{
                    borderLeft: `2px solid ${T.border}`,
                    marginLeft: 17,
                    paddingLeft: 20,
                    position: "relative",
                  }}
                >
                  {/* Connector line */}
                  <div
                    style={{
                      position: "absolute",
                      left: -2,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      background: `linear-gradient(to bottom, ${T.primary} 0%, ${T.border} 100%)`,
                      borderRadius: 2,
                    }}
                  />

                  <TimelineItem
                    active
                    icon={
                      <WalletIcon
                        style={{ width: 16, height: 16, color: T.primary }}
                      />
                    }
                    title="Payment Link Generated"
                    subtitle="Token amount link created"
                    badge="ACTION REQ"
                    badgeVariant="warning"
                    action={{ label: "Share Link", variant: "primary" }}
                  />

                  <TimelineItem
                    icon={
                      <ShieldCheckIcon
                        style={{
                          width: 16,
                          height: 16,
                          color: T.textTertiary,
                        }}
                      />
                    }
                    title="Agreement Execution"
                    subtitle="Awaiting payment confirmation"
                    badge="Pending"
                    badgeVariant="muted"
                  />
                </div>
              </div>

              {/* Footer CTAs */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.6fr",
                  gap: 10,
                  marginTop: 16,
                }}
              >
                <button
                  style={{
                    padding: "13px",
                    borderRadius: 10,
                    border: `1px solid ${T.border}`,
                    background: T.surface,
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.textSecondary,
                    cursor: "pointer",
                  }}
                >
                  Cancel Request
                </button>
                <button
                  style={{
                    padding: "13px",
                    borderRadius: 10,
                    border: "none",
                    background: T.primary,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  Proceed to Agreement
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
