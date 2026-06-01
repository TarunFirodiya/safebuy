"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { CalendlyModal } from "@/components/calendly-modal";
import { cn } from "@/lib/utils";

type BookCalendlyButtonProps = {
  children: ReactNode;
  className?: string;
  /** Optional prefilled Calendly URL (name/email/context). */
  url?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export function BookCalendlyButton({
  children,
  className,
  url,
  onClick,
  ...props
}: BookCalendlyButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CalendlyModal open={open} onOpenChange={setOpen} url={url} />
      <button
        type="button"
        {...props}
        className={cn(className)}
        onClick={(e) => {
          onClick?.(e);
          setOpen(true);
        }}
      >
        {children}
      </button>
    </>
  );
}
