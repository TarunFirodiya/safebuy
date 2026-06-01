"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Stepper } from "@/components/onboarding/stepper";
import { transitions } from "@/lib/motion";
import { cn, formatINR } from "@/lib/utils";

export interface ApplyWizardSku {
  type: "service" | "bundle";
  slug: string;
  name: string;
  price: number;
  priceNote?: string;
  deliveryTime: string;
  shortDescription: string;
  result: string;
  buyable: boolean;
}

export interface ApplyWizardProperty {
  propertyType: string;
  address: string;
  ward: string;
  buyerName: string;
  sellerName: string;
  notes: string;
}

interface ApplyWizardProps {
  applicationId: string;
  sku: ApplyWizardSku;
  initialProperty: ApplyWizardProperty;
}

// Steps live across two routes: 1–3 here, "Documents" continues on the next
// page. Keep the labels in sync with /apply/[id]/documents.
const STEP_LABELS = ["Confirm", "Property", "Contact", "Documents"];
const TOTAL_STEPS = STEP_LABELS.length;

const PROPERTY_TYPES = ["Apartment", "Villa / House", "Plot / Land", "Commercial"];

const emptyContact = { name: "", email: "", phone: "" };

export function ApplyWizard({
  applicationId,
  sku,
  initialProperty,
}: ApplyWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 confirm, 1 property, 2 contact
  const [property, setProperty] = useState<ApplyWizardProperty>(initialProperty);
  const [contact, setContact] = useState(emptyContact);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function back() {
    setError(null);
    if (step > 0) setStep(step - 1);
  }

  async function saveProperty() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Could not save. Please try again.");
      }
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function saveContact() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Could not save. Please try again.");
      }
      router.push(`/apply/${applicationId}/documents`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-8">
        <Stepper current={step + 1} total={TOTAL_STEPS} label={STEP_LABELS[step]} />
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transitions.smooth}
        >
          {step === 0 && (
            <section>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Confirm what you&apos;re applying for
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Fixed price, clear timeline. You can add your details near the end.
              </p>

              <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-foreground">
                      {sku.name}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {sku.shortDescription}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-right text-lg font-bold tabular-nums text-foreground"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {sku.priceNote ?? formatINR(sku.price)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {sku.deliveryTime}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckBadgeIcon className="h-3.5 w-3.5" />
                    {sku.type === "bundle" ? "Bundle" : "Fixed-price service"}
                  </span>
                </div>
                <p className="mt-3 rounded-md bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-secondary)]">
                  {sku.result}
                </p>
              </div>

              <Link
                href="/start"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
              >
                <PencilSquareIcon className="h-3.5 w-3.5" />
                Choose a different service
              </Link>

              <PrimaryButton onClick={() => setStep(1)}>
                Continue
                <ArrowRightIcon className="h-4 w-4" />
              </PrimaryButton>
            </section>
          )}

          {step === 1 && (
            <section>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Property &amp; parties
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Help us prepare the right paperwork. All fields are optional — share
                what you have.
              </p>

              <div className="mt-6 space-y-4">
                <Field label="Property type">
                  <div className="grid grid-cols-2 gap-2">
                    {PROPERTY_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setProperty((p) => ({ ...p, propertyType: t }))
                        }
                        className={cn(
                          "rounded-md border px-3 py-2.5 text-sm font-medium transition-colors",
                          property.propertyType === t
                            ? "border-[var(--primary)] bg-[var(--accent)] text-[var(--accent-foreground)]"
                            : "border-[var(--border)] bg-white text-foreground hover:border-[var(--border-strong)]",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Property address">
                  <textarea
                    value={property.address}
                    onChange={(e) =>
                      setProperty((p) => ({ ...p, address: e.target.value }))
                    }
                    rows={2}
                    placeholder="Door no., street, area, city, PIN"
                    className="w-full resize-none rounded-md border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </Field>

                <Field label="BBMP ward (if known)">
                  <input
                    value={property.ward}
                    onChange={(e) =>
                      setProperty((p) => ({ ...p, ward: e.target.value }))
                    }
                    placeholder="e.g. Ward 150, Bommanahalli"
                    className="h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-foreground placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Buyer name">
                    <input
                      value={property.buyerName}
                      onChange={(e) =>
                        setProperty((p) => ({ ...p, buyerName: e.target.value }))
                      }
                      placeholder="Buyer"
                      className="h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-foreground placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                    />
                  </Field>
                  <Field label="Seller name">
                    <input
                      value={property.sellerName}
                      onChange={(e) =>
                        setProperty((p) => ({ ...p, sellerName: e.target.value }))
                      }
                      placeholder="Seller"
                      className="h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-foreground placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                    />
                  </Field>
                </div>

                <Field label="Anything else we should know?">
                  <textarea
                    value={property.notes}
                    onChange={(e) =>
                      setProperty((p) => ({ ...p, notes: e.target.value }))
                    }
                    rows={2}
                    placeholder="Optional context for our team"
                    className="w-full resize-none rounded-md border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </Field>
              </div>

              {error && <ErrorText>{error}</ErrorText>}

              <PrimaryButton onClick={saveProperty} disabled={saving}>
                {saving ? "Saving…" : "Continue"}
                {!saving && <ArrowRightIcon className="h-4 w-4" />}
              </PrimaryButton>
            </section>
          )}

          {step === 2 && (
            <section>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Where should we reach you?
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                We&apos;ll send your application updates here. No spam — just
                progress on {sku.name}.
              </p>

              <div className="mt-6 space-y-4">
                <Field label="Full name">
                  <input
                    value={contact.name}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, name: e.target.value }))
                    }
                    autoComplete="name"
                    placeholder="Your name"
                    className="h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-foreground placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, email: e.target.value }))
                    }
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-foreground placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, phone: e.target.value }))
                    }
                    autoComplete="tel"
                    placeholder="10-digit mobile"
                    className="h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-foreground placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </Field>
              </div>

              {error && <ErrorText>{error}</ErrorText>}

              <PrimaryButton onClick={saveContact} disabled={saving}>
                {saving ? "Saving…" : "Continue to documents"}
                {!saving && <ArrowRightIcon className="h-4 w-4" />}
              </PrimaryButton>

              <p className="mt-3 text-center text-[11px] text-[var(--text-muted)]">
                By continuing you agree to be contacted about this application.
              </p>
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-md bg-[var(--error-subtle)] px-3 py-2 text-sm text-[var(--error)]">
      {children}
    </p>
  );
}
