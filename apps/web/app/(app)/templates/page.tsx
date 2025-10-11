async function fetchTemplates() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + "/api/templates", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}

export default async function TemplatesPage() {
  const data = await fetchTemplates();
  const templates = data.templates as Array<{id: string; name: string; category: string; description?: string}>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Templates</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.id} className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="text-sm text-gray-500">{t.category}</div>
            <div className="mt-1 text-lg font-medium">{t.name}</div>
            {t.description && <p className="mt-1 text-gray-600 dark:text-gray-300">{t.description}</p>}
            <a href={`/documents/new?template=${t.id}`} className="mt-3 inline-flex text-blue-600 hover:underline">Use template →</a>
          </div>
        ))}
      </div>
    </main>
  );
}
