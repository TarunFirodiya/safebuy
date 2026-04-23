// POST /api/razorpay/verify-payment
//
// Called from the client immediately after Razorpay's `handler` callback
// fires. We re-verify the HMAC signature server-side, optimistically flip the
// order to `paid`, and return a redirect target to the success page. The
// authoritative fulfillment pipeline still lives in the webhook — this
// endpoint exists purely so the user-facing redirect is snappy and so we can
// reject tampered payloads before the browser sees /checkout/success.

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, getOrderById, markOrderPaid } from "@/lib/db";
import { verifyCheckoutSignature } from "@/lib/razorpay";

interface VerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { env } = await getCloudflareContext({ async: true });

  if (!env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Payments are temporarily unavailable." },
      { status: 503 },
    );
  }

  let body: VerifyRequest;
  try {
    body = (await req.json()) as VerifyRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (
    typeof body.razorpayOrderId !== "string" ||
    typeof body.razorpayPaymentId !== "string" ||
    typeof body.razorpaySignature !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing payment fields." },
      { status: 400 },
    );
  }

  const ok = await verifyCheckoutSignature(env.RAZORPAY_KEY_SECRET, {
    razorpayOrderId: body.razorpayOrderId,
    razorpayPaymentId: body.razorpayPaymentId,
    razorpaySignature: body.razorpaySignature,
  });

  if (!ok) {
    console.warn(
      "[verify-payment] signature mismatch for",
      body.razorpayOrderId,
    );
    return NextResponse.json(
      { error: "Payment signature could not be verified." },
      { status: 400 },
    );
  }

  const db = await getDb();
  const order = await getOrderById(db, body.razorpayOrderId);
  if (!order) {
    // We verified the signature but never saw the order draft. Rare, but
    // possible if create-order's D1 write failed. The webhook will reconcile.
    console.warn(
      "[verify-payment] unknown order after signature match",
      body.razorpayOrderId,
    );
    return NextResponse.json({ ok: true, redirect: "/checkout/success" });
  }

  await markOrderPaid(db, order.id, Date.now());

  return NextResponse.json({
    ok: true,
    redirect: `/checkout/success?order=${encodeURIComponent(order.id)}`,
    order: {
      id: order.id,
      skuName: order.sku_name,
      amountPaise: order.amount_paise,
      receipt: order.receipt,
    },
  });
}
