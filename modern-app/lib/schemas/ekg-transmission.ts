import { z } from 'zod';

export const transmissionMethods = [
  'Fax',
  'Email',
  'Telemetry',
  'Direct Upload',
  'Phone Report',
  'Bluetooth',
  'WiFi',
  'Cellular',
  'DirectConnect',
  'ExternalModem',
  'Other'
] as const;

export const transmissionFormats = [
  'PDF',
  'DICOM',
  'XML',
  'HL7',
  'SCP-ECG',
  'Fax',
  'Image',
  'Other'
] as const;

export const transmissionStatus = [
  'Pending',
  'InProgress',
  'Completed',
  'Failed',
  'Cancelled'
] as const;

export const receivingFacilityTypes = [
  'Emergency Department',
  'Cardiac Cath Lab',
  'Cardiology Office',
  'Medical Control',
  'Base Hospital',
  'Hospital',
  'Clinic',
  'EmergencyCare',
  'CardiacCenter',
  'Other'
] as const;

export const transmissionPriority = [
  'Routine',
  'Urgent',
  'Emergency',
  'Other'
] as const;

export const EKGTransmissionSchema = z.object({
  // Basic transmission details
  method: z.enum(transmissionMethods),
  customMethod: z.string().optional(),
  format: z.enum(transmissionFormats).default('PDF'),
  status: z.enum(transmissionStatus).default('Pending'),
  
  // Facility information
  facilityType: z.enum(receivingFacilityTypes),
  customFacilityType: z.string().optional(),
  receivingFacility: z.string(),
  facilityIdentifier: z.string().optional(),

  // Recipient details  
  receivingProvider: z.string().optional(),
  department: z.string().optional(),
  providerIdentifier: z.string().optional(),

  // Confirmation tracking
  confirmationRequired: z.boolean().default(false),
  confirmationReceived: z.boolean().default(false),
  confirmationMethod: z.string().optional(),
  confirmedAt: z.string().optional(),
  confirmedBy: z.string().optional(),

  // Transmission metadata
  transmissionTime: z.string(),
  transmissionAttempts: z.number().min(1).default(1),
  priority: z.enum(transmissionPriority).default('Routine'),
  operatorId: z.string().optional(),
  deviceId: z.string().optional(),
  notes: z.string().optional(),
});

export const EKGPrintSettingsSchema = z.object({
  // Include settings
  includeMeasurements: z.boolean().default(true),
  includeGrid: z.boolean().default(true),
  includeAnnotations: z.boolean().default(true),
  includeInterpretation: z.boolean().default(true),

  // Display settings
  paperSpeed: z.enum(['25mm/s', '50mm/s']).default('25mm/s'),
  amplitudeScale: z.enum(['5mm/mV', '10mm/mV', '20mm/mV']).default('10mm/mV'),
  leadConfiguration: z.enum(['Standard', 'Cabrera']).default('Standard'),

  // Filter settings
  filterSettings: z.object({
    baseline: z.boolean().default(true),
    muscleFilter: z.boolean().default(false),
    notchFilter: z.boolean().default(true),
  }).default({
    baseline: true,
    muscleFilter: false,
    notchFilter: true,
  }),
});

// Type exports
export type TransmissionMethod = typeof transmissionMethods[number];
export type TransmissionFormat = typeof transmissionFormats[number];
export type TransmissionStatus = typeof transmissionStatus[number];
export type ReceivingFacilityType = typeof receivingFacilityTypes[number];
export type TransmissionPriority = typeof transmissionPriority[number];

// Schema type exports
export type EKGTransmission = z.infer<typeof EKGTransmissionSchema>;
export type EKGPrintSettings = z.infer<typeof EKGPrintSettingsSchema>;