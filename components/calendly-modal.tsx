"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CALENDLY_BOOKING_URL } from "@/lib/booking";

interface CalendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CalendlyModal({ open, onOpenChange }: CalendlyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-[960px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[960px]"
        showCloseButton
      >
        <DialogHeader className="shrink-0 border-b border-border px-4 py-3 text-left">
          <DialogTitle className="text-base font-semibold">
            Book a call with us
          </DialogTitle>
        </DialogHeader>
        <div className="relative min-h-[min(560px,70vh)] w-full flex-1 bg-muted/30">
          <iframe
            title="Schedule a call — Jumbo SafeBuy"
            src={CALENDLY_BOOKING_URL}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
