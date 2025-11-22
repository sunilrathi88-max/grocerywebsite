# Phase 1 Deployment - Quick Start Guide

## 🎯 Overview

This guide will help you deploy Phase 1 backend infrastructure in **under 15 minutes**.

---

## ✅ Prerequisites

Before starting, ensure you have:

- [ ] Supabase project created
- [ ] Razorpay account (test or production)
- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] Git Bash or WSL (for Windows users)

---

## 🚀 Quick Deploy (Automated)

### Option 1: Using Deployment Script

```bash
# Make script executable (Linux/Mac/Git Bash)
chmod +x scripts/deploy-phase1.sh

# Run deployment script
./scripts/deploy-phase1.sh
```

The script will:
1. ✅ Link to your Supabase project
2. ✅ Configure all secrets
3. ✅ Deploy all 3 Edge Functions
4. ✅ Display webhook URL for Razorpay

---

## 📋 Manual Deployment (Step-by-Step)

### Step 1: Database Migration (5 min)

**Via Supabase Dashboard:**
1. Open [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy contents of `supabase/phase1_schema.sql`
5. Click **Run**

**Verify tables created:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'payment_transactions', 
  'order_status_history', 
  'returns', 
  'return_items', 
  'stock_notifications'
);
```

---

### Step 2: Configure Secrets (3 min)

Link to your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Set secrets:
```bash
# Razorpay credentials
supabase secrets set RAZORPAY_KEY_ID=rzp_test_YOUR_KEY
supabase secrets set RAZORPAY_KEY_SECRET=YOUR_SECRET
supabase secrets set RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# Supabase credentials
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

**Get these values:**
- **Razorpay**: Dashboard → Settings → API Keys
- **Supabase URL**: Dashboard → Settings → API
- **Service Role Key**: Dashboard → Settings → API → `service_role` key

---

### Step 3: Deploy Edge Functions (3 min)

```bash
# Deploy all three functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy razorpay-webhook
```

**Verify deployment:**
```bash
supabase functions list
```

---

### Step 4: Configure Razorpay Webhook (2 min)

