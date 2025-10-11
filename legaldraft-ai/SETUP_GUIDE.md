# LegalDraft AI - Complete Setup Guide

This guide will walk you through setting up LegalDraft AI from scratch, including all third-party services.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Clerk Setup](#clerk-setup)
4. [OpenAI Setup](#openai-setup)
5. [Stripe Setup](#stripe-setup)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and **npm** installed
- A **GitHub** account (for deployment)
- Credit card for Stripe (test mode available)

Check your Node version:
\`\`\`bash
node --version  # Should be 18.x or higher
npm --version
\`\`\`

---

## Supabase Setup

### Step 1: Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Choose organization or create one
6. Fill in:
   - **Name**: legaldraft-ai
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
7. Click "Create new project" (takes ~2 minutes)

### Step 2: Setup Database Schema

1. Once project is ready, click "SQL Editor" in left sidebar
2. Click "New Query"
3. Open `lib/supabase/schema.sql` in your code editor
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click "Run" (bottom right)
7. You should see "Success. No rows returned"

### Step 3: Get API Keys

1. Click "Settings" (gear icon) in left sidebar
2. Click "API" under Project Settings
3. Copy these values:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public**: `eyJh...` (under "Project API keys")
   - **service_role**: `eyJh...` (click "Reveal" first)

⚠️ Keep the service_role key secret - never expose it in frontend code!

---

## Clerk Setup

### Step 1: Create Application

1. Go to [clerk.com](https://clerk.com)
2. Sign up for free account
3. Click "Add application"
4. Name it "LegalDraft AI"
5. Choose authentication methods:
   - ✅ Email
   - ✅ Google (recommended)
6. Click "Create Application"

### Step 2: Configure Authentication

1. In Clerk Dashboard, go to "User & Authentication" > "Email, Phone, Username"
2. Enable:
   - Email address (required)
   - Password
3. Go to "Social Connections"
4. Toggle on "Google"
5. Follow Google OAuth setup instructions if needed

### Step 3: Configure Paths

1. Go to "Paths" in sidebar
2. Set:
   - Sign-in page: `/sign-in`
   - Sign-up page: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/onboarding`

### Step 4: Get API Keys

1. Go to "API Keys" in sidebar
2. Copy:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...` (click "Show")

---

## OpenAI Setup

### Step 1: Create Account

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Add payment method (required for API access)
   - Go to Settings > Billing
   - Add payment method
   - Set usage limits to prevent unexpected charges

### Step 2: Get API Key

1. Click your profile icon > "API keys"
2. Click "Create new secret key"
3. Name it "LegalDraft AI"
4. Click "Create secret key"
5. Copy the key immediately (you can't see it again!)
   - Format: `sk-...`

### Step 3: Set Usage Limits (Important!)

1. Go to Settings > Limits
2. Set a monthly budget (e.g., $20/month)
3. Enable email alerts at 50% and 80%

⚠️ OpenAI charges per token used. Monitor your usage regularly!

---

## Stripe Setup

### Step 1: Create Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for free account
3. Complete business details (can use test mode without full verification)

### Step 2: Create Products

1. In Stripe Dashboard, click "Products" > "Add Product"

**Pro Plan:**
- Name: "LegalDraft AI - Pro"
- Description: "Unlimited documents, no watermark"
- Pricing: $29.00 USD
- Billing period: Monthly
- Click "Save product"
- Copy the **Price ID** (starts with `price_...`)

**Firm Plan:**
- Name: "LegalDraft AI - Firm"
- Description: "Pro + team features"
- Pricing: $99.00 USD
- Billing period: Monthly
- Click "Save product"
- Copy the **Price ID**

### Step 3: Get API Keys

1. Click "Developers" > "API keys"
2. Copy:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...` (click "Reveal")

⚠️ Use test keys for development, live keys only in production!

### Step 4: Setup Webhook (After Deployment)

We'll configure this after deploying the app. The webhook URL will be:
\`\`\`
https://your-domain.com/api/stripe/webhook
\`\`\`

---

## Environment Configuration

### Step 1: Create .env.local

In your project root, create `.env.local`:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

### Step 2: Fill in All Variables

\`\`\`env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (leave empty for now)
STRIPE_PRO_PRICE_ID=price_... (your Pro plan price ID)
STRIPE_FIRM_PRICE_ID=price_... (your Firm plan price ID)

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Step 3: Update Stripe Client

Edit `lib/stripe/client.ts` and update the price IDs:

\`\`\`typescript
pro: {
  stripePriceId: 'price_YOUR_PRO_PRICE_ID',
  // ...
},
firm: {
  stripePriceId: 'price_YOUR_FIRM_PRICE_ID',
  // ...
},
\`\`\`

---

## Running the Application

### Step 1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 2: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

### Step 3: Test the Application

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Sign Up"
3. Create an account
4. Complete onboarding
5. Try creating a document:
   - Go to Templates
   - Select "NDA" template
   - Fill in the form
   - Click "Generate Document"
6. Download as PDF

### Step 4: Test Subscription (Test Mode)

1. Go to Billing page
2. Click "Upgrade to Pro"
3. Use Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
4. Complete checkout
5. Verify upgrade worked

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   \`\`\`

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Add Environment Variables:**
   - Copy all variables from `.env.local`
   - Paste into Vercel environment variables
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel URL

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your live site!

### Setup Stripe Webhook (Production)

1. In Stripe Dashboard, go to "Developers" > "Webhooks"
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the **Signing secret** (`whsec_...`)
7. Add to Vercel environment variables:
   \`\`\`
   STRIPE_WEBHOOK_SECRET=whsec_...
   \`\`\`
8. Redeploy your app

---

## Troubleshooting

### Clerk Authentication Issues

**Problem**: Redirect loop or "Invalid redirect URL"

**Solution**:
1. Check Clerk paths match your routes
2. Verify middleware.ts is configured correctly
3. Clear browser cookies and try again

### Supabase Connection Errors

**Problem**: "Invalid API key" or connection refused

**Solution**:
1. Verify URL and keys are correct
2. Check if you're using anon key for client, service key for server
3. Ensure database is not paused (free tier)

### OpenAI API Errors

**Problem**: "Insufficient quota" or "Invalid API key"

**Solution**:
1. Verify API key is correct
2. Check billing in OpenAI dashboard
3. Add payment method if not already added
4. Wait a few minutes after adding payment

### Stripe Webhook Not Working

**Problem**: Subscription not updating after payment

**Solution**:
1. Verify webhook URL is correct
2. Check webhook signing secret in env variables
3. Use Stripe CLI to test locally:
   \`\`\`bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   \`\`\`

### Build Errors

**Problem**: TypeScript or build errors

**Solution**:
1. Delete node_modules and reinstall:
   \`\`\`bash
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`
2. Clear Next.js cache:
   \`\`\`bash
   rm -rf .next
   npm run dev
   \`\`\`

---

## Next Steps

Once your app is running:

1. ✅ Test all features thoroughly
2. ✅ Switch to Stripe live mode for production
3. ✅ Set up monitoring (Vercel Analytics, Sentry)
4. ✅ Configure custom domain
5. ✅ Add legal pages (Terms, Privacy Policy)
6. ✅ Set up customer support (email, chat)

---

## Getting Help

If you encounter issues not covered here:

1. Check the main README.md
2. Review error logs in Vercel
3. Check third-party service status pages
4. Open an issue on GitHub

Good luck building with LegalDraft AI! 🚀
