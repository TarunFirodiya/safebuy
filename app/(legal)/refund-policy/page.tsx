import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Jumbo SafeBuy",
  description:
    "When and how Jumbo SafeBuy processes refunds and cancellations.",
  alternates: { canonical: "/refund-policy" },
};

const LAST_UPDATED = "November 1, 2025";

export default function RefundPolicyPage() {
  return (
    <>
      <h1>Refund & Cancellation Policy</h1>
      <p className="last-updated">Last updated: {LAST_UPDATED}</p>

      <p>
        We want you to feel confident when you book a service on Jumbo
        SafeBuy. This policy explains when you can cancel an order and what
        refund you will receive.
      </p>

      <h2>1. Before work begins</h2>
      <p>
        You may cancel any paid order at any time before a SafeBuy
        coordinator has been assigned to your file and work has started. In
        this case we will refund{" "}
        <strong>100% of the service fee</strong>, less the payment-gateway
        charge levied by Razorpay (currently ~2% of the transaction value,
        which they do not return to us on refunds). Refunds are initiated
        within 2 working days of your request and typically reflect in your
        source account within 5–7 working days.
      </p>

      <h2>2. After work begins</h2>
      <p>
        Many of our services involve immediate outflows — government fee
        payments, advocate engagements, document procurement, field visits,
        and courier charges. Once such work has been initiated, the refund
        amount will be determined on a <strong>pro-rata basis</strong>{" "}
        based on the stage of the engagement and costs already incurred on
        your behalf.
      </p>
      <p>
        Your coordinator will share a written breakdown showing
        work-in-progress, third-party expenses already committed, and the
        refundable balance. Upon your confirmation, the refundable amount
        will be initiated within 2 working days.
      </p>

      <h2>3. Non-refundable situations</h2>
      <ul>
        <li>
          <strong>Government & statutory fees already paid</strong> (stamp
          duty, registration fee, Khata application fee, ward tax, BESCOM
          deposits, etc.) are non-refundable by law, regardless of outcome.
        </li>
        <li>
          <strong>Completed services</strong> — where the deliverable has
          been handed over and acknowledged.
        </li>
        <li>
          <strong>Documents already registered or submitted</strong> at a
          Sub-Registrar office, BBMP, or other authority.
        </li>
        <li>
          <strong>Customer non-cooperation</strong> — if the engagement
          cannot be completed because required documents are not shared or
          you are unreachable for more than 30 days, the order will be
          closed without refund of work already performed.
        </li>
      </ul>

      <h2>4. Turnaround commitments</h2>
      <p>
        If we fail to deliver a service within the turnaround window
        published on the service page — for reasons within our control (i.e.
        not attributable to government delays, customer delays, or a{" "}
        <em>force majeure</em> event) — you may either (a) wait for
        completion at no additional charge, or (b) cancel and receive a full
        refund of our professional fees (less any third-party pass-through
        expenses already incurred).
      </p>

      <h2>5. Guaranteed outcomes</h2>
      <p>
        For services expressly marked as "guaranteed outcome" (e.g. certain
        Khata and EC bundles), if we cannot deliver the promised outcome for
        reasons within our control, we will refund{" "}
        <strong>100% of our professional fees</strong>, no questions asked.
        Pass-through government fees remain non-refundable.
      </p>

      <h2>6. How to request a refund</h2>
      <p>
        Email <a href="mailto:hello@jumbohomes.in">hello@jumbohomes.in</a>{" "}
        with your order reference number and the reason for cancellation, or
        simply tell your coordinator. We will acknowledge within 1 working
        day and share the refund breakdown within 3 working days.
      </p>

      <h2>7. Failed payments</h2>
      <p>
        If you see a debit on your statement for an order that did not
        complete successfully on our side, don't worry — such charges are
        auto-reversed by your bank / UPI provider within 5–7 working days.
        If the reversal doesn't happen, write to us with the transaction
        reference and we'll coordinate with Razorpay to expedite it.
      </p>

      <h2>8. Chargebacks</h2>
      <p>
        Please reach out to us first before raising a chargeback — it is
        almost always faster. Chargebacks initiated without first contacting
        us will be contested if we have evidence of delivered work.
      </p>

      <h2>9. Questions</h2>
      <p>
        For anything refund-related, write to{" "}
        <a href="mailto:hello@jumbohomes.in">hello@jumbohomes.in</a>. We
        respond within one working day.
      </p>
    </>
  );
}
