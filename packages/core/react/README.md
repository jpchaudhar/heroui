# LegalDraft AI - Professional Legal Document Generator

A comprehensive SaaS application that automatically generates professional legal documents for law firms, startups, and individuals using AI.

## 🚀 Features

### Core Functionality
- **AI-Powered Document Generation**: Uses OpenAI GPT-4 to generate professional legal documents
- **User Authentication**: Secure login/signup with Clerk (email + password or Google login)
- **Template Library**: Comprehensive collection of legal document templates organized by category
- **Document Management**: Create, edit, and manage generated documents
- **Export Options**: Download documents as PDF or DOCX format

### Subscription System
- **Free Plan**: 3 documents/month, basic templates, PDF export
- **Pro Plan**: $29/month - Unlimited documents, all templates, no watermarks, DOCX export
- **Firm Plan**: $99/month - Everything in Pro + 5 team members + custom templates

### Template Categories
- **Business**: NDAs, Service Agreements, Partnership Contracts
- **Employment**: Offer Letters, Employment Contracts, Termination Letters
- **Property**: Lease Agreements, Purchase Contracts, Property Disclosures
- **Litigation**: Demand Letters, Legal Notices, Settlement Agreements

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - PostgreSQL database with real-time features
- **Clerk** - Authentication and user management
- **OpenAI API** - AI document generation
- **Stripe** - Payment processing and subscription management

### Document Processing
- **jsPDF** - PDF generation
- **docx** - DOCX document creation
- **React Hook Form** - Form handling and validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- Git

You'll also need accounts and API keys for:
- [Clerk](https://clerk.com) - Authentication
- [Supabase](https://supabase.com) - Database
- [OpenAI](https://openai.com) - AI document generation
- [Stripe](https://stripe.com) - Payment processing

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd legaldraft-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

#### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
3. Update your environment variables with the Supabase URL and keys

#### Database Schema
The application uses the following main tables:
- `users` - User profiles and subscription information
- `document_templates` - Legal document templates
- `documents` - Generated documents
- `subscriptions` - Stripe subscription data
- `team_members` - Team collaboration (for Firm plans)

### 5. Clerk Setup
1. Create a Clerk application
2. Configure authentication providers (Email/Password, Google)
3. Set up redirect URLs in Clerk dashboard
4. Update environment variables with Clerk keys

### 6. OpenAI Setup
1. Create an OpenAI account
2. Generate an API key
3. Add the API key to your environment variables
4. Ensure you have sufficient credits for GPT-4 usage

### 7. Stripe Setup
1. Create a Stripe account
2. Set up products and prices for Pro ($29/month) and Firm ($99/month) plans
3. Configure webhooks endpoint: `your-domain.com/api/webhooks/stripe`
4. Add webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
5. Update environment variables with Stripe keys

### 8. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
legaldraft-ai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── admin/                    # Admin dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── users/
│   ├── api/                      # API routes
│   │   ├── create-checkout-session/
│   │   ├── export/
│   │   ├── generate-document/
│   │   └── webhooks/
│   ├── dashboard/                # Main user dashboard
│   │   ├── billing/
│   │   ├── documents/
│   │   ├── generate/
│   │   ├── templates/
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/                   # Reusable components
├── database/                     # Database schema and migrations
│   └── schema.sql
├── lib/                         # Utility libraries
│   ├── stripe.ts
│   └── supabase.ts
├── middleware.ts                # Clerk authentication middleware
├── package.json
└── README.md
```

## 🔐 Authentication Flow

1. Users sign up/sign in via Clerk
2. User data is synchronized with Supabase
3. Default subscription tier is set to "free"
4. Users can upgrade via Stripe checkout
5. Webhooks update subscription status in real-time

## 💳 Subscription Plans

### Free Plan
- 3 documents per month
- Basic templates only
- PDF export with watermark
- Email support

### Pro Plan ($29/month)
- Unlimited documents
- All templates
- PDF & DOCX export
- No watermarks
- Priority support

### Firm Plan ($99/month)
- Everything in Pro
- 5 team members
- Custom templates
- Advanced analytics
- Dedicated support

## 🤖 AI Document Generation

The AI system works by:
1. Taking user input from dynamic forms
2. Replacing placeholders in legal templates
3. Enhancing content with GPT-4 for professional language
4. Formatting the final document for export

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

Key responsive features:
- Collapsible sidebar navigation
- Mobile-optimized forms
- Touch-friendly buttons and interactions
- Responsive grid layouts

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding New Templates
1. Add template data to the database via admin panel
2. Include template fields configuration
3. Test document generation
4. Update template library UI

### Customizing AI Prompts
Edit the prompts in `app/api/generate-document/route.ts` to modify how AI enhances documents.

## 🐛 Troubleshooting

### Common Issues

**Authentication not working**
- Check Clerk environment variables
- Verify redirect URLs in Clerk dashboard
- Ensure middleware.ts is properly configured

**Database connection issues**
- Verify Supabase URL and keys
- Check if database schema is properly set up
- Ensure RLS policies are configured

**Stripe webhooks failing**
- Verify webhook endpoint URL
- Check webhook secret in environment variables
- Ensure all required webhook events are configured

**AI generation not working**
- Verify OpenAI API key
- Check API usage limits and billing
- Ensure GPT-4 access is enabled

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Contact support via the admin dashboard

## 🎯 Future Enhancements

- [ ] E-signature integration with DocuSign
- [ ] Advanced document collaboration features
- [ ] AI document review and suggestions
- [ ] Mobile app for iOS and Android
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Custom branding for Firm plans
- [ ] API access for enterprise customers

---

Built with ❤️ using Next.js, TypeScript, and AI