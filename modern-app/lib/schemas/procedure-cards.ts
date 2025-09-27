import { z } from 'zod';
import { basePlanCardSchema } from './card-schema';

// Endotracheal Tube Card Schema
export const ettCardSchema = basePlanCardSchema.extend({
  type: z.literal('ett'),
  details: z.object({
    size: z.number().min(2.0).max(9.0),
    depthAtTeeth: z.number().min(12).max(26),
    method: z.enum(['Direct', 'Video', 'Blind', 'Digital']),
    attempts: z.number().min(1),
    successful: z.boolean(),
    confirmation: z.array(z.enum([
      'Chest Rise',
      'Breath Sounds',
      'End-Tidal CO2',
      'Misting',
      'Direct Visualization'
    ])),
    complications: z.array(z.string()).optional(),
    difficulty: z.enum(['Easy', 'Moderate', 'Difficult']),
    cormackLehane: z.enum(['Grade 1', 'Grade 2', 'Grade 2a', 'Grade 2b', 'Grade 3', 'Grade 4']),
    styletUsed: z.boolean(),
    bougie: z.boolean(),
    inlineStabilization: z.boolean(),
    cricoidPressure: z.boolean(),
    medications: z.array(z.object({
      name: z.string(),
      dose: z.string(),
      time: z.string()
    })).optional(),
  }),
});

// Medication Card Schema with detailed tracking
export const medicationCardSchema = basePlanCardSchema.extend({
  type: z.literal('medication'),
  details: z.object({
    medication: z.string(),
    dose: z.string(),
    route: z.enum([
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
    ]),
    indication: z.string(),
    administeredBy: z.string(),
    protocol: z.string().optional(),
    orderSource: z.enum(['Standing Order', 'Online Medical Control', 'Direct Order']),
    orderDetails: z.string().optional(),
    response: z.object({
      effectiveness: z.enum(['Effective', 'Partially Effective', 'Not Effective']),
      description: z.string().optional(),
      adverseEffects: z.array(z.string()).optional(),
      timeToEffect: z.number().optional(), // minutes
    }),
    secondaryDoses: z.array(z.object({
      dose: z.string(),
      time: z.string(),
      reason: z.string(),
    })).optional(),
    wastage: z.object({
      amount: z.number(),
      witness: z.string().optional(),
      reason: z.string().optional(),
    }).optional(),
    doubleVerification: z.object({
      required: z.boolean(),
      verifiedBy: z.string().optional(),
      verifiedAt: z.string().optional(),
    }),
  }),
});

// EKG/12-Lead Card Schema
export const ekgCardSchema = basePlanCardSchema.extend({
  type: z.literal('ekg'),
  details: z.object({
    leadType: z.enum(['12-Lead', '4-Lead', '3-Lead']),
    rhythm: z.string(),
    rate: z.number().min(0).max(300),
    qrs: z.object({
      duration: z.number().optional(),
      morphology: z.string().optional(),
    }),
    stSegment: z.object({
      elevation: z.boolean(),
      depression: z.boolean(),
      locations: z.array(z.string()).optional(),
    }),
    interpretation: z.object({
      findings: z.array(z.string()),
      stemi: z.boolean(),
      alerts: z.array(z.string()).optional(),
    }),
    transmitted: z.boolean(),
    receivingFacility: z.string().optional(),
    physicianReview: z.object({
      reviewed: z.boolean(),
      reviewedBy: z.string().optional(),
      reviewTime: z.string().optional(),
      feedback: z.string().optional(),
    }),
  }),
});

// Types based on schemas
export type ETTCard = z.infer<typeof ettCardSchema>;
export type MedicationCard = z.infer<typeof medicationCardSchema>;
export type EKGCard = z.infer<typeof ekgCardSchema>;