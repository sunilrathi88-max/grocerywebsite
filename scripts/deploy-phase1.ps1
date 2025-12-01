# Phase 1 Deployment Script (PowerShell)
# This script automates the deployment of Phase 1 backend infrastructure

$ErrorActionPreference = "Stop"

Write-Host "🚀 Phase 1 Deployment Script" -ForegroundColor Cyan
Write-Host "=============================="
Write-Host ""

# Check if Supabase CLI is installed
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI not found" -ForegroundColor Red
    Write-Host "Install it with: npm install -g supabase"
    exit 1
}

Write-Host "✓ Supabase CLI found" -ForegroundColor Green
Write-Host ""

# Step 1: Link to Supabase project
Write-Host "📡 Step 1: Linking to Supabase project" -ForegroundColor Cyan
Write-Host "---------------------------------------"
$PROJECT_REF = Read-Host "Enter your Supabase project reference ID"

if ([string]::IsNullOrWhiteSpace($PROJECT_REF)) {
    Write-Host "❌ Project reference is required" -ForegroundColor Red
    exit 1
}

supabase link --project-ref "$PROJECT_REF"
Write-Host "✓ Linked to Supabase project" -ForegroundColor Green
Write-Host ""

# Step 2: Configure secrets
Write-Host "🔐 Step 2: Configuring secrets" -ForegroundColor Cyan
Write-Host "------------------------------"
Write-Host "You'll need the following from your Razorpay dashboard:"
Write-Host "1. Key ID (starts with rzp_)"
Write-Host "2. Key Secret"
Write-Host "3. Webhook Secret"
Write-Host ""

$RAZORPAY_KEY_ID = Read-Host "Enter Razorpay Key ID"
$RAZORPAY_KEY_SECRET = Read-Host "Enter Razorpay Key Secret"
Write-Host ""
$RAZORPAY_WEBHOOK_SECRET = Read-Host "Enter Razorpay Webhook Secret"
Write-Host ""

# Get Supabase credentials
$SUPABASE_URL = Read-Host "Enter Supabase URL"
$SUPABASE_SERVICE_ROLE_KEY = Read-Host "Enter Supabase Service Role Key"
Write-Host ""

# Set secrets
Write-Host "Setting secrets..."
supabase secrets set RAZORPAY_KEY_ID="$RAZORPAY_KEY_ID"
supabase secrets set RAZORPAY_KEY_SECRET="$RAZORPAY_KEY_SECRET"
supabase secrets set RAZORPAY_WEBHOOK_SECRET="$RAZORPAY_WEBHOOK_SECRET"
supabase secrets set SUPABASE_URL="$SUPABASE_URL"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

Write-Host "✓ Secrets configured" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy Edge Functions
Write-Host "⚡ Step 3: Deploying Edge Functions" -ForegroundColor Cyan
Write-Host "-----------------------------------"

Write-Host "Deploying create-razorpay-order..."
supabase functions deploy create-razorpay-order

Write-Host "Deploying verify-razorpay-payment..."
supabase functions deploy verify-razorpay-payment

Write-Host "Deploying razorpay-webhook..."
supabase functions deploy razorpay-webhook

Write-Host "✓ All Edge Functions deployed" -ForegroundColor Green
Write-Host ""

# Step 4: Display webhook URL
Write-Host "🔗 Step 4: Webhook Configuration" -ForegroundColor Cyan
Write-Host "--------------------------------"
$WEBHOOK_URL = "https://$PROJECT_REF.supabase.co/functions/v1/razorpay-webhook"
Write-Host ""
Write-Host "Configure this webhook URL in your Razorpay dashboard:"
Write-Host "$WEBHOOK_URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "Enable these events:"
Write-Host "  ✓ payment.captured"
Write-Host "  ✓ payment.failed"
Write-Host "  ✓ refund.processed"
Write-Host ""

# Step 5: Database migration
Write-Host "💾 Step 5: Database Migration" -ForegroundColor Cyan
Write-Host "-----------------------------"
Write-Host "To run the database migration:"
Write-Host "1. Go to Supabase Dashboard → SQL Editor"
Write-Host "2. Open supabase/full_phase1_schema.sql"
Write-Host "3. Execute the SQL"
Write-Host ""
Write-Host "OR run: supabase db push (if using migrations)"
Write-Host ""

# Summary
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "======================="
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Configure webhook in Razorpay dashboard"
Write-Host "2. Run database migration (see above)"
Write-Host "3. Update .env with VITE_RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID"
Write-Host "4. Test payment flow with test card"
Write-Host ""
Write-Host "Edge Function URLs:"
Write-Host "  - Create Order: https://$PROJECT_REF.supabase.co/functions/v1/create-razorpay-order"
Write-Host "  - Verify Payment: https://$PROJECT_REF.supabase.co/functions/v1/verify-razorpay-payment"
Write-Host "  - Webhook: $WEBHOOK_URL"
Write-Host ""
Write-Host "🎉 All done!" -ForegroundColor Green
