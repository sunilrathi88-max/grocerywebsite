// Supabase Edge Function: apply-coupon
// Deploy with: supabase functions deploy apply-coupon

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization') ?? '' },
                },
            }
        );

        const { code, cartTotal } = await req.json();

        if (!code) throw new Error('Coupon code required');

        // Fetch Coupon
        const { data: coupon, error } = await supabaseClient
            .from('coupons')
            .select('*')
            .eq('code', code)
            .eq('is_active', true)
            .single();

        if (error || !coupon) {
            return new Response(JSON.stringify({ valid: false, message: 'Invalid or expired coupon' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Validate logic
        const now = new Date();
        const start = coupon.start_date ? new Date(coupon.start_date) : null;
        const end = coupon.end_date ? new Date(coupon.end_date) : null;

        if (start && now < start) throw new Error('Coupon not yet active');
        if (end && now > end) throw new Error('Coupon expired');
        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) throw new Error('Coupon usage limit reached');
        if (cartTotal < (coupon.min_order_value || 0)) {
            return new Response(JSON.stringify({
                valid: false,
                message: `Minimum order value of ₹${coupon.min_order_value} required`
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Calculate Discount
        let discount = 0;
        if (coupon.discount_type === 'percentage') {
            discount = (cartTotal * coupon.discount_value) / 100;
            if (coupon.max_discount_amount) {
                discount = Math.min(discount, coupon.max_discount_amount);
            }
        } else {
            discount = coupon.discount_value;
        }

        // Cap at total
        discount = Math.min(discount, cartTotal);

        return new Response(JSON.stringify({
            valid: true,
            code: coupon.code,
            discount,
            discountType: coupon.discount_type,
            message: 'Coupon applied successfully'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ valid: false, message: error.message || 'Validation failed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200, // Return 200 with valid: false for UI logic usually, or 400. Let's stick to 200 for "valid: false" results
        });
    }
});
