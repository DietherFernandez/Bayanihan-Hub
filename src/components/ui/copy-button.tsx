"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({
  textToCopy,
  label = "Copy",
  copiedLabel = "Copied!",
  className = "",
  showText = true,
}: {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  showText?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`${label}: ${textToCopy}`}
      className={`inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition hover:border-[#17365D] hover:text-[#17365D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17365D] ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          {showText && <span className="text-emerald-700">{copiedLabel}</span>}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          {showText && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
