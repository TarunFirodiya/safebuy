"use client";

import { useRef } from "react";
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  DocumentIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export interface DocumentSlot {
  requirementKey: string;
  label: string;
  docId: string;
  uploaded: boolean;
  filename: string | null;
  reviewStatus: "pending" | "accepted" | "rejected";
  reviewerNote: string | null;
}

interface DocumentUploadCardProps {
  applicationId: string;
  slot: DocumentSlot;
  uploading: boolean;
  error: string | null;
  onUpload: (file: File) => void;
}

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,image/*";

/**
 * One checklist row per required document. Shows upload affordance, uploaded
 * state with a view link, review status, and re-upload. (DESIGN.md → upload.)
 */
export function DocumentUploadCard({
  applicationId,
  slot,
  uploading,
  error,
  onUpload,
}: DocumentUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const rejected = slot.reviewStatus === "rejected";
  const accepted = slot.reviewStatus === "accepted";

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border bg-white p-4",
        rejected
          ? "border-[var(--error)]"
          : slot.uploaded
            ? "border-[var(--primary)]"
            : "border-[var(--border)]",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            slot.uploaded
              ? "bg-[var(--accent)] text-[var(--primary)]"
              : "bg-[var(--surface)] text-[var(--text-muted)]",
          )}
        >
          {slot.uploaded ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <DocumentIcon className="h-5 w-5" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {slot.label}
          </p>
          {slot.uploaded ? (
            <p className="truncate text-xs text-[var(--text-muted)]">
              {slot.filename}
              {accepted && " · Accepted"}
              {slot.reviewStatus === "pending" && " · Under review"}
            </p>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">PDF or photo, up to 10 MB</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {slot.uploaded && (
            <a
              href={`/api/applications/${applicationId}/documents/${slot.docId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs font-medium text-[var(--primary)] hover:underline sm:inline"
            >
              View
            </a>
          )}
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70",
              slot.uploaded
                ? "border border-[var(--border)] text-foreground hover:bg-[var(--surface)]"
                : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]",
            )}
          >
            {uploading ? (
              <>
                <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                Uploading…
              </>
            ) : slot.uploaded ? (
              <>
                <ArrowPathIcon className="h-3.5 w-3.5" />
                Replace
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="h-3.5 w-3.5" />
                Upload
              </>
            )}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      {(rejected || error) && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-[var(--error)]">
          <ExclamationTriangleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error ?? slot.reviewerNote ?? "This document needs to be re-uploaded."}
        </p>
      )}
    </div>
  );
}
