import { z } from 'zod';

// Splinting Types and Schema
export const splintTypes = [
  'Rigid',
  'Flexible',
  'Traction',
  'SAM',
  'Air',
  'Vacuum',
  'Other'
] as const;

export const bodyLocations = [
  'Left Hand',
  'Right Hand',
  'Left Wrist',
  'Right Wrist',
  'Left Forearm',
  'Right Forearm',
  'Left Elbow',
  'Right Elbow',
  'Left Humerus',
  'Right Humerus',
  'Left Shoulder',
  'Right Shoulder',
  'Left Foot',
  'Right Foot',
  'Left Ankle',
  'Right Ankle',
  'Left Lower Leg',
  'Right Lower Leg',
  'Left Knee',
  'Right Knee',
  'Left Thigh',
  'Right Thigh',
  'Left Hip',
  'Right Hip',
  'Cervical Spine',
  'Thoracic Spine',
  'Lumbar Spine',
  'Other'
] as const;

export const SplintDetailsSchema = z.object({
  type: z.enum(splintTypes),
  customType: z.string().optional(),
  location: z.enum(bodyLocations),
  customLocation: z.string().optional(),
  pulsesBefore: z.boolean(),
  pulsesAfter: z.boolean(),
  sensationBefore: z.boolean(),
  sensationAfter: z.boolean(),
  movementBefore: z.boolean(),
  movementAfter: z.boolean(),
  complications: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Bandaging Types and Schema
export const bandageTypes = [
  'Gauze',
  'Elastic',
  'Compression',
  'Triangular',
  'Occlusive',
  'Pressure',
  'Multi-Trauma',
  'Other'
] as const;

export const BandageDetailsSchema = z.object({
  type: z.enum(bandageTypes),
  customType: z.string().optional(),
  location: z.enum(bodyLocations),
  customLocation: z.string().optional(),
  bleedingControlled: z.boolean(),
  woundCleaned: z.boolean(),
  dressing: z.string(),
  complications: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Spinal Immobilization Types and Schema
export const immobilizationDevices = [
  'Cervical Collar',
  'Long Spine Board',
  'KED',
  'Scoop Stretcher',
  'Vacuum Mattress',
  'Head Blocks',
  'Spider Straps',
  'Other'
] as const;

export const immobilizationPositions = [
  'Supine',
  'Found',
  'Seated',
  'Standing',
  'Other'
] as const;

export const SpinalImmobilizationDetailsSchema = z.object({
  devices: z.array(z.enum(immobilizationDevices)),
  customDevice: z.string().optional(),
  position: z.enum(immobilizationPositions),
  customPosition: z.string().optional(),
  pulsesBefore: z.boolean(),
  pulsesAfter: z.boolean(),
  sensationBefore: z.boolean(),
  sensationAfter: z.boolean(),
  movementBefore: z.boolean(),
  movementAfter: z.boolean(),
  complications: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Export types
export type SplintType = typeof splintTypes[number];
export type BodyLocation = typeof bodyLocations[number];
export type BandageType = typeof bandageTypes[number];
export type ImmobilizationDevice = typeof immobilizationDevices[number];
export type ImmobilizationPosition = typeof immobilizationPositions[number];

export type SplintDetails = z.infer<typeof SplintDetailsSchema>;
export type BandageDetails = z.infer<typeof BandageDetailsSchema>;
export type SpinalImmobilizationDetails = z.infer<typeof SpinalImmobilizationDetailsSchema>;