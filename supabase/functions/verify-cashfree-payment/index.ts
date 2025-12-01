import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();

    if (!order_id) {
      throw new Error('Order ID is required');
    }

    const APP_ID = Deno.env.get('CASHFREE_APP_ID');
    const SECRET_KEY = Deno.env.get('CASHFREE_SECRET_KEY');
    const IS_PRODUCTION = Deno.env.get('CASHFREE_ENV') === 'production';

    if (!APP_ID || !SECRET_KEY) {
      throw new Error('Cashfree credentials not found');
    }

    const BASE_URL = IS_PRODUCTION
      ? `https://api.cashfree.com/pg/orders/${order_id}`
      : `https://sandbox.cashfree.com/pg/orders/${order_id}`;

    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': APP_ID,
        'x-client-secret': SECRET_KEY,
        'x-api-version': '2022-09-01',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree Verification Error:', data);
      throw new Error(data.message || 'Failed to verify Cashfree order');
    }

    // Check if order status is PAID
    const isPaid = data.order_status === 'PAID';

    return new Response(
      JSON.stringify({
        status: isPaid ? 'SUCCESS' : data.order_status,
        data: data,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
