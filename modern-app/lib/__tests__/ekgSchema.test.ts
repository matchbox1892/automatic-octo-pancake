import { describe, expect, test } from 'vitest';
import { EKGTransmissionSchema, EKGPrintSettingsSchema } from '../schemas/ekg-transmission';

describe('EKG Schema Legacy Compatibility', () => {
  test('transmission schema accepts legacy data format', () => {
    const legacyTransmission = {
      method: 'Fax',
      facilityType: 'Emergency Department',
      receivingFacility: 'City Hospital ED',
      receivingProvider: 'Dr. Smith',
      confirmationReceived: false,
      transmissionTime: '2024-01-31T10:30:00Z',
      transmissionAttempts: 1,
      notes: 'STEMI Alert'
    };

    const result = EKGTransmissionSchema.safeParse(legacyTransmission);
    expect(result.success).toBe(true);
  });

  test('print settings schema accepts legacy data format', () => {
    const legacyPrintSettings = {
      includeMeasurements: true,
      includeGrid: true,
      includeAnnotations: true,
      includeInterpretation: true,
      paperSpeed: '25mm/s',
      amplitudeScale: '10mm/mV',
      leadConfiguration: 'Standard',
      filterSettings: {
        baseline: true,
        muscleFilter: false,
        notchFilter: true
      }
    };

    const result = EKGPrintSettingsSchema.safeParse(legacyPrintSettings);
    expect(result.success).toBe(true);
  });

  test('transmission schema supports new features', () => {
    const modernTransmission = {
      method: 'DirectConnect',
      format: 'DICOM',
      status: 'Pending',
      facilityType: 'CardiacCenter',
      receivingFacility: 'Heart Institute',
      facilityIdentifier: 'HI-123',
      receivingProvider: 'Dr. Johnson',
      providerIdentifier: 'MD-456',
      department: 'Cardiology',
      confirmationRequired: true,
      confirmationReceived: false,
      transmissionTime: '2024-01-31T10:30:00Z',
      transmissionAttempts: 1,
      priority: 'Urgent',
      operatorId: 'OP-789',
      deviceId: 'EKG-123',
      notes: 'Suspected Acute MI'
    };

    const result = EKGTransmissionSchema.safeParse(modernTransmission);
    expect(result.success).toBe(true);
  });

  test('print settings schema provides correct defaults', () => {
    const minimalSettings = {
      paperSpeed: '25mm/s',
      amplitudeScale: '10mm/mV',
      leadConfiguration: 'Standard'
    };

    const result = EKGPrintSettingsSchema.parse(minimalSettings);
    
    expect(result.includeMeasurements).toBe(true);
    expect(result.includeGrid).toBe(true);
    expect(result.includeAnnotations).toBe(true);
    expect(result.includeInterpretation).toBe(true);
    expect(result.filterSettings.baseline).toBe(true);
    expect(result.filterSettings.muscleFilter).toBe(false);
    expect(result.filterSettings.notchFilter).toBe(true);
  });
});