import { useState, useCallback } from 'react';
import type { PainCard } from '../lib/schemas/treatment-cards';
import { TextField, RadioField, CheckboxField } from './card-fields';

interface PainCardProps extends PainCard {
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: PainCard['details']) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const painQualities = [
  'Sharp',
  'Dull',
  'Burning',
  'Aching',
  'Throbbing',
  'Stabbing',
  'Crushing',
  'Other'
].map(quality => ({ value: quality.toLowerCase(), label: quality }));

const severityOptions = [
  { value: 'Mild', label: 'Mild' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Severe', label: 'Severe' }
];

const onsetOptions = [
  { value: 'Sudden', label: 'Sudden onset' },
  { value: 'Gradual', label: 'Gradual onset' }
];

const timePatternOptions = [
  { value: 'Constant', label: 'Constant' },
  { value: 'Intermittent', label: 'Intermittent' },
  { value: 'Worsening', label: 'Worsening' },
  { value: 'Improving', label: 'Improving' }
];

export function PainCardComponent({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: PainCardProps) {
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

      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Pain Score (0-10)</label>
        <input
          type="range"
          min="0"
          max="10"
          value={values.score}
          onChange={e => handleChange('score', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-lg font-semibold">{values.score}</span>
      </div>

      <TextField
        field={{
          id: `${id}_location`,
          type: 'text',
          label: 'Pain Location',
          placeholder: 'Describe location of pain',
          required: true,
        }}
        value={values.location}
        onChange={v => handleChange('location', v)}
      />

      <CheckboxField
        field={{
          id: `${id}_quality`,
          type: 'checkbox',
          label: 'Pain Quality',
          required: true,
          options: painQualities,
        }}
        values={values.quality}
        onChange={v => handleChange('quality', v)}
      />

      {values.quality.includes('Other') && (
        <TextField
          field={{
            id: `${id}_qualityOther`,
            type: 'text',
            label: 'Other Quality Description',
            placeholder: 'Describe other pain quality',
            required: true,
          }}
          value={values.qualityOther || ''}
          onChange={v => handleChange('qualityOther', v)}
        />
      )}

      <RadioField
        field={{
          id: `${id}_severity`,
          type: 'radio',
          label: 'Pain Severity',
          required: true,
          options: severityOptions,
        }}
        value={values.severity}
        onChange={v => handleChange('severity', v)}
      />

      <RadioField
        field={{
          id: `${id}_onset`,
          type: 'radio',
          label: 'Onset',
          required: true,
          options: onsetOptions,
        }}
        value={values.onset}
        onChange={v => handleChange('onset', v)}
      />

      <TextField
        field={{
          id: `${id}_provokes`,
          type: 'text',
          label: 'What Provokes Pain',
          placeholder: 'What makes the pain worse?',
          required: false,
        }}
        value={values.provokes || ''}
        onChange={v => handleChange('provokes', v)}
      />

      <TextField
        field={{
          id: `${id}_palliates`,
          type: 'text',
          label: 'What Relieves Pain',
          placeholder: 'What makes the pain better?',
          required: false,
        }}
        value={values.palliates || ''}
        onChange={v => handleChange('palliates', v)}
      />

      <RadioField
        field={{
          id: `${id}_timePattern`,
          type: 'radio',
          label: 'Time Pattern',
          required: true,
          options: timePatternOptions,
        }}
        value={values.timePattern}
        onChange={v => handleChange('timePattern', v)}
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