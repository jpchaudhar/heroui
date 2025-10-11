"use client";
import { useEffect, useMemo, useState } from "react";

export default function NewDocumentPage() {
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [template, setTemplate] = useState<any>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("template");
    if (t) setTemplateId(t);
  }, []);

  useEffect(() => {
    if (!templateId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/templates/${templateId}`)
      .then((r) => r.json())
      .then((data) => {
        setTemplate(data.template);
        const initial: Record<string, string> = {};
        (data.template.placeholders as string[]).forEach((ph: string) => {
          initial[ph] = "";
        });
        setInputs(initial);
      });
  }, [templateId]);

  const disabled = useMemo(() => Object.values(inputs).some((v) => !v), [inputs]);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/documents/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, inputs, model: "gpt-4o-mini" }),
      });
      const data = await res.json();
      setResult(data.text);
      const id = Math.random().toString(36).slice(2, 10);
      localStorage.setItem(`doc-${id}`, data.text);
      history.replaceState(null, "", `/documents/${id}`);
    } finally {
      setLoading(false);
    }
  };

  if (!templateId) return <div className="p-6">Select a template first.</div>;
  if (!template) return <div className="p-6">Loading template...</div>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">New Document</h1>
      <div className="space-y-4">
        {template.placeholders.map((ph: string) => (
          <div key={ph} className="grid gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">{ph}</label>
            <input
              className="rounded-md border px-3 py-2 dark:border-gray-800 dark:bg-gray-900"
              value={inputs[ph] ?? ""}
              onChange={(e) => setInputs((s) => ({ ...s, [ph]: e.target.value }))}
            />
          </div>
        ))}
        <button
          onClick={generate}
          disabled={disabled || loading}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {result && (
        <div className="prose max-w-none whitespace-pre-wrap rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          {result}
        </div>
      )}
    </main>
  );
}
