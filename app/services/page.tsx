"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { services, categoryLabels, type ServiceCategory } from "@/lib/services";
import { staggerContainer, staggerItem, fadeInUp, transitions, VIEWPORT } from "@/lib/motion";
import { formatINR } from "@/lib/utils";

const categories: ServiceCategory[] = [
  "pre-offer",
  "pre-close",
  "at-registration",
  "post-close",
  "inspection",
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");

  const filtered =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Header */}
        <section className="section-wrapper pb-12">
          <div className="container-lg px-6 md:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={transitions.fadeInUp}
            >
              <span className="eyebrow">Services catalog</span>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground max-w-2xl">
                The full catalog
              </h1>
              <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl">
                20+ fixed-price services. Book individually or start with a bundle
                that combines the services most buyers need.
              </p>

              {/* Bundle callout */}
              <Link
                href="/#pricing"
                className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-md border border-[var(--border)] bg-[var(--accent)] text-sm font-medium text-[var(--primary)] hover:bg-white transition-colors"
              >
                <RectangleGroupIcon className="w-4 h-4" />
                Browse bundles — 15–25% cheaper
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Category filters */}
            <div className="mt-8 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`h-8 px-4 rounded-full text-xs font-semibold border transition-colors ${
                  activeCategory === "all"
                    ? "bg-foreground text-white border-foreground"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                }`}
              >
                All services
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`h-8 px-4 rounded-full text-xs font-semibold border transition-colors ${
                    activeCategory === cat
                      ? "bg-foreground text-white border-foreground"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="pb-24">
          <div className="container-lg px-6 md:px-8">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((service) => (
                <motion.div
                  key={service.slug}
                  variants={staggerItem}
                  transition={transitions.staggerItem}
                  className="flex flex-col rounded-xl border border-[var(--border)] bg-white p-6"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                        {categoryLabels[service.category]}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {service.deliveryTime}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold text-foreground tracking-tight">
                      {service.name}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {service.shortDescription}
                    </p>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      Result: {service.result}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span
                      className="text-xl font-bold text-foreground tabular-nums"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {formatINR(service.price)}
                    </span>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md border border-[var(--border)] text-sm font-medium text-foreground hover:bg-[var(--surface)] transition-colors"
                    >
                      Learn more <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
