import { z } from "zod";

const VitalSchema = z.object({
  time: z.string().optional(),
  heartRate: z.string().optional(),
  bloodPressure: z.string().optional(),
  respiratoryRate: z.string().optional(),
  spo2: z.string().optional()
});

export const SubjectiveSchema = z.object({
  chiefComplaint: z.string().optional(),
  noChiefComplaint: z.boolean().default(false),
  historyProvider: z.string().optional(),
  symptoms: z.array(z.string()).default([]),
  painScale: z.string().optional(),
  patientNarrative: z.string().optional(),
  opqrstOnset: z.string().optional(),
  opqrstProvokes: z.string().optional(),
  opqrstQuality: z.string().optional(),
  opqrstRadiates: z.string().optional(),
  opqrstSeverityDescription: z.string().optional(),
  opqrstTime: z.string().optional(),
  historySimilar: z.string().optional(),
  notes: z.string().optional()
});

export const ObjectiveSchema = z.object({
  age: z.string().optional(),
  ageUnits: z.string().optional(),
  gender: z.string().optional(),
  weightKg: z.string().optional(),
  weightLb: z.string().optional(),
  generalImpression: z.string().optional(),
  airwayStatus: z.string().optional(),
  breathingStatus: z.string().optional(),
  circulationStatus: z.string().optional(),
  skinFindings: z.string().optional(),
  neuroStatus: z.string().optional(),
  primaryImpression: z.string().optional(),
  secondaryImpression: z.string().optional(),
  vitals: z.array(VitalSchema).default([{}]),
  objectiveNotes: z.string().optional()
});

export const AssessmentSchema = z.object({
  summary: z.string().optional(),
  differential: z.string().optional(),
  clinicalFindings: z.array(z.string()).default([])
});

export const PlanSchema = z.object({
  treatments: z.array(z.string()).default([]),
  transportMode: z.string().optional(),
  transportOtherDetails: z.string().optional(),
  destination: z.string().optional(),
  mileage: z.string().optional(),
  planNotes: z.string().optional()
});

export const NarrativeSchema = z.object({
  subjective: SubjectiveSchema,
  objective: ObjectiveSchema,
  assessment: AssessmentSchema,
  plan: PlanSchema
});

export type NarrativeFormData = z.infer<typeof NarrativeSchema>;
