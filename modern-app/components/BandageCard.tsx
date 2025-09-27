import { useState, useCallback } from 'react';
import type { BandageDetails, BandageType, BodyLocation } from '../lib/schemas/immobilization-types';
import { TextField, SelectField } from './card-fields';
import { bandageTypes, bodyLocations } from '../lib/schemas/immobilization-types';

interface BandageCardProps {
  id: string;
  time: string;
  details: BandageDetails;
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: BandageDetails) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

export function BandageCard({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: BandageCardProps) {
  const [values, setValues] = useState(details);

  const handleChange = useCallback((field: keyof BandageDetails, value: any) => {
    setValues(prev => {
      const next = { ...prev, [field]: value };
      onDetailsChange?.(next);
      return next;
    });
  }, [onDetailsChange]);

  const bandageTypeOptions = bandageTypes.map(type => ({ value: type, label: type }));
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
            label: 'Bandage Type',
            required: true,
            options: bandageTypeOptions,
          }}
          value={values.type}
          onChange={v => handleChange('type', v as BandageType)}
        />

        {values.type === 'Other' && (
          <TextField
            field={{
              id: `${id}_customType`,
              type: 'text',
              label: 'Custom Bandage Type',
              required: true,
              placeholder: 'Enter bandage type'
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
        <h3 className="text-sm font-medium text-gray-900">Wound Care</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={values.woundCleaned}
              onChange={e => handleChange('woundCleaned', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Wound Cleaned</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={values.bleedingControlled}
              onChange={e => handleChange('bleedingControlled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Bleeding Controlled</label>
          </div>

          <TextField
            field={{
              id: `${id}_dressing`,
              type: 'text',
              label: 'Dressing',
              required: true,
              placeholder: 'Enter dressing type and size'
            }}
            value={values.dressing}
            onChange={v => handleChange('dressing', v)}
          />
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