import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Jumbo SafeBuy",
  description:
    "How Jumbo SafeBuy collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

const LAST_UPDATED = "November 1, 2025";

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last updated: {LAST_UPDATED}</p>

      <p>
        This Privacy Policy explains how NoBrokerage Homes Private Limited
        ("<strong>Jumbo SafeBuy</strong>", "<strong>we</strong>") collects,
        uses, shares, and protects your personal information when you use{" "}
        <a href="https://safebuy.jumbohomes.in">safebuy.jumbohomes.in</a>{" "}
        ("<strong>Platform</strong>") or engage our services. We are
        committed to handling your information in accordance with the Digital
        Personal Data Protection Act, 2023 ("<strong>DPDP Act</strong>") and
        applicable rules.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>1.1 Information you give us</h3>
      <ul>
        <li>
          <strong>Identity & contact details:</strong> name, email, phone
          number — collected at checkout and when you book a consultation.
        </li>
        <li>
          <strong>Transaction details:</strong> the service(s) you purchase,
          order reference numbers, invoice information (including GSTIN if
          you provide one).
        </li>
        <li>
          <strong>Property / case-specific documents:</strong> sale
          agreement, Khata, encumbrance certificate, tax paid receipts, and
          other documents you upload or share over email / WhatsApp for the
          purpose of delivering the service you requested.
        </li>
      </ul>

      <h3>1.2 Information we collect automatically</h3>
      <ul>
        <li>
          <strong>Usage & device data:</strong> IP address, browser user
          agent, pages viewed, referral source, approximate location — via
          cookies and analytics scripts.
        </li>
        <li>
          <strong>Cookies & similar tech:</strong> essential cookies for
          checkout, plus analytics cookies (Google Analytics / Meta Pixel) to
          understand how the Platform is used. You can disable non-essential
          cookies through your browser settings.
        </li>
      </ul>

      <h3>1.3 Information from third parties</h3>
      <p>
        We receive payment status, payment method type, and a masked
        transaction identifier from our payment processor (Razorpay). We do
        not collect or store full card numbers, UPI PINs, or net-banking
        credentials.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To process orders, issue invoices, and deliver the Services.</li>
        <li>
          To communicate with you about your order — via email (Resend) and
          WhatsApp (Kapso) — including reminders, document requests, and
          status updates.
        </li>
        <li>
          To respond to enquiries, provide customer support, and resolve
          disputes.
        </li>
        <li>
          To comply with legal, regulatory, and tax obligations, including
          GST invoicing and statutory record-keeping.
        </li>
        <li>
          To detect, prevent, and investigate fraud, abuse, or unauthorised
          access.
        </li>
        <li>
          With your consent, to send product updates, offers, and content
          marketing emails — you can opt out at any time via the unsubscribe
          link.
        </li>
      </ul>

      <h2>3. Legal Basis</h2>
      <p>
        We process personal data on the basis of (a) your consent collected
        at the time of sign-up or checkout, (b) the necessity to perform a
        contract with you, and (c) our legitimate interests in running the
        Platform securely and improving it.
      </p>

      <h2>4. Sharing Your Information</h2>
      <p>
        We share data only with trusted service providers who help us run the
        Platform and deliver services, and only to the extent necessary:
      </p>
      <ul>
        <li>
          <strong>Razorpay</strong> — payment processing and invoice generation.
        </li>
        <li>
          <strong>Cloudflare</strong> — website hosting, edge delivery,
          analytics, and security.
        </li>
        <li>
          <strong>Resend</strong> — transactional email delivery (order
          confirmation, receipts, reminders).
        </li>
        <li>
          <strong>Kapso</strong> — WhatsApp Business messaging for status
          updates and reminders.
        </li>
        <li>
          <strong>Independent advocates and on-ground coordinators</strong>{" "}
          engaged on a case-by-case basis to deliver your specific service —
          strictly on a need-to-know basis.
        </li>
        <li>
          <strong>Government authorities and courts</strong> when a legal
          obligation requires it.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> sell or rent your personal data to
        advertisers or data brokers.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain order records, invoices, and associated communication for a
        minimum of 8 years as required under Indian tax and accounting laws.
        Property documents you share are retained until the engagement is
        closed plus an additional 2 years, after which they are deleted or
        anonymised, unless a legal hold applies.
      </p>

      <h2>6. Security</h2>
      <p>
        Your data is stored on Cloudflare infrastructure with encryption in
        transit (TLS) and at rest where supported. Access to production
        systems is limited to authorised personnel. While we apply
        commercially reasonable safeguards, no online system is 100%
        impenetrable; please notify us immediately if you suspect a
        compromise.
      </p>

      <h2>7. Your Rights</h2>
      <p>Subject to the DPDP Act, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Request correction of inaccurate or incomplete information.</li>
        <li>
          Request erasure of your personal data (subject to retention
          obligations above).
        </li>
        <li>Withdraw consent to marketing communications at any time.</li>
        <li>Nominate another individual to exercise your rights in the event of death or incapacity.</li>
        <li>Lodge a grievance with our Grievance Officer (below).</li>
      </ul>

      <h2>8. Children</h2>
      <p>
        The Platform is not directed at children under 18. We do not
        knowingly collect data from minors. If you believe a minor has shared
        data with us, write to us and we'll delete it.
      </p>

      <h2>9. International Transfers</h2>
      <p>
        Some of our service providers (Cloudflare, Resend) operate globally,
        which may involve processing your data in countries outside India.
        We ensure such transfers comply with applicable data-protection
        laws.
      </p>

      <h2>10. Changes to this Policy</h2>
      <p>
        We may update this Policy from time to time. The "Last updated" date
        at the top of this page reflects the current version. Material
        changes will be notified via email or a prominent notice on the
        Platform.
      </p>

      <h2>11. Grievance Officer</h2>
      <p>
        If you have a complaint about how your personal data is being
        handled, write to our Grievance Officer:
      </p>
      <p>
        <strong>Grievance Officer</strong>
        <br />
        NoBrokerage Homes Private Limited
        <br />
        Email: <a href="mailto:privacy@jumbohomes.in">privacy@jumbohomes.in</a>
        <br />
        We will acknowledge within 48 hours and respond within 30 days.
      </p>
    </>
  );
}
