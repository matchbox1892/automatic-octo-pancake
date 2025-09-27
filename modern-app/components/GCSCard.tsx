import { useState, useCallback } from 'react';
import type { GCSCard } from '../schemas/specialized-cards';
import { TextField, RadioField } from './card-fields';

interface GCSCardProps extends GCSCard {
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: GCSCard['details']) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const GCSRanges = {
  eyes: [
    { value: '1', label: '1 - No eye opening' },
    { value: '2', label: '2 - To pain' },
    { value: '3', label: '3 - To voice' },
    { value: '4', label: '4 - Spontaneous' },
  ],
  verbal: [
    { value: '1', label: '1 - No verbal response' },
    { value: '2', label: '2 - Incomprehensible sounds' },
    { value: '3', label: '3 - Inappropriate words' },
    { value: '4', label: '4 - Confused' },
    { value: '5', label: '5 - Oriented' },
  ],
  motor: [
    { value: '1', label: '1 - No motor response' },
    { value: '2', label: '2 - Extension to pain' },
    { value: '3', label: '3 - Flexion to pain' },
    { value: '4', label: '4 - Withdrawal from pain' },
    { value: '5', label: '5 - Localizes pain' },
    { value: '6', label: '6 - Obeys commands' },
  ],
  pupils: [
    { value: 'Normal', label: 'Normal' },
    { value: 'Constricted', label: 'Constricted' },
    { value: 'Dilated', label: 'Dilated' },
    { value: 'No Response', label: 'No Response' },
  ],
};

export function GCSCardComponent({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: GCSCardProps) {
  const [values, setValues] = useState(details);

  const handleChange = useCallback((field: keyof typeof values, value: any) => {
    setValues(prev => {
      const next = { ...prev, [field]: value };
      if (['eyes', 'verbal', 'motor'].includes(field)) {
        next.total = Number(next.eyes) + Number(next.verbal) + Number(next.motor);
      }
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
          id: `${id}_eyes`,
          type: 'radio',
          label: 'Eye Opening',
          required: true,
          options: GCSRanges.eyes,
        }}
        value={values.eyes.toString()}
        onChange={v => handleChange('eyes', Number(v))}
      />

      <RadioField
        field={{
          id: `${id}_verbal`,
          type: 'radio',
          label: 'Verbal Response',
          required: true,
          options: GCSRanges.verbal,
        }}
        value={values.verbal.toString()}
        onChange={v => handleChange('verbal', Number(v))}
      />

      <RadioField
        field={{
          id: `${id}_motor`,
          type: 'radio',
          label: 'Motor Response',
          required: true,
          options: GCSRanges.motor,
        }}
        value={values.motor.toString()}
        onChange={v => handleChange('motor', Number(v))}
      />

      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
        <span className="font-semibold">Total GCS Score:</span>
        <span className="text-xl">{values.total}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <RadioField
          field={{
            id: `${id}_pupilLeft`,
            type: 'radio',
            label: 'Left Pupil',
            required: true,
            options: GCSRanges.pupils,
          }}
          value={values.pupilLeft}
          onChange={v => handleChange('pupilLeft', v)}
        />

        <RadioField
          field={{
            id: `${id}_pupilRight`,
            type: 'radio',
            label: 'Right Pupil',
            required: true,
            options: GCSRanges.pupils,
          }}
          value={values.pupilRight}
          onChange={v => handleChange('pupilRight', v)}
        />
      </div>

      <TextField
        field={{
          id: `${id}_notes`,
          type: 'text',
          label: 'Notes',
          placeholder: 'Additional observations',
          required: false,
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
            className="text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-900">Verify</span>
        </label>
      </div>
    </div>
  );
}