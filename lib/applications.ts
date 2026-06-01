// Domain helpers for the onboarding application object.
//
// Bridges the authoritative catalogue (lib/services.ts) and the persistence
// layer (lib/db.ts). Unlike lib/checkout.ts#resolveSku, this resolver does NOT
// gate on buyability — high-ticket / scope-dependent SKUs still get a full
// application; they just route to an advisor call instead of Razorpay at the end.

import {
  getBundleBySlug,
  getBundleServices,
  getServiceBySlug,
  isBundleBuyable,
  isServiceBuyable,
  type Bundle,
  type Service,
} from "@/lib/services";

export interface RequirementItem {
  /** Stable slug used as the document checklist key. */
  key: string;
  label: string;
}

export interface ApplicationSku {
  type: "service" | "bundle";
  slug: string;
  name: string;
  price: number;
  priceNote?: string;
  deliveryTime: string;
  shortDescription: string;
  /** What the customer walks away with. */
  result: string;
  /** Whether checkout is available online (vs. advisor-confirmed scope). */
  buyable: boolean;
  /** Documents the customer must provide, de-duplicated for bundles. */
  requirements: RequirementItem[];
  /** Customer-visible milestones (feeds the tracker); may be empty in v1. */
  steps: string[];
}

function slugifyRequirement(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function toRequirementItems(labels: string[]): RequirementItem[] {
  const seen = new Set<string>();
  const items: RequirementItem[] = [];
  for (const label of labels) {
    const trimmed = label.trim();
    if (!trimmed) continue;
    const key = slugifyRequirement(trimmed) || `req-${items.length + 1}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ key, label: trimmed });
  }
  return items;
}

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

function serviceToSku(service: Service): ApplicationSku {
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
    requirements: toRequirementItems(service.requirements),
    steps: service.steps,
  };
}

function bundleToSku(bundle: Bundle): ApplicationSku {
  const members = getBundleServices(bundle);
  const requirements = toRequirementItems(
    members.flatMap((s) => s.requirements),
  );
  return {
    type: "bundle",
    slug: bundle.slug,
    name: bundle.name,
    price: bundle.price,
    deliveryTime: bundleDeliveryTime(bundle),
    shortDescription: bundle.shortDescription,
    result: bundle.longDescription,
    buyable: isBundleBuyable(bundle),
    requirements,
    steps: members.map((s) => s.name),
  };
}

/**
 * Resolves an application's `{type, slug}` to catalogue-backed metadata.
 * Returns null when the SKU no longer exists (e.g. it was retired after an
 * application was created).
 */
export function resolveApplicationSku(
  type: string,
  slug: string,
): ApplicationSku | null {
  if (type === "bundle") {
    const bundle = getBundleBySlug(slug);
    return bundle ? bundleToSku(bundle) : null;
  }
  if (type === "service") {
    const service = getServiceBySlug(slug);
    return service ? serviceToSku(service) : null;
  }
  return null;
}
