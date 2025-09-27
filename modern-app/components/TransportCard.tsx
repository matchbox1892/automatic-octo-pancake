import { useState, useCallback } from 'react';
import type { TransportCard } from '../lib/schemas/treatment-cards';
import { TextField, RadioField, CheckboxField } from './card-fields';

interface TransportCardProps {
  id: string;
  time: string;
  details: TransportCard['details'];
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: TransportCard['details']) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const facilityTypeOptions = [
  { value: 'Hospital', label: 'Hospital' },
  { value: 'Trauma Center', label: 'Trauma Center' },
  { value: 'Specialty Center', label: 'Specialty Center' },
  { value: 'Other', label: 'Other' }
];

const modeOptions = [
  { value: 'Ground', label: 'Ground' },
  { value: 'Air', label: 'Air' },
  { value: 'Water', label: 'Water' }
];

const priorityOptions = [
  { value: 'Emergency', label: 'Emergency' },
  { value: 'Priority', label: 'Priority' },
  { value: 'Routine', label: 'Routine' }
];

const positionOptions = [
  { value: 'Supine', label: 'Supine' },
  { value: 'Semi-Fowlers', label: 'Semi-Fowlers' },
  { value: 'Fowlers', label: 'Fowlers' },
  { value: 'Left Side', label: 'Left Side' },
  { value: 'Right Side', label: 'Right Side' },
  { value: 'Other', label: 'Other' }
];

const monitoringOptions = [
  { value: 'Cardiac', label: 'Cardiac Monitor' },
  { value: 'SPO2', label: 'Pulse Oximetry' },
  { value: 'ETCO2', label: 'End-Tidal CO2' },
  { value: 'BP', label: 'Blood Pressure' },
  { value: 'Temperature', label: 'Temperature' }
];

export function TransportCardComponent({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: TransportCardProps) {
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

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">Destination</h3>
        
        <TextField
          field={{
            id: `${id}_facility`,
            type: 'text',
            label: 'Facility Name',
            required: true,
            placeholder: 'Enter destination facility name',
          }}
          value={values.destination.facility}
          onChange={v => handleChange(['destination', 'facility'], v)}
        />

        <RadioField
          field={{
            id: `${id}_facilityType`,
            type: 'radio',
            label: 'Facility Type',
            required: true,
            options: facilityTypeOptions,
          }}
          value={values.destination.type}
          onChange={v => handleChange(['destination', 'type'], v)}
        />

        {values.destination.type === 'Trauma Center' && (
          <TextField
            field={{
              id: `${id}_level`,
              type: 'text',
              label: 'Trauma Level',
              required: true,
              placeholder: 'Enter trauma center level',
            }}
            value={values.destination.level || ''}
            onChange={v => handleChange(['destination', 'level'], v)}
          />
        )}
      </div>

      <RadioField
        field={{
          id: `${id}_mode`,
          type: 'radio',
          label: 'Transport Mode',
          required: true,
          options: modeOptions,
        }}
        value={values.mode}
        onChange={v => handleChange(['mode'], v)}
      />

      <RadioField
        field={{
          id: `${id}_priority`,
          type: 'radio',
          label: 'Transport Priority',
          required: true,
          options: priorityOptions,
        }}
        value={values.priority}
        onChange={v => handleChange(['priority'], v)}
      />

      <RadioField
        field={{
          id: `${id}_position`,
          type: 'radio',
          label: 'Patient Position',
          required: true,
          options: positionOptions,
        }}
        value={values.position}
        onChange={v => handleChange(['position'], v)}
      />

      <CheckboxField
        field={{
          id: `${id}_monitoring`,
          type: 'checkbox',
          label: 'Monitoring',
          required: true,
          options: monitoringOptions,
        }}
        values={values.monitoring}
        onChange={v => handleChange(['monitoring'], v)}
      />

      <TextField
        field={{
          id: `${id}_interventions`,
          type: 'text',
          label: 'Interventions',
          required: false,
          placeholder: 'List any interventions performed during transport',
        }}
        value={values.interventions?.join(', ') || ''}
        onChange={v => handleChange(['interventions'], v.split(', ').filter(Boolean))}
      />

      <TextField
        field={{
          id: `${id}_complications`,
          type: 'text',
          label: 'Complications',
          required: false,
          placeholder: 'Document any complications during transport',
        }}
        value={values.complications || ''}
        onChange={v => handleChange(['complications'], v)}
      />

      <TextField
        field={{
          id: `${id}_eta`,
          type: 'text',
          label: 'ETA',
          required: false,
          placeholder: 'Estimated time of arrival',
        }}
        value={values.eta || ''}
        onChange={v => handleChange(['eta'], v)}
      />

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={values.diversion.required}
            onChange={e => handleChange(['diversion', 'required'], e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">
            Diversion Required
          </label>
        </div>

        {values.diversion.required && (
          <>
            <TextField
              field={{
                id: `${id}_diversionReason`,
                type: 'text',
                label: 'Reason for Diversion',
                required: true,
                placeholder: 'Explain why diversion was necessary',
              }}
              value={values.diversion.reason || ''}
              onChange={v => handleChange(['diversion', 'reason'], v)}
            />

            <TextField
              field={{
                id: `${id}_originalDestination`,
                type: 'text',
                label: 'Original Destination',
                required: true,
                placeholder: 'Enter original destination facility',
              }}
              value={values.diversion.originalDestination || ''}
              onChange={v => handleChange(['diversion', 'originalDestination'], v)}
            />
          </>
        )}
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