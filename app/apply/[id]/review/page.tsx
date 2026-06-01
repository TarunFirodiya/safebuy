import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  getApplicationById,
  getApplicationDocuments,
  getCustomerById,
  getDb,
} from "@/lib/db";
import { resolveApplicationSku } from "@/lib/applications";
import { buildCalendlyUrl } from "@/lib/booking";
import { ReviewClient } from "./review-client";

export const metadata: Metadata = {
  title: "Review your application — SafeBuy",
  robots: { index: false, follow: false },
};

export default async function ReviewPage({
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

  const [docs, customer] = await Promise.all([
    getApplicationDocuments(db, id),
    application.customer_id
      ? getCustomerById(db, application.customer_id)
      : Promise.resolve(null),
  ]);

  const documentsUploaded = docs.filter(
    (d) => d.upload_status === "uploaded",
  ).length;

  const contact = {
    name: customer?.name,
    email: customer?.email,
    phone: customer?.phone,
  };

  const calendlyUrl = buildCalendlyUrl({
    name: customer?.name,
    email: customer?.email,
    applicationId: application.id,
    skuName: sku.name,
  });

  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="container-lg px-6 md:px-8 py-12 md:py-16 min-h-[70vh]">
          <ReviewClient
            applicationId={application.id}
            accessToken={application.access_token}
            sku={{
              type: sku.type,
              slug: sku.slug,
              name: sku.name,
              price: sku.price,
              priceNote: sku.priceNote,
              deliveryTime: sku.deliveryTime,
              result: sku.result,
              buyable: sku.buyable,
            }}
            contact={contact}
            documentsUploaded={documentsUploaded}
            documentsTotal={sku.requirements.length}
            calendlyUrl={calendlyUrl}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
