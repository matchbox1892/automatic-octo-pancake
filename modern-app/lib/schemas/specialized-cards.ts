import { z } from 'zod';
import { basePlanCardSchema, timeSchema, verificationSchema } from './card-schema';

// Response Card Schema
export const responseCardSchema = basePlanCardSchema.extend({
  type: z.literal('response'),
  details: z.object({
    responseType: z.enum(['Emergency', 'Non-Emergency', 'Mutual Aid']),
    responseCode: z.enum(['Code 1', 'Code 2', 'Code 3']).optional(),
    location: z.string(),
    dispatchInfo: z.string().optional(),
    additionalUnits: z.array(z.string()).optional(),
  }),
});

// GCS Card Schema
export const gcsCardSchema = basePlanCardSchema.extend({
  type: z.literal('gcs'),
  details: z.object({
    eyes: z.number().min(1).max(4),
    verbal: z.number().min(1).max(5),
    motor: z.number().min(1).max(6),
    total: z.number().min(3).max(15),
    pupilLeft: z.enum(['Normal', 'Constricted', 'Dilated', 'No Response']),
    pupilRight: z.enum(['Normal', 'Constricted', 'Dilated', 'No Response']),
    notes: z.string().optional(),
  }),
});

// O2 Administration Card Schema
export const o2CardSchema = basePlanCardSchema.extend({
  type: z.literal('o2'),
  details: z.object({
    method: z.enum([
      'Nasal Cannula',
      'Non-Rebreather',
      'Bag Valve Mask',
      'CPAP',
      'Ventilator',
    ]),
    flowRate: z.number().min(0).max(25),
    spO2Before: z.number().min(0).max(100).optional(),
    spO2After: z.number().min(0).max(100).optional(),
    complications: z.string().optional(),
  }),
});

// IV Access Card Schema
export const ivCardSchema = basePlanCardSchema.extend({
  type: z.literal('iv'),
  details: z.object({
    site: z.string(),
    size: z.enum(['14G', '16G', '18G', '20G', '22G', '24G']),
    attempts: z.number().min(1),
    successful: z.boolean(),
    fluid: z.enum(['Normal Saline', 'Lactated Ringers', 'Other']),
    rate: z.enum(['KVO', 'Wide Open', 'Other']),
    totalVolume: z.number().optional(),
    complications: z.string().optional(),
  }),
});

// Medication Administration Card Schema
export const medicationCardSchema = basePlanCardSchema.extend({
  type: z.literal('medication'),
  details: z.object({
    medication: z.string(),
    dose: z.string(),
    route: z.enum(['IV', 'IM', 'IO', 'SQ', 'IN', 'PO', 'SL', 'Other']),
    indication: z.string(),
    response: z.string().optional(),
    provider: z.string(),
    wastage: z.number().optional(),
    doubleVerification: z.boolean(),
  }),
});

// Types based on schemas
export type ResponseCard = z.infer<typeof responseCardSchema>;
export type GCSCard = z.infer<typeof gcsCardSchema>;
export type O2Card = z.infer<typeof o2CardSchema>;
export type IVCard = z.infer<typeof ivCardSchema>;
export type MedicationCard = z.infer<typeof medicationCardSchema>;