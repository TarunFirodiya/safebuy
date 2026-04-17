import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Service as SchemaService, WithContext } from "schema-dts";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  RectangleGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  bundles,
  getBundleBySlug,
  getBundleServices,
  categoryLabels,
} from "@/lib/services";
import { formatINR } from "@/lib/utils";

export function generateStaticParams() {
  return bundles.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);
  if (!bundle) return {};

  return {
    title: `${bundle.name} Bundle`,
    description: `${bundle.shortDescription} Fixed price ${formatINR(bundle.price)}. Includes ${bundle.serviceSlugOrder.length} services.`,
    openGraph: {
      title: `${bundle.name} Bundle | Jumbo SafeBuy`,
      description: bundle.shortDescription,
      images: [{ url: `/og-bundles-${slug}.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);
  if (!bundle) notFound();

  const bundleServices = getBundleServices(bundle);
  const individualTotal = bundleServices.reduce((sum, s) => sum + s.price, 0);
  const maxDelivery = bundleServices
    .map((s) => s.deliveryTime)
    .sort()
    .at(-1);

  const bundleJsonLd: WithContext<SchemaService> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${bundle.name} Bundle`,
    description: bundle.longDescription,
    provider: {
      "@type": "Organization",
      name: "Jumbo SafeBuy",
      url: "https://jumbosafebuy.in",
    },
    areaServed: { "@type": "City", name: "Bangalore" },
    serviceType: "Property Transfer Bundle",
    offers: {
      "@type": "Offer",
      price: String(bundle.price),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bundleJsonLd) }}
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
              href="/#pricing"
              className="hover:text-foreground transition-colors"
            >
              Bundles
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{bundle.name}</span>
          </div>
        </div>

        <div className="container-lg px-6 md:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Back link */}
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors mb-8 group"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                All bundles
              </Link>

              {/* Badge + title */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 rounded-full">
                  <RectangleGroupIcon className="w-3.5 h-3.5" />
                  Bundle · {bundleServices.length} services
                </span>
                {bundle.badge && (
                  <span className="text-xs font-semibold text-[var(--primary)] bg-[var(--accent)] px-2.5 py-1 rounded-full">
                    {bundle.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {bundle.name}
              </h1>

              <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
                {bundle.longDescription}
              </p>

              {/* Savings callout */}
              {bundle.savingsAmount > 0 && (
                <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-sm text-emerald-700">
                    <span className="font-semibold">
                      Save {formatINR(bundle.savingsAmount)}
                    </span>{" "}
                    vs. booking each service individually (
                    {formatINR(individualTotal)} total)
                  </p>
                </div>
              )}

              {/* What's included */}
              <div className="mt-10">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  What's included
                </h2>
                <ul className="space-y-2 mb-6">
                  {bundle.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-[var(--text-secondary)]">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Individual services breakdown */}
              <div className="mt-10">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  Services in this bundle
                </h2>
                <div className="space-y-3">
                  {bundleServices.map((service, i) => (
                    <div
                      key={service.slug}
                      className="flex items-start gap-4 p-4 rounded-lg border border-[var(--border)] bg-white hover:border-[var(--border-strong)] transition-colors"
                    >
                      <span
                        className="w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--primary)] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-foreground">
                            {service.name}
                          </p>
                          <p
                            className="text-sm text-[var(--text-muted)] tabular-nums shrink-0 line-through"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {formatINR(service.price)}
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                          {service.shortDescription}
                        </p>
                        <div className="mt-1.5 flex items-center gap-3">
                          <span className="text-xs text-[var(--text-muted)]">
                            {categoryLabels[service.category]}
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">
                            · {service.deliveryTime}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-xs font-medium text-[var(--primary)] hover:underline shrink-0 mt-0.5"
                      >
                        Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div
                  className="rounded-xl border border-[var(--border)] bg-white p-6"
                  style={{ boxShadow: "var(--shadow-md)" }}
                >
                  {bundle.badge && (
                    <span className="inline-block text-xs font-semibold text-[var(--primary)] bg-[var(--accent)] px-2.5 py-1 rounded-full mb-3">
                      {bundle.badge}
                    </span>
                  )}

                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">
                    Bundle price
                  </p>
                  <p
                    className="text-4xl font-bold text-foreground tabular-nums"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {formatINR(bundle.price)}
                  </p>

                  {bundle.savingsAmount > 0 && (
                    <p className="mt-1 text-sm text-emerald-600 font-medium">
                      Save {formatINR(bundle.savingsAmount)} vs. individual
                    </p>
                  )}

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {bundleServices.length} services · No hidden fees
                  </p>

                  {maxDelivery && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                      Delivery in {maxDelivery}
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    <a
                      href={bundle.razorpayLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-md bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors"
                    >
                      Book this bundle
                      <ArrowRightIcon className="w-4 h-4" />
                    </a>
                    <a
                      href="https://cal.com/tarunfirodiya/jumbosafebuy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full h-10 rounded-md border border-[var(--border)] text-sm font-medium text-foreground hover:bg-[var(--surface)] transition-colors"
                    >
                      Talk to a SafeBuy advisor
                    </a>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[var(--border)] space-y-2">
                    <div className="flex items-start gap-2.5">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-[var(--text-secondary)]">
                        Fixed bundle price — guaranteed
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
                        All {bundleServices.length} services coordinated for you
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
                  Need just one service?{" "}
                  <Link
                    href="/services"
                    className="text-[var(--primary)] hover:underline font-medium"
                  >
                    Browse individual services
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
