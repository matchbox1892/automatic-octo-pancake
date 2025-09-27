"use client";

import { useMemo } from "react";
import { useNarrativeStore } from "@/lib/store";

export function DebugPanel() {
  const formData = useNarrativeStore((state) => state.formData);
  const lastValidatedAt = useNarrativeStore((state) => state.lastValidatedAt);

  const payload = useMemo(
    () => JSON.stringify(formData, null, 2),
    [formData]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-900/95 p-4 text-xs text-slate-100 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Debug payload</h3>
        {lastValidatedAt && (
          <span className="text-[10px] uppercase tracking-wide text-slate-400">
            Updated {new Date(lastValidatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
      <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
        {payload}
      </pre>
    </div>
  );
}
