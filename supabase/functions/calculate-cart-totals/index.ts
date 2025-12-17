// Supabase Edge Function: calculate-cart-totals
// Deploy with: supabase functions deploy calculate-cart-totals

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

        const { items, couponCode, userLocation } = await req.json();

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid items array');
        }

        // 1. Fetch products & variants from DB to get real prices
        // Optimized: Fetch all related product/variant data in one go or multiple if needed
        // For simplicity, fetching all products needed. Real-world: use 'in' query.

        // Extract IDs
        const productIds = items.map(i => i.productId);

        // Fetch products (and variants)
        const { data: dbProducts, error: prodError } = await supabaseClient
            .from('products')
            .select('id, name, variants(id, price, sale_price, stock, name)')
            .in('id', productIds);

        if (prodError) throw prodError;
        if (!dbProducts) throw new Error('Failed to fetch products');

        let subtotal = 0;
        const lineItems = [];
        const messages = [];

        // 2. Calculate Subtotal
        for (const item of items) {
            const product = dbProducts.find(p => p.id === item.productId);
            if (!product) {
                messages.push(`Product ID ${item.productId} not found/unavailable.`);
                continue;
            }

            const variant = product.variants.find((v: any) => v.id === item.variantId);
            if (!variant) {
                messages.push(`Variant ID ${item.variantId} not found.`);
                continue;
            }

            // Check stock (Soft check, validation function does hard check)
            if (variant.stock < item.quantity) {
                messages.push(`Insufficient stock for ${product.name} (${variant.name}). Available: ${variant.stock}`);
            }

            const price = variant.sale_price || variant.price;
            const total = price * item.quantity;
            subtotal += total;

            lineItems.push({
                productId: item.productId,
                variantId: item.variantId,
                name: product.name,
                variantName: variant.name,
                unitPrice: price,
                quantity: item.quantity,
                total
            });
        }

        // 3. Apply Coupon
        let discount = 0;
        let couponDetails = null;

        if (couponCode) {
            // Validate coupon
            const { data: coupon, error: couponError } = await supabaseClient
                .from('coupons')
                .select('*')
                .eq('code', couponCode)
                .eq('is_active', true)
                .single();

            if (coupon) {
                const now = new Date();
                const start = coupon.start_date ? new Date(coupon.start_date) : null;
                const end = coupon.end_date ? new Date(coupon.end_date) : null;

                let valid = true;
                if (start && now < start) valid = false;
                if (end && now > end) valid = false;
                if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) valid = false;
                if (subtotal < (coupon.min_order_value || 0)) valid = false;

                if (valid) {
                    if (coupon.discount_type === 'percentage') {
                        discount = (subtotal * coupon.discount_value) / 100;
                        if (coupon.max_discount_amount) {
                            discount = Math.min(discount, coupon.max_discount_amount);
                        }
                    } else {
                        discount = coupon.discount_value;
                    }

                    // Ensure discount doesn't exceed subtotal
                    discount = Math.min(discount, subtotal);

                    couponDetails = {
                        code: coupon.code,
                        discount,
                        type: coupon.discount_type
                    };
                } else {
                    messages.push(`Coupon '${couponCode}' is not applicable.`);
                }
            } else {
                messages.push(`Coupon '${couponCode}' invalid or expired.`);
            }
        }

        // 4. Calculate Final
        // 4. Calculate Final
        const tax = 0; // Or calculate tax logic here

        // Calculate Shipping
        let shipping = 50; // Default base
        let freeShippingLimit = 1000; // Default limit

        if (userLocation?.pincode) {
            const { data: pinData } = await supabaseClient
                .from('serviceable_pincodes')
                .select('shipping_cost, free_shipping_threshold')
                .eq('pincode', userLocation.pincode)
                .single();

            if (pinData) {
                shipping = pinData.shipping_cost || 50;
                freeShippingLimit = pinData.free_shipping_threshold || 1000;
            } else {
                // Unknown pincode - technically not serviceable, 
                // but for cart calculation we might fallback to standard or specific "high" rate
                // Or we could flag it. For now, using default.
                messages.push(`Pincode ${userLocation.pincode} not found in specific rules. using standard rates.`);
            }
        }

        if (subtotal >= freeShippingLimit) {
            shipping = 0;
        }

        const finalTotal = subtotal + tax + shipping - discount;

        return new Response(
            JSON.stringify({
                subtotal,
                discount,
                tax,
                shipping,
                finalTotal,
                lineItems,
                coupon: couponDetails,
                messages
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
