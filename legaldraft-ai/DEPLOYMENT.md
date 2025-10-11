# Deployment Guide

This guide covers deploying LegalDraft AI to various platforms.

## Table of Contents

1. [Vercel (Recommended)](#vercel-recommended)
2. [Netlify](#netlify)
3. [Railway](#railway)
4. [Render](#render)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Vercel (Recommended)

Vercel is the recommended platform as it's built by the creators of Next.js.

### Prerequisites

- GitHub account with your code pushed
- All environment variables ready

### Steps

1. **Sign Up / Log In**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" > "Project"
   - Select your repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**
   
   Click "Environment Variables" and add all from your `.env.local`:
   
   \`\`\`
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   OPENAI_API_KEY
   STRIPE_SECRET_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   STRIPE_PRO_PRICE_ID
   STRIPE_FIRM_PRICE_ID
   \`\`\`
   
   ⚠️ Update `NEXT_PUBLIC_APP_URL` to your Vercel URL:
   \`\`\`
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   \`\`\`

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Visit your live site!

6. **Configure Custom Domain (Optional)**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

7. **Setup Stripe Webhook**
   - In Stripe Dashboard: Developers > Webhooks
   - Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy signing secret
   - Add to Vercel env vars: `STRIPE_WEBHOOK_SECRET`
   - Redeploy

8. **Update Clerk URLs**
   - In Clerk Dashboard: Configure > Paths
   - Update all URLs to use your Vercel domain

### Continuous Deployment

Vercel automatically deploys when you push to your main branch!

\`\`\`bash
git add .
git commit -m "Update feature"
git push origin main
# Automatically deploys to Vercel
\`\`\`

---

## Netlify

### Steps

1. **Sign Up / Log In**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site" > "Import an existing project"
   - Choose GitHub
   - Select your repository

3. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables (same as Vercel)

4. **Deploy**
   - Click "Deploy site"
   - Configure Stripe webhook with Netlify URL
   - Update Clerk redirect URLs

---

## Railway

### Steps

1. **Sign Up**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select repository

3. **Add Variables**
   - Click "Variables" tab
   - Add all environment variables

4. **Configure Start Command**
   - Add start command: `npm run start`
   - Set port: `3000`

5. **Deploy**
   - Railway builds and deploys automatically
   - Get your public URL
   - Configure webhooks and redirects

---

## Render

### Steps

1. **Sign Up**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **New Web Service**
   - Click "New" > "Web Service"
   - Connect repository

3. **Configure**
   - Name: legaldraft-ai
   - Environment: Node
   - Build command: `npm install && npm run build`
   - Start command: `npm run start`

4. **Add Environment Variables**
   - Click "Environment" tab
   - Add all variables

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Configure webhooks and redirects

---

## Post-Deployment Checklist

After deploying to any platform, complete these steps:

### 1. Verify Deployment

- [ ] Site loads correctly
- [ ] Sign up works
- [ ] Sign in works
- [ ] Dashboard displays
- [ ] Templates load
- [ ] Document generation works
- [ ] PDF export works
- [ ] DOCX export works (Pro plan)

### 2. Configure Third-Party Services

**Clerk:**
- [ ] Update redirect URLs to production domain
- [ ] Test Google OAuth
- [ ] Verify email delivery

**Stripe:**
- [ ] Set up webhook with production URL
- [ ] Test webhook delivery (use Stripe CLI)
- [ ] Switch to live mode when ready
- [ ] Test subscription flow

**Supabase:**
- [ ] Verify database connection
- [ ] Check API rate limits
- [ ] Set up backups
- [ ] Configure row-level security

**OpenAI:**
- [ ] Monitor usage
- [ ] Set spending limits
- [ ] Configure error alerts

### 3. Set Up Monitoring

- [ ] Add Vercel Analytics (free)
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation

### 4. Performance Optimization

- [ ] Enable Vercel Edge Functions
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable compression

### 5. Security

- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CORS
- [ ] Set up CSP headers
- [ ] Review security headers

### 6. SEO & Analytics

- [ ] Add Google Analytics
- [ ] Configure meta tags
- [ ] Set up sitemap
- [ ] Add robots.txt

### 7. Legal & Compliance

- [ ] Add Privacy Policy
- [ ] Add Terms of Service
- [ ] Configure cookie consent
- [ ] Set up GDPR compliance

### 8. Go Live Checklist

- [ ] Test with real payment (then refund)
- [ ] Invite beta users
- [ ] Set up customer support email
- [ ] Create knowledge base
- [ ] Launch! 🚀

---

## Rollback Procedure

If something goes wrong:

### Vercel
1. Go to Deployments
2. Find last working deployment
3. Click "..." > "Promote to Production"

### Other Platforms
Check their docs for rollback procedures.

---

## Scaling Considerations

As your app grows:

1. **Database**: Upgrade Supabase plan
2. **API**: Implement rate limiting
3. **CDN**: Use for static assets
4. **Caching**: Add Redis for sessions
5. **Queue**: Add job queue for document generation

---

## Cost Estimates

### Free Tier (Development)
- Vercel: Free
- Supabase: Free (up to 500MB)
- Clerk: Free (up to 5,000 users)
- Stripe: Free (pay-as-you-go)
- OpenAI: ~$5-20/month depending on usage

### Production (100 users)
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Clerk Pro: $25/month
- OpenAI: ~$50-100/month
- **Total: ~$120-170/month**

### Scale (1,000+ users)
- Consider custom infrastructure
- Use reserved instances
- Negotiate enterprise pricing

---

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)
- Railway: [help.railway.app](https://help.railway.app)
- Render: [render.com/docs](https://render.com/docs)

Happy deploying! 🎉
