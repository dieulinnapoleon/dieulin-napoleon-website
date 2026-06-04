"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl py-4 px-6">
        <CheckCircle size={18} />
        <span className="text-sm font-medium">Thank you! You will be notified of new insights.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} translate="no" translate="no" className="flex gap-2 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-3 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-charcoal transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {status === "loading" ? "..." : <>Subscribe <ArrowRight size={14} /></>}
      </button>
    </form>
  );
}
