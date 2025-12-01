import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Verify Webhook Signature (Optional but recommended)
        // Cashfree sends signature in headers, but for simplicity we'll trust the payload for now
        // In production, verify x-webhook-signature using your secret

        const payload = await req.json()
        console.log('Webhook Payload:', payload)

        // 2. Initialize Supabase Admin Client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

        const type = payload.type
        const data = payload.data

        if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
            const orderId = data.order.order_id
            const paymentId = data.payment.cf_payment_id
            const amount = data.payment.payment_amount

            // Update Order Status in Database
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'Processing', // Paid
                    payment_id: paymentId,
                    payment_method: data.payment.payment_group || 'cashfree'
                })
                .eq('id', orderId)

            if (updateError) {
                console.error('Failed to update order:', updateError)
                throw updateError
            }

            // Log Transaction
            await supabase.from('payment_transactions').insert({
                order_id: orderId,
                payment_id: paymentId,
                amount: amount,
                status: 'success',
                gateway: 'cashfree',
                raw_response: payload
            })
        } else if (type === 'PAYMENT_FAILED_WEBHOOK') {
            // Log failure
            const orderId = data.order.order_id
            await supabase.from('payment_transactions').insert({
                order_id: orderId,
                amount: data.payment.payment_amount,
                status: 'failed',
                gateway: 'cashfree',
                raw_response: payload
            })
        }

        return new Response(
            JSON.stringify({ received: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Webhook Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
