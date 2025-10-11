import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r p-4 space-y-4">
        <Link href="/dashboard" className="font-semibold text-lg block">
          LegalDraft AI
        </Link>
        <nav className="space-y-2">
          <Link href="/dashboard/templates" className="block">Templates</Link>
          <Link href="/dashboard/documents" className="block">My Documents</Link>
          <Link href="/dashboard/billing" className="block">Billing</Link>
          <Link href="/dashboard/account" className="block">Account</Link>
        </nav>
      </aside>
      <div className="p-6">
        <header className="flex justify-end mb-6">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>{redirect("/sign-in")}</SignedOut>
        </header>
        {children}
      </div>
    </div>
  );
}
