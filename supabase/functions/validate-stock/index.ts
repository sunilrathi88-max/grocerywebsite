// Supabase Edge Function: validate-stock
// Deploy with: supabase functions deploy validate-stock

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

        const { items } = await req.json(); // [{ productId, variantId, quantity }]

        if (!items || !Array.isArray(items)) throw new Error('Invalid items');

        const productIds = items.map(i => i.productId);

        // Fetch current stock
        const { data: products, error } = await supabaseClient
            .from('products')
            .select('id, name, variants(id, stock, name)')
            .in('id', productIds);

        if (error) throw error;

        const issues = [];

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                issues.push({
                    productId: item.productId,
                    variantId: item.variantId,
                    error: 'Product not found'
                });
                continue;
            }

            const variant = product.variants.find((v: any) => v.id === item.variantId);
            if (!variant) {
                issues.push({
                    productId: item.productId,
                    variantId: item.variantId,
                    error: 'Variant not found'
                });
                continue;
            }

            if (variant.stock < item.quantity) {
                issues.push({
                    productId: item.productId,
                    variantId: item.variantId,
                    productName: product.name,
                    variantName: variant.name,
                    requested: item.quantity,
                    available: variant.stock,
                    error: 'Insufficient stock'
                });
            }
        }

        return new Response(JSON.stringify({
            valid: issues.length === 0,
            issues
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
