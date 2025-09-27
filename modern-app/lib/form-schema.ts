import { z } from "zod";
import { VitalSignsSchema } from "./vital-signs";

export const ThreeStateSchema = z.object({
  state: z.enum(["none", "minus", "plus"]).default("none"),
  details: z.string().optional(),
});

export const ApgarScoreSchema = z.object({
  oneMinute: z.object({
    time: z.literal("1min"),
    scores: z.record(z.number()),
    total: z.number(),
  }).optional(),
  fiveMinute: z.object({
    time: z.literal("5min"),
    scores: z.record(z.number()),
    total: z.number(),
  }).optional(),
  tenMinute: z.object({
    time: z.literal("10min"),
    scores: z.record(z.number()),
    total: z.number(),
  }).optional(),
});

export const SubjectiveSchema = z.object({
  chiefComplaint: z.string().optional(),
  historyProvider: z.string().optional(),
  symptoms: z.array(z.string()).default([]),
  painScale: z.string().optional(),
  notes: z.string().optional()
});

export const ObjectiveSchema = z.object({
  primaryImpression: z.string().optional(),
  secondaryImpression: z.string().optional(),
  vitals: z.array(VitalSignsSchema).default([{}]),
  unremarkable: z.boolean().default(false),
  isTrauma: z.boolean().default(false),
  assessmentFindings: z.record(ThreeStateSchema).default({}),
  apgarScores: ApgarScoreSchema.optional(),
  objectiveNotes: z.string().optional()
});

export const AssessmentSchema = z.object({
  summary: z.string().optional(),
  differential: z.string().optional(),
  clinicalFindings: z.array(z.string()).default([]),
  unremarkable: z.boolean().default(false),
  findings: z.record(ThreeStateSchema).default({})
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
