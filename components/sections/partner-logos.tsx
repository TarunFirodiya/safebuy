import { InfiniteSlider } from "@/components/ui/infinite-slider";

const partners = [
  {
    name: "ICICI Bank",
    logo: "https://pathfinderstraining.com/wp-content/uploads/2022/10/ICICI-BANK-LOGO.png",
  },
  {
    name: "State Bank of India",
    logo: "https://icon2.cleanpng.com/lnd/20241224/fe/656de25930c6fdc0e12ba4162d0f25.webp",
  },
  {
    name: "HDFC Bank",
    logo: "https://1000logos.net/wp-content/uploads/2021/06/HDFC-Bank-logo.png",
  },
  {
    name: "Kaveri Online Services",
    logo: "https://housiey.com/blogs/wp-content/uploads/2025/03/Kaveri-Online-Service.png",
  },
  {
    name: "Aadhaar (UIDAI)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Aadhaar.svg",
  },
  {
    name: "BBMP — Bruhat Bengaluru Mahanagara Palike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/BBMP_2019.svg",
  },
];

export function PartnerLogos() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="container-lg px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-6 py-8">
          {/* Label */}
          <p className="shrink-0 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] md:w-32 md:text-right">
            Powered By
          </p>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-[var(--border)]" />

          {/* Slider */}
          <div className="flex-1 relative min-w-0">
            <InfiniteSlider gap={56} duration={20} durationOnHover={42}>
              {partners.map((p) => (
                <div
                  key={p.name}
                  className="flex h-11 w-[9.5rem] shrink-0 items-center justify-center sm:h-12 sm:w-40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain object-center grayscale opacity-40 transition-opacity hover:opacity-70"
                  />
                </div>
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
