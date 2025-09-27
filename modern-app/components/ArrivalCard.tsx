import { useState, useCallback } from 'react';
import type { CardComponentProps } from './card-fields';
import { TextField, RadioField, CheckboxField } from './card-fields';

export function ArrivalCard({ id, time, onTimeChange, onRemove, onDetailsChange, onVerifiedChange, verified }: CardComponentProps) {
  const [values, setValues] = useState({
    ptContact: '',
    staged: false,
    stageLocation: '',
    stagingCleared: '',
    note: '',
    ppe: [] as string[],
    ppeDetails: ''
  });

  const handleChange = useCallback((field: keyof typeof values, value: any) => {
    setValues(prev => {
      const next = { ...prev, [field]: value };
      onDetailsChange?.(JSON.stringify(next));
      return next;
    });
  }, [onDetailsChange]);

  return (
    <div className="space-y-4">
      <TextField
        field={{
          id: `${id}_ptContact`,
          type: 'text',
          label: 'Patient Contact Time',
          placeholder: 'HHMM',
          required: true
        }}
        value={values.ptContact}
        onChange={v => handleChange('ptContact', v)}
      />

      <RadioField
        field={{
          id: `${id}_staged`,
          type: 'radio',
          label: 'Staging',
          required: true,
          options: [
            { value: 'true', label: 'Staged' },
            { value: 'false', label: 'Direct Response' }
          ]
        }}
        value={values.staged ? 'true' : 'false'}
        onChange={v => handleChange('staged', v === 'true')}
      />

      {values.staged && (
        <>
          <TextField
            field={{
              id: `${id}_stageLocation`,
              type: 'text',
              label: 'Stage Location',
              placeholder: 'Enter staging location',
              required: false
            }}
            value={values.stageLocation}
            onChange={v => handleChange('stageLocation', v)}
          />

          <TextField
            field={{
              id: `${id}_stagingCleared`,
              type: 'text',
              label: 'Cleared By',
              placeholder: 'Enter who cleared staging',
              required: false
            }}
            value={values.stagingCleared}
            onChange={v => handleChange('stagingCleared', v)}
          />
        </>
      )}

      <CheckboxField
        field={{
          id: `${id}_ppe`,
          type: 'checkbox',
          label: 'PPE',
          required: true,
          options: [
            { value: 'gloves', label: 'Gloves' },
            { value: 'mask', label: 'Mask' },
            { value: 'eyewear', label: 'Eye Protection' },
            { value: 'gown', label: 'Gown/Suit' }
          ]
        }}
        values={values.ppe}
        onChange={v => handleChange('ppe', v)}
      />

      <TextField
        field={{
          id: `${id}_ppeDetails`,
          type: 'text',
          label: 'PPE Details',
          placeholder: 'Additional PPE details',
          required: false
        }}
        value={values.ppeDetails}
        onChange={v => handleChange('ppeDetails', v)}
      />

      <TextField
        field={{
          id: `${id}_note`,
          type: 'text',
          label: 'Note',
          placeholder: 'Additional arrival details',
          required: false
        }}
        value={values.note}
        onChange={v => handleChange('note', v)}
      />
      
      <div className="flex items-center justify-end mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={verified}
            onChange={e => onVerifiedChange?.(e.target.checked)}
            className="text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-900">Verify</span>
        </label>
      </div>
    </div>
  );
}