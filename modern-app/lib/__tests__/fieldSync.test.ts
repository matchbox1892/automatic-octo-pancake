import { renderHook, act } from "@testing-library/react";
import { useEffect } from "react";
import { useForm, type Path, type UseFormReturn } from "react-hook-form";
import type { Section } from "@/lib/types";
import { useFieldSync } from "@/lib/useFieldSync";

type FormValues = {
  incident: {
    locationAddress: string;
    locationRoom: string;
    locationCity: string;
    locationState: string;
    locationZip: string;
    copyAddressToPatient: boolean;
    gender: string;
  };
  patient: {
    address: string;
    room: string;
    city: string;
    state: string;
    zip: string;
    gender: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    age: string;
  };
};

const sections: Section[] = [
  {
    id: "incident",
    title: "Incident",
    fields: [
      { id: "locationAddress", label: "Incident Address", type: "text" },
      { id: "locationRoom", label: "Incident Room", type: "text" },
      { id: "locationCity", label: "Incident City", type: "text" },
      { id: "locationState", label: "Incident State", type: "text" },
      { id: "locationZip", label: "Incident Zip", type: "text" },
      { id: "copyAddressToPatient", label: "Copy address", type: "text" },
      {
        id: "gender",
        label: "Incident Gender",
        type: "select",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" }
        ]
      }
    ]
  },
  {
    id: "patient",
    title: "Patient",
    fields: [
      { id: "address", label: "Patient Address", type: "text" },
      { id: "room", label: "Patient Room", type: "text" },
      { id: "city", label: "Patient City", type: "text" },
      { id: "state", label: "Patient State", type: "text" },
      { id: "zip", label: "Patient Zip", type: "text" },
      { id: "gender", label: "Patient Gender", type: "select", options: [] },
      { id: "birthYear", label: "Birth Year", type: "text" },
      { id: "birthMonth", label: "Birth Month", type: "text" },
      { id: "birthDay", label: "Birth Day", type: "text" },
      { id: "age", label: "Patient Age", type: "text" }
    ]
  }
];

const fieldPaths: Array<Path<FormValues>> = [
  "incident.locationAddress",
  "incident.locationRoom",
  "incident.locationCity",
  "incident.locationState",
  "incident.locationZip",
  "incident.copyAddressToPatient",
  "incident.gender",
  "patient.address",
  "patient.room",
  "patient.city",
  "patient.state",
  "patient.zip",
  "patient.gender",
  "patient.birthYear",
  "patient.birthMonth",
  "patient.birthDay",
  "patient.age"
];

function createDefaultValues(): FormValues {
  return {
    incident: {
      locationAddress: "",
      locationRoom: "",
      locationCity: "",
      locationState: "",
      locationZip: "",
      copyAddressToPatient: false,
      gender: ""
    },
    patient: {
      address: "",
      room: "",
      city: "",
      state: "",
      zip: "",
      gender: "",
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      age: ""
    }
  };
}

function registerFields(form: UseFormReturn<FormValues>) {
  fieldPaths.forEach((field) => {
    form.register(field);
  });
}

describe("useFieldSync", () => {
  it("copies incident address fields to patient fields when empty and respects the copy toggle", () => {
    const { result } = renderHook(() => {
      const form = useForm<FormValues>({ defaultValues: createDefaultValues() });

      useEffect(() => {
        registerFields(form);
      }, [form]);

      useFieldSync(
        {
          sectionId: "incident",
          watch: form.watch,
          getValues: form.getValues,
          setValue: form.setValue,
          enabled: true
        },
        { sections }
      );
      useFieldSync(
        {
          sectionId: "patient",
          watch: form.watch,
          getValues: form.getValues,
          setValue: form.setValue,
          enabled: true
        },
        { sections }
      );

      return form;
    });

    act(() => {
      const form = result.current;
      form.setValue("incident.locationAddress", "123 Main St", { shouldDirty: true });
      form.setValue("incident.locationCity", "Hagerstown", { shouldDirty: true });
    });

    expect(result.current.getValues("patient.address")).toBe("123 Main St");
    expect(result.current.getValues("patient.city")).toBe("Hagerstown");

    act(() => {
      const form = result.current;
      form.setValue("patient.address", "Manual Entry", { shouldDirty: true });
      form.setValue("incident.locationAddress", "456 Elm St", { shouldDirty: true });
    });

    expect(result.current.getValues("patient.address")).toBe("Manual Entry");

    act(() => {
      const form = result.current;
      form.setValue("incident.copyAddressToPatient", true, { shouldDirty: true });
    });

    expect(result.current.getValues("patient.address")).toBe("456 Elm St");
    expect(result.current.getValues("patient.city")).toBe("Hagerstown");
  });

  it("calculates age from birthdate fields", () => {
    const fixedNow = new Date("2025-01-01T00:00:00Z");

    const { result } = renderHook(() => {
      const form = useForm<FormValues>({ defaultValues: createDefaultValues() });

      useEffect(() => {
        registerFields(form);
      }, [form]);

      useFieldSync(
        {
          sectionId: "incident",
          watch: form.watch,
          getValues: form.getValues,
          setValue: form.setValue,
          enabled: true
        },
        { sections, currentDate: fixedNow }
      );
      useFieldSync(
        {
          sectionId: "patient",
          watch: form.watch,
          getValues: form.getValues,
          setValue: form.setValue,
          enabled: true
        },
        { sections, currentDate: fixedNow }
      );

      return form;
    });

    act(() => {
      const form = result.current;
      form.setValue("patient.birthYear", "1990", { shouldDirty: true });
      form.setValue("patient.birthMonth", "1", { shouldDirty: true });
      form.setValue("patient.birthDay", "1", { shouldDirty: true });
    });

    expect(result.current.getValues("patient.age")).toBe("35");

    act(() => {
      const form = result.current;
      form.setValue("patient.birthMonth", "13", { shouldDirty: true });
    });

    expect(result.current.getValues("patient.age")).toBe("");
  });

  it("keeps gender selections synchronized", () => {
    const { result } = renderHook(() => {
      const form = useForm<FormValues>({ defaultValues: createDefaultValues() });

      useEffect(() => {
        registerFields(form);
      }, [form]);

      useFieldSync(
        {
          sectionId: "incident",
          watch: form.watch,
          getValues: form.getValues,
          setValue: form.setValue,
          enabled: true
        },
        { sections }
      );
      useFieldSync(
        {
          sectionId: "patient",
          watch: form.watch,
          getValues: form.getValues,
          setValue: form.setValue,
          enabled: true
        },
        { sections }
      );

      return form;
    });

    act(() => {
      result.current.setValue("incident.gender", "female", { shouldDirty: true });
    });

    expect(result.current.getValues("patient.gender")).toBe("female");

    act(() => {
      result.current.setValue("patient.gender", "male", { shouldDirty: true });
    });

    expect(result.current.getValues("incident.gender")).toBe("male");
  });
});
