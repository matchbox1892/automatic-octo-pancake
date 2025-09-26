import { describe, expect, it } from "vitest";
import { renderNarrative } from "@/lib/renderNarrative";
import { defaultFormValues } from "@/lib/default-values";

describe("renderNarrative", () => {
  it("omits empty sentences", () => {
    const narrative = renderNarrative(defaultFormValues);
    expect(narrative).toBe("");
  });

  it("includes populated content", () => {
    const data = {
      ...defaultFormValues,
      subjective: {
        ...defaultFormValues.subjective,
        chiefComplaint: "Chest pain",
        symptoms: ["sob"],
        painScale: "6"
      },
      objective: {
        ...defaultFormValues.objective,
        primaryImpression: "cardiac",
        vitals: [
          {
            time: "14:32",
            heartRate: "88",
            bloodPressure: "126/82",
            respiratoryRate: "18",
            spo2: "98"
          }
        ]
      },
      assessment: {
        ...defaultFormValues.assessment,
        summary: "Likely ACS"
      },
      plan: {
        ...defaultFormValues.plan,
        treatments: ["asa"],
        transportMode: "als",
        destination: "Meritus Medical Center"
      }
    };

    const narrative = renderNarrative(data);
    expect(narrative).toContain("Chief complaint: Chest pain.");
    expect(narrative).toContain("Vitals: 14:32 - HR 88, BP 126/82, RR 18, SpO₂ 98%.");
    expect(narrative).toContain("Transport mode: ALS to Meritus Medical Center.");
  });
});
