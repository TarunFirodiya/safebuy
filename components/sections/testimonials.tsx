"use client";

import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import { testimonials } from "@/lib/testimonials";
import { staggerContainer, staggerItem, fadeInUp, transitions, VIEWPORT } from "@/lib/motion";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} className="w-3.5 h-3.5 text-[#f5a623]" />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="section-wrapper bg-[var(--surface)]">
      <div className="container-lg px-6 md:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          transition={transitions.fadeInUp}
        >
          <span className="eyebrow">Testimonials</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Bangalore buyers, real transfers
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-md mx-auto">
            Actual buyers who transferred through Jumbo SafeBuy.
          </p>

          {/* Aggregate rating */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-white text-sm text-[var(--text-secondary)]">
            <Stars count={5} />
            <span className="font-semibold text-foreground">4.9</span>
            <span>Google Reviews</span>
          </div>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              transition={{ ...transitions.staggerItem, delay: i * 0.04 }}
              className="flex flex-col rounded-xl border border-[var(--border)] bg-white p-6"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <Stars count={t.rating} />
              <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                "{t.text}"
              </p>
              <div className="mt-5 flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {t.propertyType} · {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
