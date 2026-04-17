export type ServiceCategory =
  | "pre-offer"
  | "pre-close"
  | "at-registration"
  | "post-close"
  | "inspection";

export interface Service {
  slug: string;
  name: string;
  price: number;
  deliveryTime: string;
  result: string;
  category: ServiceCategory;
  shortDescription: string;
  longDescription: string;
  whenToUse: string;
  steps: string[];
  youProvide: string[];
  notIncluded: string[];
  oftenBundledWith: string[];
}

export interface Bundle {
  slug: string;
  name: string;
  price: number;
  badge?: string;
  shortDescription: string;
  longDescription: string;
  serviceSlugOrder: string[];
  savingsAmount: number;
  razorpayLink: string;
  features: string[];
}

export const services: Service[] = [
  {
    slug: "encumbrance-certificate",
    name: "Encumbrance Certificate",
    price: 1499,
    deliveryTime: "3 business days",
    result: "Official EC from sub-registrar + 1-page lawyer summary",
    category: "pre-offer",
    shortDescription: "Pull and review the property's 13-year transaction history.",
    longDescription:
      "We obtain the Encumbrance Certificate directly from the sub-registrar's office and have our legal team review it for liens, mortgages, and undisclosed transactions.",
    whenToUse:
      "Before making any offer or paying a token — confirms the property has no hidden financial claims.",
    steps: [
      "We collect property details and survey number from you",
      "Pull the EC from the sub-registrar's office (13-year history)",
      "Lawyer reviews for liens, mortgages, and red flags",
      "You receive the EC + a plain-English 1-page summary",
    ],
    youProvide: ["Property survey number or registration details", "Seller's name"],
    notIncluded: [
      "Title opinion (book the Title Search service separately)",
      "Physical visit to the property",
    ],
    oftenBundledWith: ["title-search", "legal-opinion"],
  },
  {
    slug: "title-search",
    name: "Title Search",
    price: 2499,
    deliveryTime: "4 business days",
    result: "Ownership trace document + chain-of-title report",
    category: "pre-offer",
    shortDescription: "Trace ownership back 30 years to confirm clean title.",
    longDescription:
      "Our lawyers trace the ownership chain of the property back 30 years, verifying each transfer and flagging any gaps, disputes, or irregularities.",
    whenToUse:
      "When the EC looks clean and you want to verify the full ownership history before proceeding.",
    steps: [
      "Collect property documents from you",
      "Pull title records from the sub-registrar and revenue office",
      "Trace each ownership transfer in the chain",
      "Deliver a clear ownership trace with flagged risks",
    ],
    youProvide: ["Sale deed or property registration document", "Seller's name and Aadhaar"],
    notIncluded: [
      "Encumbrance Certificate (book separately or as a bundle)",
      "Legal opinion letter",
    ],
    oftenBundledWith: ["encumbrance-certificate", "legal-opinion"],
  },
  {
    slug: "legal-opinion",
    name: "Legal Opinion",
    price: 3499,
    deliveryTime: "3 business days",
    result: "Signed legal opinion letter from a property lawyer",
    category: "pre-offer",
    shortDescription: "Get a written go / no-go from a property lawyer.",
    longDescription:
      "A qualified property lawyer reviews all documents and issues a signed written opinion on whether the title is clear, what risks exist, and whether it is safe to proceed.",
    whenToUse:
      "After title search and EC are complete — the final legal sign-off before you pay the token.",
    steps: [
      "We review all documents you've collected (EC, title, sale deed)",
      "Lawyer cross-references with local regulation and RERA records",
      "Any red flags are flagged with recommended next steps",
      "You receive a signed legal opinion letter",
    ],
    youProvide: [
      "EC, title search report, sale deed copies",
      "Approved plan document (if available)",
    ],
    notIncluded: [
      "Obtaining documents (we assume you have them or book those services separately)",
      "Court representation",
    ],
    oftenBundledWith: ["encumbrance-certificate", "title-search"],
  },
  {
    slug: "sale-deed-drafting",
    name: "Sale Deed Drafting",
    price: 8999,
    deliveryTime: "5 business days",
    result: "Reviewed, finalized sale deed ready for registration",
    category: "pre-close",
    shortDescription: "Professionally drafted sale deed reviewed by a property lawyer.",
    longDescription:
      "We draft the sale deed from scratch (or review a seller-provided draft), ensure it reflects agreed terms accurately, and prepare it for sub-registrar registration.",
    whenToUse:
      "Once both parties have agreed on terms and you are ready to move toward registration.",
    steps: [
      "Collect agreed terms, buyer/seller details, and property schedule",
      "Draft sale deed per Karnataka Registration Act requirements",
      "Review for accuracy, completeness, and legal soundness",
      "Deliver finalized deed ready for stamp duty and registration",
    ],
    youProvide: [
      "Agreed sale price and payment terms",
      "Buyer and seller ID + address documents",
      "Property schedule / survey number",
    ],
    notIncluded: [
      "Stamp duty payment (we assist with calculation, you pay the SRO)",
      "Sub-registrar appointment (book Registration Assistance separately)",
    ],
    oftenBundledWith: ["registration-assistance", "stamp-duty-calculation"],
  },
  {
    slug: "stamp-duty-calculation",
    name: "Stamp Duty Calculation",
    price: 999,
    deliveryTime: "1 business day",
    result: "Exact stamp duty + registration fee breakdown, ready to pay",
    category: "pre-close",
    shortDescription: "Precise stamp duty and registration fee calculation for your property.",
    longDescription:
      "We calculate the exact stamp duty and registration fees due under Karnataka law for your specific property, circle rate, and transaction value.",
    whenToUse:
      "Before registration — ensures you bring the correct challan amount to the sub-registrar.",
    steps: [
      "Review property details, sale price, and circle rate",
      "Calculate stamp duty as per Karnataka Stamp Act",
      "Add registration fee and any applicable surcharges",
      "Deliver a payment breakdown with challan instructions",
    ],
    youProvide: ["Sale price agreed", "Property location (taluk / zone)"],
    notIncluded: ["Actual stamp duty payment (you pay the SRO directly)"],
    oftenBundledWith: ["sale-deed-drafting", "registration-assistance"],
  },
  {
    slug: "registration-assistance",
    name: "Registration Assistance",
    price: 6999,
    deliveryTime: "7–10 business days",
    result: "Registered sale deed with sub-registrar stamp",
    category: "at-registration",
    shortDescription: "We handle sub-registrar coordination and document preparation end-to-end.",
    longDescription:
      "Our team prepares all registration documents, books the sub-registrar appointment, guides you through the process, and ensures the deed is registered without defect.",
    whenToUse:
      "Once the sale deed is finalized and stamp duty is paid — we handle everything up to and including your SRO visit.",
    steps: [
      "Prepare all documents required by the sub-registrar",
      "Book the SRO appointment and share the slot with you",
      "Attend with you (or brief you fully if remote)",
      "Confirm registration and collect the registered deed",
    ],
    youProvide: [
      "Finalized sale deed",
      "Stamp duty payment challan",
      "Buyer and seller Aadhaar + PAN",
      "Two witnesses with ID",
    ],
    notIncluded: [
      "Stamp duty payment (you pay directly)",
      "Legal disputes or objections raised by SRO",
    ],
    oftenBundledWith: ["sale-deed-drafting", "khata-transfer"],
  },
  {
    slug: "khata-transfer",
    name: "Khata Transfer",
    price: 4999,
    deliveryTime: "15–21 business days",
    result: "Updated khata and e-Khata in your name",
    category: "post-close",
    shortDescription: "Transfer the khata and obtain e-Khata in the buyer's name after registration.",
    longDescription:
      "We handle the full khata transfer process with BBMP or the relevant local body — from application to the updated khata certificate and e-Khata in your name.",
    whenToUse:
      "After the sale deed is registered — the khata transfer is the first post-registration step.",
    steps: [
      "Prepare khata transfer application with all required documents",
      "Submit to BBMP / local body",
      "Follow up and respond to any queries",
      "Deliver updated khata certificate + e-Khata",
    ],
    youProvide: [
      "Registered sale deed copy",
      "Previous khata in seller's name",
      "Tax receipts for last 5 years",
    ],
    notIncluded: [
      "BBMP fees (you pay directly, typically ₹500–₹2,000)",
      "Property tax assessment updates",
    ],
    oftenBundledWith: ["registration-assistance", "electricity-transfer"],
  },
  {
    slug: "electricity-transfer",
    name: "Electricity Transfer",
    price: 2499,
    deliveryTime: "7–10 business days",
    result: "Electricity connection transferred to buyer's name",
    category: "post-close",
    shortDescription: "Transfer the BESCOM electricity connection to the buyer's name.",
    longDescription:
      "We coordinate with BESCOM to transfer the electricity consumer account from the seller to the buyer, ensuring no service interruption.",
    whenToUse:
      "After sale deed registration — do this alongside khata transfer for a clean handover.",
    steps: [
      "Collect required documents from buyer and seller",
      "Prepare and submit BESCOM transfer application",
      "Follow up on any field verification visits",
      "Confirm transfer and share new consumer number",
    ],
    youProvide: [
      "Registered sale deed copy",
      "Existing BESCOM consumer number",
      "Buyer ID + address proof",
    ],
    notIncluded: [
      "BESCOM fees (you pay directly, typically ₹200–₹500)",
      "Electrical repairs or new connections",
    ],
    oftenBundledWith: ["khata-transfer"],
  },
  {
    slug: "home-inspection",
    name: "Home Inspection",
    price: 14999,
    deliveryTime: "3 business days",
    result: "Detailed inspection report with photos and recommendations",
    category: "inspection",
    shortDescription: "A qualified engineer inspects the property and hands you a plain-English report.",
    longDescription:
      "A certified structural engineer visits the property and conducts a thorough inspection covering structure, electrical systems, plumbing, drainage, and finishing. You receive a detailed report with photos.",
    whenToUse:
      "Before paying the token or finalizing the sale price — gives you negotiation leverage and avoids post-purchase surprises.",
    steps: [
      "Schedule a visit with seller's consent",
      "Engineer conducts 2–3 hour walkthrough",
      "Assess structure, electrical, plumbing, drainage, and finishing",
      "Deliver detailed report with photos within 3 days",
    ],
    youProvide: [
      "Property address",
      "Seller's consent for inspection visit",
      "Your availability for a 30-minute debrief call",
    ],
    notIncluded: [
      "Soil testing or foundation report (a separate specialized service)",
      "Electrical safety certification",
    ],
    oftenBundledWith: ["encumbrance-certificate", "title-search"],
  },
];

