// PATCH /api/applications/[id]
//
// Partial updates for the onboarding wizard. Accepts a `property` object
// (Step B) and/or a `contact` object (Step C, guest identity). Saving contact
// attaches the customer and advances the application to `documents_pending`.
//
// The application id is the capability in v1 (unguessable UUID) — there is no
// separate auth. PII is only ever written, never returned here.

import { NextRequest, NextResponse } from "next/server";
import {
  CheckoutValidationError,
  validateCustomerInput,
} from "@/lib/checkout";
import {
  addApplicationEvent,
  attachCustomerToApplication,
  getApplicationById,
  getDb,
  setApplicationStatus,
  updateApplicationProperty,
  upsertCustomer,
  type ApplicationStatus,
} from "@/lib/db";

interface PropertyInput {
  propertyType?: string;
  address?: string;
  ward?: string;
  buyerName?: string;
  sellerName?: string;
  notes?: string;
}

interface PatchRequest {
  property?: PropertyInput;
  contact?: { name?: string; email?: string; phone?: string };
}

function sanitizeProperty(input: PropertyInput): string {
  const clean = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";
  const property = {
    propertyType: clean(input.propertyType, 40),
    address: clean(input.address, 400),
    ward: clean(input.ward, 120),
    buyerName: clean(input.buyerName, 120),
    sellerName: clean(input.sellerName, 120),
    notes: clean(input.notes, 1000),
  };
  return JSON.stringify(property);
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/applications/[id]">,
): Promise<NextResponse> {
  const { id } = await ctx.params;

  let body: PatchRequest;
  try {
    body = (await req.json()) as PatchRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const db = await getDb();
  const application = await getApplicationById(db, id);
  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  let nextStatus: ApplicationStatus = application.status;

  try {
    if (body.property && typeof body.property === "object") {
      await updateApplicationProperty(db, id, sanitizeProperty(body.property));
      await addApplicationEvent(db, {
        applicationId: id,
        type: "note",
        message: "Property details saved.",
      });
    }

    if (body.contact && typeof body.contact === "object") {
      let customer;
      try {
        customer = validateCustomerInput(body.contact);
      } catch (e) {
        const message =
          e instanceof CheckoutValidationError
            ? e.message
            : "Invalid contact details.";
        return NextResponse.json({ error: message }, { status: 400 });
      }

      const customerRow = await upsertCustomer(db, customer);
      await attachCustomerToApplication(db, id, customerRow.id);

      // First time we capture contact, move the draft into the documents stage.
      if (application.status === "draft") {
        nextStatus = "documents_pending";
        await setApplicationStatus(db, id, nextStatus);
      }
      await addApplicationEvent(db, {
        applicationId: id,
        type: "note",
        message: "Contact details added.",
      });
    }
  } catch (e) {
    console.error("[applications] patch failed", e);
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, status: nextStatus }, { status: 200 });
}
