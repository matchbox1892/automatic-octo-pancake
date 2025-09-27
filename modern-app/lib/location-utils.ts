import { z } from 'zod';

export const LocationSchema = z.object({
  address: z.string().optional(),
  room: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  what3words: z.string().optional(),
  gpsLatitude: z.string().optional(),
  gpsLongitude: z.string().optional(),
});

export type Location = z.infer<typeof LocationSchema>;

interface What3WordsResponse {
  words?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  suggestions?: string[];
}

export async function getW3WSuggestions(input: string): Promise<string[]> {
  try {
    const response = await fetch(`https://api.what3words.com/v3/autosuggest?key=${process.env.NEXT_PUBLIC_W3W_API_KEY}&input=${input}&format=json`);
    const data: What3WordsResponse = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('Error fetching W3W suggestions:', error);
    return [];
  }
}

export async function getW3WCoordinates(words: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(`https://api.what3words.com/v3/convert-to-coordinates?key=${process.env.NEXT_PUBLIC_W3W_API_KEY}&words=${words}&format=json`);
    const data: What3WordsResponse = await response.json();
    return data.coordinates || null;
  } catch (error) {
    console.error('Error fetching W3W coordinates:', error);
    return null;
  }
}

export async function getW3WFromCoordinates(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(`https://api.what3words.com/v3/convert-to-3wa?key=${process.env.NEXT_PUBLIC_W3W_API_KEY}&coordinates=${lat},${lng}&format=json`);
    const data: What3WordsResponse = await response.json();
    return data.words || null;
  } catch (error) {
    console.error('Error fetching W3W from coordinates:', error);
    return null;
  }
}

export function generateGoogleMapsLink(lat: string, lng: string): string {
  if (!lat || !lng) return '';
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function generateW3WMapsLink(words: string): string {
  if (!words) return '';
  return `https://what3words.com/${words}`;
}

export function validateCoordinates(lat: string, lng: string): boolean {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) return false;

  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

export function copyIncidentToPatientLocation(incident: Location, patient: Location): Location {
  // Only copy if patient location is empty
  if (!patient.address && !patient.room && !patient.city && !patient.state && !patient.zip) {
    return {
      ...patient,
      address: incident.address,
      room: incident.room,
      city: incident.city,
      state: incident.state,
      zip: incident.zip
    };
  }
  
  // If patient has incident address but missing other fields, copy those
  if (patient.address === incident.address) {
    return {
      ...patient,
      room: patient.room || incident.room,
      city: patient.city || incident.city,
      state: patient.state || incident.state,
      zip: patient.zip || incident.zip
    };
  }

  return patient;
}