// Jumbo SafeBuy service catalogue
// ---------------------------------------------------------------------------
// Machine-filled from the Jumbo SafeBuy rate card.
//
// Content that still needs to be authored by the team is marked with:
//   TODO(seo)      — metadata, keywords, long-form content, FAQs
//   TODO(content)  — product copy (steps, notIncluded, whenToUse)
//   TODO(bundle)   — SafeBuy Plus additional SKUs beyond Shield+Seal+Assure
//
// To surface every unfilled item, grep for `TODO(seo)` or `TODO(content)`.
// ---------------------------------------------------------------------------

export type ServiceCategory =
  | "before-buying" // due diligence (EC, Title Verification, reviews)
  | "for-buying" // registration-phase (sale deed, agreement, stamp, TDS)
  | "after-buying" // post-registration (Khata transfer, BESCOM, tax name)
  | "for-owners"; // owner maintenance (EC updates, rectification, POA)

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface LongFormContent {
  overview: string;
  whyItMatters: string;
  karnatakaContext: string;
  commonPitfalls: string;
}

export interface ServiceReviewer {
  name: string;
  credential: string;
}

export interface PriceAlternate {
  label: string;
  price: number;
}

export interface Service {
  slug: string;
  name: string;
  price: number;
  /** Display override, e.g. "from ₹4,999" or "Per hour". */
  priceNote?: string;
  /** Alternate pricing tiers (e.g. single vs joint buyer for TDS). */
  priceAlternates?: PriceAlternate[];
  deliveryTime: string;
  categories: ServiceCategory[];
  shortDescription: string;
  /** One-line description of what the customer walks away with. */
  result: string;
  /** Documents / inputs the customer must provide. */
  requirements: string[];
  /** Optional product copy — detail page renders sections only when filled. */
  steps: string[];
  notIncluded: string[];
  /** Slugs of related services surfaced as "often booked together". */
  oftenBundledWith: string[];

  // ---- SEO scaffolding --------------------------------------------------
  /** ≤60 chars. Falls back to `${name} in Bangalore | Jumbo SafeBuy` when empty. */
  metaTitle: string;
  /** ≤155 chars. Falls back to shortDescription when empty. */
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longFormContent: LongFormContent;
  faqs: ServiceFaq[];
  /** ISO date string. Shown in the E-E-A-T byline. */
  lastUpdated: string;
  reviewedBy?: ServiceReviewer;
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

  // ---- SEO scaffolding --------------------------------------------------
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  faqs: ServiceFaq[];
  lastUpdated: string;
}

// ---------------------------------------------------------------------------
// Content stubs shared across SKUs until the team fills them in.
// ---------------------------------------------------------------------------

const LAST_UPDATED = "2025-11-01"; // TODO(seo): bump when page copy is reviewed

const emptyLongForm: LongFormContent = {
  overview: "",
  whyItMatters: "",
  karnatakaContext: "",
  commonPitfalls: "",
};

// ---------------------------------------------------------------------------
// Services catalogue
// ---------------------------------------------------------------------------

