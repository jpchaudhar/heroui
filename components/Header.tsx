import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.06)] bg-[color:var(--bg)]/80 backdrop-blur">
      <div className="container-page h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-brand-teal-500" />
          <span className="text-lg font-semibold">Agentic E‑commerce AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[color:var(--muted)]">
          <Link className="hover:text-white" href="#analytics">Analytics</Link>
          <Link className="hover:text-white" href="#suggestions">Product AI</Link>
          <Link className="hover:text-white" href="#campaigns">Campaigns</Link>
          <Link className="hover:text-white" href="#forecast">Forecasts</Link>
        </nav>
      </div>
    </header>
  );
}