"use client";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <SignUp signInUrl="/sign-in" />
    </div>
  );
}
