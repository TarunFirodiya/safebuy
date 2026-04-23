import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Jumbo SafeBuy",
  description:
    "The terms that govern your use of the Jumbo SafeBuy platform and services.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "November 1, 2025";

export default function TermsPage() {
  return (
    <>
      <h1>Terms & Conditions</h1>
      <p className="last-updated">Last updated: {LAST_UPDATED}</p>

      <p>
        These Terms & Conditions ("<strong>Terms</strong>") govern your access
        to and use of the Jumbo SafeBuy website at{" "}
        <a href="https://safebuy.jumbohomes.in">safebuy.jumbohomes.in</a>{" "}
        ("<strong>Platform</strong>") and the legal and property-related
        services offered through it ("<strong>Services</strong>"), operated by
        NoBrokerage Homes Private Limited ("<strong>Jumbo SafeBuy</strong>",{" "}
        "<strong>we</strong>", "<strong>us</strong>"). By using the Platform
        or engaging our Services you agree to these Terms.
      </p>

      <h2>1. Scope of Services</h2>
      <p>
        Jumbo SafeBuy provides fixed-price professional assistance for
        property-related legal and administrative work in Karnataka, including
        but not limited to encumbrance certificates, title verification, sale
        agreements and deeds, Khata services, property tax updates, and
        utility transfers. Specific inclusions, deliverables, and turnaround
        times for each Service are published on the corresponding service
        detail page on the Platform at the time of booking, and form part of
        these Terms.
      </p>
      <p>
        We are facilitators and document preparers. Where a Service involves a
        legal opinion, the opinion is rendered by an independent advocate on
        record and is not provided by Jumbo SafeBuy itself. Government
        timelines (e.g. Sub-Registrar offices, BBMP, BESCOM) are outside our
        control and actual turnaround may vary.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You represent that you are at least 18 years of age and competent to
        enter into a legally binding contract under the Indian Contract Act,
        1872. You are responsible for providing accurate, truthful, and
        complete information during checkout and for producing authentic
        supporting documents when requested.
      </p>

      <h2>3. Pricing, Payments & Taxes</h2>
      <ul>
        <li>
          All prices are in Indian Rupees (INR) and are inclusive of
          professional fees for the scope listed on the service page. Prices
          may be exclusive of applicable GST, which will be displayed at
          checkout where applicable.
        </li>
        <li>
          Government fees, stamp duty, registration charges, and similar
          statutory outflows are pass-through and are not included unless
          explicitly stated on the service page.
        </li>
        <li>
          Payments are processed by Razorpay Software Private Limited and are
          subject to Razorpay's own terms. Jumbo SafeBuy does not store your
          card, UPI, or bank credentials.
        </li>
        <li>
          A GST tax invoice (GSTIN 29AAJCN9781B1Z0) will be generated and sent
          to you after successful payment.
        </li>
      </ul>

      <h2>4. Customer Responsibilities</h2>
      <p>
        Our ability to deliver depends on you providing legible copies of
        required documents, being available for brief verification calls, and
        being physically present at the Sub-Registrar / authority office on
        dates we coordinate with you. Delays caused by missing documents,
        non-availability, or mis-shared details will extend turnaround times
        and are not our responsibility.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content on the Platform — copy, visuals, checklists, templates,
        code, and branding — is the property of Jumbo SafeBuy or its licensors
        and is protected by applicable IP laws. You may not reproduce,
        distribute, or create derivative works without written permission.
        Documents drafted specifically for your transaction become yours once
        delivered.
      </p>

      <h2>6. Third-Party Integrations</h2>
      <p>
        The Platform integrates with third-party services including Razorpay
        (payments), Resend (email delivery), Kapso (WhatsApp messaging),
        Cloudflare (hosting and analytics), and Google / Meta (analytics,
        advertising). Your use of these integrations is also governed by their
        respective terms and privacy policies.
      </p>

      <h2>7. Disclaimer of Warranties</h2>
      <p>
        The Platform and Services are provided on an "as is" and "as
        available" basis. While we take reasonable care and engage qualified
        professionals, we do not warrant that: (a) the Platform will be
        uninterrupted or error-free, (b) any third-party government authority
        will act within a specific timeline, or (c) a property transaction
        will complete in a specific manner. Legal advice is informational and
        not a substitute for independent counsel in complex matters.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Jumbo SafeBuy's aggregate
        liability for any claim arising out of or relating to the Services
        shall not exceed the fees actually paid by you for the specific
        Service giving rise to the claim. In no event shall we be liable for
        indirect, incidental, special, consequential, or punitive damages.
      </p>

      <h2>9. Governing Law & Jurisdiction</h2>
      <p>
        These Terms are governed by the laws of India. Any dispute will be
        subject to the exclusive jurisdiction of the courts at Bengaluru,
        Karnataka.
      </p>

      <h2>10. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The "Last updated" date
        at the top of this page reflects the current version. Continued use
        of the Platform after changes constitutes acceptance of the revised
        Terms.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href="mailto:hello@jumbohomes.in">hello@jumbohomes.in</a> or see our{" "}
        <a href="/contact">contact page</a>.
      </p>
    </>
  );
}
