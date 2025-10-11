import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">LegalDraft AI</h1>
      <p className="text-center max-w-2xl text-gray-600 dark:text-gray-300 mb-8">
        Generate professional legal documents in minutes. Templates for Business, Employment,
        Property, and Litigation. Export to PDF or DOCX.
      </p>
      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="rounded-md bg-black text-white dark:bg-white dark:text-black px-6 py-3"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="rounded-md border px-6 py-3"
        >
          Create account
        </Link>
        <Link
          href="/dashboard/templates"
          className="rounded-md border px-6 py-3"
        >
          Browse templates
        </Link>
      </div>
    </main>
  );
}
