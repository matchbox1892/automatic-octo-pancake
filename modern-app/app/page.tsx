"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NarrativeSchema, type NarrativeFormData } from "@/lib/form-schema";
import { defaultFormValues } from "@/lib/default-values";
import { sections } from "@/lib/content-loader";
import { SectionFields } from "@/components/SectionFields";
import { NarrativePreview } from "@/components/NarrativePreview";
import { DebugPanel } from "@/components/DebugPanel";
import { PhaseProgress } from "@/components/PhaseProgress";
import { useNarrativeStore } from "@/lib/store";
import { renderNarrative } from "@/lib/renderNarrative";

const phaseDefinitions = [
  {
    id: "foundation",
    title: "Phase 1 · SOAP Inputs",
    description: "Capture subjective history and objective findings."
  },
  {
    id: "assessment",
    title: "Phase 2 · Clinical Assessment",
    description: "Summarize working diagnosis and key findings."
  },
  {
    id: "plan",
    title: "Phase 3 · Plan & Narrative",
    description: "Confirm treatment plan and export narrative."
  }
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "subjective");
  const formMethods = useForm<NarrativeFormData>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(NarrativeSchema),
    mode: "onChange"
  });
  const setFormData = useNarrativeStore((state) => state.setFormData);
  const setNarrative = useNarrativeStore((state) => state.setNarrative);
  const markValidated = useNarrativeStore((state) => state.markValidated);
  const formData = useNarrativeStore((state) => state.formData);
  const narrative = useNarrativeStore((state) => state.narrative);

  useEffect(() => {
    setFormData(defaultFormValues);
    setNarrative(renderNarrative(defaultFormValues));
    markValidated();
  }, [markValidated, setFormData, setNarrative]);

  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      const result = NarrativeSchema.safeParse(values);
      if (result.success) {
        setFormData(result.data);
        const narrativeOutput = renderNarrative(result.data);
        setNarrative(narrativeOutput);
        markValidated();
      }
    });
    return () => subscription.unsubscribe();
  }, [formMethods, setFormData, setNarrative, markValidated]);

  const phases = useMemo(() => {
    const hasChiefComplaint =
      Boolean(formData.subjective.noChiefComplaint) ||
      Boolean(formData.subjective.chiefComplaint?.trim());
    const completion = {
      foundation:
        hasChiefComplaint && Boolean(formData.objective.primaryImpression),
      assessment:
        Boolean(formData.assessment.summary) || formData.assessment.clinicalFindings.length > 0,
      plan: Boolean(formData.plan.transportMode) && Boolean(narrative)
    };

    let activeFound = false;
    return phaseDefinitions.map((phase) => {
      if (completion[phase.id as keyof typeof completion]) {
        return { ...phase, status: "complete" as const };
      }
      if (!activeFound) {
        activeFound = true;
        return { ...phase, status: "current" as const };
      }
      return { ...phase, status: "upcoming" as const };
    });
  }, [formData, narrative]);

  const activeSectionConfig = sections.find((section) => section.id === activeSection) ?? sections[0];

  return (
    <FormProvider {...formMethods}>
      <div className="bg-gradient-to-b from-brand-50 via-white to-slate-100">
        <div className="px-4 py-10 sm:px-6 lg:px-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <header className="rounded-3xl border border-brand-100 bg-white/80 p-8 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">MatchCloud Modernization</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                SOAP Narrative Studio
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Build reports with configurable content, live previews, and structured data ready for future mileage
                automation and GPT-assisted polishing.
              </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[260px_1fr_320px]">
              <aside className="space-y-4">
                <PhaseProgress phases={phases} />
                <nav className="rounded-2xl border border-slate-200 bg-white p-4 shadow">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Form Sections</p>
                  <ul className="mt-3 space-y-2">
                    {sections.map((section) => {
                      const isActive = section.id === activeSection;
                      return (
                        <li key={section.id}>
                          <button
                            type="button"
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                              isActive
                                ? "bg-brand-600 text-white shadow"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {section.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </aside>

              <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{activeSectionConfig.title}</h2>
                  {activeSectionConfig.description && (
                    <p className="mt-2 text-sm text-slate-600">{activeSectionConfig.description}</p>
                  )}
                </div>
                <SectionFields section={activeSectionConfig} basePath={activeSectionConfig.id} />
              </section>

              <div className="space-y-4">
                <NarrativePreview />
                <DebugPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
