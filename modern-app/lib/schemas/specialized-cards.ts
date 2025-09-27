import { z } from 'zod';
import { basePlanCardSchema, timeSchema, verificationSchema } from './card-schema';

// Common card props
export const cardPropsBase = z.object({
  id: z.string(),
  time: z.string(),
  verification: z.object({
    verified: z.boolean(),
    verifiedBy: z.string().optional(),
    verifiedAt: z.string().optional(),
  }),
});

// Response Card Schema
export const responseCardSchema = z.object({
  id: z.string(),
  time: z.string(),
  details: z.object({
    responseType: z.enum(['Emergency', 'Non-Emergency', 'Scheduled Transfer']),
    dispatchMethod: z.enum(['911', 'Direct', 'Transfer Center', 'Other']),
    location: z.string(),
    sceneDescription: z.string().optional(),
    dispatchComments: z.string().optional(),
  }),
  verification: verificationSchema,
});

// GCS Card Schema
export const gcsCardSchema = z.object({
  id: z.string(),
  time: z.string(),
  details: z.object({
    eyeOpening: z.enum(['Spontaneous', 'To Voice', 'To Pain', 'None']),
    verbalResponse: z.enum(['Oriented', 'Confused', 'Inappropriate', 'Incomprehensible', 'None']),
    motorResponse: z.enum(['Obeys Commands', 'Localizes Pain', 'Withdraws', 'Abnormal Flexion', 'Extension', 'None']),
    totalScore: z.number().min(3).max(15),
    pupilLeft: z.enum(['Normal', 'Constricted', 'Dilated', 'No Response']),
    pupilRight: z.enum(['Normal', 'Constricted', 'Dilated', 'No Response']),
    notes: z.string().optional(),
  }),
  verification: verificationSchema,
});

// Pain Card Schema
export const painCardSchema = z.object({
  id: z.string(),
  time: z.string(),
  details: z.object({
    painLevel: z.number().min(0).max(10),
    location: z.string(),
    quality: z.string(),
    radiation: z.string().optional(),
    severity: z.enum(['Mild', 'Moderate', 'Severe']),
    timing: z.string().optional(),
    factors: z.object({
      aggravating: z.array(z.string()).optional(),
      alleviating: z.array(z.string()).optional(),
    }).optional(),
    notes: z.string().optional(),
  }),
  verification: verificationSchema,
});

// CPR Card Schema
export const cprCardSchema = z.object({
  id: z.string(),
  time: z.string(),
  details: z.object({
    initiator: z.enum(['EMS', 'Bystander', 'First Responder']),
    method: z.enum(['Manual', 'Mechanical', 'Both']),
    compressionQuality: z.object({
      rate: z.number(),
      depth: z.enum(['Adequate', 'Too Shallow', 'Too Deep']),
      recoil: z.boolean(),
      interruptions: z.number(),
    }),
    aed: z.object({
      applied: z.boolean(),
      shockDelivered: z.boolean(),
      rhythm: z.enum(['VF', 'VT', 'PEA', 'Asystole', 'Unknown']),
      numberOfShocks: z.number().optional(),
    }),
    rosc: z.object({
      achieved: z.boolean(),
      time: z.string().optional(),
      sustainedROSC: z.boolean(),
      duration: z.number().optional(),
    }),
    mechanicalDevice: z.string().optional(),
  }),
  verification: verificationSchema,
});

// O2 Administration Card Schema
export const o2CardSchema = z.object({
  id: z.string(),
  time: z.string(),
  details: z.object({
    method: z.enum([
      'Nasal Cannula',
      'Non-Rebreather',
      'Bag Valve Mask',
      'CPAP',
      'Ventilator',
      'Other'
    ]),
    flowRate: z.number().min(0),
    spO2Before: z.number().min(0).max(100).optional(),
    spO2After: z.number().min(0).max(100).optional(),
    complications: z.string().optional(),
  }),
  verification: verificationSchema,
});

// IV Access Card Schema
export const ivCardSchema = z.object({
  id: z.string(),
  time: z.string(),
  details: z.object({
    site: z.string(),
    size: z.enum(['14G', '16G', '18G', '20G', '22G', '24G']),
    attempts: z.number().min(1),
    successful: z.boolean(),
    fluid: z.enum(['Normal Saline', 'Lactated Ringers', 'D5W', 'Other']),
    rate: z.enum(['KVO', 'Wide Open', 'Pump', 'Other']),
    totalVolume: z.number().optional(),
    complications: z.string().optional(),
  }),
  verification: verificationSchema,
});

// Exam Card Schema
export const examCardSchema = z.object({
  id: z.string(),
  time: z.string(),
  details: z.object({
    section: z.enum([
      'Other',
      'Head',
      'Neck',
      'Chest',
      'Abdomen',
      'Back',
      'Pelvis',
      'Extremities',
      'Neurological',
      'Skin'
    ]),
    findings: z.array(z.object({
      type: z.enum(['Normal', 'Abnormal']),
      description: z.string(),
      severity: z.enum(['Mild', 'Moderate', 'Severe']).optional(),
      side: z.enum(['Left', 'Right', 'Bilateral', 'N/A']).optional(),
    })),
    injuries: z.array(z.object({
      type: z.enum([
        'Other',
        'Abrasion',
        'Laceration',
        'Contusion',
        'Burn',
        'Fracture',
        'Deformity'
      ]),
      description: z.string(),
      location: z.string(),
      size: z.string().optional(),
    })).optional(),
  }),
  verification: verificationSchema,
});

// Medication Administration Card Schema
export const medicationCardSchema = z.object({
  id: z.string(),
  time: z.string(),
  details: z.object({
    medication: z.string(),
    dose: z.string(),
    route: z.enum(['IV', 'IM', 'IO', 'SQ', 'IN', 'PO', 'SL', 'Other']),
    indication: z.string(),
    response: z.object({
      effectiveness: z.enum(['Effective', 'Partially Effective', 'Not Effective']),
      description: z.string().optional(),
      adverseEffects: z.array(z.string()).optional(),
      timeToEffect: z.number().optional(),
    }),
    provider: z.string(),
    wastage: z.number().optional(),
    doubleVerification: z.boolean(),
    verifier: z.string().optional(),
    secondaryDoses: z.array(z.object({
      dose: z.string(),
      time: z.string(),
      provider: z.string(),
    })).optional(),
  }),
  verification: verificationSchema,
});

// Card schemas with common interface
export interface BaseCardProps {
  id: string;
  time: string;
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
}

// Export types for component props
export type ResponseCardProps = z.infer<typeof responseCardSchema>;
export type GCSCardProps = z.infer<typeof gcsCardSchema>;
export type PainCardProps = z.infer<typeof painCardSchema>;
export type CPRCardProps = z.infer<typeof cprCardSchema>;
export type ExamCardProps = z.infer<typeof examCardSchema>;
export type O2CardProps = z.infer<typeof o2CardSchema>;
export type IVCardProps = z.infer<typeof ivCardSchema>;
export type MedicationCardProps = z.infer<typeof medicationCardSchema>;