export const bundles: Bundle[] = [
  {
    slug: "legal-diligence",
    name: "Legal Diligence",
    price: 9999,
    shortDescription: "Know if the title is clean before you commit a rupee.",
    longDescription:
      "We verify the title is clean before you sign anything. You get a written legal opinion and a plain-English summary of every document we checked.",
    serviceSlugOrder: [
      "encumbrance-certificate",
      "title-search",
      "legal-opinion",
    ],
    savingsAmount: 2498,
    razorpayLink: "https://rzp.io/rzp/diligence",
    features: [
      "Encumbrance Certificate pull + review",
      "30-year title search and ownership trace",
      "Written legal opinion from a property lawyer",
      "Plain-English risk summary",
      "21-day token protection",
    ],
  },
  {
    slug: "sale-deed",
    name: "Sale Deed",
    price: 34999,
    shortDescription: "Diligence + drafting + registration. We handle the sub-registrar.",
    longDescription:
      "Everything in Legal Diligence, plus your sale deed drafted, stamp duty calculated, and the registration shepherded through the sub-registrar's office.",
    serviceSlugOrder: [
      "encumbrance-certificate",
      "title-search",
      "legal-opinion",
      "sale-deed-drafting",
      "stamp-duty-calculation",
      "registration-assistance",
    ],
    savingsAmount: 8496,
    razorpayLink: "https://rzp.io/rzp/sale-deed",
    features: [
      "Full legal diligence (EC + title + opinion)",
      "Professional sale deed drafting",
      "Stamp duty calculation",
      "Sub-registrar appointment and registration",
      "Registered deed delivered to you",
    ],
  },
  {
    slug: "full-title-transfer",
    name: "Full Title Transfer",
    price: 49999,
    badge: "Most Popular",
    shortDescription: "Everything above, plus khata, utilities, and 30 days of post-transfer support.",
    longDescription:
      "The complete package: legal diligence, sale deed, sub-registrar registration, khata transfer, electricity transfer, and 30 days of post-close legal support.",
    serviceSlugOrder: [
      "encumbrance-certificate",
      "title-search",
      "legal-opinion",
      "sale-deed-drafting",
      "stamp-duty-calculation",
      "registration-assistance",
      "khata-transfer",
      "electricity-transfer",
    ],
    savingsAmount: 16494,
    razorpayLink: "https://rzp.io/rzp/title-transfer",
    features: [
      "Full legal diligence (EC + title + opinion)",
      "Sale deed drafting and registration",
      "Khata and e-Khata transfer to your name",
      "BESCOM electricity transfer",
      "30 days of post-transfer legal support",
    ],
  },
  {
    slug: "home-inspection",
    name: "Home Inspection",
    price: 14999,
    shortDescription: "A qualified engineer walks the property and hands you a plain-English report.",
    longDescription:
      "We send a certified structural engineer for a full property walkthrough. You get a detailed written report with photos — before you commit to anything.",
    serviceSlugOrder: ["home-inspection"],
    savingsAmount: 0,
    razorpayLink: "https://rzp.io/rzp/jumbo-inspect",
    features: [
      "Structural integrity assessment",
      "Electrical system inspection",
      "Plumbing and drainage check",
      "Finishing and waterproofing review",
      "Photo-documented report within 3 days",
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getBundleBySlug(slug: string): Bundle | undefined {
  return bundles.find((b) => b.slug === slug);
}

export function getBundleServices(bundle: Bundle): Service[] {
  return bundle.serviceSlugOrder
    .map(getServiceBySlug)
    .filter((s): s is Service => s !== undefined);
}

export const categoryLabels: Record<ServiceCategory, string> = {
  "pre-offer":        "Before your offer",
  "pre-close":        "Before registration",
  "at-registration":  "At registration",
  "post-close":       "After registration",
  "inspection":       "Property inspection",
};
