import { z } from "zod";

export const GCSSchema = z.object({
  eyes: z.number().min(1).max(4).optional(),
  verbal: z.number().min(1).max(5).optional(),
  motor: z.number().min(1).max(6).optional(),
  total: z.number().min(3).max(15).optional(),
});

export const VitalSignsSchema = z.object({
  time: z.string().optional(),
  heartRate: z.number().min(0).max(300).optional(),
  systolic: z.number().min(0).max(300).optional(),
  diastolic: z.number().min(0).max(300).optional(),
  bloodPressure: z.string().optional(), // Computed from systolic/diastolic
  respiratoryRate: z.number().min(0).max(100).optional(),
  spo2: z.number().min(0).max(100).optional(),
  temperature: z.number().optional(),
  tempScale: z.enum(["F", "C"]).default("F"),
  gcs: GCSSchema.optional(),
  rhythm: z.string().optional(),
  etco2: z.number().min(0).max(100).optional(),
  bgl: z.number().min(0).max(999).optional(),
  pain: z.number().min(0).max(10).optional(),
});

export const VitalSignsDisplay = {
  heartRate: { label: "HR", unit: "bpm" },
  bloodPressure: { label: "BP", unit: "mmHg" },
  respiratoryRate: { label: "RR", unit: "/min" },
  spo2: { label: "SpO₂", unit: "%" },
  temperature: { label: "Temp", unit: "°" }, // °F or °C added dynamically
  etco2: { label: "EtCO₂", unit: "mmHg" },
  bgl: { label: "BGL", unit: "mg/dL" },
  pain: { label: "Pain", unit: "/10" },
};