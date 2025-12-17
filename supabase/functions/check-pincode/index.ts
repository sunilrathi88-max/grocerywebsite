import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { pincode } = await req.json();

    if (!pincode) {
      return new Response(JSON.stringify({ error: 'Pincode is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Query database
    const { data, error } = await supabase
      .from('serviceable_pincodes')
      .select('*')
      .eq('pincode', pincode)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "Result contains 0 rows"
      throw error;
    }

    if (!data) {
      return new Response(
        JSON.stringify({
          serviceable: false,
          message: 'Sorry, we do not deliver to this pincode yet.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        serviceable: true,
        message: `Delivery available to ${data.city}, ${data.state}`,
        details: {
          city: data.city,
          state: data.state,
          codAvailable: data.cod_available,
          estimatedDeliveryDays: data.estimated_delivery_days,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
