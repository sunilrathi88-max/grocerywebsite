# Phase 1 Deployment Script (PowerShell)
# This script automates the deployment of Phase 1 backend infrastructure

Write-Host "Phase 1 Deployment Script" -ForegroundColor Cyan
Write-Host "=============================="
Write-Host ""

# Check if Supabase CLI is installed
if (-not (Get-Command "supabase" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Supabase CLI not found" -ForegroundColor Red
    Write-Host "Please ensure Supabase CLI is installed and in your PATH."
    Write-Host "You can try installing it via Scoop: scoop install supabase"
    exit 1
}

Write-Host "Success: Supabase CLI found" -ForegroundColor Green
Write-Host ""

# Step 1: Link to Supabase project
Write-Host "Step 1: Linking to Supabase project" -ForegroundColor Cyan
Write-Host "---------------------------------------"

$PerformLink = $true

if (Test-Path "supabase/config.toml") {
    Write-Host "Found existing supabase/config.toml"
    $SkipLink = Read-Host "Are you already linked to the correct project? (y/n)"
    if ($SkipLink -match "^[Yy]$") {
        Write-Host "Skipping link step" -ForegroundColor Green
        
        # Try to extract project_id
        $ConfigContent = Get-Content "supabase/config.toml"
        $ProjectRefLine = $ConfigContent | Select-String "project_id"
        if ($ProjectRefLine) {
            $ProjectRef = $ProjectRefLine.ToString().Split('=')[1].Trim().Trim('"')
            Write-Host "Detected Project ID: $ProjectRef"
        }
        else {
            Write-Host "Could not auto-detect project ID from config.toml. You might need it later." -ForegroundColor Yellow
        }
        Write-Host ""
        $PerformLink = $false
    }
}

if ($PerformLink) {
    $ProjectRef = Read-Host "Enter your Supabase project reference ID"
    
    if ([string]::IsNullOrWhiteSpace($ProjectRef)) {
        Write-Host "Error: Project reference is required" -ForegroundColor Red
        exit 1
    }

    supabase link --project-ref "$ProjectRef"
    Write-Host "Success: Linked to Supabase project" -ForegroundColor Green
    Write-Host ""
}

# Step 2: Configure secrets
Write-Host "Step 2: Configuring secrets" -ForegroundColor Cyan
Write-Host "------------------------------"
Write-Host "You'll need the following from your Cashfree dashboard:"
Write-Host "1. App ID (Client ID)"
Write-Host "2. Secret Key (Client Secret)"
Write-Host ""

$CashfreeAppId = Read-Host "Enter Cashfree App ID"
$CashfreeSecretKey = Read-Host "Enter Cashfree Secret Key" -AsSecureString
$CashfreeEnv = Read-Host "Enter Environment (sandbox/production) [default: sandbox]"

if ([string]::IsNullOrWhiteSpace($CashfreeEnv)) {
    $CashfreeEnv = "sandbox"
}

# Convert SecureString to Plain Text
$BSTR1 = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($CashfreeSecretKey)
$CashfreeSecretKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR1)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR1)

Write-Host ""

$SupabaseUrl = Read-Host "Enter Supabase URL"
$SupabaseServiceRoleKey = Read-Host "Enter Supabase Service Role Key" -AsSecureString

$BSTR3 = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SupabaseServiceRoleKey)
$SupabaseServiceRoleKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR3)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR3)

Write-Host ""

# Set secrets
Write-Host "Setting secrets..."
supabase secrets set CASHFREE_APP_ID="$CashfreeAppId"
supabase secrets set CASHFREE_SECRET_KEY="$CashfreeSecretKeyPlain"
supabase secrets set CASHFREE_ENV="$CashfreeEnv"
supabase secrets set SUPABASE_URL="$SupabaseUrl"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SupabaseServiceRoleKeyPlain"

Write-Host "Success: Secrets configured" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy Edge Functions
Write-Host "Step 3: Deploying Edge Functions" -ForegroundColor Cyan
Write-Host "-----------------------------------"

Write-Host "Deploying create-cashfree-order..."
supabase functions deploy create-cashfree-order

Write-Host "Deploying verify-cashfree-payment..."
supabase functions deploy verify-cashfree-payment

Write-Host "Deploying cashfree-webhook..."
supabase functions deploy cashfree-webhook

Write-Host "Success: All Edge Functions deployed" -ForegroundColor Green
Write-Host ""

# Step 4: Display webhook URL
Write-Host "Step 4: Webhook Configuration" -ForegroundColor Cyan
Write-Host "--------------------------------"

# If we didn't get ProjectRef earlier (skipped link), try to find it again or ask
if ([string]::IsNullOrWhiteSpace($ProjectRef)) {
    if (Test-Path "supabase/config.toml") {
        $ConfigContent = Get-Content "supabase/config.toml"
        $ProjectRefLine = $ConfigContent | Select-String "project_id"
        if ($ProjectRefLine) {
            $ProjectRef = $ProjectRefLine.ToString().Split('=')[1].Trim().Trim('"')
        }
    }
}

if ([string]::IsNullOrWhiteSpace($ProjectRef)) {
    $ProjectRef = "<YOUR_PROJECT_ID>"
}

$WebhookUrl = "https://$ProjectRef.supabase.co/functions/v1/cashfree-webhook"
Write-Host ""
Write-Host "Configure this webhook URL in your Cashfree dashboard:"
Write-Host "$WebhookUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Enable these events:"
Write-Host "  - PAYMENT_SUCCESS_WEBHOOK"
Write-Host "  - PAYMENT_FAILED_WEBHOOK"
Write-Host ""

# Step 5: Database migration
Write-Host "Step 5: Database Migration" -ForegroundColor Cyan
Write-Host "-----------------------------"
Write-Host "To run the database migration:"
Write-Host "1. Go to Supabase Dashboard -> SQL Editor"
Write-Host "2. Open supabase/full_phase1_schema.sql"
Write-Host "3. Execute the SQL"
Write-Host ""
Write-Host "OR run: supabase db push (if using migrations)"
Write-Host ""

# Summary
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "======================="
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Configure webhook in Cashfree dashboard"
Write-Host "2. Run database migration (see above)"
Write-Host "3. Update .env with VITE_CASHFREE_MODE=$CashfreeEnv"
Write-Host "4. Test payment flow"
Write-Host ""
Write-Host "Edge Function URLs:"
Write-Host "  - Create Order: https://$ProjectRef.supabase.co/functions/v1/create-cashfree-order"
Write-Host "  - Verify Payment: https://$ProjectRef.supabase.co/functions/v1/verify-cashfree-payment"
Write-Host "  - Webhook: $WebhookUrl"
Write-Host ""
Write-Host "All done!" -ForegroundColor Green
