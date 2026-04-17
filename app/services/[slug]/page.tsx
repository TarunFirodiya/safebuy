import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Service as SchemaService, WithContext } from "schema-dts";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  XCircleIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  services,
  getServiceBySlug,
  categoryLabels,
  bundles,
  getBundleServices,
} from "@/lib/services";
import { formatINR } from "@/lib/utils";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.name,
    description: `${service.shortDescription} Fixed price ₹${formatINR(service.price)}. Result: ${service.result}`,
    openGraph: {
      title: `${service.name} | Jumbo SafeBuy`,
      description: service.shortDescription,
      images: [{ url: `/og-services-${slug}.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const relatedBundles = bundles.filter((b) =>
    b.serviceSlugOrder.includes(service.slug)
  );

  const relatedServices = services.filter(
    (s) => service.oftenBundledWith.includes(s.slug) && s.slug !== service.slug
  );

  const serviceJsonLd: WithContext<SchemaService> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.longDescription,
    provider: {
      "@type": "Organization",
      name: "Jumbo SafeBuy",
      url: "https://jumbosafebuy.in",
    },
    areaServed: { "@type": "City", name: "Bangalore" },
    serviceType: categoryLabels[service.category],
    offers: {
      "@type": "Offer",
      price: String(service.price),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Nav />
      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="border-b border-[var(--border)]">
          <div className="container-lg px-6 md:px-8 py-3 flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/services"
              className="hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{service.name}</span>
          </div>
        </div>

        <div className="container-lg px-6 md:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Back link */}
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors mb-8 group"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                All services
              </Link>

              {/* Category + delivery */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] bg-[var(--accent)] px-2.5 py-1 rounded-full">
                  {categoryLabels[service.category]}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <ClockIcon className="w-3.5 h-3.5" />
                  {service.deliveryTime}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {service.name}
              </h1>

              <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
                {service.longDescription}
              </p>

              {/* Result */}
              <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <DocumentTextIcon className="w-5 h-5 text-[var(--primary)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-0.5">
                    Result
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {service.result}
                  </p>
                </div>
              </div>

              {/* When to use */}
              <div className="mt-10">
                <h2 className="text-base font-semibold text-foreground mb-3">
                  When to use this service
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {service.whenToUse}
                </p>
              </div>

              {/* Steps */}
              <div className="mt-10">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  How it works
                </h2>
                <ol className="space-y-3">
                  {service.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span
                        className="w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--primary)] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm text-[var(--text-secondary)] leading-relaxed pt-0.5">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* What you provide */}
              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-base font-semibold text-foreground mb-4">
                    What you provide
                  </h2>
                  <ul className="space-y-2">
                    {service.youProvide.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-[var(--text-secondary)]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-base font-semibold text-foreground mb-4">
                    Not included
                  </h2>
                  <ul className="space-y-2">
                    {service.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <XCircleIcon className="w-4 h-4 text-[var(--text-muted)] mt-0.5 shrink-0" />
                        <span className="text-sm text-[var(--text-secondary)]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Related services */}
              {relatedServices.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[var(--border)]">
                  <h2 className="text-base font-semibold text-foreground mb-4">
                    Often booked together
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {relatedServices.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)] transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {s.name}
                          </p>
                          <p
                            className="text-sm text-[var(--primary)] font-medium mt-0.5 tabular-nums"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {formatINR(s.price)}
                          </p>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Bundles that include this service */}
              {relatedBundles.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-2 mb-4">
                    <RectangleGroupIcon className="w-4 h-4 text-[var(--text-muted)]" />
                    <h2 className="text-base font-semibold text-foreground">
                      This service is included in
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {relatedBundles.map((bundle) => {
                      const bundleServices = getBundleServices(bundle);
                      return (
                        <div
                          key={bundle.slug}
                          className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-foreground">
                              {bundle.name} Bundle
                            </p>
                            <p
                              className="text-sm font-bold text-foreground tabular-nums"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {formatINR(bundle.price)}
                            </p>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] mb-3">
                            {bundle.shortDescription}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {bundleServices.length} services ·{" "}
                            {bundle.savingsAmount > 0 &&
                              `Save ${formatINR(bundle.savingsAmount)}`}
                          </p>
                          <Link
                            href={`/#pricing`}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
                          >
                            View bundle details <ArrowRightIcon className="w-3 h-3" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div
                  className="rounded-xl border border-[var(--border)] bg-white p-6"
                  style={{ boxShadow: "var(--shadow-md)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">
                    Fixed price
                  </p>
                  <p
                    className="text-4xl font-bold text-foreground tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {formatINR(service.price)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    No hidden fees. No surprises.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                    Delivery in {service.deliveryTime}
                  </div>

                  <div className="mt-6 space-y-3">
                    <a
                      href="https://cal.com/tarunfirodiya/jumbosafebuy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-md bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors"
                    >
                      Book a free 15-min call
                    </a>
                    <p className="text-center text-xs text-[var(--text-muted)]">
                      or talk to a SafeBuy advisor — we'll tell you exactly what you need
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[var(--border)] space-y-2">
                    <div className="flex items-start gap-2.5">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-[var(--text-secondary)]">
                        Fixed price guaranteed — no hourly billing
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-[var(--text-secondary)]">
                        ICICI Bank escrow-protected payments
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-[var(--text-secondary)]">
                        Result delivered in {service.deliveryTime}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
                  Want more coverage?{" "}
                  <Link
                    href="/#pricing"
                    className="text-[var(--primary)] hover:underline font-medium"
                  >
                    See bundles — 15–25% cheaper
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
