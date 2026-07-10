"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const basePath = slug.includes("dieulinnapoleon.com") ? "" : (typeof window !== "undefined" && window.location.pathname.includes("/quotes/") ? "/quotes/" : "/insights/");
  const url = basePath ? "https://dieulinnapoleon.com" + basePath + slug : slug;

  const copyLink = async () => {
    try {
      // Use the canonical URL to avoid issues with Google Translate
      const basePath = typeof window !== "undefined" && window.location.pathname.includes("/quotes/") ? "/quotes/" : "/insights/";
      const canonical = "https://dieulinnapoleon.com" + basePath + slug;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(canonical);
      } else {
        // Fallback for older browsers or translated pages
        const textarea = document.createElement("textarea");
        textarea.value = canonical;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: open in new window for manual copy
      window.prompt("Copy this link:", "https://dieulinnapoleon.com/insights/" + slug);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-8 mb-8 notranslate" translate="no">
      <span className="text-sm text-gray-400 font-medium">Share:</span>
      <a href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] text-xs font-semibold hover:bg-[#0A66C2]/20 transition-colors">LinkedIn</a>
      <a href={"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2]/10 text-[#1877F2] text-xs font-semibold hover:bg-[#1877F2]/20 transition-colors">Facebook</a>
      <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors">X / Twitter</a>
      <button onClick={copyLink} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors">
        {copied ? <><Check size={12} /> Copied!</> : <><Link2 size={12} /> Copy Link</>}
      </button>
    </div>
  );
}
