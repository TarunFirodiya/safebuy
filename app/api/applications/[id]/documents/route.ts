// POST /api/applications/[id]/documents
//
// Multipart upload for a single checklist requirement. The file is stored in a
// private R2 bucket; only the storage key is persisted to D1. Re-uploading the
// same requirement overwrites the previous object and resets review to pending.
//
// The application id is the capability (unguessable UUID). Only requirement
// keys that were seeded for this application are accepted.

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  addApplicationEvent,
  getApplicationById,
  getApplicationDocuments,
  getDb,
  recordDocumentUpload,
  setApplicationStatus,
} from "@/lib/db";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const EXT_BY_TYPE: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

function sanitizeFilename(name: string): string {
  return (
    name
      .replace(/[^a-zA-Z0-9._-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 120) || "upload"
  );
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/applications/[id]/documents">,
): Promise<NextResponse> {
  const { id } = await ctx.params;

  const { env } = await getCloudflareContext({ async: true });
  if (!env.DOCUMENTS) {
    console.error("[documents] R2 binding DOCUMENTS not configured");
    return NextResponse.json(
      { error: "Uploads are temporarily unavailable. Please try again soon." },
      { status: 503 },
    );
  }

  const db = await getDb();
  const application = await getApplicationById(db, id);
  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected a multipart form upload." },
      { status: 400 },
    );
  }

  const requirementKey = form.get("requirementKey");
  const file = form.get("file");

  if (typeof requirementKey !== "string" || requirementKey.length === 0) {
    return NextResponse.json(
      { error: "Missing requirement key." },
      { status: 400 },
    );
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please choose a file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 10 MB." },
      { status: 400 },
    );
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a PDF or image." },
      { status: 400 },
    );
  }

  // Only allow uploads against requirements we seeded for this application.
  const docs = await getApplicationDocuments(db, id);
  const target = docs.find((d) => d.requirement_key === requirementKey);
  if (!target) {
    return NextResponse.json(
      { error: "Unknown document requirement." },
      { status: 400 },
    );
  }

  const ext = EXT_BY_TYPE[file.type] ?? "bin";
  const storageKey = `applications/${id}/${requirementKey}/${crypto.randomUUID()}.${ext}`;
  const filename = sanitizeFilename(file.name);

  try {
    await env.DOCUMENTS.put(storageKey, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
      customMetadata: {
        applicationId: id,
        requirementKey,
        originalName: filename,
      },
    });

    // Best-effort cleanup of a previously uploaded object for this requirement.
    if (target.storage_key && target.storage_key !== storageKey) {
      await env.DOCUMENTS.delete(target.storage_key).catch(() => {});
    }

    await recordDocumentUpload(db, {
      applicationId: id,
      requirementKey,
      storageKey,
      filename,
      contentType: file.type,
      sizeBytes: file.size,
    });

    await addApplicationEvent(db, {
      applicationId: id,
      type: "document",
      message: `Uploaded "${target.requirement_label}".`,
    });

    // Surface that documents are now under review once the first file lands.
    if (application.status === "documents_pending") {
      await setApplicationStatus(db, id, "documents_review");
    }
  } catch (e) {
    console.error("[documents] upload failed", e);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      document: {
        requirementKey,
        filename,
        uploadStatus: "uploaded",
        reviewStatus: "pending",
        sizeBytes: file.size,
        contentType: file.type,
      },
    },
    { status: 200 },
  );
}
