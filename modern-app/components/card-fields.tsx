import type { ReactNode } from 'react';
import { z } from 'zod';

// Base schema for all plan card fields
export const PlanCardFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  required: z.boolean().default(false),
  helpText: z.string().optional()
});

// Different field type schemas
export const TextFieldSchema = PlanCardFieldSchema.extend({
  type: z.literal('text'),
  placeholder: z.string().optional()
});

export const SelectFieldSchema = PlanCardFieldSchema.extend({
  type: z.literal('select'),
  options: z.array(z.object({
    value: z.string(),
    label: z.string()
  }))
});

export const RadioFieldSchema = PlanCardFieldSchema.extend({
  type: z.literal('radio'),
  options: z.array(z.object({
    value: z.string(),
    label: z.string()
  }))
});

export const CheckboxFieldSchema = PlanCardFieldSchema.extend({
  type: z.literal('checkbox'),
  options: z.array(z.object({
    value: z.string(),
    label: z.string()
  }))
});

// Union of all field types
export const CardFieldSchema = z.discriminatedUnion('type', [
  TextFieldSchema,
  SelectFieldSchema,
  RadioFieldSchema,
  CheckboxFieldSchema
]);

// Schema for the template configuration
export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  fields: z.array(CardFieldSchema),
  helpText: z.string().optional(),
  component: z.any() // Type of React component
});

export type CardField = z.infer<typeof CardFieldSchema>;
export type TemplateConfig = z.infer<typeof TemplateSchema>;

// Props shared by all card components
export interface CardComponentProps {
  id: string;
  time?: string;
  onTimeChange: (time: string) => void;
  onRemove: () => void;
  onDetailsChange?: (details: string) => void;
  onVerifiedChange?: (verified: boolean) => void;
  verified?: boolean;
  children?: ReactNode;
}

// Helper components for card fields
export function TextField({ 
  field, 
  value, 
  onChange 
}: { 
  field: z.infer<typeof TextFieldSchema>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">{field.label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        className="px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500"
      />
      {field.helpText && (
        <p className="text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}

export function SelectField({
  field,
  value,
  onChange
}: {
  field: z.infer<typeof SelectFieldSchema>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">{field.label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={field.required}
        className="px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select...</option>
        {field.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {field.helpText && (
        <p className="text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}

export function RadioField({
  field,
  value,
  onChange
}: {
  field: z.infer<typeof RadioFieldSchema>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">{field.label}</label>
      <div className="space-y-2">
        {field.options.map(option => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              name={field.id}
              value={option.value}
              checked={value === option.value}
              onChange={e => onChange(e.target.value)}
              required={field.required}
              className="text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-900">{option.label}</span>
          </label>
        ))}
      </div>
      {field.helpText && (
        <p className="text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}

export function CheckboxField({
  field,
  values,
  onChange
}: {
  field: z.infer<typeof CheckboxFieldSchema>;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...values, value]);
    } else {
      onChange(values.filter(v => v !== value));
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">{field.label}</label>
      <div className="space-y-2">
        {field.options.map(option => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={option.value}
              checked={values.includes(option.value)}
              onChange={e => handleChange(option.value, e.target.checked)}
              className="text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-900">{option.label}</span>
          </label>
        ))}
      </div>
      {field.helpText && (
        <p className="text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}