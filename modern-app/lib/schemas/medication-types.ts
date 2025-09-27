import { z } from 'zod';

export const medicationRoutes = [
  'IV',
  'IM',
  'IO',
  'SQ',
  'IN',
  'PO',
  'SL',
  'PR',
  'Nebulized',
  'Topical',
  'Other'
] as const;

export const orderSources = ['Standing Order', 'Direct Order'] as const;

export const MedicationEntrySchema = z.object({
  name: z.string(),
  dose: z.string(),
  route: z.enum(medicationRoutes),
  time: z.string(),
  indications: z.string().optional(),
  response: z.string().optional(),
  administeredBy: z.string(),
  orderSource: z.enum(orderSources),
  orderingProvider: z.string().optional(),
  wastage: z.object({
    amount: z.string(),
    witness: z.string(),
  }).optional(),
});

export const MedicationDetailsSchema = z.object({
  entries: z.array(MedicationEntrySchema),
  complications: z.array(z.string()).optional(),
});

export type MedicationRoute = typeof medicationRoutes[number];
export type OrderSource = typeof orderSources[number];
export type MedicationEntry = z.infer<typeof MedicationEntrySchema>;
export type MedicationDetails = z.infer<typeof MedicationDetailsSchema>;