import { useState, useCallback } from 'react';
import type { SplintDetails, SplintType, BodyLocation } from '../lib/schemas/immobilization-types';
import { TextField, SelectField, CheckboxField } from './card-fields';
import { splintTypes, bodyLocations } from '../lib/schemas/immobilization-types';

interface SplintCardProps {
  id: string;
  time: string;
  details: SplintDetails;
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: SplintDetails) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

export function SplintCard({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: SplintCardProps) {
  const [values, setValues] = useState(details);

  const handleChange = useCallback((field: keyof SplintDetails, value: any) => {
    setValues(prev => {
      const next = { ...prev, [field]: value };
      onDetailsChange?.(next);
      return next;
    });
  }, [onDetailsChange]);

  const splintTypeOptions = splintTypes.map(type => ({ value: type, label: type }));
  const locationOptions = bodyLocations.map(location => ({ value: location, label: location }));

  return (
    <div className="space-y-4">
      <TextField
        field={{
          id: `${id}_time`,
          type: 'text',
          label: 'Time',
          placeholder: 'HHMM',
          required: true,
        }}
        value={time}
        onChange={(v: string) => onTimeChange?.(v)}
      />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          field={{
            id: `${id}_type`,
            type: 'select',
            label: 'Splint Type',
            required: true,
            options: splintTypeOptions,
          }}
          value={values.type}
          onChange={v => handleChange('type', v as SplintType)}
        />

        {values.type === 'Other' && (
          <TextField
            field={{
              id: `${id}_customType`,
              type: 'text',
              label: 'Custom Splint Type',
              required: true,
              placeholder: 'Enter splint type'
            }}
            value={values.customType || ''}
            onChange={v => handleChange('customType', v)}
          />
        )}

        <SelectField
          field={{
            id: `${id}_location`,
            type: 'select',
            label: 'Location',
            required: true,
            options: locationOptions,
          }}
          value={values.location}
          onChange={v => handleChange('location', v as BodyLocation)}
        />

        {values.location === 'Other' && (
          <TextField
            field={{
              id: `${id}_customLocation`,
              type: 'text',
              label: 'Custom Location',
              required: true,
              placeholder: 'Enter location'
            }}
            value={values.customLocation || ''}
            onChange={v => handleChange('customLocation', v)}
          />
        )}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Neurovascular Assessment</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Before Application</h4>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.pulsesBefore}
                onChange={e => handleChange('pulsesBefore', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Pulses Present</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.sensationBefore}
                onChange={e => handleChange('sensationBefore', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Sensation Present</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.movementBefore}
                onChange={e => handleChange('movementBefore', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Movement Present</label>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">After Application</h4>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.pulsesAfter}
                onChange={e => handleChange('pulsesAfter', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Pulses Present</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.sensationAfter}
                onChange={e => handleChange('sensationAfter', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Sensation Present</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.movementAfter}
                onChange={e => handleChange('movementAfter', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Movement Present</label>
            </div>
          </div>
        </div>
      </div>

      {values.complications && values.complications.length > 0 && (
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="font-medium text-red-900">Complications</h3>
          <ul className="mt-2 list-disc list-inside text-red-700">
            {values.complications.map((complication, index) => (
              <li key={index}>{complication}</li>
            ))}
          </ul>
        </div>
      )}

      <TextField
        field={{
          id: `${id}_notes`,
          type: 'text',
          label: 'Additional Notes',
          required: false,
          placeholder: 'Enter any additional notes'
        }}
        value={values.notes || ''}
        onChange={v => handleChange('notes', v)}
      />

      <div className="flex items-center justify-end mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={verification.verified}
            onChange={e => onVerifiedChange?.(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-900">Verify</span>
        </label>
      </div>
    </div>
  );
}