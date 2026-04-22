"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CalendlyModal } from "@/components/calendly-modal";
import { fadeInUp, transitions, VIEWPORT } from "@/lib/motion";

export function CtaStrip() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <>
      <CalendlyModal open={calendlyOpen} onOpenChange={setCalendlyOpen} />

      <section className="section-wrapper bg-[var(--foreground)]">
        <div className="container-lg px-6 md:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            transition={transitions.fadeInUp}
          >
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to transfer safely?
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-md mx-auto text-balance">
              Start with a free call. We'll tell you exactly which services you
              need.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCalendlyOpen(true)}
                className="inline-flex items-center justify-center h-12 px-7 rounded-md bg-white text-[var(--foreground)] text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Talk to an expert
              </button>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-md border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Browse all services
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
