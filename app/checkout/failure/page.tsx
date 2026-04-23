import Link from "next/link";
import type { Metadata } from "next";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Payment failed — Jumbo SafeBuy",
  robots: { index: false, follow: false },
};

const REASON_COPY: Record<string, string> = {
  verification_failed:
    "We couldn't verify the payment signature. No charge has been made.",
  verification_error:
    "There was a problem verifying your payment. If you were charged, don't worry — the amount will be reversed within 5–7 working days, or we'll reconcile it when you get in touch.",
};

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const message =
    (reason && REASON_COPY[reason]) ||
    "Your payment could not be completed. No amount has been deducted from your account in most cases — if you see a charge, it will be auto-reversed.";

  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="container-lg px-6 md:px-8 py-20 min-h-[60vh]">
          <div className="max-w-lg mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-200 mb-6">
              <ExclamationTriangleIcon className="w-9 h-9 text-amber-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Payment didn't go through
            </h1>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
              {message}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center h-11 px-5 rounded-md border border-[var(--border)] text-sm font-medium text-foreground hover:bg-[var(--surface)] transition-colors"
              >
                Back to home
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center h-11 px-5 rounded-md bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors"
              >
                Try again
              </Link>
            </div>

            <p className="mt-10 text-xs text-[var(--text-muted)]">
              Need help? Email{" "}
              <a
                href="mailto:hello@jumbohomes.in"
                className="text-[var(--primary)] hover:underline"
              >
                hello@jumbohomes.in
              </a>{" "}
              or call <a href="tel:+919611112345" className="text-[var(--primary)] hover:underline">+91 96111 12345</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
