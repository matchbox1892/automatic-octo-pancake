"use client";

import { useState } from "react";
import { useNarrativeStore } from "@/lib/store";

export function NarrativePreview() {
  const narrative = useNarrativeStore((state) => state.narrative);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleCopy = async () => {
    if (!narrative) return;
    try {
      await navigator.clipboard.writeText(narrative);
      setCopied(true);
      setCopyError(null);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy narrative to clipboard", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error ?? "");
      setCopyError(
        errorMessage
          ? `Failed to copy narrative to clipboard: ${errorMessage}`
          : "Failed to copy narrative to clipboard."
      );
      setCopied(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Narrative Preview</h2>
        <p className="text-sm text-slate-500">Live SOAP output generated from your selections.</p>
      </div>
      <div className="flex-1 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
        {narrative ? (
          <pre className="whitespace-pre-wrap font-sans text-slate-800">{narrative}</pre>
        ) : (
          <p className="text-slate-400">Complete the sections to generate a narrative.</p>
        )}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!narrative}
        className="inline-flex items-center justify-center rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {copied ? "Copied!" : "Copy Narrative"}
      </button>
      {copyError ? (
        <p className="text-sm text-red-600" role="status">
          {copyError}
        </p>
      ) : null}
    </div>
  );
}
