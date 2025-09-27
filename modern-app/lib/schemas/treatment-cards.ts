import { z } from 'zod';
import { basePlanCardSchema } from './card-schema';

// Pain Assessment Card Schema
export const painCardSchema = basePlanCardSchema.extend({
  type: z.literal('pain'),
  details: z.object({
    score: z.number().min(0).max(10),
    location: z.string(),
    quality: z.array(z.enum([
      'Sharp',
      'Dull',
      'Burning',
      'Aching',
      'Throbbing',
      'Stabbing',
      'Crushing',
      'Other'
    ])),
    qualityOther: z.string().optional(),
    radiation: z.string().optional(),
    severity: z.enum(['Mild', 'Moderate', 'Severe']),
    onset: z.enum(['Sudden', 'Gradual']),
    provokes: z.string().optional(),
    palliates: z.string().optional(),
    timePattern: z.enum(['Constant', 'Intermittent', 'Worsening', 'Improving']),
    interventionResponse: z.string().optional(),
  }),
});

// CPR Card Schema
export const cprCardSchema = basePlanCardSchema.extend({
  type: z.literal('cpr'),
  details: z.object({
    initiator: z.enum(['EMS', 'Bystander', 'First Responder']),
    method: z.enum(['Manual', 'Mechanical', 'Both']),
    mechanicalDevice: z.string().optional(),
    compressionQuality: z.object({
      rate: z.number().min(80).max(120),
      depth: z.enum(['Adequate', 'Too Shallow', 'Too Deep']),
      recoil: z.boolean(),
      interruptions: z.number(),
    }),
    aed: z.object({
      applied: z.boolean(),
      shockDelivered: z.boolean(),
      numberOfShocks: z.number().optional(),
      rhythm: z.enum(['VF', 'VT', 'PEA', 'Asystole', 'Unknown']),
    }),
    rosc: z.object({
      achieved: z.boolean(),
      time: z.string().optional(),
      sustainedMinutes: z.number().optional(),
    }),
  }),
});

// Physical Exam Card Schema
export const examCardSchema = basePlanCardSchema.extend({
  type: z.literal('exam'),
  details: z.object({
    section: z.enum([
      'Head',
      'Neck',
      'Chest',
      'Abdomen',
      'Back',
      'Pelvis',
      'Extremities',
      'Neurological',
      'Skin',
      'Other'
    ]),
    findings: z.array(z.object({
      type: z.enum(['Normal', 'Abnormal']),
      description: z.string(),
      side: z.enum(['Left', 'Right', 'Bilateral', 'N/A']).optional(),
      severity: z.enum(['Mild', 'Moderate', 'Severe']).optional(),
    })),
    injuries: z.array(z.object({
      type: z.enum([
        'Abrasion',
        'Laceration',
        'Contusion',
        'Burn',
        'Fracture',
        'Deformity',
        'Other'
      ]),
      location: z.string(),
      size: z.string().optional(),
      description: z.string(),
    })).optional(),
  }),
});

// Transport Card Schema
export const transportCardSchema = basePlanCardSchema.extend({
  type: z.literal('transport'),
  details: z.object({
    destination: z.object({
      facility: z.string(),
      type: z.enum(['Hospital', 'Trauma Center', 'Specialty Center', 'Other']),
      level: z.string().optional(),
    }),
    mode: z.enum(['Ground', 'Air', 'Water']),
    priority: z.enum(['Emergency', 'Priority', 'Routine']),
    position: z.enum(['Supine', 'Semi-Fowlers', 'Fowlers', 'Left Side', 'Right Side', 'Other']),
    monitoring: z.array(z.enum([
      'Cardiac',
      'SPO2',
      'ETCO2',
      'BP',
      'Temperature'
    ])),
    interventions: z.array(z.string()).optional(),
    complications: z.string().optional(),
    eta: z.string().optional(),
    diversion: z.object({
      required: z.boolean(),
      reason: z.string().optional(),
      originalDestination: z.string().optional(),
    }),
  }),
});

// Types based on schemas
export type PainCard = z.infer<typeof painCardSchema>;
export type CPRCard = z.infer<typeof cprCardSchema>;
export type ExamCard = z.infer<typeof examCardSchema>;
export type TransportCard = z.infer<typeof transportCardSchema>;