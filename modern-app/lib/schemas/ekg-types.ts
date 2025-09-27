import { z } from 'zod';

export const ekgTypes = [
  'Continuous Monitoring',
  '3-Lead',
  '4-Lead',
  '12-Lead',
  '15-Lead',
  'Other'
] as const;

export const commonRhythms = [
  'Normal Sinus Rhythm',
  'Sinus Bradycardia',
  'Sinus Tachycardia',
  'Atrial Fibrillation',
  'Atrial Flutter',
  'SVT',
  'Ventricular Tachycardia',
  'Ventricular Fibrillation',
  'Asystole',
  'PEA',
  '1° Heart Block',
  '2° Heart Block Type I',
  '2° Heart Block Type II',
  '3° Heart Block',
  'Bundle Branch Block',
  'Junctional Rhythm',
  'Idioventricular Rhythm',
  'Paced Rhythm',
  'STEMI',
  'Other'
] as const;

export const stemiLocations = [
  'Anterior',
  'Inferior',
  'Lateral',
  'Posterior',
  'Septal'
] as const;

export const EKGDetailsSchema = z.object({
  time: z.string(),
  type: z.enum(ekgTypes),
  rhythm: z.enum(commonRhythms),
  customRhythm: z.string().optional(),
  rate: z.number().min(0).max(300),
  regular: z.boolean(),
  stemi: z.boolean(),
  stemiLocation: z.array(z.enum(stemiLocations)).optional(),
  findings: z.string().optional(),
  transmitted: z.boolean(),
  transmittedTo: z.string().optional(),
  attachmentUrl: z.string().url().optional(),
  interpretation: z.string().optional(),
  qrs: z.number().min(40).max(200).optional(),
  qtc: z.number().min(200).max(600).optional(),
  prInterval: z.number().min(80).max(400).optional(),
  verified: z.boolean(),
  verifiedBy: z.string().optional(),
  verifiedAt: z.string().optional(),
});

export type EKGType = typeof ekgTypes[number];
export type CommonRhythm = typeof commonRhythms[number];
export type STEMILocation = typeof stemiLocations[number];
export type EKGDetails = z.infer<typeof EKGDetailsSchema>;