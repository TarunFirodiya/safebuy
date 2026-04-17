"use client";

import { motion } from "framer-motion";
import { PhoneIcon } from "@heroicons/react/24/outline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/faq";
import { fadeInUp, transitions, VIEWPORT } from "@/lib/motion";

export function FaqSection() {
  return (
    <section className="section-wrapper">
      <div className="container-lg px-6 md:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">

          {/* Left */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            transition={transitions.fadeInUp}
          >
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Questions buyers ask us
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
              The same questions come up before every transfer. Here's exactly
              how we handle them.
            </p>
            <button
              onClick={() =>
                window.open(
                  "https://cal.com/tarunfirodiya/jumbosafebuy",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="mt-8 inline-flex items-center gap-2 h-10 px-5 rounded-md border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-foreground hover:border-[var(--border-strong)] hover:bg-white transition-colors"
            >
              <PhoneIcon className="w-4 h-4 text-[var(--text-muted)]" />
              Still unsure? Book a 15-min call
            </button>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            className="lg:col-span-3"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            transition={{ ...transitions.fadeInUp, delay: 0.1 }}
          >
            <Accordion multiple={false} className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={i}
                  className="border-[var(--border)]"
                >
                  <AccordionTrigger className="text-left text-sm font-medium text-foreground py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[var(--text-secondary)] leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
