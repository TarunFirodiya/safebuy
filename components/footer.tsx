import Link from "next/link";
import Image from "next/image";

const product = [
  { label: "Features",         href: "/#features" },
  { label: "How it works",     href: "/#how-it-works" },
  { label: "Services catalog", href: "/services" },
  { label: "Pricing",          href: "/#pricing" },
];

const company = [
  { label: "About",   href: "https://www.jumbosafebuy.in",         external: true },
  { label: "Blog",    href: "https://www.jumbosafebuy.in/blog",     external: true },
  { label: "Careers", href: "https://www.jumbosafebuy.in/careers",  external: true },
];

const resources = [
  { label: "Contact",           href: "/contact",          external: false },
  { label: "Terms",             href: "/terms",            external: false },
  { label: "Privacy Policy",    href: "/privacy-policy",   external: false },
  { label: "Refund Policy",     href: "/refund-policy",    external: false },
  { label: "Service Delivery",  href: "/shipping-policy",  external: false },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/jumbosafebuy.in/" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/jumbosafebuy" },
  { label: "Twitter",   href: "https://twitter.com/jumbosafebuy" },
  { label: "Facebook",  href: "https://www.facebook.com/jumbosafebuy/" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-auto">
      <div className="container-lg px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/jumbo-safebuy-logo.png"
                alt="Jumbo SafeBuy"
                width={28}
                height={28}
                className="h-7 w-auto"
              />
              <span className="font-semibold text-base text-foreground tracking-tight">
                Jumbo SafeBuy
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              The safest way to buy a resale home in Bangalore. Fixed prices, escrow-protected payments, 21-day transfer.
            </p>
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Jumbo SafeBuy on ${s.label}`}
                  className="text-xs font-medium text-[var(--text-muted)] hover:text-foreground transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {product.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {company.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} Jumbo SafeBuy. Made in India. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
