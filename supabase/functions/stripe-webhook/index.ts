import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

// ─── Helpers ─────────────────────────────────────────────────────

/** Upsert credits for a user — adds quantity to existing or creates new row */
async function upsertCredits(
  userId: string,
  creditType: string,
  quantity: number,
): Promise<void> {
  // Try update first (increment), then insert if no row exists
  const { data: existing } = await supabaseAdmin
    .from("credits")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("credit_type", creditType)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("credits")
      .update({
        quantity: existing.quantity + quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin.from("credits").insert({
      user_id: userId,
      credit_type: creditType,
      quantity,
    });
  }
}

/** Record a ledger entry — idempotent via stripe_event_id */
async function recordLedgerEntry(
  userId: string,
  delta: number,
  reason: string,
  stripeEventId: string,
  auditJobId?: string,
): Promise<void> {
  // Idempotency: skip if this stripe event was already processed
  const { data: existing } = await supabaseAdmin
    .from("credit_ledger")
    .select("id")
    .eq("stripe_event_id", stripeEventId)
    .maybeSingle();

  if (existing) {
    console.log(`Duplicate stripe event ${stripeEventId}, skipping.`);
    return;
  }

  await supabaseAdmin.from("credit_ledger").insert({
    user_id: userId,
    delta,
    reason,
    stripe_event_id: stripeEventId,
    audit_job_id: auditJobId || null,
  });
}

/** Record a payment row */
async function recordPayment(
  userId: string,
  session: Stripe.Checkout.Session,
): Promise<void> {
  await supabaseAdmin.from("payments").insert({
    user_id: userId,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || null,
    stripe_event_id: session.id, // we use checkout.session.id as the idempotency key
    amount_total: session.amount_total || 0,
    currency: session.currency || "gbp",
    status: session.payment_status,
  });
}

// ─── Server ──────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      WEBHOOK_SECRET,
    );

    console.log(`Stripe webhook received: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status !== "paid") {
          console.log(`Session ${session.id} not paid, skipping.`);
          break;
        }

        const userId = session.metadata?.userId;
        const creditsStr = session.metadata?.credits || "0";
        const tier = session.metadata?.tier || "unknown";
        const credits = parseInt(creditsStr, 10);

        if (!userId || credits <= 0) {
          console.error(`Missing userId or invalid credits in session ${session.id}`);
          break;
        }

        // 1. Record payment
        await recordPayment(userId, session);

        // 2. Record ledger entry (idempotent)
        await recordLedgerEntry(
          userId,
          credits,
          `stripe_purchase:${tier}`,
          session.id,
        );

        // 3. Upsert credits
        await upsertCredits(userId, "paid_report", credits);

        console.log(
          `Credits granted: user=${userId}, tier=${tier}, credits=${credits}`,
        );
        break;
      }

      case "checkout.session.expired": {
        console.log(`Checkout session expired: ${event.data.object.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("stripe-webhook error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
