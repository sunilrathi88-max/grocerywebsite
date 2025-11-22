# Phase 1 Backend Deployment Guide

## Overview

This guide covers the deployment of Supabase backend infrastructure for Phase 1: Core E-commerce Loop, including database schema, Edge Functions, and webhook configuration.

---

## Prerequisites

- [x] Supabase project created
- [x] Supabase CLI installed (`npm install -g supabase`)
- [x] Razorpay account (test + production keys)
- [x] Access to Supabase project credentials

---

## Step 1: Database Schema Migration

### 1.1 Run the SQL Migration

Navigate to your Supabase project dashboard:

1. Go to **SQL Editor**
2. Create a new query
3. Copy the contents of `supabase/phase1_schema.sql`
4. Execute the query

Alternatively, via CLI:

```bash
supabase db push
```

### 1.2 Verify Tables Created

Check that the following tables exist:

- [x] `payment_transactions`
- [x] `order_status_history`
- [x] `returns`
- [x] `return_items`
- [x] `stock_notifications`

### 1.3 Verify Storage Bucket

Navigate to **Storage** → Verify `return-images` bucket exists with public access enabled.

---

## Step 2: Configure Environment Variables

### 2.1 Local Development

Create `.env.local`:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
```

### 2.2 Supabase Edge Functions

Set secrets for Edge Functions:

```bash
# Razorpay credentials
supabase secrets set RAZORPAY_KEY_ID=rzp_test_YOUR_KEY
supabase secrets set RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
supabase secrets set RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# Supabase credentials (for functions)
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

### 2.3 Production

For production deployment:

1. Replace test keys with live Razorpay keys
2. Update `VITE_RAZORPAY_KEY_ID` in hosting platform (Vercel/Netlify)
3. Ensure webhook secrets match Razorpay dashboard configuration

---

## Step 3: Deploy Edge Functions

### 3.1 Link Supabase Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 3.2 Deploy Functions

Deploy all three Edge Functions:

```bash
# Deploy order creation function
supabase functions deploy create-razorpay-order

# Deploy payment verification function
supabase functions deploy verify-razorpay-payment

# Deploy webhook handler
supabase functions deploy razorpay-webhook
```

### 3.3 Verify Deployment

Check function URLs in Supabase Dashboard → **Edge Functions**

Expected URLs:

- `https://YOUR_PROJECT.supabase.co/functions/v1/create-razorpay-order`
- `https://YOUR_PROJECT.supabase.co/functions/v1/verify-razorpay-payment`
- `https://YOUR_PROJECT.supabase.co/functions/v1/razorpay-webhook`

---

## Step 4: Configure Razorpay Webhooks

### 4.1 Access Razorpay Dashboard

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **Webhooks**

### 4.2 Add Webhook URL

1. Click **+ Add New Webhook**
2. **Webhook URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/razorpay-webhook`
3. **Secret**: Generate or use existing secret
4. **Alert Email**: Your email
5. **Active Events**: Select the following:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `refund.processed`

### 4.3 Update Webhook Secret

Update the secret in Supabase:

```bash
supabase secrets set RAZORPAY_WEBHOOK_SECRET=<secret-from-razorpay>
```

### 4.4 Test Webhook

Send a test event from Razorpay Dashboard to verify webhook is receiving events properly.

---

## Step 5: Update Client Code

### 5.1 Update paymentService.ts

Replace mock implementations with real API calls:

```typescript
// In paymentService.ts

async createOrder(amount: number): Promise<PaymentOrderResponse> {
  const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
    body: { amount: Math.round(amount * 100) }
  });

  if (error) throw error;
  return data;
}

