import { useState } from 'react';
import type { EKGPrintSettings } from '../lib/schemas/ekg-transmission';
import { TextField, SelectField } from './card-fields';

interface EKGPrintSettingsFormProps {
  id: string;
  settings: EKGPrintSettings;
  onSettingsChange: (settings: EKGPrintSettings) => void;
}

export function EKGPrintSettingsForm({
  id,
  settings,
  onSettingsChange,
}: EKGPrintSettingsFormProps) {
  const [values, setValues] = useState(settings);

  const handleChange = (field: keyof EKGPrintSettings | keyof EKGPrintSettings['filterSettings'], value: any) => {
    if (field in values.filterSettings) {
      const next = {
        ...values,
        filterSettings: {
          ...values.filterSettings,
          [field]: value
        }
      };
      setValues(next);
      onSettingsChange(next);
    } else {
      const next = { ...values, [field]: value };
      setValues(next);
      onSettingsChange(next);
    }
  };

  const paperSpeedOptions = [
    { value: '25mm/s', label: '25 mm/s' },
    { value: '50mm/s', label: '50 mm/s' }
  ];

  const amplitudeOptions = [
    { value: '5mm/mV', label: '5 mm/mV' },
    { value: '10mm/mV', label: '10 mm/mV' },
    { value: '20mm/mV', label: '20 mm/mV' }
  ];

  const configurationOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Cabrera', label: 'Cabrera' }
  ];

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900">Print Settings</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Include in Printout</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.includeMeasurements}
                onChange={e => handleChange('includeMeasurements', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Measurements</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.includeGrid}
                onChange={e => handleChange('includeGrid', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Grid</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.includeAnnotations}
                onChange={e => handleChange('includeAnnotations', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Annotations</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.includeInterpretation}
                onChange={e => handleChange('includeInterpretation', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Interpretation</label>
            </div>
          </div>
        </div>

        <SelectField
          field={{
            id: `${id}_paperSpeed`,
            type: 'select',
            label: 'Paper Speed',
            required: true,
            options: paperSpeedOptions,
          }}
          value={values.paperSpeed}
          onChange={v => handleChange('paperSpeed', v)}
        />

        <SelectField
          field={{
            id: `${id}_amplitudeScale`,
            type: 'select',
            label: 'Amplitude Scale',
            required: true,
            options: amplitudeOptions,
          }}
          value={values.amplitudeScale}
          onChange={v => handleChange('amplitudeScale', v)}
        />

        <SelectField
          field={{
            id: `${id}_leadConfiguration`,
            type: 'select',
            label: 'Lead Configuration',
            required: true,
            options: configurationOptions,
          }}
          value={values.leadConfiguration}
          onChange={v => handleChange('leadConfiguration', v)}
        />

        <div className="col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Filters</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.filterSettings.baseline}
                onChange={e => handleChange('baseline', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Baseline Wander</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.filterSettings.muscleFilter}
                onChange={e => handleChange('muscleFilter', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Muscle Artifact</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={values.filterSettings.notchFilter}
                onChange={e => handleChange('notchFilter', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Notch (60Hz)</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}