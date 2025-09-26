"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { NarrativeFormData } from "@/lib/form-schema";
import type { ArrayField, Field, Section } from "@/lib/types";

function FieldHelp({ helperText }: { helperText?: string }) {
  if (!helperText) return null;
  return <p className="text-sm text-slate-500">{helperText}</p>;
}

function TextInput({
  id,
  placeholder,
  rows,
  type
}: {
  id: string;
  placeholder?: string;
  rows?: number;
  type: "text" | "textarea" | "number" | "time";
}) {
  const { register } = useFormContext<NarrativeFormData>();
  const baseClasses =
    "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

  if (type === "textarea") {
    return (
      <textarea
        id={id}
        {...register(id)}
        placeholder={placeholder}
        rows={rows ?? 3}
        className={`${baseClasses} resize-y`}
      />
    );
  }

  return (
    <input
      id={id}
      type={type === "number" ? "number" : type === "time" ? "time" : "text"}
      {...register(id)}
      placeholder={placeholder}
      className={baseClasses}
    />
  );
}

function SelectInput({
  id,
  label,
  placeholder,
  options
}: {
  id: string;
  label: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}) {
  const { register } = useFormContext<NarrativeFormData>();
  return (
    <select
      id={id}
      {...register(id)}
      defaultValue=""
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
    >
      <option value="" disabled>
        {placeholder ?? "Select option"}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function CheckboxGroup({
  id,
  options
}: {
  id: string;
  options: Array<{ value: string; label: string }>;
}) {
  const { control } = useFormContext<NarrativeFormData>();
  return (
    <Controller
      name={id}
      control={control}
      render={({ field }) => {
        const value: string[] = field.value ?? [];
        const toggle = (next: string) => {
          const set = new Set(value);
          if (set.has(next)) {
            set.delete(next);
          } else {
            set.add(next);
          }
          field.onChange(Array.from(set));
        };
        return (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  checked={value.includes(option.value)}
                  onChange={() => toggle(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      }}
    />
  );
}

function ArrayFieldGroup({ field, path }: { field: ArrayField; path: string }) {
  const { control } = useFormContext<NarrativeFormData>();
  const { fields: items, append, remove } = useFieldArray({
    control,
    name: path as never
  });

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const itemPath = `${path}.${index}`;
        return (
          <div key={item.id ?? index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700">
                {field.itemLabel} {index + 1}
              </h4>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-sm font-medium text-brand-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {field.itemFields.map((innerField) => (
                <div key={innerField.id} className="flex flex-col">
                  <label htmlFor={`${itemPath}.${innerField.id}`} className="text-sm font-medium text-slate-700">
                    {innerField.label}
                  </label>
                  <div className="mt-1">
                    {renderField(innerField, `${itemPath}.${innerField.id}`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => append({})}
        className="rounded-md border border-dashed border-brand-400 bg-white px-3 py-2 text-sm font-medium text-brand-600 shadow-sm hover:bg-brand-50"
      >
        {field.addButtonLabel ?? "Add"}
      </button>
    </div>
  );
}

function renderField(field: Field, path: string) {
  switch (field.type) {
    case "text":
    case "textarea":
    case "number":
    case "time":
      return (
        <TextInput
          id={path}
          placeholder={field.placeholder}
          rows={"rows" in field ? field.rows : undefined}
          type={field.type}
        />
      );
    case "select":
      return <SelectInput id={path} label={field.label} placeholder={field.placeholder} options={field.options} />;
    case "checkbox-group":
      return <CheckboxGroup id={path} options={field.options} />;
    case "array":
      return <ArrayFieldGroup field={field} path={path} />;
    default:
      return null;
  }
}

export function SectionFields({ section, basePath }: { section: Section; basePath: string }) {
  return (
    <div className="space-y-6">
      {section.fields.map((field) => (
        <div key={field.id} className="flex flex-col">
          <label
            htmlFor={`${basePath}.${field.id}`}
            className="text-sm font-semibold text-slate-800"
          >
            {field.label}
          </label>
          <div className="mt-1">{renderField(field, `${basePath}.${field.id}`)}</div>
          <FieldHelp helperText={field.helperText} />
        </div>
      ))}
    </div>
  );
}
