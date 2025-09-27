import { z } from 'zod';
import React from 'react';
import type { VitalSignsSchema } from './vital-signs';

export const PlanCardTypes = {
  // Assessment and monitoring
  Response: 'plnResponse',
  Arrival: 'plnArrival', 
  Exam: 'plnExam',
  Vitals: 'plnVitals',
  GCS: 'plnGCS',
  CNE: 'plnCNE',
  Pain: 'plnPain',
  BGL: 'plnBSugar',
  
  // Interventions
  O2: 'plnO2',
  IV: 'plnIV',
  CPR: 'plnCPR',
  Cap: 'plnCap', 
  Drug: 'plnDrug',
  OPA: 'plnOPA',
  ETT: 'plnETT',
  LMA: 'plnLMA',
  Cric: 'plnCric',
  Ack: 'plnAck',
  Suc: 'plnSuc',
  EKG: 'plnEKG',
  Fax: 'plnFax',
  Defib: 'plnDefib',

  // Trauma care
  Bandage: 'plnBandage',
  Splint: 'plnSplint',
  Extrication: 'plnExtrication',
  Spinal: 'plnSpinal',
  Cot: 'plnCot',

  // Patient care
  Refusal: 'plnRefusal', 
  Advised: 'plnAdvised',
  Term: 'plnTerm',

  // Transport
  Ambulance: 'plnAmbulance',
  Xport: 'plnXport',
  Radio: 'plnRadio',
  Dest: 'plnDest',
  Xfer: 'plnXfer',
  End: 'plnEnd',

  // Other
  Order: 'plnOrd',
  Other: 'plnOther',
  Custom: 'plncstm'
} as const;

export type PlanCardType = typeof PlanCardTypes[keyof typeof PlanCardTypes];

export const PlanCardTimeSchema = z.union([
  z.literal('PTA'), // Prior To Arrival
  z.string().regex(/^\d{4}$/), // 24-hour time format HHMM
  z.literal('') // No time set
]);

export type PlanCardTime = z.infer<typeof PlanCardTimeSchema>;

/**
 * Common fields for all plan cards
 */
export const PlanCardBaseSchema = z.object({
  id: z.string(),
  name: z.string(), // Display name
  type: z.string(), // Base type without counter suffix
  timeId: z.string(), // ID of the time input element
  order: z.number(), // Visual order in the list
  time: PlanCardTimeSchema,
  details: z.string().optional(),
  verified: z.boolean().default(false),
  templateId: z.string().optional()
});

export type PlanCardBase = z.infer<typeof PlanCardBaseSchema>;

/**
 * Special vital signs fields
 */
export const VitalsCardSchema = PlanCardBaseSchema.extend({
  type: z.literal(PlanCardTypes.Vitals),
  vitals: VitalSignsSchema
});

export type VitalsCard = z.infer<typeof VitalsCardSchema>;

/**
 * Discriminated union of all plan card types
 */
export const PlanCardSchema = z.discriminatedUnion('type', [
  VitalsCardSchema,
  PlanCardBaseSchema
]);

export type PlanCard = z.infer<typeof PlanCardSchema>;

export interface PlanCardManagerState {
  cards: PlanCard[];
  runningCount: number; // Total cards created (includes deleted)
  visibleCount: number; // Currently visible cards 
}

export interface PlanCardTemplate {
  id: string; // Template identifier
  name: string; // Display name
  type: PlanCardType; // Card type this template creates
  category: string; // For grouping/filtering templates
  description?: string; // Optional details about the template
  defaultDetails?: string; // Default text to insert
  component: React.ComponentType<PlanCardProps>; // Component to render
  validateCard?: (card: PlanCard) => boolean; // Optional validation
}

export interface PlanCardProps {
  id: string;
  onRemove: () => void; 
  onTimeChange: (time: PlanCardTime) => void;
  onDetailsChange: (details: string) => void;
  onVerifiedChange: (verified: boolean) => void;
  time: PlanCardTime;
  details?: string;
  verified: boolean;
}

/**
 * Converts a number to a 4-character string with leading zeros
 */
export function formatCounter(num: number): string {
  return num.toString().padStart(4, '0');
}

/**
 * Determines the type of a time value
 */
