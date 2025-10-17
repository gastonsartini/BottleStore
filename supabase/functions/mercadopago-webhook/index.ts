import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");
    const webhookSecret = Deno.env.get("MERCADOPAGO_WEBHOOK_SECRET");

    if (webhookSecret && xSignature && xRequestId) {
      const parts = xSignature.split(",");
      let ts = "";
      let hash = "";

      for (const part of parts) {
        const [key, value] = part.split("=");
        if (key && value) {
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();
          if (trimmedKey === "ts") {
            ts = trimmedValue;
          } else if (trimmedKey === "v1") {
            hash = trimmedValue;
          }
        }
      }

      const dataId = body.data?.id || "";
      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(webhookSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(manifest)
      );

      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

      if (hashHex !== hash) {
        console.error("Invalid signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          {
            status: 401,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.log("Signature validated successfully");
    }

    console.log("Webhook received:", body);

    if (body.type === "payment") {
      const paymentId = body.data.id;
      const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const payment = await paymentResponse.json();
      console.log("Payment data:", payment);

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      if (payment.status === "approved") {
        await supabase
          .from("orders")
          .update({
            status: "confirmed",
            payment_id: paymentId.toString(),
            payment_status: "paid",
          })
          .eq("id", payment.external_reference);
      } else if (payment.status === "rejected") {
        await supabase
          .from("orders")
          .update({
            status: "cancelled",
            payment_status: "failed",
          })
          .eq("id", payment.external_reference);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});