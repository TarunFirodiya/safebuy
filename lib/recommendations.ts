// Rule-based recommendation engine for the /start journey quiz.
//
// Maps a guest's plain-language answers (role, stage, goal, urgency) to a
// primary service/bundle plus a couple of alternates. Pricing and copy are
// always read from the authoritative catalogue in lib/services.ts — the quiz
// never carries prices itself.

import {
  bundles,
  categoryOrder,
  getBundleServices,
  getBundleBySlug,
  getServiceBySlug,
  isBundleBuyable,
  isServiceBuyable,
  type Bundle,
  type Service,
  type ServiceCategory,
} from "@/lib/services";

export type UserRole = "buyer" | "owner" | "seller" | "other";
export type JourneyStage = ServiceCategory;
export type Urgency = "standard" | "fast";

export interface QuizAnswers {
  role: UserRole;
  stage: JourneyStage;
  goal: string;
  urgency: Urgency;
}

export interface SkuRef {
  type: "service" | "bundle";
  slug: string;
}

export interface RecommendationItem extends SkuRef {
  name: string;
  price: number;
  priceNote?: string;
  deliveryTime: string;
  shortDescription: string;
  result: string;
  buyable: boolean;
}

export interface RecommendationResult {
  primary: RecommendationItem;
  alternates: RecommendationItem[];
}

// ── Quiz option metadata (drives the /start UI) ────────────────────────────

export interface QuizGoal {
  id: string;
  label: string;
  helper?: string;
}

export const roleOptions: { id: UserRole; label: string; helper: string }[] = [
  { id: "buyer", label: "Buying a property", helper: "Diligence, registration, transfers" },
  { id: "owner", label: "I already own it", helper: "Certificates, corrections, updates" },
  { id: "seller", label: "Selling a property", helper: "Deeds, certified copies, dues" },
  { id: "other", label: "Something else", helper: "Not sure yet — show me options" },
];

export const stageLabels: Record<JourneyStage, { label: string; helper: string }> = {
  "before-buying": { label: "Before I buy", helper: "Check the property is safe to buy" },
  "for-buying": { label: "Registering the purchase", helper: "Agreement, sale deed, stamp duty, TDS" },
  "after-buying": { label: "After registration", helper: "Move Khata, BESCOM and tax to my name" },
  "for-owners": { label: "Managing what I own", helper: "Certificates, corrections, ownership changes" },
};

export const goalsByStage: Record<JourneyStage, QuizGoal[]> = {
  "before-buying": [
    { id: "title-check", label: "Check if the title is clean", helper: "Legal opinion before you commit" },
    { id: "get-ec", label: "Get an Encumbrance Certificate", helper: "10 or 20-year ownership history" },
    { id: "secure-token", label: "Protect my token / advance", helper: "Hold funds safely in escrow" },
    { id: "full-diligence", label: "Full legal due diligence", helper: "The complete pre-purchase check" },
  ],
  "for-buying": [
    { id: "register-sale", label: "Register the sale end-to-end", helper: "Agreement, deed, stamp duty and TDS" },
    { id: "draft-agreement", label: "Draft a sale agreement", helper: "Lock the terms before registration" },
    { id: "review-docs", label: "Review documents before I sign", helper: "Lawyer checks your agreement / deed" },
    { id: "pay-tds", label: "File TDS (Form 26QB)", helper: "Mandatory tax on the purchase" },
    { id: "stamp-duty", label: "Pay stamp duty / e-stamping", helper: "Valid stamp papers, done online" },
  ],
  "after-buying": [
    { id: "transfer-khata", label: "Transfer Khata to my name", helper: "Update BBMP ownership records" },
    { id: "transfer-bescom", label: "Transfer the electricity (BESCOM)", helper: "Connection in your name" },
    { id: "update-tax-name", label: "Change the property tax name", helper: "Municipal records in your name" },
    { id: "all-transfers", label: "Do all post-registration transfers", helper: "Khata, BESCOM and tax together" },
  ],
  "for-owners": [
    { id: "get-ec", label: "Get an Encumbrance Certificate", helper: "10 or 20-year ownership history" },
    { id: "khata-update", label: "Fix or update my Khata", helper: "Corrections and manual-to-e-Khata" },
    { id: "fix-records", label: "Correct an error in my documents", helper: "Rectification and record fixes" },
    { id: "transfer-ownership", label: "Transfer ownership to family", helper: "Gift, partition or power of attorney" },
  ],
};

// ── Goal → SKU mapping ─────────────────────────────────────────────────────

interface GoalMapping {
  primary: SkuRef;
  alternates: SkuRef[];
}

const svc = (slug: string): SkuRef => ({ type: "service", slug });
const bdl = (slug: string): SkuRef => ({ type: "bundle", slug });

