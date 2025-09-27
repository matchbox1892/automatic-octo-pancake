import { useState, useCallback } from 'react';
import type { CardComponentProps } from './card-fields';
import { TextField, SelectField, CheckboxField } from './card-fields';

export function VitalsCard({ id, time, onTimeChange, onRemove, onDetailsChange, onVerifiedChange, verified }: CardComponentProps) {
  const [values, setValues] = useState({
    hr: '',
    bp: '',
    rr: '',
    spo2: '',
    o2Flow: '',
    o2Device: '',
    temp: '',
    etco2: '',
    bs: '',
    pain: ''
  });

  const handleChange = useCallback((field: keyof typeof values, value: string) => {
    setValues(prev => {
      const next = { ...prev, [field]: value };
      onDetailsChange?.(JSON.stringify(next));
      return next;
    });
  }, [onDetailsChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          field={{
            id: `${id}_hr`,
            type: 'text',
            label: 'Heart Rate',
            required: true,
            placeholder: 'BPM'
          }}
          value={values.hr}
          onChange={v => handleChange('hr', v)}
        />
        <TextField
          field={{
            id: `${id}_bp`,
            type: 'text',
            label: 'Blood Pressure',
            required: true,
            placeholder: 'SYS/DIA'
          }}
          value={values.bp}
          onChange={v => handleChange('bp', v)}
        />
        <TextField
          field={{
            id: `${id}_rr`,
            type: 'text',
            label: 'Respiratory Rate',
            required: true,
            placeholder: 'Breaths/min'
          }}
          value={values.rr}
          onChange={v => handleChange('rr', v)}
        />
        <TextField
          field={{
            id: `${id}_spo2`,
            type: 'text',
            label: 'SpO2',
            required: true,
            placeholder: '%'
          }}
          value={values.spo2}
          onChange={v => handleChange('spo2', v)}
        />
        <TextField
          field={{
            id: `${id}_o2flow`,
            type: 'text',
            label: 'O2 Flow Rate',
            placeholder: 'LPM'
          }}
          value={values.o2Flow}
          onChange={v => handleChange('o2Flow', v)}
        />
        <SelectField
          field={{
            id: `${id}_o2device`,
            type: 'select',
            label: 'O2 Device',
            options: [
              { value: 'nc', label: 'Nasal Cannula' },
              { value: 'nrb', label: 'Non-Rebreather' },
              { value: 'bvm', label: 'BVM' },
              { value: 'other', label: 'Other' }
            ]
          }}
          value={values.o2Device}
          onChange={v => handleChange('o2Device', v)}
        />
        <TextField
          field={{
            id: `${id}_temp`,
            type: 'text',
            label: 'Temperature',
            placeholder: '°F'
          }}
          value={values.temp}
          onChange={v => handleChange('temp', v)}
        />
        <TextField
          field={{
            id: `${id}_etco2`,
            type: 'text',
            label: 'EtCO2',
            placeholder: 'mmHg'
          }}
          value={values.etco2}
          onChange={v => handleChange('etco2', v)}
        />
        <TextField
          field={{
            id: `${id}_bs`,
            type: 'text',
            label: 'Blood Sugar',
            placeholder: 'mg/dL'
          }}
          value={values.bs}
          onChange={v => handleChange('bs', v)}
        />
        <TextField
          field={{
            id: `${id}_pain`,
            type: 'text',
            label: 'Pain Scale',
            placeholder: '0-10'
          }}
          value={values.pain}
          onChange={v => handleChange('pain', v)}
        />
      </div>
      
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