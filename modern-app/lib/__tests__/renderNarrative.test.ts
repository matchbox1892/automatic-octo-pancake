import { describe, expect, it } from "vitest";
import { renderNarrative } from "@/lib/renderNarrative";
import { defaultFormValues } from "@/lib/default-values";

describe("renderNarrative", () => {
  it("returns section headings when empty", () => {
    const narrative = renderNarrative(defaultFormValues);
    expect(narrative).toBe("S:\n\nO:\n\nA:\n\nP:");
  });

  it("formats populated content in SOAP order", () => {
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
    const sections = narrative.split("\n\n");
    expect(sections[0]).toBe(
      "S: Pt's chief complaint is chest pain. Pertinent symptoms include shortness of breath. Pain rated 6/10."
    );
    expect(sections[1]).toBe(
      "O: Primary impression: Cardiac. Vitals: 14:32 - HR 88, BP 126/82, RR 18, SpO₂ 98%."
    );
    expect(sections[2]).toBe("A: Likely ACS.");
    expect(sections[3]).toBe(
      "P: Treatments provided include aspirin. Transported ALS to Meritus Medical Center."
    );
  });
});
