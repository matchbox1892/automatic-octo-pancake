import type { NarrativeFormData } from "@/lib/form-schema";

export const defaultFormValues: NarrativeFormData = {
  subjective: {
    chiefComplaint: "",
    historyProvider: "",
    symptoms: [],
    painScale: "",
    notes: "",
    opqrstOnset: "",
    opqrstProvocation: "",
    opqrstQuality: "",
    opqrstRadiation: "",
    opqrstSeverity: "",
    opqrstTimeCourse: "",
    sampleAllergies: "",
    sampleMedications: "",
    samplePastHistory: "",
    sampleLastIntake: "",
    sampleEvents: ""
  },
  objective: {
    primaryImpression: "",
    secondaryImpression: "",
    vitals: [
      {
        time: "",
        heartRate: "",
        bloodPressure: "",
        respiratoryRate: "",
        spo2: ""
      }
    ],
    objectiveNotes: ""
  },
  assessment: {
    summary: "",
    differential: "",
    clinicalFindings: []
  },
  plan: {
    treatments: [],
    transportMode: "",
    transportOtherDetails: "",
    destination: "",
    mileage: "",
    planNotes: ""
  }
};
