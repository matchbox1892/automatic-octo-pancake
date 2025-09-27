import { useState, useCallback } from 'react';
import type { O2Card } from '../lib/schemas/specialized-cards';
import { TextField, RadioField } from './card-fields';

interface O2CardProps {
  id: string;
  time: string;
  details: O2Card['details'];
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: O2Card['details']) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const methodOptions = [
  { value: 'Nasal Cannula', label: 'Nasal Cannula' },
  { value: 'Non-Rebreather', label: 'Non-Rebreather Mask' },
  { value: 'Bag Valve Mask', label: 'Bag Valve Mask' },
  { value: 'CPAP', label: 'CPAP' },
  { value: 'Ventilator', label: 'Ventilator' }
];

export function O2CardComponent({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: O2CardProps) {
  const [values, setValues] = useState(details);

  const handleChange = useCallback((field: keyof typeof values, value: any) => {
    setValues(prev => {
      const next = { ...prev, [field]: value };
      onDetailsChange?.(next);
      return next;
    });
  }, [onDetailsChange]);

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
        onChange={onTimeChange}
      />

      <RadioField
        field={{
          id: `${id}_method`,
          type: 'radio',
          label: 'Oxygen Delivery Method',
          required: true,
          options: methodOptions,
        }}
        value={values.method}
        onChange={v => handleChange('method', v)}
      />

      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Flow Rate (LPM)</label>
        <input
          type="number"
          min="0"
          max="25"
          step="0.5"
          value={values.flowRate}
          onChange={e => handleChange('flowRate', Number(e.target.value))}
          className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        <span className="text-sm text-gray-500">L/min</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">SpO2 Before</label>
          <input
            type="number"
            min="0"
            max="100"
            value={values.spO2Before || ''}
            onChange={e => handleChange('spO2Before', Number(e.target.value))}
            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <span className="text-sm text-gray-500">%</span>
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">SpO2 After</label>
          <input
            type="number"
            min="0"
            max="100"
            value={values.spO2After || ''}
            onChange={e => handleChange('spO2After', Number(e.target.value))}
            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <span className="text-sm text-gray-500">%</span>
        </div>
      </div>

      <TextField
        field={{
          id: `${id}_complications`,
          type: 'text',
          label: 'Complications/Notes',
          required: false,
          placeholder: 'Enter any complications or additional notes',
        }}
        value={values.complications || ''}
        onChange={v => handleChange('complications', v)}
      />
      
      <div className="flex items-center justify-end mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={verification.verified}
            onChange={e => onVerifiedChange?.(e.target.checked)}
            className="text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-900">Verify</span>
        </label>
      </div>
    </div>
  );
}