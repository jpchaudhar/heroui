import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "LegalDraft AI",
  description: "Generate professional legal documents with AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
