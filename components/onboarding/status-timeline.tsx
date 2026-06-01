import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

export type TimelineState = "done" | "current" | "upcoming" | "alert";

export interface TimelineStep {
  key: string;
  label: string;
  description?: string;
  state: TimelineState;
}

/**
 * Vertical status timeline (Atlys "Submitted → Under review → Approved"). Pure
 * presentational component — callers map application status to step states.
 */
export function StatusTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px",
                  step.state === "done"
                    ? "bg-[var(--primary)]"
                    : "bg-[var(--border)]",
                )}
              />
            )}

            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                step.state === "done" &&
                  "border-[var(--primary)] bg-[var(--primary)] text-white",
                step.state === "current" &&
                  "border-[var(--primary)] bg-white text-[var(--primary)]",
                step.state === "upcoming" &&
                  "border-[var(--border)] bg-white text-[var(--text-muted)]",
                step.state === "alert" &&
                  "border-[var(--error)] bg-[var(--error)] text-white",
              )}
            >
              {step.state === "done" ? (
                <CheckIcon className="h-4 w-4" />
              ) : step.state === "alert" ? (
                <ExclamationTriangleIcon className="h-4 w-4" />
              ) : (
                i + 1
              )}
            </span>

            <div className="pt-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  step.state === "upcoming"
                    ? "text-[var(--text-muted)]"
                    : "text-foreground",
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
