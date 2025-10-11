"use client";
import axios from "axios";
import { useState } from "react";

export default function DocumentsPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Document");

  async function download(path: string) {
    const url = process.env.NEXT_PUBLIC_API_URL + path;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, title }),
    });
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = path.endsWith("pdf") ? `${title}.pdf` : `${title}.docx`;
    a.click();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-2">My Documents</h2>
      <input
        className="border rounded p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border rounded p-2 w-full h-60"
        placeholder="Paste content or generate from a template"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-3">
        <button className="rounded border px-4 py-2" onClick={() => download("/documents/export/pdf")}>
          Download PDF
        </button>
        <button className="rounded border px-4 py-2" onClick={() => download("/documents/export/docx")}>
          Download DOCX
        </button>
      </div>
    </div>
  );
}
