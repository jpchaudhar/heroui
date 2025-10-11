"use client";
import { useEffect, useState } from "react";

export default function DocumentDetail({ params }: { params: { id: string } }) {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    // placeholder: in a real app, fetch document by id
    const stored = localStorage.getItem(`doc-${params.id}`);
    if (stored) setText(stored);
  }, [params.id]);

  const download = async (format: "pdf" | "docx") => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/documents/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, format }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Document</h1>
      <div className="prose max-w-none whitespace-pre-wrap rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        {text}
      </div>
      <div className="flex gap-3">
        <button onClick={() => download("pdf")} className="rounded-md bg-blue-600 px-4 py-2 text-white">Download PDF</button>
        <button onClick={() => download("docx")} className="rounded-md bg-gray-700 px-4 py-2 text-white">Download DOCX</button>
      </div>
    </main>
  );
}
