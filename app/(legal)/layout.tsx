import type { ReactNode } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="container-lg px-6 md:px-8 py-12 lg:py-16">
          <article className="legal-article max-w-3xl mx-auto">{children}</article>
        </div>
      </main>
      <Footer />
    </>
  );
}
