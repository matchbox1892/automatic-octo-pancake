import { z } from 'zod';

// Base time schema that handles all legacy time formats
export const timeSchema = z.string().refine((time) => {
  if (time === '') return true;
  if (/^([Pp][Tt][Aa])/.test(time)) return true;
  // Support 24hr format, 12hr format with AM/PM, and times with colons
  return /^([0123]?[0-9]):?([0-5][0-9])( *[APap][Mm])?$/.test(time);
}, "Invalid time format. Use PTA, 24hr format (e.g., 1430), or 12hr format (e.g., 2:30pm)");

// Base verification schema
export const verificationSchema = z.object({
  verified: z.boolean(),
  verifiedBy: z.string().optional(),
  verifiedAt: z.string().optional(),
});

// Common field types
export const textFieldSchema = z.object({
  type: z.literal('text'),
  id: z.string(),
  label: z.string(),
  required: z.boolean(),
  value: z.string(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
});

export const radioFieldSchema = z.object({
  type: z.literal('radio'),
  id: z.string(),
  label: z.string(),
  required: z.boolean(),
  value: z.string(),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })),
  helpText: z.string().optional(),
});

export const checkboxFieldSchema = z.object({
  type: z.literal('checkbox'),
  id: z.string(),
  label: z.string(),
  required: z.boolean(),
  values: z.array(z.string()),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })),
  helpText: z.string().optional(),
});

// Base card schema that all specialized cards will extend
export const basePlanCardSchema = z.object({
  id: z.string(),
  type: z.string(),
  time: timeSchema,
  order: z.number(),
  verification: verificationSchema,
});

// Types based on schemas
export type TimeFormat = z.infer<typeof timeSchema>;
export type Verification = z.infer<typeof verificationSchema>;
export type TextField = z.infer<typeof textFieldSchema>;
export type RadioField = z.infer<typeof radioFieldSchema>;
export type CheckboxField = z.infer<typeof checkboxFieldSchema>;
export type BasePlanCard = z.infer<typeof basePlanCardSchema>;

// Helper functions for time validation and parsing
export const parseTimeToMinutes = (time: string): number => {
  if (time === '') return -1;
  if (/^([Pp][Tt][Aa])/.test(time)) return -2; // PTA is always earliest

  const match = time.match(/^([0123]?[0-9]):?([0-5][0-9])( *[APap][Mm])?$/);
  if (!match) return -1;

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  
  // Handle AM/PM
  if (match[3]?.toLowerCase().includes('pm') && hours < 12) {
    hours += 12;
  } else if (match[3]?.toLowerCase().includes('am') && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

export const formatTimeForDisplay = (time: string): string => {
  if (time === '') return '';
  if (/^([Pp][Tt][Aa])/.test(time)) return 'PTA';

  const minutes = parseTimeToMinutes(time);
  if (minutes < 0) return '';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};