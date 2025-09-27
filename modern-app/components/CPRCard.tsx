import { useState, useCallback } from 'react';
import type { CPRCard } from '../lib/schemas/treatment-cards';
import { TextField, RadioField, CheckboxField } from './card-fields';

interface CPRCardProps {
  id: string;
  time: string;
  details: CPRCard['details'];
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: CPRCard['details']) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const initiatorOptions = [
  { value: 'EMS', label: 'EMS' },
  { value: 'Bystander', label: 'Bystander' },
  { value: 'First Responder', label: 'First Responder' }
];

const methodOptions = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Both', label: 'Both' }
];

const depthOptions = [
  { value: 'Adequate', label: 'Adequate' },
  { value: 'Too Shallow', label: 'Too Shallow' },
  { value: 'Too Deep', label: 'Too Deep' }
];

const rhythmOptions = [
  { value: 'VF', label: 'VF' },
  { value: 'VT', label: 'VT' },
  { value: 'PEA', label: 'PEA' },
  { value: 'Asystole', label: 'Asystole' },
  { value: 'Unknown', label: 'Unknown' }
];

export function CPRCardComponent({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: CPRCardProps) {
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
          id: `${id}_initiator`,
          type: 'radio',
          label: 'CPR Initiated By',
          required: true,
          options: initiatorOptions,
        }}
        value={values.initiator}
        onChange={v => handleChange(['initiator'], v)}
      />

      <RadioField
        field={{
          id: `${id}_method`,
          type: 'radio',
          label: 'CPR Method',
          required: true,
          options: methodOptions,
        }}
        value={values.method}
        onChange={v => handleChange(['method'], v)}
      />

      {(values.method === 'Mechanical' || values.method === 'Both') && (
        <TextField
          field={{
            id: `${id}_mechanicalDevice`,
            type: 'text',
            label: 'Mechanical Device Used',
            placeholder: 'Enter device name',
            required: true,
          }}
          value={values.mechanicalDevice || ''}
          onChange={v => handleChange(['mechanicalDevice'], v)}
        />
      )}

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">Compression Quality</h3>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Rate</label>
          <input
            type="number"
            min="80"
            max="120"
            value={values.compressionQuality.rate}
            onChange={e => handleChange(['compressionQuality', 'rate'], Number(e.target.value))}
            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <span className="text-sm text-gray-500">per minute</span>
        </div>

        <RadioField
          field={{
            id: `${id}_depth`,
            type: 'radio',
            label: 'Compression Depth',
            required: true,
            options: depthOptions,
          }}
          value={values.compressionQuality.depth}
          onChange={v => handleChange(['compressionQuality', 'depth'], v)}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={values.compressionQuality.recoil}
            onChange={e => handleChange(['compressionQuality', 'recoil'], e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Complete chest recoil between compressions
          </label>
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Interruptions</label>
          <input
            type="number"
            min="0"
            value={values.compressionQuality.interruptions}
            onChange={e => handleChange(['compressionQuality', 'interruptions'], Number(e.target.value))}
            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">AED/Monitor</h3>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={values.aed.applied}
            onChange={e => handleChange(['aed', 'applied'], e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            AED/Monitor applied
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={values.aed.shockDelivered}
            onChange={e => handleChange(['aed', 'shockDelivered'], e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Shock delivered
          </label>
        </div>

        {values.aed.shockDelivered && (
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Number of Shocks</label>
            <input
              type="number"
              min="1"
              value={values.aed.numberOfShocks || 1}
              onChange={e => handleChange(['aed', 'numberOfShocks'], Number(e.target.value))}
              className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        )}

        <RadioField
          field={{
            id: `${id}_rhythm`,
            type: 'radio',
            label: 'Initial Rhythm',
            required: true,
            options: rhythmOptions,
          }}
          value={values.aed.rhythm}
          onChange={v => handleChange(['aed', 'rhythm'], v)}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">ROSC</h3>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={values.rosc.achieved}
            onChange={e => handleChange(['rosc', 'achieved'], e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Return of Spontaneous Circulation (ROSC) achieved
          </label>
        </div>

        {values.rosc.achieved && (
          <>
            <TextField
              field={{
                id: `${id}_roscTime`,
                type: 'text',
                label: 'Time of ROSC',
                placeholder: 'HHMM',
                required: true,
              }}
              value={values.rosc.time || ''}
              onChange={v => handleChange(['rosc', 'time'], v)}
            />

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sustained For (minutes)</label>
              <input
                type="number"
                min="0"
                value={values.rosc.sustainedMinutes || 0}
                onChange={e => handleChange(['rosc', 'sustainedMinutes'], Number(e.target.value))}
                className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
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