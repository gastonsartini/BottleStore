import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    console.log('=== START ORDER PROCESSING ===');
    const orderData = await request.json();
    console.log('Order data received:', JSON.stringify(orderData, null, 2));

    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
      return NextResponse.json(
        { error: 'Server configuration error', details: 'Supabase URL not configured' },
        { status: 500 }
      );
    }
    
    if (!supabaseServiceKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error', details: 'Supabase service key not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    console.log('Creating order in database...');

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating order:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to create order', details: error },
        { status: 500 }
      );
    }

    console.log('✅ Order created successfully:', data);

    if (orderData.payment_method === 'mercadopago') {
      console.log('Processing MercadoPago payment...');

      const mercadopagoToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!mercadopagoToken) {
        console.error('❌ MERCADOPAGO_ACCESS_TOKEN is not set');
        return NextResponse.json(
          { error: 'Payment configuration error', details: 'MercadoPago token not configured' },
          { status: 500 }
        );
      }

      // Prepare items with currency
      const mpItems = orderData.items.map((item: any) => ({
        id: item.product_id,
        title: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "ARS",
      }));

      // Add shipping as a separate item if cost > 0
      if (orderData.shipping_cost > 0) {
        mpItems.push({
          id: "shipping",
          title: "Envío",
          quantity: 1,
          unit_price: orderData.shipping_cost,
          currency_id: "ARS",
        });
      }

      console.log('MercadoPago items:', JSON.stringify(mpItems, null, 2));

      // Parse phone number (expecting format like "1123456789")
      const phoneNumber = orderData.customer_phone.replace(/\D/g, '');
      const areaCode = phoneNumber.substring(0, 2) || '11';
      const phoneWithoutArea = phoneNumber.substring(2) || phoneNumber;

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bottlestore.netlify.app';

      const preference = {
        items: mpItems,
        payer: {
          name: orderData.customer_name,
          surname: orderData.customer_name.split(' ').slice(1).join(' ') || orderData.customer_name,
          email: orderData.customer_email,
          phone: {
            area_code: areaCode,
            number: phoneWithoutArea,
          },
          identification: {
            type: 'DNI',
            number: orderData.customer_identification,
          },
          address: {
            street_name: orderData.shipping_address.street,
            street_number: 1,
            zip_code: orderData.shipping_address.postalCode,
          },
        },
        back_urls: {
          success: `${siteUrl}/orden/${data.id}`,
          failure: `${siteUrl}/checkout?error=payment_failed`,
          pending: `${siteUrl}/orden/${data.id}`,
        },
        auto_return: "approved",
        external_reference: data.id,
        notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
      };

      console.log('Preference payload:', JSON.stringify(preference, null, 2));

      const preferenceResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mercadopagoToken}`,
        },
        body: JSON.stringify(preference),
      });

      console.log('MercadoPago API response status:', preferenceResponse.status);

      const responseText = await preferenceResponse.text();
      console.log('MercadoPago API response body:', responseText);

      if (!preferenceResponse.ok) {
        console.error('❌ Error creating MercadoPago preference');
        return NextResponse.json(
          { error: 'Failed to create payment preference', details: responseText },
          { status: 500 }
        );
      }

      const responseData = JSON.parse(responseText);
      console.log('✅ MercadoPago preference created:', responseData);

      return NextResponse.json({
        orderId: data.id,
        orderNumber: data.order_number,
        paymentUrl: responseData.init_point,
      });
    }

    console.log('=== ORDER PROCESSING COMPLETE ===');
    return NextResponse.json({ orderId: data.id, orderNumber: data.order_number });
  } catch (error) {
    console.error('❌ Error processing order:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to process order', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
