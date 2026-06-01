import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  getApplicationById,
  getApplicationDocuments,
  getDb,
} from "@/lib/db";
import { resolveApplicationSku } from "@/lib/applications";
import { DocumentsClient } from "./documents-client";
import type { DocumentSlot } from "@/components/onboarding/document-upload-card";

export const metadata: Metadata = {
  title: "Upload documents — SafeBuy",
  robots: { index: false, follow: false },
};

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await getDb();
  const application = await getApplicationById(db, id);
  if (!application) notFound();

  const sku = resolveApplicationSku(application.sku_type, application.sku_slug);
  if (!sku) notFound();

  const docs = await getApplicationDocuments(db, id);

  // Drive the checklist from the catalogue requirements, hydrating each with
  // any existing upload/review state from D1.
  const slots: DocumentSlot[] = sku.requirements.map((req) => {
    const row = docs.find((d) => d.requirement_key === req.key);
    return {
      requirementKey: req.key,
      label: req.label,
      docId: row?.id ?? "",
      uploaded: row?.upload_status === "uploaded",
      filename: row?.filename ?? null,
      reviewStatus: (row?.review_status ?? "pending") as DocumentSlot["reviewStatus"],
      reviewerNote: row?.reviewer_note ?? null,
    };
  });

  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="container-lg px-6 md:px-8 py-12 md:py-16 min-h-[70vh]">
          <DocumentsClient
            applicationId={application.id}
            skuName={sku.name}
            initialSlots={slots}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
