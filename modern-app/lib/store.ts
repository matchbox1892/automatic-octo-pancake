import { create } from "zustand";
import type { NarrativeFormData } from "@/lib/form-schema";

export type NarrativeState = {
  formData: NarrativeFormData;
  narrative: string;
  lastValidatedAt?: number;
  setFormData: (data: NarrativeFormData) => void;
  setNarrative: (value: string) => void;
  markValidated: () => void;
};

export const useNarrativeStore = create<NarrativeState>((set) => ({
  formData: {
    subjective: { chiefComplaint: "", historyProvider: "", symptoms: [], painScale: "", notes: "" },
    objective: { primaryImpression: "", secondaryImpression: "", vitals: [], objectiveNotes: "" },
    assessment: { summary: "", differential: "", clinicalFindings: [] },
    plan: { treatments: [], transportMode: "", destination: "", mileage: "", planNotes: "" }
  },
  narrative: "",
  setFormData: (data) => set({ formData: data }),
  setNarrative: (value) => set({ narrative: value }),
  markValidated: () => set({ lastValidatedAt: Date.now() })
}));
