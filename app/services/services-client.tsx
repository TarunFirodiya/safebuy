"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";
import {
  services,
  categoryLabels,
  categoryOrder,
  formatServicePrice,
  type ServiceCategory,
} from "@/lib/services";
import { staggerContainer, staggerItem, fadeInUp, transitions } from "@/lib/motion";

type CategoryFilter = ServiceCategory | "all";

const filters: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "All services" },
  ...categoryOrder.map((c) => ({ key: c, label: categoryLabels[c] })),
];

export function ServicesClient() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const groups = useMemo(() => {
    return categoryOrder
      .filter((cat) => activeCategory === "all" || activeCategory === cat)
      .map((cat) => ({
        category: cat,
        items: services.filter((s) => s.categories.includes(cat)),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeCategory]);

  return (
    <>
      <section className="section-wrapper pb-12">
        <div className="container-lg px-6 md:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={transitions.fadeInUp}
          >
            <span className="eyebrow">Services catalogue</span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground max-w-2xl">
              The full catalogue
            </h1>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl">
              Fixed-price legal services for property buyers and owners in
              Bangalore. Book individually — or start with a bundle that
              combines the services most buyers need.
            </p>

            <Link
              href="/#pricing"
              className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-md border border-[var(--border)] bg-[var(--accent)] text-sm font-medium text-[var(--primary)] hover:bg-white transition-colors"
            >
              <RectangleGroupIcon className="w-4 h-4" />
              Browse bundles — Shield / Seal / Assure / Plus
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-2">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`h-8 px-4 rounded-full text-xs font-semibold border transition-colors ${
                  activeCategory === key
                    ? "bg-foreground text-white border-foreground"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-lg px-6 md:px-8 space-y-12">
          {groups.map((group) => (
            <div key={group.category}>
              <div className="flex items-end justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  {categoryLabels[group.category]}
                </h2>
                <span className="text-xs text-[var(--text-muted)]">
                  {group.items.length} services
                </span>
              </div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {group.items.map((service) => (
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
                          {categoryLabels[service.categories[0]]}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {service.deliveryTime}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground tracking-tight">
                        {service.name}
                      </h3>
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
                        {formatServicePrice(service)}
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
          ))}
        </div>
      </section>
    </>
  );
}
