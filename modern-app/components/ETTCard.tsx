import { useState, useCallback } from 'react';
import type { ETTCard } from '../lib/schemas/procedure-cards';
import { TextField, RadioField, CheckboxField } from './card-fields';

interface ETTCardProps {
  id: string;
  time: string;
  details: ETTCard['details'];
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: ETTCard['details']) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const methodOptions = [
  { value: 'Direct', label: 'Direct Laryngoscopy' },
  { value: 'Video', label: 'Video Laryngoscopy' },
  { value: 'Blind', label: 'Blind Insertion' },
  { value: 'Digital', label: 'Digital Intubation' }
];

const difficultyOptions = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Difficult', label: 'Difficult' }
];

const gradeOptions = [
  { value: 'Grade 1', label: 'Grade 1 - Full view of glottis' },
  { value: 'Grade 2', label: 'Grade 2 - Partial view of glottis' },
  { value: 'Grade 2a', label: 'Grade 2a - Partial view with posterior commissure' },
  { value: 'Grade 2b', label: 'Grade 2b - Only arytenoids visible' },
  { value: 'Grade 3', label: 'Grade 3 - Only epiglottis visible' },
  { value: 'Grade 4', label: 'Grade 4 - No glottic structures visible' }
];

const confirmationOptions = [
  { value: 'Chest Rise', label: 'Chest Rise' },
  { value: 'Breath Sounds', label: 'Breath Sounds' },
  { value: 'End-Tidal CO2', label: 'End-Tidal CO2' },
  { value: 'Misting', label: 'Tube Misting' },
  { value: 'Direct Visualization', label: 'Direct Visualization' }
];

export function ETTCardComponent({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: ETTCardProps) {
  const [values, setValues] = useState(details);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dose: '',
    time: ''
  });

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

  const addMedication = () => {
    if (newMedication.name && newMedication.dose && newMedication.time) {
      setValues(prev => {
        const next = {
          ...prev,
          medications: [...(prev.medications || []), { ...newMedication }]
        };
        onDetailsChange?.(next);
        return next;
      });
      setNewMedication({ name: '', dose: '', time: '' });
    }
  };

  const removeMedication = (index: number) => {
    setValues(prev => {
      const next = {
        ...prev,
        medications: prev.medications?.filter((_, i) => i !== index)
      };
      onDetailsChange?.(next);
      return next;
    });
  };

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
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">ETT Size</label>
          <input
            type="number"
            min="2.0"
            max="9.0"
            step="0.5"
            value={values.size}
            onChange={e => handleChange(['size'], Number(e.target.value))}
            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Depth at Teeth</label>
          <input
            type="number"
            min="12"
            max="26"
            value={values.depthAtTeeth}
            onChange={e => handleChange(['depthAtTeeth'], Number(e.target.value))}
            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <span className="text-sm text-gray-500">cm</span>
        </div>
      </div>

      <RadioField
        field={{
          id: `${id}_method`,
          type: 'radio',
          label: 'Intubation Method',
          required: true,
          options: methodOptions,
        }}
        value={values.method}
        onChange={v => handleChange(['method'], v)}
      />

      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Number of Attempts</label>
        <input
          type="number"
          min="1"
          value={values.attempts}
          onChange={e => handleChange(['attempts'], Number(e.target.value))}
          className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={values.successful}
          onChange={e => handleChange(['successful'], e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="text-sm font-medium text-gray-700">
          Successful Intubation
        </label>
      </div>

      <CheckboxField
        field={{
          id: `${id}_confirmation`,
          type: 'checkbox',
          label: 'Confirmation Methods',
          required: true,
          options: confirmationOptions,
        }}
        values={values.confirmation}
        onChange={v => handleChange(['confirmation'], v)}
      />

      <RadioField
        field={{
          id: `${id}_difficulty`,
          type: 'radio',
          label: 'Intubation Difficulty',
          required: true,
          options: difficultyOptions,
        }}
        value={values.difficulty}
        onChange={v => handleChange(['difficulty'], v)}
      />

      <RadioField
        field={{
          id: `${id}_cormackLehane`,
          type: 'radio',
          label: 'Cormack-Lehane Grade',
          required: true,
          options: gradeOptions,
        }}
        value={values.cormackLehane}
        onChange={v => handleChange(['cormackLehane'], v)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={values.styletUsed}
            onChange={e => handleChange(['styletUsed'], e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Stylet Used</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={values.bougie}
            onChange={e => handleChange(['bougie'], e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Bougie Used</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={values.inlineStabilization}
            onChange={e => handleChange(['inlineStabilization'], e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Inline Stabilization</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={values.cricoidPressure}
            onChange={e => handleChange(['cricoidPressure'], e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Cricoid Pressure</label>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Medications</h3>
          <button
            type="button"
            onClick={addMedication}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Medication
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <TextField
            field={{
              id: `${id}_newMedName`,
              type: 'text',
              label: 'Medication',
              required: false,
              placeholder: 'Enter medication name',
            }}
            value={newMedication.name}
            onChange={v => setNewMedication(prev => ({ ...prev, name: v }))}
          />

          <TextField
            field={{
              id: `${id}_newMedDose`,
              type: 'text',
              label: 'Dose',
              required: false,
              placeholder: 'Enter dose',
            }}
            value={newMedication.dose}
            onChange={v => setNewMedication(prev => ({ ...prev, dose: v }))}
          />

          <TextField
            field={{
              id: `${id}_newMedTime`,
              type: 'text',
              label: 'Time',
              required: false,
              placeholder: 'HHMM',
            }}
            value={newMedication.time}
            onChange={v => setNewMedication(prev => ({ ...prev, time: v }))}
          />
        </div>

        {values.medications?.map((med, index) => (
          <div key={index} className="flex items-center space-x-4">
            <span className="text-sm">{med.name} - {med.dose} @ {med.time}</span>
            <button
              type="button"
              onClick={() => removeMedication(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
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