export const services: Service[] = [
  // ── Due-diligence / pre-offer ──────────────────────────────────────────
  {
    slug: "encumbrance-certificate",
    name: "Encumbrance Certificate (10 / 20 years)",
    price: 1999,
    deliveryTime: "7 days",
    categories: ["before-buying", "for-owners"],
    shortDescription:
      "A complete record of property ownership and transaction history over 10 or 20 years.",
    result:
      "A verified Encumbrance Certificate sourced through official channels, ensuring accuracy and reliability.",
    requirements: ["Sale Deed", "Aadhaar Card"],
    steps: [], // TODO(content)
    notIncluded: [], // TODO(content)
    oftenBundledWith: ["title-verification", "e-khata-ec-update"],
    metaTitle: "", // TODO(seo)
    metaDescription: "", // TODO(seo)
    primaryKeyword: "", // TODO(seo): e.g. "encumbrance certificate bangalore"
    secondaryKeywords: [], // TODO(seo)
    longFormContent: emptyLongForm, // TODO(seo)
    faqs: [], // TODO(seo)
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "instant-ec",
    name: "Instant EC",
    price: 3499,
    deliveryTime: "1 day",
    categories: ["before-buying", "for-owners"],
    shortDescription:
      "For property owners who need their Encumbrance Certificate urgently without delays or manual effort.",
    result:
      "A fast-tracked, verified EC delivered within 24 hours through expert-led processing and official systems.",
    requirements: ["Sale Deed", "Aadhaar Card"],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["encumbrance-certificate", "title-verification"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "e-khata-ec-update",
    name: "E-Khata EC Update",
    price: 2499,
    deliveryTime: "7 days",
    categories: ["before-buying", "for-owners"],
    shortDescription:
      "For property owners who want to update their E-Khata with the latest Encumbrance Certificate records.",
    result:
      "A complete compliance process ensuring ownership clarity, legal accuracy, and readiness for sale, loan, or due diligence.",
    requirements: ["Property Tax receipt", "Encumbrance Certificate (EC)"],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["encumbrance-certificate", "e-khata-registration"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "title-verification",
    name: "Title Verification",
    price: 12499,
    deliveryTime: "7 days",
    categories: ["before-buying"],
    shortDescription:
      "A comprehensive review of property documents with a professional legal opinion.",
    result:
      "A complete legal report with lawyer sign and seal on the letterhead of a reputed law firm.",
    requirements: [
      "Sale Deed",
      "Khata Certificate",
      "Encumbrance Certificate (EC)",
      "Approved Layout Plan",
      "Allotment Letter",
      "Property Tax Paid Receipts",
      "NOCs",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["encumbrance-certificate", "sale-agreement-review"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "escrow",
    name: "Escrow",
    price: 4999,
    deliveryTime: "1 day",
    categories: ["before-buying"],
    shortDescription:
      "Secure your token amount until legal due-diligence checks are completed.",
    result:
      "A neutral third-party escrow setup where funds are released to the seller only after all conditions are fulfilled.",
    requirements: ["PAN", "Bank Details", "Property Details"],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["title-verification", "agreement-for-sale"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },

  // ── Registration / deed services ───────────────────────────────────────
  {
    slug: "agreement-for-sale",
    name: "Agreement for Sale",
    price: 4999,
    deliveryTime: "5 days",
    categories: ["for-buying"],
    shortDescription:
      "Legally secure the transaction before final property registration.",
    result:
      "A legally binding agreement defining price, terms, and conditions — ensuring commitment and protection until ownership transfer.",
    requirements: [
      "Aadhaar Card",
      "PAN Card",
      "Property Tax Paid Receipt",
      "Encumbrance Certificate (EC)",
      "Khata Certificate",
      "Copy of old Sale Deed",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["sale-deed", "e-stamping", "sale-agreement-review"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "sale-deed",
    name: "Sale Deed",
    price: 4999,
    deliveryTime: "5 days",
    categories: ["for-buying"],
    shortDescription:
      "Complete the final transfer of property ownership legally and securely.",
    result:
      "A registered legal document that confirms ownership transfer, ensuring full rights, compliance, and conclusive proof of sale.",
    requirements: [
      "Aadhaar Card",
      "PAN Card",
      "Property Tax Paid Receipt",
      "Encumbrance Certificate (EC)",
      "Khata Certificate",
      "Copy of Sale Agreement",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["agreement-for-sale", "e-stamping", "tds-filing-26qb"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "mou",
    name: "Memorandum of Understanding (MoU)",
    price: 4999,
    deliveryTime: "5 days",
    categories: ["for-buying"],
    shortDescription:
      "Document initial understanding before entering a formal property agreement.",
    result:
      "A structured MoU outlining key terms, timelines, and responsibilities — ensuring clarity and alignment before legal commitment.",
    requirements: ["Aadhaar Card", "PAN Card", "Witness Signatures"],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["agreement-for-sale", "sale-deed"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "power-of-attorney",
    name: "Power of Attorney",
    price: 11999,
    deliveryTime: "10–15 days",
    categories: ["for-buying", "for-owners"],
    shortDescription:
      "Authorize a trusted person to act on your behalf in property transactions.",
    result:
      "A legally drafted Power of Attorney enabling execution of documents, registration, and transaction management with full clarity and compliance.",
    requirements: [
      "Sale Deed",
      "Identity and Address Proof",
      "Passport-size Photo",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["sale-deed", "notary"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "gift-deed",
    name: "Gift Deed",
    price: 14999,
    deliveryTime: "10 days",
    categories: ["for-buying", "for-owners"],
    shortDescription:
      "Transfer ownership to another person without any monetary consideration.",
    result:
      "A legally binding gift deed ensuring immediate ownership transfer, proper documentation, and dispute-free property records.",
    requirements: [
      "Final Gift Deed Document",
      "Identity & Address Proofs",
      "Original Property Documents",
      "Khata Certificate & Extract",
      "PAN Card Details",
      "Passport-size Photographs",
      "No Objection Certificate (NOC)",
      "Possession Certificate",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["release-partition-deed", "rectification-deed"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "release-partition-deed",
    name: "Release / Partition Deed",
    price: 14999,
    deliveryTime: "10 days",
    categories: ["for-buying", "for-owners"],
    shortDescription:
      "Divide jointly owned property or transfer share rights within the same ownership structure.",
    result:
      "A legally binding deed ensuring clear ownership allocation or release of rights — enabling dispute-free and independent property control.",
    requirements: [
      "Identity & Address Proofs",
      "Original Property Documents",
      "Khata Certificate & Extract",
      "PAN Card Details",
      "Passport-size Photographs",
      "No Objection Certificate (NOC)",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["gift-deed", "rectification-deed"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "rectification-deed",
    name: "Rectification Deed",
    price: 14999,
    deliveryTime: "10–15 days",
    categories: ["for-buying", "for-owners"],
    shortDescription:
      "Correct errors in previously registered property documents.",
    result:
      "A legally valid rectification deed ensuring accurate records, clear documentation, and alignment with the original transaction.",
    requirements: [
      "Original Sale Deed",
      "Written Application for Rectification",
      "Identity Proofs of All Parties",
      "Address Proofs of All Parties",
      "No Objection Certificate (NOC) — if property is currently mortgaged",
      "Draft Rectification Deed",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["gift-deed", "release-partition-deed"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "notary",
    name: "Notary",
    price: 2499,
    deliveryTime: "2 days",
    categories: ["before-buying", "for-buying", "after-buying", "for-owners"],
    shortDescription:
      "Authenticate and legally validate your documents through an authorized notary.",
    result:
      "A notarized document with official seal and signature — ensuring authenticity, fraud prevention, and acceptance across legal and government authorities.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["power-of-attorney"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },

  // ── Legal review services ──────────────────────────────────────────────
  {
    slug: "sale-agreement-review",
    name: "Sale Agreement Review",
    price: 2999,
    deliveryTime: "5 days",
    categories: ["for-buying"],
    shortDescription:
      "A detailed review of your Sale Agreement before signing.",
    result:
      "A professional legal assessment highlighting risks, clauses, and discrepancies — ensuring a safe, transparent, and well-informed property transaction.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["agreement-for-sale", "title-verification"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "sale-deed-review",
    name: "Sale Deed Review",
    price: 2999,
    deliveryTime: "5 days",
    categories: ["for-buying"],
    shortDescription:
      "A thorough legal review of the Sale Deed before final registration.",
    result:
      "A detailed legal assessment ensuring accuracy of ownership, terms, and property details — protecting you before the transaction is legally completed.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["sale-deed", "title-verification"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "other-legal-documents-review",
    name: "Other Legal Documents Review",
    price: 2999,
    deliveryTime: "5 days",
    categories: ["for-buying"],
    shortDescription:
      "A comprehensive review of any legal document related to your property transaction.",
    result:
      "A detailed legal assessment covering approvals, certificates, and records — ensuring complete due diligence and a risk-free transaction.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["title-verification"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "online-consultation",
    name: "Online Consultation",
    price: 1999,
    priceNote: "Per hour · first 15 mins free",
    deliveryTime: "Per hour (first 15 mins free)",
    categories: ["before-buying", "for-buying", "after-buying", "for-owners"],
    shortDescription:
      "One-on-one legal consultation with a property lawyer over video call.",
    result:
      "A structured consultation covering your specific questions, risks, and recommended next steps — delivered by a qualified property lawyer.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["title-verification", "sale-agreement-review"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "offline-consultation",
    name: "Offline Consultation",
    price: 2499,
    priceNote: "Per hour",
    deliveryTime: "Per hour",
    categories: ["before-buying", "for-buying", "after-buying", "for-owners"],
    shortDescription:
      "In-person legal consultation with a property lawyer at our Bangalore office.",
    result:
      "A face-to-face consultation covering your specific questions, risks, and recommended next steps — delivered by a qualified property lawyer.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["title-verification", "sale-agreement-review"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },

  // ── Registration / stamp / TDS ─────────────────────────────────────────
  {
    slug: "e-stamping",
    name: "E-Stamping",
    price: 3999,
    deliveryTime: "2 days",
    categories: ["for-buying"],
    shortDescription:
      "Generate legally valid stamp papers through a secure digital process.",
    result:
      "An electronically issued e-stamp certificate ensuring compliant stamp duty payment, authenticity, and acceptance across legal and registration authorities.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["sale-deed", "agreement-for-sale"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "sale-deed-certified-copy-manual",
    name: "Sale Deed Certified Copy (Manual)",
    price: 12999,
    deliveryTime: "25–30 days",
    categories: ["for-buying", "for-owners"],
    shortDescription:
      "Obtain an official duplicate (certified copy) of your registered Sale Deed.",
    result:
      "A government-attested copy issued by the Sub-Registrar — legally valid proof of ownership for verification, legal, and compliance purposes.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["sale-deed-certified-copy-electronic"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "sale-deed-certified-copy-electronic",
    name: "Sale Deed Certified Copy (Electronic)",
    price: 7999,
    deliveryTime: "10–15 days",
    categories: ["for-buying", "for-owners"],
    shortDescription:
      "Obtain a digitally accessible certified copy of your registered Sale Deed.",
    result:
      "An official electronic copy issued through government systems — legally valid ownership proof with fast, hassle-free access.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["sale-deed-certified-copy-manual"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "modt-registration",
    name: "MODT Registration (Excluding LE)",
    price: 6999,
    deliveryTime: "1 day",
    categories: ["for-buying", "for-owners"],
    shortDescription:
      "Record the Memorandum of Deposit of Title Deeds (MODT) to evidence the creation of an equitable mortgage.",
    result:
      "Statutory MODT registration covering only government fees — excludes legal expenses such as advocate fees, documentation, and verification charges.",
    requirements: [],
    steps: [],
    notIncluded: ["Legal Expenses (LE): advocate fees, documentation, verification charges"],
    oftenBundledWith: ["discharge-deed-registration"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "discharge-deed-registration",
    name: "Discharge Deed Registration",
    price: 6999,
    deliveryTime: "1 day",
    categories: ["for-buying", "for-owners"],
    shortDescription:
      "Record the Discharge Deed evidencing full repayment and closure of the loan secured against the property.",
    result:
      "Confirms release of the lender's charge or mortgage — restoring clear and marketable title to the property owner.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["modt-registration"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "tds-filing-26qb",
    name: "TDS Filing (Form 26QB)",
    price: 4999,
    priceNote: "from ₹4,999",
    priceAlternates: [
      { label: "Single buyer", price: 4999 },
      { label: "Joint buyers", price: 6999 },
    ],
    deliveryTime: "2 days",
    categories: ["for-buying", "for-owners"],
    shortDescription:
      "Complete mandatory TDS compliance during property transactions.",
    result:
      "End-to-end filing of Form 26QB — accurate tax deduction, timely payment, and full compliance with legal requirements.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["sale-deed", "tan-registration"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "tan-registration",
    name: "TAN Registration",
    price: 4999,
    deliveryTime: "6–7 days",
    categories: ["for-buying"],
    shortDescription:
      "Obtain a Tax Deduction and Collection Account Number (TAN) as mandated under the Income Tax Act.",
    result:
      "Ensures compliance with TDS/TCS provisions — enables proper filing, reporting, and remittance of taxes to the authorities.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["tds-filing-26qb"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "low-tds-nri",
    name: "Low TDS Assistance for NRI",
    price: 24999,
    deliveryTime: "30 days",
    categories: ["for-buying", "for-owners"],
    shortDescription:
      "For NRI property owners who want to reduce excess TDS deduction on their transaction.",
    result:
      "End-to-end assistance for obtaining a Lower/Nil TDS Certificate — optimal tax deduction, compliance, and faster access to funds.",
    requirements: [],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["tds-filing-26qb", "sale-deed"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },

  // ── Khata services ─────────────────────────────────────────────────────
  {
    slug: "e-khata-correction",
    name: "E-Khata Correction",
    price: 24999,
    deliveryTime: "30 days",
    categories: ["before-buying", "for-owners"],
    shortDescription:
      "Rectify errors in your E-Khata and align records with registered property documents.",
    result:
      "A complete correction process ensuring accurate ownership details, compliance, and smooth transactions for sale, loan, or legal purposes.",
    requirements: [
      "Sale Deed",
      "Aadhaar",
      "PAN Card",
      "Tax Receipts",
      "Encumbrance Certificate (EC)",
      "Electricity Bill",
      "Water Bill (BWSSB)",
      "Property Photo",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["e-khata-ec-update", "e-khata-registration"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "manual-to-e-khata-conversion",
    name: "Manual to E-Khata Conversion",
    price: 24999,
    deliveryTime: "30 days",
    categories: ["before-buying", "for-owners"],
    shortDescription:
      "Convert your manual Khata records into a digitally recognized E-Khata.",
    result:
      "A complete conversion process ensuring compliant, verifiable, and legally accepted property records for seamless transactions and approvals.",
    requirements: [
      "Sale Deed",
      "Aadhaar",
      "PAN Card",
      "Tax Receipts",
      "Encumbrance Certificate (EC)",
      "Electricity Bill",
      "Water Bill (BWSSB)",
      "Property Photo",
      "Copy of Manual Khata",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["e-khata-registration", "e-khata-correction"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "e-khata-registration",
    name: "E-Khata Registration (including LE)",
    price: 24999,
    deliveryTime: "30 days",
    categories: ["before-buying", "for-owners"],
    shortDescription:
      "Register your property in the BBMP digital records through E-Khata.",
    result:
      "A complete registration process ensuring legally compliant, verifiable, and officially recognized property records for seamless transactions and approvals.",
    requirements: [
      "Sale Deed",
      "Aadhaar",
      "PAN Card",
      "Tax Receipts",
      "Encumbrance Certificate (EC)",
      "Electricity Bill",
      "Water Bill (BWSSB)",
      "Property Photo",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["manual-to-e-khata-conversion", "e-khata-correction"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "khata-amalgamation",
    name: "Khata Amalgamation",
    price: 29999,
    deliveryTime: "45 days",
    categories: ["after-buying"],
    shortDescription:
      "Combine multiple property Khatas into a single consolidated Khata in the records of the local authority.",
    result:
      "Unified property tax assessment, clear ownership documentation, and compliance for future transactions or development approvals.",
    requirements: [
      "Property Tax Receipt",
      "Aadhaar & PAN Card of Seller",
      "Property Photo",
      "Encumbrance Certificate (EC)",
      "Sale Deed",
      "Electricity Bill",
      "BESCOM Bill",
      "Khata Extract",
      "Khata Certificate",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["e-khata-transfer-bbmp", "property-tax-name-change"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },

  // ── Property tax & assessment ──────────────────────────────────────────
  {
    slug: "ward-correction-property-tax",
    name: "Ward Correction in Property Tax Receipt",
    price: 2999,
    deliveryTime: "10–15 days",
    categories: ["before-buying", "for-owners"],
    shortDescription:
      "Correct ward details in the property tax receipt as recorded with the municipal authority.",
    result:
      "Accurate property identification, proper tax assessment, and consistency of records for legal and transactional purposes.",
    requirements: [
      "Sale Deed",
      "Aadhaar",
      "Encumbrance Certificate (EC)",
      "Tax Receipts",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["property-tax-name-change", "property-tax-assessment"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "property-tax-assessment",
    name: "Property Tax Assessment",
    price: 14999,
    deliveryTime: "Case basis",
    categories: ["after-buying"],
    shortDescription:
      "Determine and record property tax liability with the municipal authority based on size, usage, and location.",
    result:
      "Proper assessment, compliance with applicable regulations, and accurate issuance of property tax demands.",
    requirements: ["Sale Deed", "Last Tax Paid Receipt", "Electricity Bill"],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["property-tax-name-change", "khata-amalgamation"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },

  // ── Post-registration transfers ────────────────────────────────────────
  {
    slug: "e-khata-transfer-bbmp",
    name: "E-Khata Transfer — BBMP",
    price: 14999,
    deliveryTime: "20–30 days",
    categories: ["after-buying"],
    shortDescription:
      "Update ownership details in BBMP records after property transfer.",
    result:
      "E-Khata reflects the correct owner — enabling compliant tax records, smooth transactions, and legal verification.",
    requirements: [
      "Aadhaar Card of Owners",
      "Sale Deed",
      "BESCOM Bill",
      "Property Tax Receipt",
      "Khata Certificate",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["bescom-transfer", "property-tax-name-change"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "e-khata-transfer-panchayat",
    name: "E-Khata Transfer — Panchayat",
    price: 24999,
    deliveryTime: "45–60 days",
    categories: ["after-buying"],
    shortDescription:
      "Update ownership details in Panchayat records after property transfer.",
    result:
      "E-Khata reflects the correct owner — enabling compliant tax records, smooth transactions, and legal verification.",
    requirements: [
      "Aadhaar Card of Owners",
      "Sale Deed",
      "BESCOM Bill",
      "Property Tax Receipt",
      "Khata Certificate",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["bescom-transfer", "property-tax-name-change"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "property-tax-name-change",
    name: "Property Tax Name Change",
    price: 4999,
    deliveryTime: "10–15 days",
    categories: ["after-buying"],
    shortDescription:
      "Update ownership details in municipal property tax records.",
    result:
      "A complete name-change process — accurate ownership, compliant tax records, and smooth transactions for resale, loans, and legal purposes.",
    requirements: ["Sale Deed", "Khata Certificate", "Property Tax Receipt"],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["e-khata-transfer-bbmp", "bescom-transfer"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "bescom-transfer",
    name: "BESCOM Transfer",
    price: 7499,
    deliveryTime: "10–15 days",
    categories: ["after-buying"],
    shortDescription:
      "Transfer the electricity connection to your name after ownership or occupancy change.",
    result:
      "BESCOM record reflects the correct user — enabling compliant billing, smooth transactions, and uninterrupted service.",
    requirements: [
      "Sale Deed",
      "Tax Receipt",
      "Khata Certificate",
      "Aadhaar Card",
      "BESCOM Bill",
      "Builder NOC",
      "Passport-size Photo",
    ],
    steps: [],
    notIncluded: [],
    oftenBundledWith: ["e-khata-transfer-bbmp", "property-tax-name-change"],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    longFormContent: emptyLongForm,
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
];

// ---------------------------------------------------------------------------
// Bundles — SafeBuy Shield / Seal / Assure / Plus
// ---------------------------------------------------------------------------

// Helper to compute savings vs. sum of SKU list prices (used for display only).
function computeSavings(slugs: string[], bundlePrice: number): number {
  const sum = slugs.reduce((total, slug) => {
    const svc = services.find((s) => s.slug === slug);
    return total + (svc?.price ?? 0);
  }, 0);
  return Math.max(0, sum - bundlePrice);
}

const shieldSlugs = ["title-verification"];
const sealSlugs = [
  "agreement-for-sale",
  "tds-filing-26qb",
  "sale-deed",
  "e-stamping",
];
const assureSlugs = [
  "e-khata-transfer-bbmp",
  "bescom-transfer",
  "property-tax-name-change",
];
// TODO(bundle): SafeBuy Plus full SKU list — the ~₹12,500 of extras beyond
// Shield + Seal + Assure that push the bundle to ₹75,000. For now the bundle
// surfaces the union of those three bundles (8 SKUs) as a working placeholder.
const plusSlugs = Array.from(
  new Set([...shieldSlugs, ...sealSlugs, ...assureSlugs]),
);

export const bundles: Bundle[] = [
  {
    slug: "safebuy-shield",
    name: "SafeBuy Shield",
    price: 12499,
    shortDescription:
      "Comprehensive review of property documents with a professional legal opinion.",
    longDescription:
      "For buyers who want a comprehensive review of property documents before committing. You receive a complete legal report signed and sealed by a reputed law firm — ready to use as your go / no-go decision for the purchase.",
    serviceSlugOrder: shieldSlugs,
    savingsAmount: computeSavings(shieldSlugs, 12499),
    razorpayLink: "https://rzp.io/rzp/safebuy-shield",
    features: [
      "Title Search Report",
      "Scrutiny of Property Documents",
      "Scrutiny of Government Approvals",
    ],
    metaTitle: "", // TODO(seo)
    metaDescription: "", // TODO(seo)
    primaryKeyword: "", // TODO(seo): e.g. "property title verification bangalore"
    secondaryKeywords: [],
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "safebuy-seal",
    name: "SafeBuy Seal",
    price: 19999,
    shortDescription:
      "End-to-end registration support — agreement, deed, TDS, and stamp duty handled for you.",
    longDescription:
      "For buyers ready to execute the transaction. We draft the sale agreement and sale deed, assist with TDS (Form 26QB), and handle BBMP stamp duty payment — so registration goes through without surprises.",
    serviceSlugOrder: sealSlugs,
    savingsAmount: computeSavings(sealSlugs, 19999),
    razorpayLink: "https://rzp.io/rzp/safebuy-seal",
    features: [
      "Drafting of Sale Agreement",
      "TDS Payment Assistance (Form 26QB)",
      "Drafting of Sale Deed",
      "BBMP Stamp Duty Payment Assistance",
    ],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "safebuy-assure",
    name: "SafeBuy Assure",
    price: 29999,
    shortDescription:
      "Post-registration formalities — Khata transfer, BESCOM, and tax name change.",
    longDescription:
      "For buyers who need assistance completing all post-registration formalities after purchase — ownership updates, utility transfers, and property tax record updates in the buyer's name.",
    serviceSlugOrder: assureSlugs,
    savingsAmount: computeSavings(assureSlugs, 29999),
    razorpayLink: "https://rzp.io/rzp/safebuy-assure",
    features: [
      "Khata Transfer (BBMP)",
      "BESCOM Transfer",
      "Property Tax Name Change",
    ],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
  {
    slug: "safebuy-plus",
    name: "SafeBuy Plus",
    price: 74999,
    badge: "Most Popular",
    shortDescription:
      "The only package a buyer should consider — legal diligence, registration, and post-registration handled end-to-end.",
    longDescription:
      "Our most comprehensive package. Covers legal due diligence, drafting and registration of the sale documents, stamp duty and TDS compliance, and every post-registration transfer — all with a dedicated coordinator from start to keys.",
    serviceSlugOrder: plusSlugs,
    savingsAmount: computeSavings(plusSlugs, 74999),
    razorpayLink: "https://rzp.io/rzp/safebuy-plus",
    features: [
      "Title Search Report",
      "Scrutiny of Property Documents",
      "Scrutiny of Government Approvals",
      "Drafting of Sale Agreement",
      "Drafting of Sale Deed",
      "TDS Payment Assistance (Form 26QB)",
      "BBMP Stamp Duty Payment Assistance",
      "Khata Transfer (BBMP)",
      "BESCOM Transfer",
      "Property Tax Name Change",
      // TODO(bundle): confirm additional inclusions beyond Shield+Seal+Assure
    ],
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    faqs: [],
    lastUpdated: LAST_UPDATED,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return services.filter((s) => s.categories.includes(category));
}

/** Display-friendly price string honoring `priceNote`. */
export function formatServicePrice(service: Service): string {
  if (service.priceNote) return service.priceNote;
  return `₹${service.price.toLocaleString("en-IN")}`;
}

export const categoryLabels: Record<ServiceCategory, string> = {
  "before-buying": "Before buying",
  "for-buying": "During purchase",
  "after-buying": "After buying",
  "for-owners": "For owners",
};

/** Display order for grouped category sections. */
export const categoryOrder: ServiceCategory[] = [
  "before-buying",
  "for-buying",
  "after-buying",
  "for-owners",
];
