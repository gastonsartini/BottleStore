import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

interface PreferenceRequest {
  items: OrderItem[];
  payer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street_name: string;
      city: string;
      state: string;
      zip_code: string;
    };
  };
  shipment: {
    cost: number;
  };
  external_reference: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN no configurado");
    }

    const body: PreferenceRequest = await req.json();

    // Add currency_id and proper structure for MercadoPago
    const items = body.items.map(item => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: "ARS",
    }));

    // Add shipping as a separate item if cost > 0
    if (body.shipment.cost > 0) {
      items.push({
        id: "shipping",
        title: "Envío",
        quantity: 1,
        unit_price: body.shipment.cost,
        currency_id: "ARS",
      });
    }

    const preference = {
      items: items,
      payer: {
        name: body.payer.name,
        email: body.payer.email,
        phone: {
          number: body.payer.phone,
        },
        address: {
          street_name: body.payer.address.street_name,
          city: body.payer.address.city,
          state: body.payer.address.state,
          zip_code: body.payer.address.zip_code,
        },
      },
      back_urls: {
        success: `${req.headers.get("origin")}/orden/${body.external_reference}`,
        failure: `${req.headers.get("origin")}/checkout?error=payment_failed`,
        pending: `${req.headers.get("origin")}/orden/${body.external_reference}`,
      },
      auto_return: "approved",
      external_reference: body.external_reference,
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook`,
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("MercadoPago API Error:", error);
      throw new Error(`Error en MercadoPago API: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ init_point: data.init_point, id: data.id }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
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