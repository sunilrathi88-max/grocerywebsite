import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { order_amount, customer_id, customer_phone, customer_name, customer_email } = await req.json()

        // Get Cashfree credentials from Supabase secrets
        const APP_ID = Deno.env.get('CASHFREE_APP_ID')
        const SECRET_KEY = Deno.env.get('CASHFREE_SECRET_KEY')
        const IS_PRODUCTION = Deno.env.get('CASHFREE_ENV') === 'production'

        if (!APP_ID || !SECRET_KEY) {
            throw new Error('Cashfree credentials not found')
        }

        const BASE_URL = IS_PRODUCTION
            ? 'https://api.cashfree.com/pg/orders'
            : 'https://sandbox.cashfree.com/pg/orders'

        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        const payload = {
            order_id: orderId,
            order_amount: order_amount,
            order_currency: 'INR',
            customer_details: {
                customer_id: customer_id || 'guest',
                customer_phone: customer_phone || '9999999999',
                customer_name: customer_name || 'Guest',
                customer_email: customer_email || 'guest@example.com'
            },
            order_meta: {
                return_url: `${req.headers.get('origin')}/#/checkout?order_id=${orderId}`
            }
        }

        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': APP_ID,
                'x-client-secret': SECRET_KEY,
                'x-api-version': '2022-09-01'
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Cashfree Error:', data)
            throw new Error(data.message || 'Failed to create Cashfree order')
        }

        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
