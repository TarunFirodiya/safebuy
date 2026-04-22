"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { ServiceFaq } from "@/lib/services";

export function FaqAccordion({ faqs }: { faqs: ServiceFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <Accordion className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="py-4 text-base font-medium">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {faq.a}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
