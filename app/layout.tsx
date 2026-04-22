import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import type { LegalService, Organization, WithContext } from "schema-dts";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const display = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Jumbo SafeBuy",
    default: "Jumbo SafeBuy — Buy your resale home without losing sleep",
  },
  description:
    "Fixed-price legal diligence, escrow-protected payments, and title transfer for resale homes in Bangalore. 21 days, start to keys.",
  metadataBase: new URL("https://jumbosafebuy.in"),
  openGraph: {
    siteName: "Jumbo SafeBuy",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const orgJsonLd: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Jumbo SafeBuy",
  url: "https://jumbosafebuy.in",
  logo: "https://jumbosafebuy.in/jumbo-safebuy-logo.png",
  areaServed: { "@type": "City", name: "Bangalore" },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Kannada", "Hindi"],
  },
  sameAs: [
    "https://www.instagram.com/jumbosafebuy.in/",
    "https://www.linkedin.com/company/jumbosafebuy",
    "https://twitter.com/jumbosafebuy",
  ],
};

// LegalService is a subtype of LocalBusiness — surfaces the brand in local
// search / map results. TODO(seo): fill in streetAddress, postalCode, telephone
// and geo coordinates once a registered business address is finalised.
const localBusinessJsonLd: WithContext<LegalService> = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Jumbo SafeBuy",
  url: "https://jumbosafebuy.in",
  image: "https://jumbosafebuy.in/jumbo-safebuy-logo.png",
  priceRange: "₹₹",
  areaServed: [
    { "@type": "City", name: "Bangalore" },
    { "@type": "State", name: "Karnataka" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressRegion: "KA",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Property title verification",
    "Property registration",
    "Khata transfer",
    "TDS filing",
    "Encumbrance certificate",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
