# LegalDraft AI - AI-Powered Legal Document Generation

A comprehensive SaaS web application that automatically generates professional legal documents for law firms, startups, and individuals using AI.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login/signup with Clerk (email + password or Google OAuth)
- **Document Dashboard**: Create and manage legal documents with an intuitive interface
- **AI Document Generator**: Uses OpenAI GPT-4 to generate professional legal documents
- **Template Library**: Pre-built templates for Business, Employment, Property, and Litigation
- **Export Options**: Download documents as PDF or DOCX
- **Subscription System**: Stripe-powered billing with Free, Pro, and Firm plans
- **Admin Dashboard**: Manage templates and users
- **Responsive Design**: Works seamlessly on mobile and desktop

### Document Types
- **Business**: NDAs, Contracts, Agreements
- **Employment**: Offer Letters, Employment Contracts, Non-Compete Agreements
- **Property**: Lease Agreements, Purchase Agreements, Property Contracts
- **Litigation**: Legal Notices, Settlement Agreements, Court Documents

### Subscription Plans
- **Free**: 3 documents/month, basic templates, PDF export
- **Pro**: $29/month - Unlimited documents, all templates, no watermarks
- **Firm**: $99/month - Everything in Pro + 5 team users + custom templates

## 🛠️ Tech Stack

- **Frontend**: React 18, Next.js 14, TypeScript, TailwindCSS
- **Backend**: Node.js, Express (API Routes)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Clerk
- **Payments**: Stripe API
- **AI Engine**: OpenAI GPT-4
- **UI Components**: Radix UI, Lucide React
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Clerk account
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd legaldraft-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Stripe
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
   - This will create all necessary tables and insert default templates

5. **Set up Clerk Authentication**
   - Create a Clerk account and application
   - Configure OAuth providers (Google, etc.)
   - Add your domain to allowed origins

6. **Set up Stripe**
   - Create a Stripe account
   - Get your API keys from the Stripe dashboard
   - Set up webhooks for subscription events

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
legaldraft-ai/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── documents/         # Document management
│   │   ├── templates/         # Template library
│   │   ├── billing/           # Billing and subscriptions
│   │   └── settings/          # User settings
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   └── documents/        # Document-specific components
│   └── lib/                  # Utility functions and configurations
├── supabase/                 # Database schema and migrations
├── public/                   # Static assets
└── README.md
```

## 🔧 API Endpoints

### Documents
- `GET /api/documents` - Get user's documents
- `POST /api/documents` - Create a new document
- `GET /api/documents/[id]` - Get specific document
- `DELETE /api/documents/[id]` - Delete document

### Templates
- `GET /api/templates` - Get available templates
- `GET /api/templates?category=business` - Filter by category

### Billing (Future)
- `POST /api/billing/create-checkout` - Create Stripe checkout session
- `POST /api/billing/webhook` - Handle Stripe webhooks

## 🎨 Customization

### Adding New Document Templates
1. Add template to `supabase/schema.sql`
2. Define template fields in JSON format
3. Template will automatically appear in the UI

### Styling
- Uses TailwindCSS for styling
- Custom CSS variables in `globals.css`
- Component variants in individual component files

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Render**: Use Node.js buildpack
- **Railway**: Connect GitHub repository
- **DigitalOcean App Platform**: Deploy from GitHub

## 🔒 Security Features

- Authentication via Clerk
- Row-level security in Supabase
- API route protection
- Input validation and sanitization
- Secure environment variable handling

## 📊 Monitoring and Analytics

- Built-in error handling and logging
- User activity tracking (future enhancement)
- Document generation metrics (future enhancement)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@legaldraftai.com or join our Discord community.

## 🔮 Future Enhancements

- **AI Review Mode**: Highlight missing clauses or inconsistencies
- **E-sign Integration**: DocuSign API integration
- **Team Collaboration**: Shared documents and permissions
- **Analytics Dashboard**: Document creation metrics and insights
- **Mobile App**: React Native mobile application
- **Advanced Templates**: More specialized legal document types
- **Document Versioning**: Track changes and revisions
- **Bulk Operations**: Generate multiple documents at once

---

Built with ❤️ using Next.js, TypeScript, and OpenAI