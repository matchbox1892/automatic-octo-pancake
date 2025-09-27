import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { SectionFields } from "@/components/SectionFields";
import type { Section } from "@/lib/types";

type FormValues = {
  plan: {
    transportMode: string;
    transportOtherDetails: string;
    mileage: string;
  };
};

const planSection: Section = {
  id: "plan",
  title: "Plan",
  fields: [
    {
      id: "transportMode",
      type: "select",
      label: "Transport Mode",
      options: [
        { value: "", label: "" },
        { value: "als", label: "ALS" },
        { value: "refused", label: "Refused" },
        { value: "other", label: "Other" }
      ],
      placeholder: "Select transport mode"
    },
    {
      id: "transportOtherDetails",
      type: "textarea",
      label: "Describe Other Transport Mode",
      visibleWhen: {
        fieldId: "plan.transportMode",
        operator: "equals",
        value: "other"
      }
    },
    {
      id: "mileage",
      type: "number",
      label: "Scene to Destination Mileage",
      visibleWhen: {
        fieldId: "plan.transportMode",
        operator: "notEquals",
        value: "refused"
      }
    }
  ]
};

function renderPlanSection(initialValues?: Partial<FormValues["plan"]>) {
  const methodsRef: { current: UseFormReturn<FormValues> | null } = { current: null };

  function Wrapper() {
    const methods = useForm<FormValues>({
      defaultValues: {
        plan: {
          transportMode: "",
          transportOtherDetails: "",
          mileage: "",
          ...initialValues
        }
      }
    });

    methodsRef.current = methods;

    return (
      <FormProvider {...methods}>
        <SectionFields section={planSection} basePath="plan" />
      </FormProvider>
    );
  }

  const utils = render(<Wrapper />);

  if (!methodsRef.current) {
    throw new Error("Form methods not initialized");
  }

  return { ...utils, form: methodsRef.current };
}

describe("conditional field visibility", () => {
  it("renders dependent fields when their conditions evaluate to true", async () => {
    renderPlanSection();

    expect(screen.queryByLabelText("Describe Other Transport Mode")).not.toBeInTheDocument();

    const transportSelect = screen.getByLabelText("Transport Mode");
    fireEvent.change(transportSelect, { target: { value: "other" } });

    await waitFor(() => {
      expect(screen.getByLabelText("Describe Other Transport Mode")).toBeInTheDocument();
    });
  });

  it("hides fields when conditions fail and clears their values and errors", async () => {
    const { form } = renderPlanSection();

    const mileageInput = screen.getByLabelText("Scene to Destination Mileage");
    fireEvent.change(mileageInput, { target: { value: "12" } });

    await act(async () => {
      form.setError("plan.mileage", { type: "manual", message: "Required" });
    });

    const transportSelect = screen.getByLabelText("Transport Mode");
    fireEvent.change(transportSelect, { target: { value: "refused" } });

    await waitFor(() => {
      expect(screen.queryByLabelText("Scene to Destination Mileage")).not.toBeInTheDocument();
      expect(form.getValues("plan.mileage")).toBe("");
      expect(form.formState.errors.plan?.mileage).toBeUndefined();
    });
  });
});
