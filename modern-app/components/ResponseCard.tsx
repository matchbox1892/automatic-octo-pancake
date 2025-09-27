import { useState, useCallback } from 'react';
import type { ResponseCard } from '../schemas/specialized-cards';
import { TextField, RadioField } from './card-fields';

interface ResponseCardProps extends ResponseCard {
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: ResponseCard['details']) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

export function ResponseCardComponent({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: ResponseCardProps) {
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
          id: `${id}_responseType`,
          type: 'radio',
          label: 'Response Type',
          required: true,
          options: [
            { value: 'Emergency', label: 'Emergency' },
            { value: 'Non-Emergency', label: 'Non-Emergency' },
            { value: 'Mutual Aid', label: 'Mutual Aid' },
          ],
        }}
        value={values.responseType}
        onChange={v => handleChange('responseType', v)}
      />

      <RadioField
        field={{
          id: `${id}_responseCode`,
          type: 'radio',
          label: 'Response Code',
          required: false,
          options: [
            { value: 'Code 1', label: 'Code 1' },
            { value: 'Code 2', label: 'Code 2' },
            { value: 'Code 3', label: 'Code 3' },
          ],
        }}
        value={values.responseCode || ''}
        onChange={v => handleChange('responseCode', v)}
      />

      <TextField
        field={{
          id: `${id}_location`,
          type: 'text',
          label: 'Location',
          placeholder: 'Enter response location',
          required: true,
        }}
        value={values.location}
        onChange={v => handleChange('location', v)}
      />

      <TextField
        field={{
          id: `${id}_dispatchInfo`,
          type: 'text',
          label: 'Dispatch Information',
          placeholder: 'Enter dispatch details',
          required: false,
        }}
        value={values.dispatchInfo || ''}
        onChange={v => handleChange('dispatchInfo', v)}
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