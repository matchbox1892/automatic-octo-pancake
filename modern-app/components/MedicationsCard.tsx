import { useState, useCallback } from 'react';
import type { MedicationDetails, MedicationEntry, MedicationRoute } from '../lib/schemas/medication-types';
import { TextField, SelectField } from './card-fields';

interface MedicationCardProps {
  id: string;
  time: string;
  details: MedicationDetails;
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
  };
  onTimeChange?: (time: string) => void;
  onDetailsChange?: (details: MedicationDetails) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const routeOptions = [
  { value: 'IV', label: 'Intravenous' },
  { value: 'IM', label: 'Intramuscular' },
  { value: 'IO', label: 'Intraosseous' },
  { value: 'PO', label: 'Oral' },
  { value: 'SL', label: 'Sublingual' },
  { value: 'IN', label: 'Intranasal' },
  { value: 'NEB', label: 'Nebulized' },
  { value: 'SC', label: 'Subcutaneous' },
  { value: 'TD', label: 'Transdermal' }
];

const commonMedications = [
  { value: 'Adenosine', label: 'Adenosine' },
  { value: 'Albuterol', label: 'Albuterol' },
  { value: 'Amiodarone', label: 'Amiodarone' },
  { value: 'Aspirin', label: 'Aspirin' },
  { value: 'Atropine', label: 'Atropine' },
  { value: 'Calcium Chloride', label: 'Calcium Chloride' },
  { value: 'Dextrose', label: 'Dextrose' },
  { value: 'Diphenhydramine', label: 'Diphenhydramine' },
  { value: 'Epinephrine', label: 'Epinephrine' },
  { value: 'Fentanyl', label: 'Fentanyl' },
  { value: 'Glucagon', label: 'Glucagon' },
  { value: 'Ketamine', label: 'Ketamine' },
  { value: 'Lidocaine', label: 'Lidocaine' },
  { value: 'Magnesium Sulfate', label: 'Magnesium Sulfate' },
  { value: 'Midazolam', label: 'Midazolam' },
  { value: 'Morphine', label: 'Morphine' },
  { value: 'Naloxone', label: 'Naloxone' },
  { value: 'Nitroglycerin', label: 'Nitroglycerin' },
  { value: 'Ondansetron', label: 'Ondansetron' },
  { value: 'Sodium Bicarbonate', label: 'Sodium Bicarbonate' }
];

export function MedicationsCard({
  id,
  time,
  details,
  verification,
  onTimeChange,
  onDetailsChange,
  onVerifiedChange
}: MedicationCardProps) {
  const [values, setValues] = useState(details);
  const [newMedication, setNewMedication] = useState<Partial<MedicationEntry>>({
    name: '',
    dose: '',
    route: 'IV' as MedicationRoute,
    time: '',
    response: '',
    indications: '',
    administeredBy: '',
    orderSource: 'Standing Order'
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
    if (newMedication.name && newMedication.dose && newMedication.route && newMedication.administeredBy) {
      setValues(prev => {
        const next = {
          ...prev,
          entries: [...(prev.entries || []), { ...newMedication as MedicationEntry }]
        };
        onDetailsChange?.(next);
        return next;
      });
      setNewMedication({
        name: '',
        dose: '',
        route: 'IV' as MedicationRoute,
        time: '',
        response: '',
        indications: '',
        administeredBy: '',
        orderSource: 'Standing Order'
      });
    }
  };

  const removeMedication = (index: number) => {
    setValues(prev => {
      const next = {
        ...prev,
        entries: prev.entries.filter((entry, i) => i !== index)
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
        onChange={(v: string) => onTimeChange?.(v)}
      />

      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Medications</h3>
          <button
            type="button"
            onClick={addMedication}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Medication
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            field={{
              id: `${id}_newMedName`,
              type: 'select',
              label: 'Medication',
              required: true,
              options: commonMedications,
              allowCustom: true
            }}
            value={newMedication.name || ''}
            onChange={v => setNewMedication(prev => ({ ...prev, name: v }))}
          />

          <TextField
            field={{
              id: `${id}_newMedDose`,
              type: 'text',
              label: 'Dose',
              required: true,
              placeholder: 'Enter dose with units'
            }}
            value={newMedication.dose || ''}
            onChange={v => setNewMedication(prev => ({ ...prev, dose: v }))}
          />

          <SelectField
            field={{
              id: `${id}_newMedRoute`,
              type: 'select',
              label: 'Route',
              required: true,
              options: routeOptions
            }}
            value={newMedication.route || 'IV'}
            onChange={v => setNewMedication(prev => ({ ...prev, route: v as MedicationRoute }))}
          />

          <TextField
            field={{
              id: `${id}_newMedTime`,
              type: 'text',
              label: 'Time',
              required: true,
              placeholder: 'HHMM'
            }}
            value={newMedication.time || ''}
            onChange={v => setNewMedication(prev => ({ ...prev, time: v }))}
          />

          <TextField
            field={{
              id: `${id}_newMedIndications`,
              type: 'text',
              label: 'Indications',
              required: false,
              placeholder: 'Reason for administration'
            }}
            value={newMedication.indications || ''}
            onChange={v => setNewMedication(prev => ({ ...prev, indications: v }))}
          />

          <TextField
            field={{
              id: `${id}_newMedResponse`,
              type: 'text',
              label: 'Response',
              required: false,
              placeholder: 'Patient response to medication'
            }}
            value={newMedication.response || ''}
            onChange={v => setNewMedication(prev => ({ ...prev, response: v }))}
          />

          <TextField
            field={{
              id: `${id}_newMedAdministeredBy`,
              type: 'text',
              label: 'Administered By',
              required: true,
              placeholder: 'Provider name'
            }}
            value={newMedication.administeredBy || ''}
            onChange={v => setNewMedication(prev => ({ ...prev, administeredBy: v }))}
          />

          <SelectField
            field={{
              id: `${id}_newMedOrderSource`,
              type: 'select',
              label: 'Order Source',
              required: true,
              options: [
                { value: 'Standing Order', label: 'Standing Order' },
                { value: 'Direct Order', label: 'Direct Order' }
              ]
            }}
            value={newMedication.orderSource || 'Standing Order'}
            onChange={v => setNewMedication(prev => ({ ...prev, orderSource: v as 'Standing Order' | 'Direct Order' }))}
          />

          {newMedication.orderSource === 'Direct Order' && (
            <TextField
              field={{
                id: `${id}_newMedOrderingProvider`,
                type: 'text',
                label: 'Ordering Provider',
                required: true,
                placeholder: 'Provider name'
              }}
              value={newMedication.orderingProvider || ''}
              onChange={v => setNewMedication(prev => ({ ...prev, orderingProvider: v }))}
            />
          )}
        </div>
      </div>

      {values.entries?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Administered Medications</h4>
          <div className="space-y-2">
            {values.entries.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {entry.name} - {entry.dose} {entry.route}
                  </p>
                  <p className="text-sm text-gray-500">
                    Time: {entry.time}
                    {entry.indications && ` | Indications: ${entry.indications}`}
                    {entry.response && ` | Response: ${entry.response}`}
                    {` | By: ${entry.administeredBy}`}
                    {` | Order: ${entry.orderSource}`}
                    {entry.orderingProvider && ` | Provider: ${entry.orderingProvider}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="ml-4 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-900">Verify</span>
        </label>
      </div>
    </div>
  );
}