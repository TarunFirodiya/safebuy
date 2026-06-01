// GET /api/applications/[id]/documents/[docId]
//
// Streams a previously uploaded document back from the private R2 bucket. The
// application id in the path is the capability — the document must belong to it.
// Served inline so the customer (and ops) can review what was uploaded.

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getApplicationDocuments, getDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/applications/[id]/documents/[docId]">,
): Promise<Response> {
  const { id, docId } = await ctx.params;

  const { env } = await getCloudflareContext({ async: true });
  if (!env.DOCUMENTS) {
    return NextResponse.json({ error: "Unavailable." }, { status: 503 });
  }

  const db = await getDb();
  const docs = await getApplicationDocuments(db, id);
  const doc = docs.find((d) => d.id === docId);
  if (!doc || !doc.storage_key) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const object = await env.DOCUMENTS.get(doc.storage_key);
  if (!object) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    object.httpMetadata?.contentType ?? doc.content_type ?? "application/octet-stream",
  );
  headers.set(
    "Content-Disposition",
    `inline; filename="${doc.filename ?? "document"}"`,
  );
  headers.set("Cache-Control", "private, no-store");

  return new Response(object.body, { headers });
}
