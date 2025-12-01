#!/bin/bash
# Phase 1 Deployment Script
# This script automates the deployment of Phase 1 backend infrastructure

set -e  # Exit on error

echo "🚀 Phase 1 Deployment Script"
echo "=============================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found${NC}"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

echo -e "${GREEN}✓ Supabase CLI found${NC}"
echo ""

# Step 1: Link to Supabase project
echo "📡 Step 1: Linking to Supabase project"
echo "---------------------------------------"
read -p "Enter your Supabase project reference ID: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo -e "${RED}❌ Project reference is required${NC}"
    exit 1
fi

supabase link --project-ref "$PROJECT_REF"
echo -e "${GREEN}✓ Linked to Supabase project${NC}"
echo ""

# Step 2: Configure secrets
echo "🔐 Step 2: Configuring secrets"
echo "------------------------------"
echo "You'll need the following from your Razorpay dashboard:"
echo "1. Key ID (starts with rzp_)"
echo "2. Key Secret"
echo "3. Webhook Secret"
echo ""

read -p "Enter Razorpay Key ID: " RAZORPAY_KEY_ID
read -s -p "Enter Razorpay Key Secret: " RAZORPAY_KEY_SECRET
echo ""
read -s -p "Enter Razorpay Webhook Secret: " RAZORPAY_WEBHOOK_SECRET
echo ""

# Get Supabase credentials
read -p "Enter Supabase URL: " SUPABASE_URL
read -s -p "Enter Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY
echo ""

# Set secrets
echo "Setting secrets..."
supabase secrets set RAZORPAY_KEY_ID="$RAZORPAY_KEY_ID"
supabase secrets set RAZORPAY_KEY_SECRET="$RAZORPAY_KEY_SECRET"
supabase secrets set RAZORPAY_WEBHOOK_SECRET="$RAZORPAY_WEBHOOK_SECRET"
supabase secrets set SUPABASE_URL="$SUPABASE_URL"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo -e "${GREEN}✓ Secrets configured${NC}"
echo ""

# Step 3: Deploy Edge Functions
echo "⚡ Step 3: Deploying Edge Functions"
echo "-----------------------------------"

echo "Deploying create-razorpay-order..."
supabase functions deploy create-razorpay-order

echo "Deploying verify-razorpay-payment..."
supabase functions deploy verify-razorpay-payment

echo "Deploying razorpay-webhook..."
supabase functions deploy razorpay-webhook

echo -e "${GREEN}✓ All Edge Functions deployed${NC}"
echo ""

# Step 4: Display webhook URL
echo "🔗 Step 4: Webhook Configuration"
echo "--------------------------------"
WEBHOOK_URL="https://$PROJECT_REF.supabase.co/functions/v1/razorpay-webhook"
echo ""
echo "Configure this webhook URL in your Razorpay dashboard:"
echo -e "${YELLOW}$WEBHOOK_URL${NC}"
echo ""
echo "Enable these events:"
echo "  ✓ payment.captured"
echo "  ✓ payment.failed"
echo "  ✓ refund.processed"
echo ""

# Step 5: Database migration
echo "💾 Step 5: Database Migration"
echo "-----------------------------"
echo "To run the database migration:"
echo "1. Go to Supabase Dashboard → SQL Editor"
echo "2. Open supabase/full_phase1_schema.sql"
echo "3. Execute the SQL"
echo ""
echo "OR run: supabase db push (if using migrations)"
echo ""

# Summary
echo "✅ Deployment Complete!"
echo "======================="
echo ""
echo "Next steps:"
echo "1. Configure webhook in Razorpay dashboard"
echo "2. Run database migration (see above)"
echo "3. Update .env with VITE_RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID"
echo "4. Test payment flow with test card"
echo ""
echo "Edge Function URLs:"
echo "  - Create Order: https://$PROJECT_REF.supabase.co/functions/v1/create-razorpay-order"
echo "  - Verify Payment: https://$PROJECT_REF.supabase.co/functions/v1/verify-razorpay-payment"
echo "  - Webhook: $WEBHOOK_URL"
echo ""
echo -e "${GREEN}🎉 All done!${NC}"
