import { useState, useCallback } from 'react';
import type { SpinalImmobilizationDetails, ImmobilizationDevice, ImmobilizationPosition } from '../lib/schemas/immobilization-types';
import { TextField, SelectField, CheckboxField } from './card-fields';
import { immobilizationDevices, immobilizationPositions } from '../lib/schemas/immobilization-types';

interface SpinalImmobilizationCardProps {
  id: string;
  time: string;
  details: SpinalImmobilizationDetails;
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: SpinalImmobilizationDetails) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

export function SpinalImmobilizationCard({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: SpinalImmobilizationCardProps) {
  const [values, setValues] = useState(details);

  const handleChange = useCallback((field: keyof SpinalImmobilizationDetails, value: any) => {
    setValues(prev => {
      const next = { ...prev, [field]: value };
      onDetailsChange?.(next);
      return next;
    });
  }, [onDetailsChange]);

  const deviceOptions = immobilizationDevices.map(device => ({ value: device, label: device }));
  const positionOptions = immobilizationPositions.map(position => ({ value: position, label: position }));

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
        onChange={(v: string) => onTimeChange?.(v)}
      />

      <div className="space-y-4">
        <CheckboxField
          field={{
            id: `${id}_devices`,
            type: 'checkbox',
            label: 'Immobilization Devices Used',
            required: true,
            options: deviceOptions,
          }}
          values={values.devices}
          onChange={v => handleChange('devices', v)}
        />

        {values.devices.includes('Other' as ImmobilizationDevice) && (
          <TextField
            field={{
              id: `${id}_customDevice`,
              type: 'text',
              label: 'Custom Device',
              required: true,
              placeholder: 'Enter device type'
            }}
            value={values.customDevice || ''}
            onChange={v => handleChange('customDevice', v)}
          />
        )}

        <SelectField
          field={{
            id: `${id}_position`,
            type: 'select',
            label: 'Patient Position',
            required: true,
            options: positionOptions,
          }}
          value={values.position}
          onChange={v => handleChange('position', v as ImmobilizationPosition)}
        />

        {values.position === 'Other' && (
          <TextField
            field={{
              id: `${id}_customPosition`,
              type: 'text',
              label: 'Custom Position',
              required: true,
              placeholder: 'Enter position'
            }}
            value={values.customPosition || ''}
            onChange={v => handleChange('customPosition', v)}
          />
        )}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Neurovascular Assessment</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Before Application</h4>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.pulsesBefore}
                onChange={e => handleChange('pulsesBefore', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Pulses Present</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.sensationBefore}
                onChange={e => handleChange('sensationBefore', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Sensation Present</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.movementBefore}
                onChange={e => handleChange('movementBefore', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Movement Present</label>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">After Application</h4>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.pulsesAfter}
                onChange={e => handleChange('pulsesAfter', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Pulses Present</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.sensationAfter}
                onChange={e => handleChange('sensationAfter', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Sensation Present</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.movementAfter}
                onChange={e => handleChange('movementAfter', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Movement Present</label>
            </div>
          </div>
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

      <TextField
        field={{
          id: `${id}_notes`,
          type: 'text',
          label: 'Additional Notes',
          required: false,
          placeholder: 'Enter any additional notes'
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
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-900">Verify</span>
        </label>
      </div>
    </div>
  );
}