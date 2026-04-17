import { InfiniteSlider } from "@/components/ui/infinite-slider";

const partners = [
  {
    name: "ICICI Bank",
    logo: "https://pathfinderstraining.com/wp-content/uploads/2022/10/ICICI-BANK-LOGO.png",
    height: 24,
  },
  {
    name: "State Bank of India",
    logo: "https://icon2.cleanpng.com/lnd/20241224/fe/656de25930c6fdc0e12ba4162d0f25.webp",
    height: 28,
  },
  {
    name: "HDFC Bank",
    logo: "https://1000logos.net/wp-content/uploads/2021/06/HDFC-Bank-logo.png",
    height: 22,
  },
  {
    name: "Kaveri Online Services",
    logo: "https://housiey.com/blogs/wp-content/uploads/2025/03/Kaveri-Online-Service.png",
    height: 26,
  },
];

export function PartnerLogos() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="container-lg px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-6 py-8">
          {/* Label */}
          <p className="shrink-0 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] md:w-32 md:text-right">
            Trusted by
          </p>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-[var(--border)]" />

          {/* Slider */}
          <div className="flex-1 relative">
            <InfiniteSlider gap={80} duration={35} durationOnHover={70}>
              {partners.map((p) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={p.name}
                  src={p.logo}
                  alt={p.name}
                  height={p.height}
                  className="grayscale opacity-40 hover:opacity-70 transition-opacity object-contain"
                  style={{ height: p.height, maxWidth: 120 }}
                />
              ))}
            </InfiniteSlider>
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--surface)] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--surface)] to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
