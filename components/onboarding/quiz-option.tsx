"use client";

import type { ComponentType, SVGProps } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface QuizOptionProps {
  label: string;
  helper?: string;
  selected: boolean;
  onSelect: () => void;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Large, tappable single-select option card used across the /start quiz.
 * Real <button> with aria-pressed for accessibility (see DESIGN.md).
 */
export function QuizOption({
  label,
  helper,
  selected,
  onSelect,
  Icon,
}: QuizOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "group flex w-full items-center gap-4 rounded-[var(--radius-lg)] border p-4 text-left transition-colors min-h-[64px]",
        selected
          ? "border-[var(--primary)] bg-[var(--accent)]"
          : "border-[var(--border)] bg-white hover:border-[var(--border-strong)] hover:bg-[var(--surface)]",
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
            selected
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--surface)] text-[var(--text-muted)] group-hover:text-[var(--primary)]",
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {label}
        </span>
        {helper && (
          <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
            {helper}
          </span>
        )}
      </span>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected
            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
            : "border-[var(--border-strong)] text-transparent",
        )}
      >
        <CheckIcon className="h-3 w-3" strokeWidth={3} />
      </span>
    </button>
  );
}
