'use client';

import { useEffect, useMemo, useRef } from "react";
import type {
  FieldValues,
  Path,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import { sections as loadedSections } from "@/lib/content-loader";
import type { Field, Section } from "@/lib/types";

type AddressPair = {
  incident: string;
  patient: string;
};

type BirthdateFields = {
  year?: string;
  month?: string;
  day?: string;
};

type FieldSyncConfig = {
  addressPairs: AddressPair[];
  forceCopyFlag?: string;
  birthdateFields: BirthdateFields;
  ageFields: string[];
  genderFields: string[];
};

type UseFieldSyncParams<TFieldValues extends FieldValues> = {
  sectionId: string;
  watch: UseFormWatch<TFieldValues>;
  getValues: UseFormGetValues<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  enabled?: boolean;
};

type UseFieldSyncOptions = {
  sections?: Section[];
  config?: Partial<FieldSyncConfig>;
  currentDate?: Date;
};

type FlattenedField = {
  path: string;
  field: Field;
};

const DEFAULT_ADDRESS_TOKENS = ["address", "room", "city", "state", "zip"] as const;
const WATCH_REGISTRY = new WeakSet<UseFormWatch<FieldValues>>();

function flattenSection(section?: Section): FlattenedField[] {
  if (!section) return [];

  const visitField = (field: Field, parentPath: string): FlattenedField[] => {
    if (field.type === "array") {
      return field.itemFields.flatMap((nestedField) =>
        visitField(nestedField, `${parentPath}.${nestedField.id}`)
      );
    }

    return [
      {
        path: parentPath,
        field
      }
    ];
  };

  return section.fields.flatMap((field) => visitField(field, `${section.id}.${field.id}`));
}

function fieldMatches(fieldId: string, keywords: string[]): boolean {
  const lower = fieldId.toLowerCase();
  return keywords.every((keyword) => lower.includes(keyword));
}

function findFieldPath(fields: FlattenedField[], ...keywords: string[]): string | undefined {
  return fields.find(({ field }) => fieldMatches(field.id, keywords))?.path;
}

function uniquePaths(paths: Array<string | undefined>): string[] {
  return Array.from(new Set(paths.filter((value): value is string => Boolean(value))));
}

export function deriveFieldSyncConfig(sections: Section[]): FieldSyncConfig {
  const incident = sections.find((section) => section.id === "incident");
  const patient = sections.find((section) => section.id === "patient");

  const incidentFields = flattenSection(incident);
  const patientFields = flattenSection(patient);

  const addressPairs = DEFAULT_ADDRESS_TOKENS.map((token) => {
    const incidentPath = findFieldPath(incidentFields, token);
    const patientPath = findFieldPath(patientFields, token);
    if (incidentPath && patientPath) {
      return { incident: incidentPath, patient: patientPath };
    }
    return undefined;
  }).filter((value): value is AddressPair => Boolean(value));

  const forceCopyFlag =
    findFieldPath(incidentFields, "copy", "address") ??
    findFieldPath(patientFields, "copy", "address") ??
    undefined;

  const birthdateFields: BirthdateFields = {
    year:
      findFieldPath(patientFields, "birth", "year") ??
      findFieldPath(patientFields, "dob", "year") ??
      findFieldPath(patientFields, "birth", "yr"),
    month:
      findFieldPath(patientFields, "birth", "month") ??
      findFieldPath(patientFields, "dob", "month") ??
      findFieldPath(patientFields, "birth", "mo"),
    day:
      findFieldPath(patientFields, "birth", "day") ??
      findFieldPath(patientFields, "dob", "day") ??
      findFieldPath(patientFields, "birth", "dy")
  };

  const ageFields = uniquePaths([
    ...incidentFields
      .filter(({ field }) => fieldMatches(field.id, ["age"]))
      .map(({ path }) => path),
    ...patientFields
      .filter(({ field }) => fieldMatches(field.id, ["age"]))
      .map(({ path }) => path)
  ]);

  const genderFields = uniquePaths([
    ...incidentFields
      .filter(({ field }) => fieldMatches(field.id, ["gender"]))
      .map(({ path }) => path),
    ...patientFields
      .filter(({ field }) => fieldMatches(field.id, ["gender"]))
      .map(({ path }) => path)
  ]);

  return {
    addressPairs,
    forceCopyFlag,
    birthdateFields,
    ageFields,
    genderFields
  };
}

function mergeConfigs(base: FieldSyncConfig, overrides?: Partial<FieldSyncConfig>): FieldSyncConfig {
  if (!overrides) return base;
  return {
    addressPairs: overrides.addressPairs ?? base.addressPairs,
    forceCopyFlag: overrides.forceCopyFlag ?? base.forceCopyFlag,
    birthdateFields: {
      ...base.birthdateFields,
      ...overrides.birthdateFields
    },
    ageFields: overrides.ageFields ?? base.ageFields,
    genderFields: overrides.genderFields ?? base.genderFields
  };
}

function isValidDate(year: number, month: number, day: number): boolean {
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return false;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const probe = new Date(year, month - 1, day);
  return (
    probe.getFullYear() === year &&
    probe.getMonth() === month - 1 &&
    probe.getDate() === day
  );
}

function calculateAge(birthDate: Date, currentDate: Date): number {
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  const dayDiff = currentDate.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return Math.max(age, 0);
}

export function useFieldSync<TFieldValues extends FieldValues>(
  { sectionId, watch, getValues, setValue, enabled = true }: UseFieldSyncParams<TFieldValues>,
  { sections, config: overrides, currentDate }: UseFieldSyncOptions = {}
): void {
  const derivedConfig = useMemo(
    () => mergeConfigs(deriveFieldSyncConfig(sections ?? loadedSections), overrides),
    [sections, overrides]
  );

  const configRef = useRef<FieldSyncConfig>(derivedConfig);
  const getValuesRef = useRef(getValues);
  const setValueRef = useRef(setValue);
  const currentDateRef = useRef<Date | null>(currentDate ?? null);

  useEffect(() => {
    configRef.current = derivedConfig;
  }, [derivedConfig]);

  useEffect(() => {
    getValuesRef.current = getValues;
  }, [getValues]);

  useEffect(() => {
    setValueRef.current = setValue;
  }, [setValue]);

  useEffect(() => {
    currentDateRef.current = currentDate ?? null;
  }, [currentDate]);

  const shouldActivate = useMemo(() => {
    if (!enabled) return false;
    if (sectionId !== "incident" && sectionId !== "patient") {
      return false;
    }

    const cfg = derivedConfig;
    return (
      cfg.addressPairs.length > 0 ||
      cfg.genderFields.length > 0 ||
      cfg.ageFields.length > 0
    );
  }, [derivedConfig, enabled, sectionId]);

  useEffect(() => {
    if (!shouldActivate) {
      return;
    }

    const alreadyRegistered = WATCH_REGISTRY.has(watch as unknown as UseFormWatch<FieldValues>);
    if (alreadyRegistered) {
      return;
    }

    WATCH_REGISTRY.add(watch as unknown as UseFormWatch<FieldValues>);

    const subscription = watch((_, info) => {
      const config = configRef.current;
      const getter = getValuesRef.current;
      const setter = setValueRef.current;
      const now = currentDateRef.current ?? new Date();

      const fieldName = info?.name;
      if (!fieldName) {
        return;
      }

      if (config.forceCopyFlag && fieldName === config.forceCopyFlag) {
        const shouldCopy = Boolean(getter(config.forceCopyFlag as Path<TFieldValues>));
        if (shouldCopy) {
          config.addressPairs.forEach(({ incident, patient }) => {
            const incidentValue = getter(incident as Path<TFieldValues>);
            if (incidentValue !== undefined) {
              setter(patient as Path<TFieldValues>, incidentValue ?? "", {
                shouldDirty: true,
                shouldTouch: false
              });
            }
          });
        }
        return;
      }

      const addressPair = config.addressPairs.find(({ incident }) => incident === fieldName);
      if (addressPair) {
        const incidentValue = getter(addressPair.incident as Path<TFieldValues>);
        const patientValue = getter(addressPair.patient as Path<TFieldValues>);
        const force = config.forceCopyFlag
          ? Boolean(getter(config.forceCopyFlag as Path<TFieldValues>))
          : false;

        const shouldCopy = force || patientValue === undefined || patientValue === "";
        if (shouldCopy && incidentValue !== patientValue) {
          setter(addressPair.patient as Path<TFieldValues>, incidentValue ?? "", {
            shouldDirty: true,
            shouldTouch: false
          });
        }
        return;
      }

      const birth = config.birthdateFields;
      if (birth.year || birth.month || birth.day) {
        const watchedBirthFields = [birth.year, birth.month, birth.day].filter(Boolean) as string[];
        if (watchedBirthFields.includes(fieldName)) {
          const yearValue = birth.year
            ? Number.parseInt(`${getter(birth.year as Path<TFieldValues>) ?? ""}`, 10)
            : NaN;
          const monthValue = birth.month
            ? Number.parseInt(`${getter(birth.month as Path<TFieldValues>) ?? ""}`, 10)
            : NaN;
          const dayValue = birth.day
            ? Number.parseInt(`${getter(birth.day as Path<TFieldValues>) ?? ""}`, 10)
            : NaN;

          if (isValidDate(yearValue, monthValue, dayValue)) {
            const age = calculateAge(new Date(yearValue, monthValue - 1, dayValue), now);
            config.ageFields.forEach((ageField) => {
              const currentAge = getter(ageField as Path<TFieldValues>);
              const nextAge = `${age}`;
              if (currentAge !== nextAge) {
                setter(ageField as Path<TFieldValues>, nextAge, {
                  shouldDirty: true,
                  shouldTouch: false
                });
              }
            });
          } else {
            config.ageFields.forEach((ageField) => {
              const currentAge = getter(ageField as Path<TFieldValues>);
              if (currentAge) {
                setter(ageField as Path<TFieldValues>, "", {
                  shouldDirty: true,
                  shouldTouch: false
                });
              }
            });
          }
        }
      }

      if (config.genderFields.includes(fieldName)) {
        const activeValue = getter(fieldName as Path<TFieldValues>);
        config.genderFields.forEach((genderField) => {
          if (genderField === fieldName) return;
          const otherValue = getter(genderField as Path<TFieldValues>);
          if (otherValue !== activeValue) {
            setter(genderField as Path<TFieldValues>, activeValue ?? "", {
              shouldDirty: true,
              shouldTouch: false
            });
          }
        });
      }
    });

    return () => {
      subscription.unsubscribe();
      WATCH_REGISTRY.delete(watch as unknown as UseFormWatch<FieldValues>);
    };
  }, [shouldActivate, watch]);
}
