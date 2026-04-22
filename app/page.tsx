import { Nav } from "@/components/nav";
import { HeroSection } from "@/components/sections/hero";
import { PartnerLogos } from "@/components/sections/partner-logos";
import { Highlights } from "@/components/sections/highlights";
import { FeaturesSection } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ServicesBundles } from "@/components/sections/services-bundles";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { TransactionDashboard } from "@/components/sections/transaction-dashboard";
import { FaqSection } from "@/components/sections/faq";
import { CtaStrip } from "@/components/sections/cta-strip";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <PartnerLogos />
        <Highlights />
        <HowItWorks />
        <FeaturesSection />
        <TransactionDashboard />
        <ServicesBundles />
        <TestimonialsSection />
        <FaqSection />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
