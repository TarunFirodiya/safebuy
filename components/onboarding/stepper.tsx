import { cn } from "@/lib/utils";

interface StepperProps {
  current: number; // 1-based index of the active step
  total: number;
  label?: string;
  className?: string;
}

/**
 * Compact progress indicator for the quiz and application wizard. Shows
 * "Step X of N" plus a segmented bar so users always know how far they are.
 */
export function Stepper({ current, total, label, className }: StepperProps) {
  const clamped = Math.min(Math.max(current, 1), total);
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Step {clamped} of {total}
        </span>
        {label && (
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            {label}
          </span>
        )}
      </div>
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < clamped ? "bg-[var(--primary)]" : "bg-[var(--border)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
