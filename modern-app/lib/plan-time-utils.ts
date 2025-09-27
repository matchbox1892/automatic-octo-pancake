import { type PlanCardTime } from './plan-card-model';

/**
 * Time formatting style options for display
 */
export const TimeFormat = {
  /** 24hr format (HH:mm) */
  MILITARY: '24hr',
  /** 12hr format with AM/PM */
  STANDARD: '12hr', 
  /** No format (raw) */
  RAW: 'raw'
} as const;

export type TimeFormatStyle = typeof TimeFormat[keyof typeof TimeFormat];

/**
 * Converts a time string to 24-hour format
 * Handles various input formats:
 * - HH:MM (24hr)
 * - H:MM (24hr) 
 * - HH:MM AM/PM (12hr)
 * - H:MM AM/PM (12hr)
 * - HHMM (24hr)
 * - PTA (preserved)
 */
export function normalizePlanTime(input: string): PlanCardTime {
  if (!input || input.toUpperCase() === 'PTA') {
    return input as PlanCardTime;
  }

  // Strip any non-alphanumeric chars
  const cleaned = input.replace(/[^0-9AaPpMm]/g, '');

  // Handle 24hr format
  if (/^\d{4}$/.test(cleaned)) {
    const hours = parseInt(cleaned.slice(0, 2));
    const minutes = parseInt(cleaned.slice(2));
    if (hours < 24 && minutes < 60) {
      return cleaned as PlanCardTime;
    }
  }

  // Parse 12hr format with AM/PM
  const match = /^(\d{1,2})(\d{2})([AaPp][Mm])$/.exec(cleaned);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const isPM = /[Pp]/.test(match[3]);

    if (hours > 12 || minutes > 59) {
      return ''; // Invalid time
    }

    // Convert to 24hr
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}` as PlanCardTime;
  }

  return ''; // Invalid format
}

/**
 * Formats a plan time for display
 */
export function formatPlanTime(time: PlanCardTime, format: TimeFormatStyle = TimeFormat.STANDARD): string {
  if (!time || time === 'PTA') {
    return time;
  }

  if (format === TimeFormat.RAW) {
    return time;
  }

  const hours = parseInt(time.slice(0, 2));
  const minutes = time.slice(2);

  if (format === TimeFormat.MILITARY) {
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  // Convert to 12hr format
  let period = 'AM';
  let displayHours = hours;

  if (hours >= 12) {
    period = 'PM';
    if (hours > 12) {
      displayHours = hours - 12;
    }
  }
  if (hours === 0) {
    displayHours = 12;
  }

  return `${displayHours}:${minutes} ${period}`;
}

/**
 * Checks if time B follows time A within reasonable bounds
 */
export function isValidTimeSequence(timeA: PlanCardTime, timeB: PlanCardTime): boolean {
  // PTA always comes first
  if (timeA === 'PTA') return true;
  if (timeB === 'PTA') return false;

  // Handle empty times
  if (!timeA || !timeB) return true;

  const numA = parseInt(timeA);
  const numB = parseInt(timeB);

  // Allow wraparound after midnight
  if (numA > 1800 && numB < 1200) {
    return true;
  }

  return numA <= numB;
}

/**
 * Gets current time in HHMM format
 */
export function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}${minutes}`;
}

/**
 * Get the difference between two times in minutes
 * Handles overnight wraparound
 */
export function getTimeDiffMinutes(timeA: PlanCardTime, timeB: PlanCardTime): number | null {
  if (!timeA || !timeB || timeA === 'PTA' || timeB === 'PTA') {
    return null;
  }

  let numA = parseInt(timeA);
  let numB = parseInt(timeB);

  // Handle overnight wraparound
  if (numB < numA && numB < 1200 && numA > 1800) {
    numB += 2400;
  }

  const hoursA = Math.floor(numA / 100);
  const minutesA = numA % 100;
  const hoursB = Math.floor(numB / 100);
  const minutesB = numB % 100;

  return (hoursB * 60 + minutesB) - (hoursA * 60 + minutesA);
}

/**
 * Add minutes to a time and return in HHMM format
 */
export function addMinutesToTime(time: PlanCardTime, minutes: number): PlanCardTime {
  if (!time || time === 'PTA' || minutes === 0) {
    return time;
  }

  const timeNum = parseInt(time);
  const hours = Math.floor(timeNum / 100);
  const mins = timeNum % 100;

  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;

  return `${newHours.toString().padStart(2, '0')}${newMinutes.toString().padStart(2, '0')}` as PlanCardTime;
}