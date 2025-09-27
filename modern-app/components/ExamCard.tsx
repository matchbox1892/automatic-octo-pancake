import { useState, useCallback } from 'react';
import type { ExamCard } from '../lib/schemas/treatment-cards';
import { TextField, RadioField } from './card-fields';

interface ExamCardProps {
  id: string;
  time: string;
  details: ExamCard['details'];
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: ExamCard['details']) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const sectionOptions = [
  { value: 'Head', label: 'Head' },
  { value: 'Neck', label: 'Neck' },
  { value: 'Chest', label: 'Chest' },
  { value: 'Abdomen', label: 'Abdomen' },
  { value: 'Back', label: 'Back' },
  { value: 'Pelvis', label: 'Pelvis' },
  { value: 'Extremities', label: 'Extremities' },
  { value: 'Neurological', label: 'Neurological' },
  { value: 'Skin', label: 'Skin' },
  { value: 'Other', label: 'Other' }
];

const findingTypes = [
  { value: 'Normal', label: 'Normal' },
  { value: 'Abnormal', label: 'Abnormal' }
];

const sideOptions = [
  { value: 'Left', label: 'Left' },
  { value: 'Right', label: 'Right' },
  { value: 'Bilateral', label: 'Bilateral' },
  { value: 'N/A', label: 'N/A' }
];

const severityOptions = [
  { value: 'Mild', label: 'Mild' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Severe', label: 'Severe' }
];

const injuryTypes = [
  { value: 'Abrasion', label: 'Abrasion' },
  { value: 'Laceration', label: 'Laceration' },
  { value: 'Contusion', label: 'Contusion' },
  { value: 'Burn', label: 'Burn' },
  { value: 'Fracture', label: 'Fracture' },
  { value: 'Deformity', label: 'Deformity' },
  { value: 'Other', label: 'Other' }
];

export function ExamCardComponent({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: ExamCardProps) {
  const [values, setValues] = useState(details);

  const handleChange = useCallback((path: string[], value: any) => {
    setValues(prev => {
      const next = { ...prev };
      let current = next;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i] as keyof typeof current];
      }
      current[path[path.length - 1] as keyof typeof current] = value;
      onDetailsChange?.(next);
      return next;
    });
  }, [onDetailsChange]);

  const addFinding = () => {
    setValues(prev => {
      const next = {
        ...prev,
        findings: [
          ...prev.findings,
          {
            type: 'Normal',
            description: '',
            side: 'N/A',
            severity: 'Mild'
          }
        ]
      };
      onDetailsChange?.(next);
      return next;
    });
  };

  const removeFinding = (index: number) => {
    setValues(prev => {
      const next = {
        ...prev,
        findings: prev.findings.filter((_, i) => i !== index)
      };
      onDetailsChange?.(next);
      return next;
    });
  };

  const addInjury = () => {
    setValues(prev => {
      const next = {
        ...prev,
        injuries: [
          ...(prev.injuries || []),
          {
            type: 'Abrasion',
            location: '',
            description: ''
          }
        ]
      };
      onDetailsChange?.(next);
      return next;
    });
  };

  const removeInjury = (index: number) => {
    setValues(prev => {
      const next = {
        ...prev,
        injuries: (prev.injuries || []).filter((_, i) => i !== index)
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

      <RadioField
        field={{
          id: `${id}_section`,
          type: 'radio',
          label: 'Body Section',
          required: true,
          options: sectionOptions,
        }}
        value={values.section}
        onChange={v => handleChange(['section'], v)}
      />

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Findings</h3>
          <button
            type="button"
            onClick={addFinding}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Finding
          </button>
        </div>

        {values.findings.map((finding, index) => (
          <div key={index} className="p-4 bg-white rounded-md shadow-sm space-y-4">
            <div className="flex justify-between">
              <h4 className="font-medium text-sm text-gray-700">Finding {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeFinding(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <RadioField
              field={{
                id: `${id}_finding${index}_type`,
                type: 'radio',
                label: 'Finding Type',
                required: true,
                options: findingTypes,
              }}
              value={finding.type}
              onChange={v => {
                const newFindings = [...values.findings];
                newFindings[index] = { ...finding, type: v };
                handleChange(['findings'], newFindings);
              }}
            />

            <TextField
              field={{
                id: `${id}_finding${index}_description`,
                type: 'text',
                label: 'Description',
                required: true,
                placeholder: 'Describe the finding',
              }}
              value={finding.description}
              onChange={v => {
                const newFindings = [...values.findings];
                newFindings[index] = { ...finding, description: v };
                handleChange(['findings'], newFindings);
              }}
            />

            {finding.type === 'Abnormal' && (
              <>
                <RadioField
                  field={{
                    id: `${id}_finding${index}_side`,
                    type: 'radio',
                    label: 'Side',
                    required: true,
                    options: sideOptions,
                  }}
                  value={finding.side || 'N/A'}
                  onChange={v => {
                    const newFindings = [...values.findings];
                    newFindings[index] = { ...finding, side: v };
                    handleChange(['findings'], newFindings);
                  }}
                />

                <RadioField
                  field={{
                    id: `${id}_finding${index}_severity`,
                    type: 'radio',
                    label: 'Severity',
                    required: true,
                    options: severityOptions,
                  }}
                  value={finding.severity || 'Mild'}
                  onChange={v => {
                    const newFindings = [...values.findings];
                    newFindings[index] = { ...finding, severity: v };
                    handleChange(['findings'], newFindings);
                  }}
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Injuries</h3>
          <button
            type="button"
            onClick={addInjury}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Injury
          </button>
        </div>

        {values.injuries?.map((injury, index) => (
          <div key={index} className="p-4 bg-white rounded-md shadow-sm space-y-4">
            <div className="flex justify-between">
              <h4 className="font-medium text-sm text-gray-700">Injury {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeInjury(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <RadioField
              field={{
                id: `${id}_injury${index}_type`,
                type: 'radio',
                label: 'Injury Type',
                required: true,
                options: injuryTypes,
              }}
              value={injury.type}
              onChange={v => {
                const newInjuries = [...(values.injuries || [])];
                newInjuries[index] = { ...injury, type: v };
                handleChange(['injuries'], newInjuries);
              }}
            />

            <TextField
              field={{
                id: `${id}_injury${index}_location`,
                type: 'text',
                label: 'Location',
                required: true,
                placeholder: 'Specify injury location',
              }}
              value={injury.location}
              onChange={v => {
                const newInjuries = [...(values.injuries || [])];
                newInjuries[index] = { ...injury, location: v };
                handleChange(['injuries'], newInjuries);
              }}
            />

            <TextField
              field={{
                id: `${id}_injury${index}_size`,
                type: 'text',
                label: 'Size',
                required: false,
                placeholder: 'Specify injury size (if applicable)',
              }}
              value={injury.size || ''}
              onChange={v => {
                const newInjuries = [...(values.injuries || [])];
                newInjuries[index] = { ...injury, size: v };
                handleChange(['injuries'], newInjuries);
              }}
            />

            <TextField
              field={{
                id: `${id}_injury${index}_description`,
                type: 'text',
                label: 'Description',
                required: true,
                placeholder: 'Describe the injury',
              }}
              value={injury.description}
              onChange={v => {
                const newInjuries = [...(values.injuries || [])];
                newInjuries[index] = { ...injury, description: v };
                handleChange(['injuries'], newInjuries);
              }}
            />
          </div>
        ))}
      </div>
      
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