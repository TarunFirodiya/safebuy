import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Jumbo SafeBuy",
  description:
    "Get in touch with Jumbo SafeBuy — email, WhatsApp, and our registered address in Bengaluru.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <h1>Contact Us</h1>
      <p>
        We're a small team based in Bengaluru. The fastest way to reach us is
        email or WhatsApp — someone on the team responds within one working
        day, typically faster.
      </p>

      <h2>General enquiries & support</h2>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:hello@jumbohomes.in">hello@jumbohomes.in</a>
        <br />
        <strong>WhatsApp:</strong>{" "}
        <a
          href="https://wa.me/919611112345"
          target="_blank"
          rel="noopener noreferrer"
        >
          +91 96111 12345
        </a>
        <br />
        <strong>Phone:</strong>{" "}
        <a href="tel:+919611112345">+91 96111 12345</a> (Mon–Sat, 10:00–19:00
        IST)
      </p>

      <h2>Privacy & data requests</h2>
      <p>
        Write to our Grievance Officer at{" "}
        <a href="mailto:privacy@jumbohomes.in">privacy@jumbohomes.in</a> for
        anything covered under our <a href="/privacy-policy">Privacy Policy</a>.
      </p>

      <h2>Billing, refunds & invoices</h2>
      <p>
        For invoice corrections, refund status, or GST-related questions,
        email <a href="mailto:hello@jumbohomes.in">hello@jumbohomes.in</a>{" "}
        with your order reference number. See our{" "}
        <a href="/refund-policy">Refund Policy</a> for the full details.
      </p>

      <h2>Partnerships & press</h2>
      <p>
        Hi — we'd love to hear from you. Email{" "}
        <a href="mailto:hello@jumbohomes.in">hello@jumbohomes.in</a> with a
        short note and we'll route it to the right person.
      </p>

      <h2>Registered office</h2>
      <p>
        <strong>NoBrokerage Homes Private Limited</strong>
        <br />
        Bengaluru, Karnataka, India
        <br />
        CIN: U70200KA2024PTC000000
        <br />
        GSTIN: 29AAJCN9781B1Z0
      </p>
      <p>
        <em>
          Visits by appointment only — most work is done remotely or at the
          relevant Sub-Registrar office / government authority.
        </em>
      </p>
    </>
  );
}
