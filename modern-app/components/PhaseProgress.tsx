"use client";

import clsx from "clsx";

type Phase = {
  id: string;
  title: string;
  description: string;
  status: "complete" | "current" | "upcoming";
};

type PhaseProgressProps = {
  phases: Phase[];
};

export function PhaseProgress({ phases }: PhaseProgressProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600">Modernization Checkpoints</h2>
      <ol className="space-y-2">
        {phases.map((phase) => (
          <li
            key={phase.id}
            className={clsx(
              "rounded-lg border px-3 py-2",
              phase.status === "complete" && "border-emerald-200 bg-emerald-50 text-emerald-800",
              phase.status === "current" && "border-brand-300 bg-brand-50 text-brand-800",
              phase.status === "upcoming" && "border-slate-200 bg-slate-50 text-slate-600"
            )}
          >
            <p className="text-sm font-semibold">{phase.title}</p>
            <p className="text-xs text-slate-600">{phase.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
