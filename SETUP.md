# LegalDraft AI - Detailed Setup Guide

This guide will walk you through setting up all the required services and API keys for LegalDraft AI.

## 🔑 Required API Keys and Services

### 1. Clerk Authentication Setup

**Step 1: Create Clerk Account**
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose "Next.js" as your framework

**Step 2: Configure Authentication**
1. In Clerk dashboard, go to "User & Authentication" → "Email, Phone, Username"
2. Enable "Email address" and "Password"
3. Go to "User & Authentication" → "Social Connections"
4. Enable "Google" if you want Google login

**Step 3: Set Redirect URLs**
1. Go to "Paths" in Clerk dashboard
2. Set the following paths:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

**Step 4: Get API Keys**
1. Go to "API Keys" in Clerk dashboard
2. Copy the "Publishable key" and "Secret key"

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 2. Supabase Database Setup

**Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Choose a region close to your users
4. Set a strong database password

**Step 2: Set up Database Schema**
1. Go to "SQL Editor" in Supabase dashboard
2. Copy the entire contents of `database/schema.sql`
3. Paste and run the SQL to create all tables and functions

**Step 3: Configure Row Level Security (Optional)**
1. Go to "Authentication" → "Policies"
2. Set up RLS policies for your tables if needed

**Step 4: Get API Keys**
1. Go to "Settings" → "API"
2. Copy the "Project URL" and "anon public" key
3. Copy the "service_role secret" key (keep this secure!)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. OpenAI API Setup

**Step 1: Create OpenAI Account**
1. Go to [platform.openai.com](https://platform.openai.com) and sign up
2. Add billing information (required for API access)
3. Purchase credits or set up auto-billing

**Step 2: Generate API Key**
1. Go to "API Keys" in OpenAI dashboard
2. Click "Create new secret key"
3. Copy the key immediately (you won't see it again)

**Step 3: Verify GPT-4 Access**
1. Check that your account has GPT-4 access
2. If not, you may need to upgrade your plan or wait for access

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Stripe Payment Setup

**Step 1: Create Stripe Account**
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete business verification if required
3. Switch to "Test mode" for development

**Step 2: Create Products and Prices**
1. Go to "Products" in Stripe dashboard
2. Create two products:

**Pro Plan Product:**
- Name: "LegalDraft AI Pro"
- Pricing: $29/month recurring
- Copy the Price ID (starts with `price_`)

**Firm Plan Product:**
- Name: "LegalDraft AI Firm"
- Pricing: $99/month recurring
- Copy the Price ID (starts with `price_`)

**Step 3: Set up Webhooks**
1. Go to "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret

**Step 4: Get API Keys**
1. Go to "Developers" → "API keys"
2. Copy "Publishable key" and "Secret key"

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxx
STRIPE_FIRM_PRICE_ID=price_xxxxxxxxxx
```

### 5. App Configuration

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, change this to your actual domain:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔧 Complete .env.local File

Create a `.env.local` file in your project root with all the values:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRO_PRICE_ID=price_your_pro_price_id_here
STRIPE_FIRM_PRICE_ID=price_your_firm_price_id_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🧪 Testing the Setup

### 1. Test Authentication
1. Start the development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Try signing up with a test email
4. Verify you can access the dashboard

### 2. Test Database Connection
1. Check if user data appears in Supabase dashboard
2. Try creating a document to test database writes

### 3. Test AI Generation
1. Go to "Generate Document" in the dashboard
2. Fill out a form and generate a document
3. Verify the AI enhancement works

### 4. Test Stripe Integration
1. Try upgrading to a paid plan
2. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

### 5. Test Webhooks (Production)
1. Use ngrok or similar tool for local testing
2. Update webhook URL in Stripe dashboard
3. Test subscription events

## 🚨 Security Notes

1. **Never commit `.env.local` to version control**
2. **Use different API keys for development and production**
3. **Regularly rotate API keys**
4. **Set up proper CORS policies**
5. **Enable Stripe webhook signature verification**

## 🐛 Common Issues

**"Invalid API key" errors:**
- Double-check all API keys are correct
- Ensure no extra spaces or quotes
- Verify keys are for the correct environment (test/live)

**Database connection issues:**
- Check Supabase URL format
- Verify database schema was created
- Check network connectivity

**Stripe webhook failures:**
- Ensure webhook URL is publicly accessible
- Verify webhook secret matches
- Check that all required events are selected

**Authentication redirects not working:**
- Verify Clerk redirect URLs match your routes
- Check middleware configuration
- Ensure environment variables are loaded

## 🎯 Production Deployment

When deploying to production:

1. **Update environment variables** with production values
2. **Switch Stripe to live mode** and update keys
3. **Set up proper domain** for webhooks
4. **Configure CORS** for your domain
5. **Set up monitoring** for API usage and errors

## 📞 Getting Help

If you encounter issues:

1. Check the error logs in your browser console
2. Verify all environment variables are set correctly
3. Test each service individually
4. Check the respective service documentation:
   - [Clerk Docs](https://clerk.com/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [OpenAI Docs](https://platform.openai.com/docs)
   - [Stripe Docs](https://stripe.com/docs)

---

This setup guide should get you up and running with LegalDraft AI. Take your time with each step and test thoroughly before moving to production!