async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
    body: {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature
    }
  });

  if (error) throw error;
  return data.verified;
}
```

### 5.2 Testing Checklist

- [ ] Test order creation
- [ ] Test payment with Razorpay test card
- [ ] Verify payment signature validation
- [ ] Check database transaction logging
- [ ] Test webhook event processing
- [ ] Test return initiation
- [ ] Verify image upload to storage

---

## Step 6: Post-Deployment Verification

### 6.1 Database Check

Query `payment_transactions` table:

```sql
SELECT * FROM payment_transactions ORDER BY created_at DESC LIMIT 10;
```

### 6.2 Webhook Logs

Check Edge Function logs:

```bash
supabase functions logs razorpay-webhook
```

### 6.3 Test Flows

**Payment Flow:**

1. Add items to cart
2. Complete checkout
3. Pay with Razorpay (test card: `4111 1111 1111 1111`)
4. Verify order created in database
5. Check payment transaction logged

**Return Flow:**

1. Navigate to order history
2. Open delivered order
3. Initiate return
4. Select items and reason
5. Submit return request
6. Verify return created in `returns` table

---

## Step 7: Monitoring & Logging

### 7.1 Enable Logging

Supabase automatically logs Edge Function execution. Access via:

- **Dashboard** → **Edge Functions** → **Logs**

### 7.2 Payment Failure Alerts

Set up email alerts for payment failures:

1. Create a Database Webhook for `payment_transactions` inserts where `status = 'failed'`
2. Configure email notification service

### 7.3 Recommended Monitoring

- Payment success rate (via Analytics)
- Webhook delivery rate
- Return request volume
- Refund processing time

---

## Testing with Razorpay Test Cards

### Test Card Details

**Success Flow:**

- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: `123456`

**Failure Flow:**

- Card: `4000 0000 0000 0002`
- This will trigger a payment failure

**UPI Testing:**

- Use `success@razorpay` for success
- Use `failure@razorpay` for failure

---

## Production Checklist

Before going live:

### Security

- [ ] Replace all test keys with production keys
- [ ] Verify RLS policies are enabled on all tables
- [ ] Test authentication flows
- [ ] Enable HTTPS enforcement
- [ ] Validate webhook signature verification

### Performance

- [ ] Enable database indexes (already in schema)
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Test under load

### Compliance

- [ ] Add terms & conditions for returns
- [ ] Privacy policy updated for payment data
- [ ] PCI compliance check (Razorpay handles this)
- [ ] GDPR compliance for user data

### Operations

- [ ] Set up error monitoring (Sentry/LogRocket)
- [ ] Configure backup schedule
- [ ] Document rollback procedure
- [ ] Train support team on return/refund process

---

## Troubleshooting

### Issue: Payment verification fails

**Solution:**

- Verify `RAZORPAY_KEY_SECRET` is correctly set
- Check signature generation logic
- Review Edge Function logs

### Issue: Webhook not receiving events

**Solution:**

- Verify webhook URL in Razorpay dashboard
- Check Edge Function deployment status
- Test webhook with Razorpay test events
- Verify signature secret matches

### Issue: Return images not uploading

**Solution:**

- Check storage bucket permissions
- Verify `return-images` bucket exists
- Review RLS policies on storage

### Issue: Database RLS blocking queries

**Solution:**

- Verify user is authenticated
- Check policy conditions
- Use service_role key for admin operations

---

## Rollback Procedure

If issues arise post-deployment:

1. **Revert Edge Functions:**

   ```bash
   supabase functions delete create-razorpay-order
   supabase functions delete verify-razorpay-payment
   supabase functions delete razorpay-webhook
   ```

2. **Client Code:** Revert to mock implementations temporarily

3. **Database:** Tables can remain (won't affect existing functionality)

---

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Webhook Guide](https://razorpay.com/docs/webhooks/)
- Project README: [Main Documentation](file:///c:/Users/shubh/grocerywebsite/grocerywebsite/README.md)

---

## Summary

✅ Database schema deployed
✅ Edge Functions configured
✅ Webhooks connected
✅ Payment flow integrated
✅ Return system operational

**Next Steps:** Monitor production metrics and iterate based on user feedback.
