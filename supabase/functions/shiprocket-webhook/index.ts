/**
 * ShipRocket Webhook Handler
 * Receives delivery status updates from ShipRocket
 *
 * Deploy this as a Supabase Edge Function or serverless endpoint
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const WEBHOOK_SECRET =
  Deno.env.get('SHIPROCKET_WEBHOOK_SECRET') || 'tattvaco_shiprocket_webhook_2024';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface WebhookPayload {
  awb: string;
  courier_name: string;
  current_status: string;
  current_status_code: number;
  shipment_status: string;
  shipment_status_id: number;
  order_id: string;
  scans: Array<{
    location: string;
    date: string;
    activity: string;
    status: string;
  }>;
  etd: string;
  current_timestamp: string;
}

// Map ShipRocket status codes to our status
const statusMap: Record<number, string> = {
  1: 'pending',
  2: 'processing',
  3: 'shipped',
  4: 'shipped',
  5: 'in_transit',
  6: 'out_for_delivery',
  7: 'delivered',
  8: 'cancelled',
  9: 'rto',
  10: 'rto',
};

serve(async (req: Request) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-webhook-token',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    // Verify webhook token
    const webhookToken = req.headers.get('x-webhook-token') || req.headers.get('authorization');

    if (webhookToken !== WEBHOOK_SECRET && webhookToken !== `Bearer ${WEBHOOK_SECRET}`) {
      console.error('Invalid webhook token');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
    }

    // Parse payload
    const payload: WebhookPayload = await req.json();

    console.log('Received webhook:', {
      awb: payload.awb,
      order_id: payload.order_id,
      status: payload.current_status,
      timestamp: payload.current_timestamp,
    });

    // Update order status in database
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const status = statusMap[payload.shipment_status_id] || 'in_transit';

      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          shipping_status: status,
          awb_code: payload.awb,
          courier_name: payload.courier_name,
          last_tracking_update: payload.current_timestamp,
          delivery_eta: payload.etd,
          delivered_at: status === 'delivered' ? payload.current_timestamp : null,
        }),
      });

      if (!response.ok) {
        console.error('Failed to update order:', await response.text());
      }
    }

    // Send notification for important status changes
    const notifyStatuses = ['out_for_delivery', 'delivered', 'rto'];
    const currentStatus = statusMap[payload.shipment_status_id];

    if (notifyStatuses.includes(currentStatus)) {
      // Trigger email/SMS notification (implement as needed)
      console.log(`Sending notification for status: ${currentStatus}`);

      // Example: Call notification service
      // await sendNotification({
      //   orderId: payload.order_id,
      //   status: currentStatus,
      //   awb: payload.awb,
      //   etd: payload.etd,
      // });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processed',
        order_id: payload.order_id,
        status: currentStatus,
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Webhook error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers }
    );
  }
});
