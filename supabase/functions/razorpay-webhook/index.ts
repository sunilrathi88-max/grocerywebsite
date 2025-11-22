// Supabase Edge Function: razorpay-webhook
// Deploy with: supabase functions deploy razorpay-webhook

/* global Deno */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-razorpay-signature');
    const body = await req.text();

    // Verify webhook signature
    const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || '';
    const expectedSignature = createHmac('sha256', secret).update(body).digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const event = JSON.parse(body);
    console.log('Webhook event:', event.event);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle different events
    switch (event.event) {
      case 'payment.captured':
        // Update payment transaction status
        await supabase
          .from('payment_transactions')
          .update({ status: 'success', payment_method: event.payload.payment.entity.method })
          .eq('payment_id', event.payload.payment.entity.id);

        // Optionally: Update order status to 'Processing'
        console.log('Payment captured:', event.payload.payment.entity.id);
        break;

      case 'payment.failed':
        // Update payment transaction status
        await supabase
          .from('payment_transactions')
          .update({
            status: 'failed',
            error_code: event.payload.payment.entity.error_code,
            error_description: event.payload.payment.entity.error_description,
          })
          .eq('payment_id', event.payload.payment.entity.id);

        console.log('Payment failed:', event.payload.payment.entity.id);
        break;

      case 'refund.processed':
        // Update payment transaction status
        await supabase
          .from('payment_transactions')
          .update({ status: 'refunded' })
          .eq('payment_id', event.payload.refund.entity.payment_id);

        // Update return status if applicable
        await supabase
          .from('returns')
          .update({
            status: 'refunded',
            refund_id: event.payload.refund.entity.id,
          })
          .eq('refund_id', event.payload.refund.entity.id);

        console.log('Refund processed:', event.payload.refund.entity.id);
        break;

      default:
        console.log('Unhandled event:', event.event);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
