import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getApplicationById, getDb } from "@/lib/db";
import { resolveApplicationSku } from "@/lib/applications";
import { ApplyWizard, type ApplyWizardProperty } from "./apply-client";

export const metadata: Metadata = {
  title: "Your application — SafeBuy",
  robots: { index: false, follow: false },
};

const emptyProperty: ApplyWizardProperty = {
  propertyType: "",
  address: "",
  ward: "",
  buyerName: "",
  sellerName: "",
  notes: "",
};

function parseProperty(json: string | null): ApplyWizardProperty {
  if (!json) return emptyProperty;
  try {
    const parsed = JSON.parse(json) as Partial<ApplyWizardProperty>;
    return { ...emptyProperty, ...parsed };
  } catch {
    return emptyProperty;
  }
}

export default async function ApplyPage({
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

  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="container-lg px-6 md:px-8 py-12 md:py-16 min-h-[70vh]">
          <ApplyWizard
            applicationId={application.id}
            sku={{
              type: sku.type,
              slug: sku.slug,
              name: sku.name,
              price: sku.price,
              priceNote: sku.priceNote,
              deliveryTime: sku.deliveryTime,
              shortDescription: sku.shortDescription,
              result: sku.result,
              buyable: sku.buyable,
            }}
            initialProperty={parseProperty(application.property_json)}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
