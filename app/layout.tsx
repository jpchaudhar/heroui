import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'LegalDraft AI - Professional Legal Document Generator',
  description: 'AI-powered legal document generation for law firms, startups, and individuals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-50">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}