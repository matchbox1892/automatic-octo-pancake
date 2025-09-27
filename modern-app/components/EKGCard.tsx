import { useState, useCallback } from 'react';
import type { EKGDetails, EKGType, CommonRhythm, STEMILocation } from '../lib/schemas/ekg-types';
import { TextField, SelectField, CheckboxField } from './card-fields';
import { ekgTypes, commonRhythms, stemiLocations } from '../lib/schemas/ekg-types';

interface EKGCardProps {
  id: string;
  time: string;
  details: EKGDetails;
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: EKGDetails) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

export function EKGCard({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange,
}: EKGCardProps) {
  const [values, setValues] = useState(details);

  const handleChange = useCallback((field: keyof EKGDetails, value: any) => {
    setValues(prev => {
      const next = { ...prev, [field]: value };
      onDetailsChange?.(next);
      return next;
    });
  }, [onDetailsChange]);

  const ekgTypeOptions = ekgTypes.map(type => ({ value: type, label: type }));
  const rhythmOptions = commonRhythms.map(rhythm => ({ value: rhythm, label: rhythm }));
  const stemiLocationOptions = stemiLocations.map(location => ({ value: location, label: location }));

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

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          field={{
            id: `${id}_type`,
            type: 'select',
            label: 'EKG Type',
            required: true,
            options: ekgTypeOptions,
          }}
          value={values.type}
          onChange={v => handleChange('type', v as EKGType)}
        />

        <SelectField
          field={{
            id: `${id}_rhythm`,
            type: 'select',
            label: 'Rhythm',
            required: true,
            options: rhythmOptions,
          }}
          value={values.rhythm}
          onChange={v => handleChange('rhythm', v as CommonRhythm)}
        />

        {values.rhythm === 'Other' && (
          <TextField
            field={{
              id: `${id}_customRhythm`,
              type: 'text',
              label: 'Custom Rhythm',
              required: true,
              placeholder: 'Enter rhythm'
            }}
            value={values.customRhythm || ''}
            onChange={v => handleChange('customRhythm', v)}
          />
        )}

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Heart Rate</label>
          <input
            type="number"
            min="0"
            max="300"
            value={values.rate}
            onChange={e => handleChange('rate', Number(e.target.value))}
            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={values.regular}
            onChange={e => handleChange('regular', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">Regular Rhythm</label>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={values.stemi}
            onChange={e => handleChange('stemi', e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-red-700">STEMI Identified</label>
        </div>

        {values.stemi && (
          <CheckboxField
            field={{
              id: `${id}_stemiLocation`,
              type: 'checkbox',
              label: 'STEMI Location',
              required: true,
              options: stemiLocationOptions,
            }}
            values={values.stemiLocation || []}
            onChange={v => handleChange('stemiLocation', v)}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          field={{
            id: `${id}_qrs`,
            type: 'number',
            label: 'QRS Duration',
            required: false,
            placeholder: 'ms',
            helpText: '40-200 ms'
          }}
          value={values.qrs?.toString() || ''}
          onChange={v => handleChange('qrs', v ? Number(v) : undefined)}
        />

        <TextField
          field={{
            id: `${id}_qtc`,
            type: 'number',
            label: 'QTc Interval',
            required: false,
            placeholder: 'ms',
            helpText: '200-600 ms'
          }}
          value={values.qtc?.toString() || ''}
          onChange={v => handleChange('qtc', v ? Number(v) : undefined)}
        />

        <TextField
          field={{
            id: `${id}_prInterval`,
            type: 'number',
            label: 'PR Interval',
            required: false,
            placeholder: 'ms',
            helpText: '80-400 ms'
          }}
          value={values.prInterval?.toString() || ''}
          onChange={v => handleChange('prInterval', v ? Number(v) : undefined)}
        />
      </div>

      <div className="space-y-4">
        <TextField
          field={{
            id: `${id}_findings`,
            type: 'text',
            label: 'Additional Findings',
            required: false,
            placeholder: 'Enter any additional findings'
          }}
          value={values.findings || ''}
          onChange={v => handleChange('findings', v)}
        />

        <TextField
          field={{
            id: `${id}_interpretation`,
            type: 'text',
            label: 'Interpretation',
            required: false,
            placeholder: 'Enter interpretation'
          }}
          value={values.interpretation || ''}
          onChange={v => handleChange('interpretation', v)}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={values.transmitted}
            onChange={e => handleChange('transmitted', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">EKG Transmitted</label>
        </div>

        {values.transmitted && (
          <TextField
            field={{
              id: `${id}_transmittedTo`,
              type: 'text',
              label: 'Transmitted To',
              required: true,
              placeholder: 'Enter receiving facility/provider'
            }}
            value={values.transmittedTo || ''}
            onChange={v => handleChange('transmittedTo', v)}
          />
        )}

        <TextField
          field={{
            id: `${id}_attachmentUrl`,
            type: 'text',
            label: 'EKG Image URL',
            required: false,
            placeholder: 'Enter URL to EKG image'
          }}
          value={values.attachmentUrl || ''}
          onChange={v => handleChange('attachmentUrl', v)}
        />
      </div>

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