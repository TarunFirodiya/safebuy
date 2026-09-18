import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ServicesClient } from "./services-client";

export const metadata: Metadata = {
  title: "All Property Legal Services in Bangalore",
  description:
    "Fixed-price property legal services for Bangalore — EC, title verification, sale deed, TDS, khata transfer, BESCOM and more. Book individually or as a bundle.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "All Property Legal Services | Jumbo SafeBuy",
    description:
      "The full Jumbo SafeBuy catalogue — fixed-price legal services for resale property buyers and owners in Bangalore.",
    url: "/services",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <ServicesClient />
      </main>
      <Footer />
    </>
  );
}
