import { useState, useCallback } from 'react';
import type { IVCard } from '../lib/schemas/specialized-cards';
import { TextField, RadioField } from './card-fields';

interface IVCardProps {
  id: string;
  time: string;
  details: IVCard['details'];
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: IVCard['details']) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const gaugeOptions = [
  { value: '14G', label: '14G - Orange' },
  { value: '16G', label: '16G - Gray' },
  { value: '18G', label: '18G - Green' },
  { value: '20G', label: '20G - Pink' },
  { value: '22G', label: '22G - Blue' },
  { value: '24G', label: '24G - Yellow' }
];

const fluidOptions = [
  { value: 'Normal Saline', label: 'Normal Saline' },
  { value: 'Lactated Ringers', label: 'Lactated Ringers' },
  { value: 'Other', label: 'Other' }
];

const rateOptions = [
  { value: 'KVO', label: 'KVO (Keep Vein Open)' },
  { value: 'Wide Open', label: 'Wide Open' },
  { value: 'Other', label: 'Other Rate' }
];

export function IVCardComponent({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: IVCardProps) {
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

      <TextField
        field={{
          id: `${id}_site`,
          type: 'text',
          label: 'IV Site',
          required: true,
          placeholder: 'e.g., Right AC, Left Forearm',
        }}
        value={values.site}
        onChange={v => handleChange('site', v)}
      />

      <RadioField
        field={{
          id: `${id}_size`,
          type: 'radio',
          label: 'Catheter Size',
          required: true,
          options: gaugeOptions,
        }}
        value={values.size}
        onChange={v => handleChange('size', v)}
      />

      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Number of Attempts</label>
        <input
          type="number"
          min="1"
          value={values.attempts}
          onChange={e => handleChange('attempts', Number(e.target.value))}
          className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={values.successful}
          onChange={e => handleChange('successful', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="text-sm font-medium text-gray-700">
          IV Successfully Established
        </label>
      </div>

      <RadioField
        field={{
          id: `${id}_fluid`,
          type: 'radio',
          label: 'IV Fluid',
          required: true,
          options: fluidOptions,
        }}
        value={values.fluid}
        onChange={v => handleChange('fluid', v)}
      />

      <RadioField
        field={{
          id: `${id}_rate`,
          type: 'radio',
          label: 'Flow Rate',
          required: true,
          options: rateOptions,
        }}
        value={values.rate}
        onChange={v => handleChange('rate', v)}
      />

      {values.successful && (
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Total Volume (mL)</label>
          <input
            type="number"
            min="0"
            step="50"
            value={values.totalVolume || 0}
            onChange={e => handleChange('totalVolume', Number(e.target.value))}
            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <span className="text-sm text-gray-500">mL</span>
        </div>
      )}

      <TextField
        field={{
          id: `${id}_complications`,
          type: 'text',
          label: 'Complications/Notes',
          required: false,
          placeholder: 'Document any complications or additional notes',
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