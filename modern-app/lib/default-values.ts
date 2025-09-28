import type { NarrativeFormData } from "@/lib/form-schema";

export const defaultFormValues: NarrativeFormData = {
  subjective: {
    chiefComplaint: "",
    noChiefComplaint: false,
    historyProvider: "",
    pertinentPositives: [],
    pertinentNegatives: [],
    painScale: "",
    patientNarrative: "",
    opqrstOnset: "",
    opqrstProvokes: "",
    opqrstQuality: "",
    opqrstRadiates: "",
    opqrstSeverityDescription: "",
    opqrstTime: "",
    historySimilar: "",
    notes: ""
  },
  objective: {
    age: "",
    ageUnits: "",
    gender: "",
    weightKg: "",
    weightLb: "",
    generalImpression: "",
    airwayStatus: "",
    breathingStatus: "",
    circulationStatus: "",
    skinFindings: "",
    neuroStatus: "",
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
