"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadModal({ open, onOpenChange }: LeadModalProps) {
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleOpenChange(o: boolean) {
    onOpenChange(o);
    if (!o) {
      if (timerRef.current) clearTimeout(timerRef.current);
      // reset after close animation
      setTimeout(() => setSuccess(false), 300);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setSuccess(true);
    timerRef.current = setTimeout(() => {
      handleOpenChange(false);
    }, 3000);
    // form still submits natively to getform.io via target="_blank"
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold tracking-tight">
                Talk to a SafeBuy advisor
              </DialogTitle>
              <DialogDescription className="text-sm text-[var(--text-secondary)] mt-1">
                Share your details and we'll call you within 2 business hours.
              </DialogDescription>
            </DialogHeader>

            <form
              action="https://getform.io/f/avrylgoa"
              method="POST"
              target="_blank"
              className="space-y-4 mt-2"
              onSubmit={handleSubmit}
            >
              <div className="space-y-1">
                <label
                  htmlFor="lead-name"
                  className="block text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="form-field"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="lead-phone"
                  className="block text-sm font-medium text-foreground"
                >
                  Phone
                </label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="form-field"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="lead-email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="form-field"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-1 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold h-10 px-4 transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ "--accent-hover": "#4f46e5" } as React.CSSProperties}
              >
                Request a callback
              </button>

              <p className="text-xs text-center text-[var(--text-muted)]">
                No spam. We call once, on time.
              </p>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--success-subtle)] flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-[var(--success)]" />
            </div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              We'll call you within 2 hours.
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              — Your SafeBuy advisor
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
