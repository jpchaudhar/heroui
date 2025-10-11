import Link from "next/link";

const templates = [
  { slug: "nda", title: "NDA", category: "Business" },
  { slug: "lease", title: "Lease", category: "Property" },
  { slug: "offer-letter", title: "Offer Letter", category: "Employment" },
];

export default function TemplatesPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Templates</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Link
            key={t.slug}
            href={`/dashboard/templates/${t.slug}`}
            className="border rounded p-4 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <div className="text-lg font-medium">{t.title}</div>
            <div className="text-xs text-gray-500">{t.category}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