1. Open [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings** → **Webhooks**
3. Click **Create New Webhook**
4. Configure:
   - **URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/razorpay-webhook`
   - **Secret**: Copy from Razorpay or generate new
   - **Events**: Enable these:
     - ✅ `payment.captured`
     - ✅ `payment.failed`
     - ✅ `refund.processed`
5. Click **Create Webhook**
6. Update secret in Supabase if you generated a new one

---

### Step 5: Update Client Environment (1 min)

Create `.env.local`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

---

## 🌐 Frontend Deployment (Vercel/Netlify)

### Vercel (Recommended)

1. **Install Vercel CLI** (Optional, or use dashboard):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Project Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (or `grocerywebsite` if in subfolder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   Add these in Vercel Dashboard > Settings > Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
   - `VITE_GA_MEASUREMENT_ID`
   - `VITE_ENABLE_ANALYTICS=true`

### Netlify

1. **Drag & Drop**:
   - Run `npm run build` locally.
   - Drag the `dist` folder to Netlify Drop.

2. **Git Integration**:
   - Connect repository.
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - Add Environment Variables in Site Settings.

---

## 🧪 Testing

### Test Payment Flow

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Add items to cart**

3. **Proceed to checkout**

4. **Use Razorpay test card:**
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date
   - OTP: `123456`

5. **Verify:**
   - Payment completes successfully
   - Order created in database
   - Transaction logged in `payment_transactions`

### Test Webhook

Send test event from Razorpay Dashboard:
1. Webhooks → Your webhook → **Send Test Webhook**
2. Select `payment.captured`
3. Check Edge Function logs:
   ```bash
   supabase functions logs razorpay-webhook
   ```

### Test Return Flow

1. Navigate to Order History
2. Open a delivered order
3. Click "Request Return"
4. Select items and complete wizard
5. Verify return created in `returns` table

---

## 🔍 Verification Checklist

After deployment, verify:

### Database
- [ ] All 5 tables created
- [ ] RLS policies enabled
- [ ] Storage bucket `return-images` exists

### Edge Functions
- [ ] All 3 functions deployed
- [ ] Functions accessible via URL
- [ ] Secrets configured correctly

### Razorpay
- [ ] Webhook configured
- [ ] Webhook receiving events (check logs)
- [ ] Test payment successful

### Client
- [ ] Environment variable set
- [ ] Build successful
- [ ] Payment flow working
- [ ] Mock fallback working (if Edge Functions not deployed)

---

## 🐛 Troubleshooting

### Edge Function Not Found

**Error:** `FunctionsRelayError` or `not found`

**Solution:** 
The client code will automatically fall back to mock implementations for development. Deploy Edge Functions to enable production mode.

### Payment Verification Failed

**Check:**
1. Webhook secret matches in both Razorpay and Supabase
2. Edge Function `verify-razorpay-payment` is deployed
3. Function logs for error details:
   ```bash
   supabase functions logs verify-razorpay-payment
   ```

### Database Permission Denied

**Check:**
1. RLS policies are correctly configured
2. User is authenticated
3. Using correct API key (anon key for client, service_role for admin)

### Webhook Not Receiving Events

**Check:**
1. Webhook URL is correct
2. Webhook is active in Razorpay dashboard
3. Events are selected
4. Check Edge Function logs:
   ```bash
   supabase functions logs razorpay-webhook --tail
   ```

---

## 📊 Monitoring

### View Edge Function Logs

```bash
# All functions
supabase functions logs

# Specific function
supabase functions logs razorpay-webhook --tail

# Filter by time
supabase functions logs --since 1h
```

### Check Database Stats

```sql
-- Payment transactions today
SELECT COUNT(*), status 
FROM payment_transactions 
WHERE created_at > CURRENT_DATE 
GROUP BY status;

-- Return requests this week
SELECT COUNT(*), status 
FROM returns 
WHERE created_at > CURRENT_DATE - INTERVAL '7 days' 
GROUP BY status;
```

### Monitor Webhook Delivery

Razorpay Dashboard → Webhooks → Your Webhook → **Logs**

---

## 🔄 Rollback

If you need to rollback:

### Delete Edge Functions
```bash
supabase functions delete create-razorpay-order
supabase functions delete verify-razorpay-payment
supabase functions delete razorpay-webhook
```

### Disable Webhook
Razorpay Dashboard → Webhooks → Disable webhook

### Client Fallback
The client code automatically falls back to mock implementations if Edge Functions are not available.

---

## 🎯 Production Checklist

Before going to production:

### Security
- [ ] Replace test Razorpay keys with production keys
- [ ] Review and update RLS policies
- [ ] Enable MFA on Supabase account
- [ ] Set up IP whitelist (if needed)
- [ ] Rotate secrets regularly

### Performance
- [ ] Enable database connection pooling
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize database indexes (already in schema)

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up payment failure alerts
- [ ] Enable webhook delivery monitoring

### Operations
- [ ] Document support procedures
- [ ] Train customer service team
- [ ] Set up backup schedule
- [ ] Create runbook for common issues

---

## 📚 References

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Razorpay API Docs](https://razorpay.com/docs/api/)
- [Razorpay Webhooks](https://razorpay.com/docs/webhooks/)
- [Full Deployment Guide](PHASE1_DEPLOYMENT.md)

---

## ✅ Summary

**Estimated Time:** 15 minutes  
**Difficulty:** Easy  
**Components:** 3 Edge Functions, 5 Database Tables, 1 Webhook

**After completion:**
- ✅ Secure payment processing
- ✅ Server-side verification
- ✅ Automated webhook handling
- ✅ Complete return management
- ✅ Production-ready infrastructure

---

**Questions?** Refer to the [full deployment guide](PHASE1_DEPLOYMENT.md) for detailed troubleshooting and advanced configuration.
