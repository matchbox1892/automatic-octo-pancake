finish the import { z } from 'zod';
import type { 
  SplintDetails, 
  BandageDetails, 
  SpinalImmobilizationDetails
} from '../schemas/immobilization-types';
import type { EKGDetails } from '../schemas/ekg-types';

export const procedureTemplates = {
  splint: (details: SplintDetails): string => {
    const parts = [];
    
    // Basic splint application
    parts.push(`${details.customType || details.type} splint applied to ${details.customLocation || details.location}`);
    
    // Neurovascular status
    const beforeStatus = [
      details.pulsesBefore ? 'pulses' : null,
      details.sensationBefore ? 'sensation' : null,
      details.movementBefore ? 'movement' : null
    ].filter(Boolean);
    
    const afterStatus = [
      details.pulsesAfter ? 'pulses' : null,
      details.sensationAfter ? 'sensation' : null,
      details.movementAfter ? 'movement' : null
    ].filter(Boolean);

    if (beforeStatus.length > 0) {
      parts.push(`Pre-splinting assessment: ${beforeStatus.join(', ')} present`);
    }
    
    if (afterStatus.length > 0) {
      parts.push(`Post-splinting assessment: ${afterStatus.join(', ')} present`);
    }

    // Complications
    if (details.complications?.length) {
      parts.push(`Complications: ${details.complications.join(', ')}`);
    }

    // Additional notes
    if (details.notes) {
      parts.push(details.notes);
    }

    return parts.join('. ') + '.';
  },

  bandage: (details: BandageDetails): string => {
    const parts = [];

    // Basic bandage application
    parts.push(`${details.customType || details.type} bandage applied to ${details.customLocation || details.location}`);

    // Wound care status
    const care = [];
    if (details.woundCleaned) care.push('wound cleaned');
    if (details.bleedingControlled) care.push('bleeding controlled');
    if (care.length > 0) {
      parts.push(care.join(' and '));
    }

    // Dressing details
    if (details.dressing) {
      parts.push(`${details.dressing} dressing applied`);
    }

    // Complications
    if (details.complications?.length) {
      parts.push(`Complications: ${details.complications.join(', ')}`);
    }

    // Additional notes
    if (details.notes) {
      parts.push(details.notes);
    }

    return parts.join('. ') + '.';
  },

  spinalImmobilization: (details: SpinalImmobilizationDetails): string => {
    const parts = [];

    // Devices used
    const devices = details.devices.map(d => d === 'Other' ? details.customDevice : d);
    parts.push(`Patient immobilized using ${devices.join(' and ')}`);

    // Position
    parts.push(`Patient ${details.position === 'Other' ? details.customPosition : `found in ${details.position} position`}`);

    // Neurovascular status
    const beforeStatus = [
      details.pulsesBefore ? 'pulses' : null,
      details.sensationBefore ? 'sensation' : null,
      details.movementBefore ? 'movement' : null
    ].filter(Boolean);
    
    const afterStatus = [
      details.pulsesAfter ? 'pulses' : null,
      details.sensationAfter ? 'sensation' : null,
      details.movementAfter ? 'movement' : null
    ].filter(Boolean);

    if (beforeStatus.length > 0) {
      parts.push(`Pre-immobilization assessment: ${beforeStatus.join(', ')} present`);
    }
    
    if (afterStatus.length > 0) {
      parts.push(`Post-immobilization assessment: ${afterStatus.join(', ')} present`);
    }

    // Complications
    if (details.complications?.length) {
      parts.push(`Complications: ${details.complications.join(', ')}`);
    }

    // Additional notes
    if (details.notes) {
      parts.push(details.notes);
    }

    return parts.join('. ') + '.';
  },

  ekg: (details: EKGDetails): string => {
    const parts = [];
    
    // Time and basic info
    if (details.time) {
      parts.push(`${details.time}: EKG`);
    } else {
      parts.push('EKG');
    }

    // Type of EKG
    if (details.type) {
      parts.push(`via ${details.type}`);
    }

    // Rhythm
    const rhythmText = details.rhythm === 'Other' ? details.customRhythm : details.rhythm;
    if (rhythmText) {
      parts.push(rhythmText);
    }

    // Rate and regularity
    if (details.rate) {
      parts.push(`${details.rate} bpm${details.regular ? ', regular' : ', irregular'}`);
    }

    // STEMI details
    if (details.stemi && details.stemiLocation?.length) {
      parts.push(`***STEMI*** identified in ${details.stemiLocation.join('/')} distribution`);
    }

    // Key measurements
    const measurements = [];
    if (details.qrs) measurements.push(`QRS ${details.qrs}ms`);
    if (details.qtc) measurements.push(`QTc ${details.qtc}ms`);
    if (details.prInterval) measurements.push(`PR ${details.prInterval}ms`);
    if (measurements.length > 0) {
      parts.push(measurements.join(', '));
    }

    // Additional findings
    if (details.findings) {
      parts.push(details.findings);
    }

    // Interpretation (if different from findings)
    if (details.interpretation && details.interpretation !== details.findings) {
      parts.push(details.interpretation);
    }

    // Transmission details
    if (details.transmitted) {
      if (details.transmittedTo) {
        parts.push(`Transmitted to ${details.transmittedTo}`);
      } else {
        parts.push('Transmitted');
      }
    }

    // Join with appropriate separators
    const narrative = parts.map((part, index) => {
      if (index === 0) return part;
      return part;
    }).join(', ') + '.';

    return narrative;
  }
};

// Add types to ensure template completeness
export type ProcedureTemplates = typeof procedureTemplates;
export type ProcedureType = keyof ProcedureTemplates;