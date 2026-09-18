import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Delivery Policy — Jumbo SafeBuy",
  description:
    "How Jumbo SafeBuy delivers services and documents after a successful payment.",
  alternates: { canonical: "/shipping-policy" },
};

const LAST_UPDATED = "November 1, 2025";

export default function ShippingPolicyPage() {
  return (
    <>
      <h1>Service Delivery Policy</h1>
      <p className="last-updated">Last updated: {LAST_UPDATED}</p>

      <p>
        Jumbo SafeBuy offers professional property-related services. We do
        not ship physical goods — all deliverables are{" "}
        <strong>digital documents</strong> (PDFs, scanned copies,
        government-issued certificates in electronic form) or completed
        off-line activities at Sub-Registrar offices and government
        authorities. This page explains how and when you will receive what
        you paid for.
      </p>

      <h2>1. Immediately after payment</h2>
      <ul>
        <li>
          A GST invoice / payment receipt is emailed to you within a few
          minutes via Resend.
        </li>
        <li>
          A WhatsApp confirmation is sent to your registered phone number
          within a few minutes via Kapso.
        </li>
        <li>
          A coordinator is assigned to your file within{" "}
          <strong>1 working day</strong>. You will receive their name,
          direct number, and a checklist of any documents we need from you.
        </li>
      </ul>

      <h2>2. Service turnaround</h2>
      <p>
        Each service lists its indicative turnaround window on the
        respective service page. Representative examples (subject to
        government timelines):
      </p>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Typical turnaround</th>
            <th>Delivery format</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Instant EC (online)</td>
            <td>Same day</td>
            <td>PDF via email + WhatsApp</td>
          </tr>
          <tr>
            <td>Encumbrance Certificate (physical)</td>
            <td>7–15 working days</td>
            <td>Hard copy + scanned PDF</td>
          </tr>
          <tr>
            <td>Title Verification</td>
            <td>7–10 working days</td>
            <td>Written legal opinion (PDF)</td>
          </tr>
          <tr>
            <td>Sale Agreement / Deed drafting</td>
            <td>3–5 working days</td>
            <td>Draft PDF for review, final after registration</td>
          </tr>
          <tr>
            <td>E-Khata registration / transfer</td>
            <td>30–60 working days</td>
            <td>E-Khata certificate (PDF)</td>
          </tr>
          <tr>
            <td>BESCOM transfer</td>
            <td>15–30 working days</td>
            <td>Updated connection in new name</td>
          </tr>
        </tbody>
      </table>
      <p>
        Turnaround counts only working days (Mon–Sat excluding public
        holidays) and <em>begins once all required documents are received
        from you</em>. Delays at Sub-Registrar offices, BBMP, or other
        government authorities can extend these windows — we will keep you
        updated at every stage.
      </p>

      <h2>3. How we deliver</h2>
      <ul>
        <li>
          <strong>Email</strong> — final PDFs, legal opinions, scanned
          copies are sent to the email address captured at checkout.
        </li>
        <li>
          <strong>WhatsApp</strong> — status updates, links to downloads,
          and reminders go to the phone number captured at checkout.
        </li>
        <li>
          <strong>Hard copies</strong> — where a service involves a
          physical certificate issued by the government (e.g. paper EC from
          SRO), we deliver the original either (a) in person, (b) via
          registered post at no additional charge within Bengaluru, or (c)
          via tracked courier anywhere in India at actuals.
        </li>
      </ul>

      <h2>4. If a deliverable is delayed</h2>
      <p>
        If a service is delayed beyond the published window for reasons
        within our control, our coordinator will proactively inform you and
        follow our <a href="/refund-policy">Refund Policy</a>. You are also
        always welcome to write to{" "}
        <a href="mailto:hello@jumbohomes.in">hello@jumbohomes.in</a> for an
        update.
      </p>

      <h2>5. Document safekeeping</h2>
      <p>
        Digital copies of documents we prepare or obtain on your behalf are
        retained as per our{" "}
        <a href="/privacy-policy">Privacy Policy</a>. You may request a
        copy at any time while the engagement is active.
      </p>

      <h2>6. Questions</h2>
      <p>
        For anything delivery-related, write to{" "}
        <a href="mailto:hello@jumbohomes.in">hello@jumbohomes.in</a>.
      </p>
    </>
  );
}
