import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CreateApplication } from "./create-client";

export const metadata: Metadata = {
  title: "Starting your application — SafeBuy",
  robots: { index: false, follow: false },
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function NewApplicationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="container-lg px-6 md:px-8 py-12 md:py-16 min-h-[70vh]">
          <CreateApplication
            type={firstParam(sp.type)}
            slug={firstParam(sp.slug)}
            journey={{
              role: firstParam(sp.role) || undefined,
              stage: firstParam(sp.stage) || undefined,
              goal: firstParam(sp.goal) || undefined,
              urgency: firstParam(sp.urgency) || undefined,
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
