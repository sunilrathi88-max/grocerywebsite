#!/bin/bash
# Phase 1 Deployment Script
# This script automates the deployment of Phase 1 backend infrastructure

set -e  # Exit on error

echo "🚀 Phase 1 Deployment Script (Cashfree Edition)"
echo "=============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    SUPABASE_CMD="supabase"
elif command -v supabase.exe &> /dev/null; then
    SUPABASE_CMD="supabase.exe"
else
    echo -e "${RED}❌ Supabase CLI not found${NC}"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

echo -e "${GREEN}✓ Supabase CLI found${NC}"
echo ""

# Step 1: Link to Supabase project
echo "📡 Step 1: Linking to Supabase project"
echo "---------------------------------------"

if [ -f "supabase/config.toml" ]; then
    echo "Found existing supabase/config.toml"
    read -p "Are you already linked to the correct project? (y/n): " SKIP_LINK
    if [[ "$SKIP_LINK" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}✓ Skipping link step${NC}"
        PROJECT_REF=$(grep "project_id" supabase/config.toml | cut -d '"' -f 2)
        if [ -z "$PROJECT_REF" ]; then
             echo -e "${YELLOW}Could not auto-detect project ID from config.toml. You might need it later.${NC}"
        else
             echo "Detected Project ID: $PROJECT_REF"
        fi
        echo ""
    else
        PERFORM_LINK=true
    fi
else
    PERFORM_LINK=true
fi

if [ "$PERFORM_LINK" = true ]; then
    read -p "Enter your Supabase project reference ID: " PROJECT_REF

    if [ -z "$PROJECT_REF" ]; then
        echo -e "${RED}❌ Project reference is required${NC}"
        exit 1
    fi

    $SUPABASE_CMD link --project-ref "$PROJECT_REF"
    echo -e "${GREEN}✓ Linked to Supabase project${NC}"
    echo ""
fi

# Step 2: Configure secrets
echo "🔐 Step 2: Configuring secrets"
echo "------------------------------"
echo "You'll need the following from your Cashfree dashboard:"
echo "1. App ID (Client ID)"
echo "2. Secret Key (Client Secret)"
echo "3. Environment (sandbox/production)"
echo ""

read -p "Enter Cashfree App ID: " CASHFREE_APP_ID
read -s -p "Enter Cashfree Secret Key: " CASHFREE_SECRET_KEY
echo ""
read -p "Enter Cashfree Environment (sandbox/production): " CASHFREE_ENV
echo ""

# Get Supabase credentials
read -p "Enter Supabase URL: " SUPABASE_URL
read -s -p "Enter Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY
echo ""

# Set secrets
echo "Setting secrets..."
$SUPABASE_CMD secrets set CASHFREE_APP_ID="$CASHFREE_APP_ID"
$SUPABASE_CMD secrets set CASHFREE_SECRET_KEY="$CASHFREE_SECRET_KEY"
$SUPABASE_CMD secrets set CASHFREE_ENV="$CASHFREE_ENV"
$SUPABASE_CMD secrets set SUPABASE_URL="$SUPABASE_URL"
$SUPABASE_CMD secrets set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo -e "${GREEN}✓ Secrets configured${NC}"
echo ""

# Step 3: Deploy Edge Functions
echo "⚡ Step 3: Deploying Edge Functions"
echo "-----------------------------------"

echo "Deploying create-cashfree-order..."
$SUPABASE_CMD functions deploy create-cashfree-order

echo "Deploying verify-cashfree-payment..."
$SUPABASE_CMD functions deploy verify-cashfree-payment

echo "Deploying cashfree-webhook..."
$SUPABASE_CMD functions deploy cashfree-webhook

echo -e "${GREEN}✓ All Edge Functions deployed${NC}"
echo ""

# Step 4: Display webhook URL
echo "🔗 Step 4: Webhook Configuration"
echo "--------------------------------"
WEBHOOK_URL="https://$PROJECT_REF.supabase.co/functions/v1/cashfree-webhook"
echo ""
echo "Configure this webhook URL in your Cashfree dashboard:"
echo -e "${YELLOW}$WEBHOOK_URL${NC}"
echo ""
echo "Enable these events:"
echo "  ✓ PAYMENT_SUCCESS_WEBHOOK"
echo "  ✓ PAYMENT_FAILED_WEBHOOK"
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
echo "1. Configure webhook in Cashfree dashboard"
echo "2. Run database migration (see above)"
echo "3. Update .env with VITE_CASHFREE_MODE=$CASHFREE_ENV"
echo "4. Test payment flow"
echo ""
echo "Edge Function URLs:"
echo "  - Create Order: https://$PROJECT_REF.supabase.co/functions/v1/create-cashfree-order"
echo "  - Verify Payment: https://$PROJECT_REF.supabase.co/functions/v1/verify-cashfree-payment"
echo "  - Webhook: $WEBHOOK_URL"
echo ""
echo -e "${GREEN}🎉 All done!${NC}"
