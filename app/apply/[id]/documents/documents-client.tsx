"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Stepper } from "@/components/onboarding/stepper";
import {
  DocumentUploadCard,
  type DocumentSlot,
} from "@/components/onboarding/document-upload-card";

interface DocumentsClientProps {
  applicationId: string;
  skuName: string;
  initialSlots: DocumentSlot[];
}

export function DocumentsClient({
  applicationId,
  skuName,
  initialSlots,
}: DocumentsClientProps) {
  const router = useRouter();
  const [slots, setSlots] = useState<DocumentSlot[]>(initialSlots);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const total = slots.length;
  const uploadedCount = slots.filter((s) => s.uploaded).length;
  const allUploaded = total === 0 || uploadedCount === total;

  async function upload(slot: DocumentSlot, file: File) {
    setBusyKey(slot.requirementKey);
    setErrors((e) => ({ ...e, [slot.requirementKey]: null }));
    try {
      const fd = new FormData();
      fd.append("requirementKey", slot.requirementKey);
      fd.append("file", file);
      const res = await fetch(`/api/applications/${applicationId}/documents`, {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => null)) as
        | { document?: { filename: string }; error?: string }
        | null;
      if (!res.ok || !data?.document) {
        throw new Error(data?.error ?? "Upload failed. Please try again.");
      }
      setSlots((prev) =>
        prev.map((s) =>
          s.requirementKey === slot.requirementKey
            ? {
                ...s,
                uploaded: true,
                filename: data.document!.filename,
                reviewStatus: "pending",
                reviewerNote: null,
              }
            : s,
        ),
      );
    } catch (e) {
      setErrors((prev) => ({
        ...prev,
        [slot.requirementKey]:
          e instanceof Error ? e.message : "Upload failed.",
      }));
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-8">
        <Stepper current={4} total={4} label="Documents" />
        <button
          type="button"
          onClick={() => router.push(`/apply/${applicationId}`)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back
        </button>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Upload your documents
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        These help us get started on {skuName}. We&apos;ll review each one and flag
        anything that needs a re-upload.
      </p>

      {total > 0 && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          {uploadedCount} of {total} uploaded
        </p>
      )}

      <div className="mt-4 space-y-3">
        {slots.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
            No documents are required upfront for this service. Continue and our
            team will request anything we need.
          </p>
        ) : (
          slots.map((slot) => (
            <DocumentUploadCard
              key={slot.requirementKey}
              applicationId={applicationId}
              slot={slot}
              uploading={busyKey === slot.requirementKey}
              error={errors[slot.requirementKey] ?? null}
              onUpload={(file) => upload(slot, file)}
            />
          ))
        )}
      </div>

      <button
        type="button"
        onClick={() => router.push(`/apply/${applicationId}/review`)}
        disabled={!allUploaded}
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Continue to review
        <ArrowRightIcon className="h-4 w-4" />
      </button>

      {!allUploaded && (
        <button
          type="button"
          onClick={() => router.push(`/apply/${applicationId}/review`)}
          className="mt-3 block w-full text-center text-xs font-medium text-[var(--text-muted)] hover:text-foreground"
        >
          I&apos;ll add the rest later
        </button>
      )}
    </div>
  );
}
