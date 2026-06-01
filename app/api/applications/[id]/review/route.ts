// POST /api/applications/[id]/review
//
// Marks that the applicant has reached the review/checkout step. We advance
// the application status here (rather than on the GET page render) so the
// tracker reflects intent without side-effecting a page load:
//   - buyable SKUs  → `payment_pending` (Razorpay checkout follows)
//   - consult SKUs  → `awaiting_consult` (advisor confirms scope, then invoices)
//
// Idempotent: never downgrades an application that is already paid or further
// along, and re-posting is a no-op.

import { NextRequest, NextResponse } from "next/server";
import {
  addApplicationEvent,
  getApplicationById,
  getDb,
  setApplicationStatus,
  type ApplicationStatus,
} from "@/lib/db";
import { resolveApplicationSku } from "@/lib/applications";

// Statuses at or past payment — reaching review again must not rewind them.
const LOCKED: ApplicationStatus[] = [
  "payment_pending",
  "awaiting_consult",
  "paid",
  "in_progress",
  "delivered",
  "cancelled",
];

export async function POST(
  _req: NextRequest,
  ctx: RouteContext<"/api/applications/[id]/review">,
): Promise<NextResponse> {
  const { id } = await ctx.params;

  const db = await getDb();
  const application = await getApplicationById(db, id);
  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  if (LOCKED.includes(application.status)) {
    return NextResponse.json({ ok: true, status: application.status });
  }

  const sku = resolveApplicationSku(application.sku_type, application.sku_slug);
  if (!sku) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 404 });
  }

  const nextStatus: ApplicationStatus = sku.buyable
    ? "payment_pending"
    : "awaiting_consult";

  await setApplicationStatus(db, id, nextStatus);
  await addApplicationEvent(db, {
    applicationId: id,
    type: nextStatus === "payment_pending" ? "review_reached" : "consult_requested",
    message: sku.buyable
      ? "Documents submitted — ready for payment."
      : "Advisor review requested — we'll confirm scope and share next steps.",
  });

  return NextResponse.json({ ok: true, status: nextStatus });
}
