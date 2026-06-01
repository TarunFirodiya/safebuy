// GET /api/applications/track/[token]
//
// Token-scoped, read-only view of an application for the guest tracker. The
// access token is the capability — we return only what the applicant already
// submitted plus status/timeline. No customer PII is exposed here.

import { NextRequest, NextResponse } from "next/server";
import {
  getApplicationByToken,
  getApplicationDocuments,
  getApplicationEvents,
  getDb,
} from "@/lib/db";
import { resolveApplicationSku } from "@/lib/applications";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/applications/track/[token]">,
): Promise<NextResponse> {
  const { token } = await ctx.params;

  const db = await getDb();
  const application = await getApplicationByToken(db, token);
  if (!application) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const sku = resolveApplicationSku(
    application.sku_type,
    application.sku_slug,
  );
  const [docs, events] = await Promise.all([
    getApplicationDocuments(db, application.id),
    getApplicationEvents(db, application.id),
  ]);

  return NextResponse.json({
    id: application.id,
    status: application.status,
    sku: {
      name: application.sku_name,
      deliveryTime: sku?.deliveryTime ?? null,
    },
    documents: docs.map((d) => ({
      label: d.requirement_label,
      uploadStatus: d.upload_status,
      reviewStatus: d.review_status,
      reviewerNote: d.reviewer_note,
    })),
    events: events.map((e) => ({
      type: e.type,
      message: e.message,
      createdAt: e.created_at,
    })),
    createdAt: application.created_at,
    updatedAt: application.updated_at,
  });
}
