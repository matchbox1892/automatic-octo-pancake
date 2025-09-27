import { useState, useCallback } from 'react';
import type { MedicationCard } from '../lib/schemas/procedure-cards';
import { TextField, SelectField } from './card-fields';

interface MedicationCardProps {
  id: string;
  time: string;
  details: MedicationCard['details'];
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: MedicationCard['details']) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const routeOptions = [
  { value: 'IV', label: 'Intravenous (IV)' },
  { value: 'IM', label: 'Intramuscular (IM)' },
  { value: 'IO', label: 'Intraosseous (IO)' },
  { value: 'PO', label: 'Oral (PO)' },
  { value: 'SL', label: 'Sublingual (SL)' },
  { value: 'IN', label: 'Intranasal (IN)' },
  { value: 'PR', label: 'Per Rectum (PR)' },
  { value: 'NEB', label: 'Nebulizer' },
  { value: 'TD', label: 'Transdermal' }
];

const indicationPresets = [
  'Pain',
  'Seizure',
  'Cardiac Arrest',
  'Respiratory Distress',
  'Allergic Reaction',
  'Sedation',
  'Agitation',
  'Nausea'
];

export function MedicationCardComponent({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange
}: MedicationCardProps) {
  const [values, setValues] = useState(details);

  const handleChange = useCallback((path: string[], value: any) => {
    setValues(prev => {
      const next = { ...prev };
      let current = next as any;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      onDetailsChange?.(next);
      return next;
    });
  }, [onDetailsChange]);

  const handleWasteChange = useCallback((wasteAmount: number) => {
    if (wasteAmount > values.dose) {
      return; // Cannot waste more than the dose
    }
    handleChange(['waste', 'amount'], wasteAmount);
  }, [values.dose, handleChange]);

  const handleResponseChange = useCallback((responseTime: string, effect: string) => {
    handleChange(['response', 'time'], responseTime);
    handleChange(['response', 'effect'], effect);
  }, [handleChange]);

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

      <div className="grid grid-cols-2 gap-4">
        <TextField
          field={{
            id: `${id}_medication`,
            type: 'text',
            label: 'Medication Name',
            required: true,
            placeholder: 'Enter medication name'
          }}
          value={values.medication}
          onChange={v => handleChange(['medication'], v)}
        />

        <TextField
          field={{
            id: `${id}_dose`,
            type: 'text',
            label: 'Dose',
            required: true,
            placeholder: 'Enter dose with units'
          }}
          value={values.dose}
          onChange={v => handleChange(['dose'], v)}
        />
      </div>

      <SelectField
        field={{
          id: `${id}_route`,
          type: 'select',
          label: 'Route',
          required: true,
          options: routeOptions
        }}
        value={values.route}
        onChange={v => handleChange(['route'], v)}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          field={{
            id: `${id}_site`,
            type: 'text',
            label: 'Administration Site',
            placeholder: 'e.g., Left AC'
          }}
          value={values.site}
          onChange={v => handleChange(['site'], v)}
        />

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Concentration</label>
          <input
            type="text"
            value={values.concentration || ''}
            onChange={e => handleChange(['concentration'], e.target.value)}
            placeholder="e.g., 1mg/mL"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Indication</label>
        <div className="flex flex-wrap gap-2">
          {indicationPresets.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => handleChange(['indication'], preset)}
              className={`px-3 py-1 text-sm rounded-full ${
                values.indication === preset
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              } border hover:bg-blue-50`}
            >
              {preset}
            </button>
          ))}
          <TextField
            field={{
              id: `${id}_indication_other`,
              type: 'text',
              label: 'Other',
              placeholder: 'Custom indication'
            }}
            value={values.indication || ''}
            onChange={v => handleChange(['indication'], v)}
          />
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">Medication Waste</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Amount Wasted</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={values.waste?.amount || 0}
              onChange={e => handleWasteChange(Number(e.target.value))}
              className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <TextField
            field={{
              id: `${id}_waste_witness`,
              type: 'text',
              label: 'Witness',
              placeholder: 'Name of witness'
            }}
            value={values.waste?.witness || ''}
            onChange={v => handleChange(['waste', 'witness'], v)}
          />
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">Patient Response</h3>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            field={{
              id: `${id}_response_time`,
              type: 'text',
              label: 'Response Time',
              placeholder: 'HHMM'
            }}
            value={values.response?.time || ''}
            onChange={v => handleResponseChange(v, values.response?.effect || '')}
          />

          <TextField
            field={{
              id: `${id}_response_effect`,
              type: 'text',
              label: 'Effect',
              placeholder: 'Describe response'
            }}
            value={values.response?.effect || ''}
            onChange={v => handleResponseChange(values.response?.time || '', v)}
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