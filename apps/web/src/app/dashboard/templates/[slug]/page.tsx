"use client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";

const formSchema = z.object({
  party1: z.string().min(1),
  party2: z.string().min(1),
  company: z.string().optional(),
  date: z.string().min(1),
  details: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function TemplateFormPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/documents/generate",
        {
          templateSlug: slug,
          inputs: values,
        }
      );
      setResult(res.data.content);
    } catch (e) {
      console.error(e);
      alert("Failed to generate document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Generate {String(slug)}</h2>
      <form className="grid gap-4 max-w-xl" onSubmit={handleSubmit(onSubmit)}>
        <input className="border rounded p-2" placeholder="Party 1" {...register("party1")} />
        {errors.party1 && <p className="text-red-600 text-sm">Required</p>}
        <input className="border rounded p-2" placeholder="Party 2" {...register("party2")} />
        {errors.party2 && <p className="text-red-600 text-sm">Required</p>}
        <input className="border rounded p-2" placeholder="Company (optional)" {...register("company")} />
        <input className="border rounded p-2" placeholder="Date" {...register("date")} />
        {errors.date && <p className="text-red-600 text-sm">Required</p>}
        <textarea className="border rounded p-2" placeholder="Details/clauses" rows={6} {...register("details")} />
        {errors.details && <p className="text-red-600 text-sm">Required</p>}
        <button disabled={loading} className="rounded bg-black text-white px-4 py-2">
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Preview</h3>
          <pre className="whitespace-pre-wrap border rounded p-4 bg-gray-50 dark:bg-gray-900">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
