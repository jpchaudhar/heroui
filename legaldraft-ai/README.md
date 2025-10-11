# LegalDraft AI 📝

A full-stack SaaS web application that automatically generates professional legal documents using AI. Built for law firms, startups, and individuals who need quick access to high-quality legal documentation.

![LegalDraft AI](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Email/password and Google OAuth via Clerk
- 📄 **AI Document Generation** - GPT-4 powered legal document creation
- 📚 **Template Library** - Pre-built templates across 4 categories (Business, Employment, Property, Litigation)
- 💾 **Export Options** - Download as PDF or DOCX
- 🎨 **Modern UI** - Clean dashboard with dark/light mode toggle
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop

### Subscription Tiers
- **Free**: 3 documents/month, basic templates, PDF export
- **Pro ($29/mo)**: Unlimited documents, all templates, PDF & DOCX export, no watermark
- **Firm ($99/mo)**: Everything in Pro + 5 team members + custom templates

### Additional Features
- 🔄 **Document Management** - View, organize, and download all your documents
- 👥 **Admin Dashboard** - Manage templates, users, and analytics
- 💳 **Stripe Integration** - Secure subscription management
- 🎓 **Onboarding Wizard** - Guided setup for new users
- 🌙 **Dark Mode** - Full theme support

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Custom components with react-icons
- **State Management**: Zustand

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Clerk
- **Payments**: Stripe
- **AI**: OpenAI GPT-4 API
- **File Storage**: Supabase Storage

### Export Libraries
- **PDF**: jsPDF
- **DOCX**: docx library

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- A Supabase account
- A Clerk account
- An OpenAI API key
- A Stripe account

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd legaldraft-ai
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup

Create a `.env.local` file in the root directory:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Fill in all the environment variables (see Configuration section below).

### 4. Database Setup

1. Create a new project in [Supabase](https://supabase.com)
2. Run the SQL schema:
   - Go to Supabase SQL Editor
   - Copy and paste the contents of `lib/supabase/schema.sql`
   - Execute the query
3. Copy your Supabase URL and keys to `.env.local`

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## ⚙️ Configuration

### Clerk Authentication

1. Create a project at [clerk.com](https://clerk.com)
2. Enable Email/Password and Google OAuth providers
3. Copy your Clerk keys to `.env.local`:

\`\`\`
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
\`\`\`

### Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and keys from Settings > API
3. Add to `.env.local`:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

### OpenAI

1. Get your API key from [platform.openai.com](https://platform.openai.com)
2. Add to `.env.local`:

\`\`\`
OPENAI_API_KEY=sk-...
\`\`\`

### Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create products and price IDs for Pro and Firm plans
3. Add to `.env.local`:

\`\`\`
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

4. Set up webhook endpoint at `https://your-domain.com/api/stripe/webhook`
   - Listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy!

\`\`\`bash
# Or use Vercel CLI
npm install -g vercel
vercel
\`\`\`

### Deploy to Other Platforms

The app can also be deployed to:
- **Netlify**: Use Next.js runtime
- **Railway**: Node.js deployment
- **Render**: Web service with Node.js
- **AWS/Google Cloud**: Container deployment

## 📁 Project Structure

\`\`\`
legaldraft-ai/
├── app/
│   ├── api/              # API routes
│   │   ├── documents/    # Document CRUD
│   │   ├── templates/    # Template endpoints
│   │   ├── stripe/       # Stripe webhooks
│   │   └── admin/        # Admin endpoints
│   ├── dashboard/        # Dashboard pages
│   ├── templates/        # Template pages
│   ├── billing/          # Billing page
│   ├── admin/            # Admin dashboard
│   ├── onboarding/       # Onboarding wizard
│   ├── sign-in/          # Auth pages
│   ├── sign-up/
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard components
│   └── templates/        # Template components
├── lib/
│   ├── supabase/         # Supabase client & schema
│   ├── stripe/           # Stripe configuration
│   ├── openai/           # OpenAI integration
│   ├── export/           # PDF/DOCX export
│   └── store.ts          # Zustand state management
├── types/
│   └── index.ts          # TypeScript types
└── middleware.ts         # Clerk middleware
\`\`\`

## 🎯 Usage

### Creating a Document

1. **Sign Up/Login** - Create an account or sign in
2. **Browse Templates** - Go to Templates and choose a document type
3. **Fill Details** - Complete the form with your specific information
4. **Generate** - Click "Generate Document" to create with AI
5. **Download** - Export as PDF or DOCX (DOCX requires Pro plan)

### Managing Subscriptions

1. Go to **Billing** page
2. Choose a plan (Pro or Firm)
3. Enter payment details via Stripe Checkout
4. Manage subscription in the Billing Portal

### Admin Features

Admins can access `/admin` to:
- View platform statistics
- Manage templates
- Monitor user activity

## 🔒 Security

- ✅ Authentication via Clerk (industry-standard security)
- ✅ API routes protected with authentication middleware
- ✅ Row-level security in Supabase
- ✅ Stripe webhooks verified with signatures
- ✅ Environment variables for sensitive data
- ✅ HTTPS enforced in production

## 📊 Database Schema

### Tables

**users**
- id, email, name, subscription_tier, documents_count, timestamps

**templates**
- id, name, category, description, base_template, fields (JSON), is_active, timestamps

**documents**
- id, user_id, template_id, title, content, status, timestamps

**subscriptions**
- id, user_id, stripe_customer_id, stripe_subscription_id, plan, status, timestamps

**team_members** (for Firm plan)
- id, firm_id, user_id, role, timestamps

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@legaldraft.ai
- Documentation: [docs.legaldraft.ai](https://docs.legaldraft.ai)

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- Clerk for authentication
- Supabase for database
- OpenAI for AI capabilities
- Stripe for payments

## 🗺️ Roadmap

- [ ] AI Review Mode - Highlight missing clauses
- [ ] E-signature integration (DocuSign)
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app
- [ ] API for third-party integrations

---

Built with ❤️ by the LegalDraft AI team
