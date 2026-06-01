// POST /api/applications
//
// Creates a guest-first onboarding application for a chosen SKU and seeds its
// document checklist from the catalogue. No account or contact details are
// required yet (guest-first) — those are collected later in the wizard.
//
// Returns the application id (used for wizard mutations) and the access token
// (used for the /track status page). The id is an unguessable UUID, so it
// doubles as the capability to edit the draft in v1.

import { NextRequest, NextResponse } from "next/server";
import { resolveApplicationSku } from "@/lib/applications";
import {
  addApplicationEvent,
  createApplication,
  getDb,
  seedApplicationDocuments,
} from "@/lib/db";

interface CreateApplicationRequest {
  type?: string;
  slug?: string;
  journey?: {
    role?: string;
    stage?: string;
    goal?: string;
    urgency?: string;
  };
}

const JOURNEY_KEYS = ["role", "stage", "goal", "urgency"] as const;

function sanitizeJourney(
  journey: CreateApplicationRequest["journey"],
): string | null {
  if (!journey || typeof journey !== "object") return null;
  const out: Record<string, string> = {};
  for (const key of JOURNEY_KEYS) {
    const value = journey[key];
    if (typeof value === "string" && value.length > 0 && value.length <= 64) {
      out[key] = value;
    }
  }
  return Object.keys(out).length > 0 ? JSON.stringify(out) : null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: CreateApplicationRequest;
  try {
    body = (await req.json()) as CreateApplicationRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const type = body.type;
  const slug = body.slug;
  if (
    (type !== "service" && type !== "bundle") ||
    typeof slug !== "string" ||
    slug.length === 0
  ) {
    return NextResponse.json(
      { error: "A valid service or bundle is required." },
      { status: 400 },
    );
  }

  const sku = resolveApplicationSku(type, slug);
  if (!sku) {
    return NextResponse.json({ error: "Unknown SKU." }, { status: 400 });
  }

  const db = await getDb();

  let application;
  try {
    application = await createApplication(db, {
      skuType: sku.type,
      skuSlug: sku.slug,
      skuName: sku.name,
      journeyJson: sanitizeJourney(body.journey),
      status: "draft",
    });

    if (sku.requirements.length > 0) {
      await seedApplicationDocuments(db, application.id, sku.requirements);
    }

    await addApplicationEvent(db, {
      applicationId: application.id,
      type: "status_change",
      message: `Application started for ${sku.name}.`,
    });
  } catch (e) {
    console.error("[applications] create failed", e);
    return NextResponse.json(
      { error: "Could not start your application. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      id: application.id,
      accessToken: application.access_token,
    },
    { status: 201 },
  );
}
