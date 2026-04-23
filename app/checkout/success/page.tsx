import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircleIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Payment successful — Jumbo SafeBuy",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="container-lg px-6 md:px-8 py-20 min-h-[60vh]">
          <div className="max-w-lg mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 mb-6">
              <CheckCircleIcon className="w-9 h-9 text-emerald-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Payment received — thank you!
            </h1>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
              Your order has been received and a SafeBuy coordinator will reach
              out within one working day to kick things off.
            </p>

            {order && (
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                Reference:{" "}
                <span
                  className="font-mono text-foreground"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {order}
                </span>
              </p>
            )}

            <div className="mt-8 grid sm:grid-cols-2 gap-3 text-left">
              <div className="p-4 rounded-lg border border-[var(--border)] bg-white">
                <EnvelopeIcon className="w-5 h-5 text-[var(--primary)] mb-2" />
                <p className="text-sm font-semibold text-foreground">
                  Confirmation email
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  A receipt and next-step checklist are on their way to your
                  inbox.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-[var(--border)] bg-white">
                <PhoneIcon className="w-5 h-5 text-[var(--primary)] mb-2" />
                <p className="text-sm font-semibold text-foreground">
                  WhatsApp update
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  We'll message your coordinator's name and direct number
                  shortly.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/services"
                className="inline-flex items-center justify-center h-11 px-5 rounded-md border border-[var(--border)] text-sm font-medium text-foreground hover:bg-[var(--surface)] transition-colors"
              >
                Browse more services
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center h-11 px-5 rounded-md bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors"
              >
                Back to home
              </Link>
            </div>

            <p className="mt-10 text-xs text-[var(--text-muted)]">
              Questions? Email{" "}
              <a
                href="mailto:hello@jumbohomes.in"
                className="text-[var(--primary)] hover:underline"
              >
                hello@jumbohomes.in
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
