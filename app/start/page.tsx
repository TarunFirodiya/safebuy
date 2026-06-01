import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { StartQuiz } from "./start-client";

export const metadata: Metadata = {
  title: "Start your application — SafeBuy",
  description:
    "Answer a few quick questions and we'll recommend the right property service or bundle — with fixed pricing and a clear timeline.",
  alternates: { canonical: "/start" },
  robots: { index: true, follow: true },
};

export default function StartPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="container-lg px-6 md:px-8 py-12 md:py-16 min-h-[70vh]">
          <StartQuiz />
        </div>
      </main>
      <Footer />
    </>
  );
}
