# Supabase CLI Installation Guide for Windows

## ⚠️ Important Note

The Supabase CLI **cannot** be installed via `npm install -g supabase` anymore. 

Use one of the methods below instead.

---

## 🎯 Recommended Methods

### Option 1: Using Scoop (Recommended)

**Step 1: Install Scoop (if not already installed)**

Open PowerShell and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

**Step 2: Install Supabase CLI**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Step 3: Verify Installation**
```powershell
supabase --version
```

---

### Option 2: Direct Binary Download (Quickest)

1. Download the Windows binary from:
   https://github.com/supabase/cli/releases/latest

2. Look for `supabase_windows_amd64.zip`

3. Extract the ZIP file

4. Add the extracted folder to your PATH:
   - Search for "Environment Variables" in Windows
   - Edit "Path" under User variables
   - Add the path to the extracted folder
   - Click OK

5. Restart your terminal

6. Verify:
   ```powershell
   supabase --version
   ```

---

### Option 3: Using NPX (No Installation)

You can use Supabase CLI without installing via `npx`:

```bash
npx supabase --version
npx supabase login
npx supabase link --project-ref YOUR_REF
npx supabase functions deploy create-razorpay-order
```

**Pros:** No installation needed  
**Cons:** Slightly slower as it downloads each time

---

## ✅ After Installation

Once installed, proceed with deployment:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy razorpay-webhook
```

---

## 🔗 Official Documentation

For more installation options: https://supabase.com/docs/guides/cli/getting-started

---

## 💡 Quick Deploy Alternative

If you prefer not to install Supabase CLI locally, you can:

1. **Deploy via Supabase Dashboard:**
   - Go to Edge Functions
   - Create new function
   - Copy/paste code from `supabase/functions/*/index.ts`
   - Deploy through the UI

2. **Use GitHub Actions:**
   - Set up CI/CD pipeline
   - Deploy automatically on push

---

## ❓ Having Issues?

Try these troubleshooting steps:

1. **Scoop installation fails:**
   - Run PowerShell as Administrator
   - Check internet connection
   - Disable antivirus temporarily

2. **Binary not in PATH:**
   - Restart terminal after adding to PATH
   - Use absolute path to binary

3. **Permission errors:**
   - Run terminal as Administrator
   - Check firewall settings
