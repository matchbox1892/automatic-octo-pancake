import { VitalSignsDisplay } from './vital-signs';
import type { VitalSignsSchema } from './vital-signs';
import type { z } from 'zod';

type VitalSigns = z.infer<typeof VitalSignsSchema>;

export function formatVitalSign(
  field: keyof typeof VitalSignsDisplay,
  value: number | undefined,
  unit: string | undefined = VitalSignsDisplay[field]?.unit
): string | undefined {
  if (value === undefined) return undefined;
  if (unit === undefined) return value.toString();
  return `${value}${unit}`;
}

export function formatVitals(vitals: VitalSigns): string {
  const parts: string[] = [];

  // Format blood pressure if both systolic and diastolic are present
  if (vitals.systolic && vitals.diastolic) {
    const bp = `${vitals.systolic}/${vitals.diastolic} mmHg`;
    parts.push(bp);
  }

  // Add other vital signs
  Object.keys(VitalSignsDisplay).forEach((field) => {
    const key = field as keyof typeof VitalSignsDisplay;
    if (key === "bloodPressure") return; // Already handled
    
    const value = vitals[key as keyof VitalSigns];
    const display = VitalSignsDisplay[key];
    
    if (typeof value === "number" && display) {
      // Special case for temperature to add the correct scale
      if (key === "temperature") {
        parts.push(`${value}°${vitals.tempScale}`);
      } else {
        parts.push(`${value}${display.unit}`);
      }
    }
  });

  // Add GCS score if present
  if (vitals.gcs) {
    const total = vitals.gcs.total ?? (
      (vitals.gcs.eyes ?? 0) + 
      (vitals.gcs.verbal ?? 0) + 
      (vitals.gcs.motor ?? 0)
    );
    if (total > 0) {
      parts.push(`GCS ${total}`);
    }
  }

  return parts.join(", ");
}

export function formatApgarScore(scores: Record<string, number>, total: number): string {
  const components = [
    'Appearance',
    'Pulse',
    'Grimace',
    'Activity',
    'Respiration'
  ];
  
  return `${components.map(c => scores[c.toLowerCase()]).join("/")} = ${total}`;
}