export function getTimeType(time: PlanCardTime): 'PTA' | 'TIME' | 'NONE' {
  if (time === 'PTA') return 'PTA';
  if (time === '') return 'NONE';
  return 'TIME';
}

/**
 * Parses a time string into 24-hour format
 * Handles:
 * - HH:MM (24hr)
 * - H:MM (24hr)
 * - HH:MM AM/PM (12hr)
 * - H:MM AM/PM (12hr)
 * Returns null if invalid format
 */
export function parseTimeString(time: string): string | null {
  if (!time) return null;

  // Try 24-hour format first
  const h24Match = /^([01]?[0-9]|2[0-3]):?([0-5][0-9])$/.exec(time);
  if (h24Match) {
    const [hours, minutes] = [h24Match[1], h24Match[2]].map(Number);
    return `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;
  }

  // Try 12-hour format
  const h12Match = /^(1[0-2]|0?[1-9]):?([0-5][0-9])\s*([AaPp][Mm])$/.exec(time);
  if (h12Match) {
    let hours = parseInt(h12Match[1]);
    const minutes = parseInt(h12Match[2]);
    const isPM = /[Pp][Mm]/.test(h12Match[3]);

    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;
  }

  return null;
}

/**
 * Sorts plan cards according to legacy rules:
 * 1. PTA cards first
 * 2. Non-time cards before first timed card
 * 3. Timed cards in chronological order
 * 4. Remaining non-time cards last
 */
export function sortPlanCards(cards: PlanCard[]): PlanCard[] {
  // Find first card with a time
  const firstTimeCard = cards.find(card => getTimeType(card.time) === 'TIME');
  const firstTimeOrder = firstTimeCard?.order ?? Infinity;

  // Separate cards into categories
  const ptaCards = cards.filter(card => card.time === 'PTA');
  const earlyBlankCards = cards.filter(card => 
    card.time === '' && card.order < firstTimeOrder
  );
  const timeCards = cards.filter(card => 
    getTimeType(card.time) === 'TIME'
  ).sort((a, b) => {
    if (a.time === '' || b.time === '') return 0;
    return parseInt(a.time) - parseInt(b.time);
  });
  const lateBlankCards = cards.filter(card => 
    card.time === '' && card.order >= firstTimeOrder
  );

  // Fix time overlap for time cards
  const adjustedTimeCards = fixTimeOverlap(timeCards);

  // Combine in correct order
  return [
    ...ptaCards,
    ...earlyBlankCards,
    ...adjustedTimeCards,
    ...lateBlankCards
  ];
}

/**
 * Checks for time overlap and adjusts if needed.
 * Also handles wrap-around after midnight by adding 24 hours
 */
export function fixTimeOverlap(cards: PlanCard[]): PlanCard[] {
  // First pass - check for overnight wraparound
  let maxTime = '0000';
  let minTime = '2359';

  const timeCards = cards.filter(card => getTimeType(card.time) === 'TIME');
  timeCards.forEach(card => {
    if (card.time > maxTime) maxTime = card.time;
    if (card.time < minTime) minTime = card.time; 
  });

  // If difference is large, assume overnight wrap
  const timeMap = new Map<string, boolean>();
  const adjustedCards = timeCards.map(card => {
    let time = card.time;
    
    // Add 24 hours (2400) to early morning times
    if (maxTime > '1800' && time < '1200' && 
        parseInt(maxTime) - parseInt(time) > 1800) {
      time = (parseInt(time) + 2400).toString().padStart(4, '0');
    }

    // If time slot taken, increment until free
    while (timeMap.has(time)) {
      const timeNum = parseInt(time);
      time = (timeNum + 1).toString().padStart(4, '0');
    }

    timeMap.set(time, true);
    return { ...card, time };
  });

  return adjustedCards;
}

/**
 * Creates a new plan card 
 */
export function createPlanCard(
  type: PlanCardType,
  name: string,
  order: number,
  templateId?: string
): PlanCard {
  const baseCard = {
    id: `card_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name,
    type,
    timeId: `time_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    time: '',
    order,
    details: '',
    verified: false,
    templateId
  };

  if (type === PlanCardTypes.Vitals) {
    return {
      ...baseCard,
      type: PlanCardTypes.Vitals,
      vitals: {}
    };
  }

  return baseCard;
}