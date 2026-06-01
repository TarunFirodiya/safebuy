import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  StatusTimeline,
  type TimelineStep,
  type TimelineState,
} from "@/components/onboarding/status-timeline";
import { BookCalendlyButton } from "@/components/book-calendly-button";
import {
  getApplicationByToken,
  getApplicationDocuments,
  getApplicationEvents,
  getDb,
  type ApplicationDocumentRow,
  type ApplicationStatus,
} from "@/lib/db";
import { resolveApplicationSku } from "@/lib/applications";
import { buildCalendlyUrl } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Track your application — SafeBuy",
  robots: { index: false, follow: false },
};

// Ordered milestones shown on the tracker. Each application status maps to one
// of these stages via STAGE_BY_STATUS.
const MILESTONES = [
  { key: "started", label: "Application started" },
  { key: "documents", label: "Documents" },
  { key: "payment", label: "Payment" },
  { key: "processing", label: "In progress" },
  { key: "delivered", label: "Delivered" },
] as const;

const STAGE_BY_STATUS: Record<ApplicationStatus, number> = {
  draft: 0,
  documents_pending: 1,
  documents_review: 1,
  action_required: 1,
  payment_pending: 2,
  awaiting_consult: 2,
  paid: 3,
  in_progress: 3,
  delivered: 4,
  cancelled: 0,
};

function buildSteps(
  status: ApplicationStatus,
  buyable: boolean,
  deliveryTime: string,
  hasRejectedDoc: boolean,
): TimelineStep[] {
  const stage = STAGE_BY_STATUS[status];
  const allDone = status === "delivered";

  return MILESTONES.map((m, i) => {
    let state: TimelineState;
    if (allDone) {
      state = "done";
    } else if (i < stage) {
      state = "done";
    } else if (i === stage) {
      state = "current";
    } else {
      state = "upcoming";
    }

    // Surface a document re-upload request right on the documents milestone.
    if (
      m.key === "documents" &&
      (status === "action_required" || hasRejectedDoc)
    ) {
      state = "alert";
    }

    let label: string = m.label;
    let description: string | undefined;
    if (m.key === "payment") {
      label = buyable ? "Payment" : "Advisor confirms scope";
    }
    if (m.key === "processing") {
      description = state === "current" ? `ETA ${deliveryTime}` : undefined;
    }

    return { key: m.key, label, description, state };
  });
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function docStateLabel(doc: ApplicationDocumentRow): {
  text: string;
  tone: "muted" | "ok" | "alert" | "pending";
} {
  if (doc.upload_status !== "uploaded") return { text: "Not uploaded", tone: "muted" };
  if (doc.review_status === "accepted") return { text: "Accepted", tone: "ok" };
  if (doc.review_status === "rejected")
    return { text: doc.reviewer_note ? `Re-upload: ${doc.reviewer_note}` : "Re-upload needed", tone: "alert" };
  return { text: "Under review", tone: "pending" };
}

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { token } = await params;
  const { paid } = await searchParams;

  const db = await getDb();
  const application = await getApplicationByToken(db, token);
  if (!application) notFound();

  const sku = resolveApplicationSku(
    application.sku_type,
    application.sku_slug,
  );
  const deliveryTime = sku?.deliveryTime ?? "a few days";

  const [docs, events] = await Promise.all([
    getApplicationDocuments(db, application.id),
    getApplicationEvents(db, application.id),
  ]);

  const hasRejectedDoc = docs.some((d) => d.review_status === "rejected");
  const steps = buildSteps(
    application.status,
    sku?.buyable ?? true,
    deliveryTime,
    hasRejectedDoc,
  );

  const actionRequired =
    application.status === "action_required" || hasRejectedDoc;

  const calendlyUrl = buildCalendlyUrl({
    applicationId: application.id,
    skuName: application.sku_name,
  });

  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="container-lg px-6 md:px-8 py-12 md:py-16 min-h-[70vh]">
          <div className="mx-auto w-full max-w-xl">
            {paid === "1" && (
              <div className="mb-6 flex items-start gap-3 rounded-[var(--radius-lg)] border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Payment received — thank you!
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-800">
                    A coordinator will reach out within one working day. Everything
                    you need is tracked right here.
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Application status
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {application.sku_name}
            </h1>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
              <ClockIcon className="h-4 w-4" />
              Estimated timeline: {deliveryTime}
            </p>

            {actionRequired && (
              <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--error)] bg-[var(--error-subtle)] p-4">
                <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--error)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--error)]">
                    Action required
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                    One or more documents need a re-upload. Open your documents to
                    fix this.
                  </p>
                  <Link
                    href={`/apply/${application.id}/documents`}
                    className="mt-2 inline-block text-xs font-semibold text-[var(--primary)] hover:underline"
                  >
                    Update documents →
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6">
              <StatusTimeline steps={steps} />
            </div>

            {docs.length > 0 && (
              <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6">
                <h2 className="text-sm font-semibold text-foreground">
                  Documents
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {docs.map((doc) => {
                    const s = docStateLabel(doc);
                    return (
                      <li
                        key={doc.id}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="inline-flex min-w-0 items-center gap-2 text-[var(--text-secondary)]">
                          <DocumentTextIcon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                          <span className="truncate">{doc.requirement_label}</span>
                        </span>
                        <span
                          className={
                            s.tone === "ok"
                              ? "shrink-0 text-xs font-medium text-emerald-600"
                              : s.tone === "alert"
                                ? "shrink-0 text-xs font-medium text-[var(--error)]"
                                : s.tone === "pending"
                                  ? "shrink-0 text-xs font-medium text-[var(--text-secondary)]"
                                  : "shrink-0 text-xs font-medium text-[var(--text-muted)]"
                          }
                        >
                          {s.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {events.length > 0 && (
              <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6">
                <h2 className="text-sm font-semibold text-foreground">Activity</h2>
                <ul className="mt-3 space-y-3">
                  {[...events].reverse().map((e) => (
                    <li key={e.id} className="flex gap-3 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--border-strong)]" />
                      <div>
                        <p className="text-[var(--text-secondary)]">{e.message}</p>
                        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                          {formatDate(e.created_at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-sm font-semibold text-foreground">
                Need help?
              </h2>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Your SafeBuy coordinator is one message away. Book a call or email
                us anytime.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <BookCalendlyButton
                  url={calendlyUrl}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-xs font-semibold text-white transition-colors hover:bg-[var(--primary-dark)]"
                >
                  Talk to your coordinator
                </BookCalendlyButton>
                <a
                  href="mailto:hello@jumbohomes.in"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-[var(--border)] px-4 text-xs font-medium text-foreground transition-colors hover:bg-white"
                >
                  Email us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
