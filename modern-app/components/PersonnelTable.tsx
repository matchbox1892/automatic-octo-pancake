'use client';

import { useState } from 'react';
import { z } from 'zod';

export const PersonnelSchema = z.object({
  name: z.string(),
  role: z.string(),
});

export type Personnel = z.infer<typeof PersonnelSchema>;

interface PersonnelTableProps {
  value: Personnel[];
  onChange: (personnel: Personnel[]) => void;
  label?: string;
}

export function PersonnelTable({ value = [], onChange, label }: PersonnelTableProps) {
  const handleAddRow = () => {
    onChange([...value, { name: '', role: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Personnel, newValue: string) => {
    const newPersonnel = [...value];
    newPersonnel[index] = {
      ...newPersonnel[index],
      [field]: newValue
    };
    onChange(newPersonnel);
  };

  return (
    <div className="space-y-4">
      {label && <h3 className="text-lg font-medium">{label}</h3>}

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-2 border-b">Name</th>
            <th className="text-left p-2 border-b">Role</th>
            <th className="p-2 border-b w-16"></th>
          </tr>
        </thead>
        <tbody>
          {value.map((person, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="Enter name"
                  className="w-full p-2 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={person.role}
                  onChange={(e) => handleChange(index, 'role', e.target.value)}
                  placeholder="Enter role"
                  className="w-full p-2 border rounded"
                />
              </td>
              <td className="p-2">
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Remove personnel"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="p-2">
              <button
                type="button"
                onClick={handleAddRow}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                Add Personnel
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}