import { useState } from 'react';
import type { EKGTransmission, TransmissionMethod, ReceivingFacilityType } from '../lib/schemas/ekg-transmission';
import { transmissionMethods, receivingFacilityTypes } from '../lib/schemas/ekg-transmission';
import { TextField, SelectField } from './card-fields';

interface EKGTransmissionFormProps {
  id: string;
  transmission: EKGTransmission;
  onTransmissionChange: (transmission: EKGTransmission) => void;
}

export function EKGTransmissionForm({
  id,
  transmission,
  onTransmissionChange,
}: EKGTransmissionFormProps) {
  const [values, setValues] = useState(transmission);

  const handleChange = (field: keyof EKGTransmission, value: any) => {
    const next = { ...values, [field]: value };
    setValues(next);
    onTransmissionChange(next);
  };

  const methodOptions = transmissionMethods.map(method => ({ value: method, label: method }));
  const facilityTypeOptions = receivingFacilityTypes.map(type => ({ value: type, label: type }));

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-medium text-blue-900">EKG Transmission</h3>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          field={{
            id: `${id}_method`,
            type: 'select',
            label: 'Transmission Method',
            required: true,
            options: methodOptions,
          }}
          value={values.method}
          onChange={v => handleChange('method', v as TransmissionMethod)}
        />

        {values.method === 'Other' && (
          <TextField
            field={{
              id: `${id}_customMethod`,
              type: 'text',
              label: 'Specify Method',
              required: true,
              placeholder: 'Enter transmission method'
            }}
            value={values.customMethod || ''}
            onChange={v => handleChange('customMethod', v)}
          />
        )}

        <SelectField
          field={{
            id: `${id}_facilityType`,
            type: 'select',
            label: 'Receiving Facility Type',
            required: true,
            options: facilityTypeOptions,
          }}
          value={values.facilityType}
          onChange={v => handleChange('facilityType', v as ReceivingFacilityType)}
        />

        {values.facilityType === 'Other' && (
          <TextField
            field={{
              id: `${id}_customFacilityType`,
              type: 'text',
              label: 'Specify Facility Type',
              required: true,
              placeholder: 'Enter facility type'
            }}
            value={values.customFacilityType || ''}
            onChange={v => handleChange('customFacilityType', v)}
          />
        )}

        <TextField
          field={{
            id: `${id}_receivingFacility`,
            type: 'text',
            label: 'Receiving Facility',
            required: true,
            placeholder: 'Enter facility name'
          }}
          value={values.receivingFacility}
          onChange={v => handleChange('receivingFacility', v)}
        />

        <TextField
          field={{
            id: `${id}_receivingProvider`,
            type: 'text',
            label: 'Receiving Provider',
            required: false,
            placeholder: 'Enter provider name'
          }}
          value={values.receivingProvider || ''}
          onChange={v => handleChange('receivingProvider', v)}
        />

        <TextField
          field={{
            id: `${id}_transmissionTime`,
            type: 'text',
            label: 'Transmission Time',
            required: true,
            placeholder: 'HHMM'
          }}
          value={values.transmissionTime}
          onChange={v => handleChange('transmissionTime', v)}
        />

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Attempts</label>
          <input
            type="number"
            min="1"
            value={values.transmissionAttempts}
            onChange={e => handleChange('transmissionAttempts', Number(e.target.value))}
            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={values.confirmationReceived}
            onChange={e => handleChange('confirmationReceived', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">
            Confirmation Received
          </label>
        </div>

        {values.confirmationReceived && (
          <TextField
            field={{
              id: `${id}_confirmationMethod`,
              type: 'text',
              label: 'Confirmation Method',
              required: true,
              placeholder: 'How was confirmation received?'
            }}
            value={values.confirmationMethod || ''}
            onChange={v => handleChange('confirmationMethod', v)}
          />
        )}

        <div className="col-span-2">
          <TextField
            field={{
              id: `${id}_notes`,
              type: 'text',
              label: 'Transmission Notes',
              required: false,
              placeholder: 'Enter any additional notes'
            }}
            value={values.notes || ''}
            onChange={v => handleChange('notes', v)}
          />
        </div>
      </div>
    </div>
  );
}