const GOAL_MAP: Record<string, GoalMapping> = {
  // Before buying
  "before-buying:title-check": {
    primary: bdl("safebuy-shield"),
    alternates: [svc("title-verification"), svc("online-consultation")],
  },
  "before-buying:get-ec": {
    primary: svc("encumbrance-certificate"),
    alternates: [svc("instant-ec"), svc("title-verification")],
  },
  "before-buying:secure-token": {
    primary: svc("escrow"),
    alternates: [bdl("safebuy-shield"), svc("online-consultation")],
  },
  "before-buying:full-diligence": {
    primary: bdl("safebuy-shield"),
    alternates: [svc("title-verification"), svc("sale-agreement-review")],
  },

  // For buying / registration
  "for-buying:register-sale": {
    primary: bdl("safebuy-seal"),
    alternates: [svc("agreement-for-sale"), svc("sale-deed")],
  },
  "for-buying:draft-agreement": {
    primary: svc("agreement-for-sale"),
    alternates: [svc("sale-agreement-review"), bdl("safebuy-seal")],
  },
  "for-buying:review-docs": {
    primary: svc("sale-agreement-review"),
    alternates: [svc("sale-deed-review"), svc("online-consultation")],
  },
  "for-buying:pay-tds": {
    primary: svc("tds-filing-26qb"),
    alternates: [svc("tan-registration"), svc("online-consultation")],
  },
  "for-buying:stamp-duty": {
    primary: svc("e-stamping"),
    alternates: [svc("sale-deed"), bdl("safebuy-seal")],
  },

  // After buying / transfers
  "after-buying:transfer-khata": {
    primary: svc("e-khata-transfer-bbmp"),
    alternates: [bdl("safebuy-assure"), svc("property-tax-name-change")],
  },
  "after-buying:transfer-bescom": {
    primary: svc("bescom-transfer"),
    alternates: [svc("e-khata-transfer-bbmp"), svc("property-tax-name-change")],
  },
  "after-buying:update-tax-name": {
    primary: svc("property-tax-name-change"),
    alternates: [svc("e-khata-transfer-bbmp"), svc("bescom-transfer")],
  },
  "after-buying:all-transfers": {
    primary: bdl("safebuy-assure"),
    alternates: [svc("e-khata-transfer-bbmp"), svc("bescom-transfer")],
  },

  // For owners
  "for-owners:get-ec": {
    primary: svc("encumbrance-certificate"),
    alternates: [svc("instant-ec"), svc("e-khata-ec-update")],
  },
  "for-owners:khata-update": {
    primary: svc("e-khata-correction"),
    alternates: [svc("manual-to-e-khata-conversion"), svc("e-khata-ec-update")],
  },
  "for-owners:fix-records": {
    primary: svc("rectification-deed"),
    alternates: [svc("e-khata-correction"), svc("ward-correction-property-tax")],
  },
  "for-owners:transfer-ownership": {
    primary: svc("gift-deed"),
    alternates: [svc("release-partition-deed"), svc("power-of-attorney")],
  },
};

// Sensible fallback per stage when a goal has no explicit mapping.
const STAGE_FALLBACK: Record<JourneyStage, GoalMapping> = {
  "before-buying": GOAL_MAP["before-buying:full-diligence"],
  "for-buying": GOAL_MAP["for-buying:register-sale"],
  "after-buying": GOAL_MAP["after-buying:all-transfers"],
  "for-owners": GOAL_MAP["for-owners:get-ec"],
};

// ── Item builders ──────────────────────────────────────────────────────────

function parseMaxDays(deliveryTime: string): number {
  const matches = deliveryTime.match(/\d+/g);
  if (!matches) return 0;
  return Math.max(...matches.map(Number));
}

function bundleDeliveryTime(bundle: Bundle): string {
  const max = getBundleServices(bundle).reduce(
    (acc, s) => Math.max(acc, parseMaxDays(s.deliveryTime)),
    0,
  );
  return max > 0 ? `~${max} days` : "Multiple steps";
}

function serviceToItem(service: Service): RecommendationItem {
  return {
    type: "service",
    slug: service.slug,
    name: service.name,
    price: service.price,
    priceNote: service.priceNote,
    deliveryTime: service.deliveryTime,
    shortDescription: service.shortDescription,
    result: service.result,
    buyable: isServiceBuyable(service),
  };
}

function bundleToItem(bundle: Bundle): RecommendationItem {
  return {
    type: "bundle",
    slug: bundle.slug,
    name: bundle.name,
    price: bundle.price,
    deliveryTime: bundleDeliveryTime(bundle),
    shortDescription: bundle.shortDescription,
    result: bundle.longDescription,
    buyable: isBundleBuyable(bundle),
  };
}

function refToItem(ref: SkuRef): RecommendationItem | null {
  if (ref.type === "bundle") {
    const bundle = getBundleBySlug(ref.slug);
    return bundle ? bundleToItem(bundle) : null;
  }
  const service = getServiceBySlug(ref.slug);
  return service ? serviceToItem(service) : null;
}

/**
 * Resolves quiz answers to a primary recommendation plus alternates. Falls
 * back to a stage-level default if the (stage, goal) pair is unmapped, and
 * promotes the Instant EC SKU when the user asked for speed.
 */
export function getRecommendations(answers: QuizAnswers): RecommendationResult {
  const mapping =
    GOAL_MAP[`${answers.stage}:${answers.goal}`] ??
    STAGE_FALLBACK[answers.stage];

  let refs: SkuRef[] = [mapping.primary, ...mapping.alternates];

  // Urgency: if the standard EC is in the mix, surface Instant EC first.
  if (answers.urgency === "fast") {
    const hasEc = refs.some((r) => r.slug === "encumbrance-certificate");
    const hasInstant = refs.some((r) => r.slug === "instant-ec");
    if (hasEc && !hasInstant) {
      refs = [svc("instant-ec"), ...refs];
    } else if (hasInstant) {
      refs = [svc("instant-ec"), ...refs.filter((r) => r.slug !== "instant-ec")];
    }
  }

  // De-dupe by slug, resolve to catalogue items.
  const seen = new Set<string>();
  const items: RecommendationItem[] = [];
  for (const ref of refs) {
    if (seen.has(ref.slug)) continue;
    const item = refToItem(ref);
    if (!item) continue;
    seen.add(ref.slug);
    items.push(item);
  }

  return {
    primary: items[0],
    alternates: items.slice(1, 3),
  };
}

/** Re-export for the quiz UI so it can render stages in the canonical order. */
export const journeyStages = categoryOrder;
