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
        patientNarrative: "pain began while mowing the lawn",
        symptoms: ["sob"],
        painScale: "6",
        opqrstOnset: "while mowing the lawn",
        opqrstProvokes: "worse with exertion",
        opqrstQuality: "pressure",
        opqrstRadiates: "to left arm",
        opqrstSeverityDescription: "aching discomfort",
        opqrstTime: "30 minutes prior",
        historySimilar: "Similar episode last year"
      },
      objective: {
        ...defaultFormValues.objective,
        age: "58",
        ageUnits: "years",
        gender: "female",
        weightKg: "72",
        weightLb: "158",
        generalImpression: "found seated in living room clutching chest",
        airwayStatus: "patent",
        breathingStatus: "clear bilaterally",
        circulationStatus: "pulses 2+ radial",
        skinFindings: "Skin warm and dry",
        neuroStatus: "Alert and oriented x4",
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
      "S: Pt's chief complaint is chest pain. Patient states pain began while mowing the lawn. Pertinent symptoms include shortness of breath. Pain rated 6/10. OPQRST: Onset: while mowing the lawn; Provokes: worse with exertion; Quality: pressure; Radiation: to left arm; Severity: aching discomfort; Time: 30 minutes prior. Similar history: Similar episode last year."
    );
    expect(sections[1]).toBe(
      "O: Patient is a 58-year-old female. Weight approx: 72 kg / 158 lbs. Primary impression: Cardiac. General impression: found seated in living room clutching chest. ABCs: Airway: patent; Breathing: clear bilaterally; Circulation: pulses 2+ radial. Skin: Skin warm and dry. Neuro: Alert and oriented x4. Vitals: 14:32 - HR 88, BP 126/82, RR 18, SpO₂ 98%."
    );
    expect(sections[2]).toBe("A: Likely ACS.");
    expect(sections[3]).toBe(
      "P: Treatments provided include aspirin. Transported ALS to Meritus Medical Center."
    );
  });

  it("supports the no chief complaint toggle", () => {
    const data = {
      ...defaultFormValues,
      subjective: {
        ...defaultFormValues.subjective,
        noChiefComplaint: true
      },
      objective: {
        ...defaultFormValues.objective,
        primaryImpression: "medical"
      }
    };

    const narrative = renderNarrative(data);
    const sections = narrative.split("\n\n");
    expect(sections[0]).toBe("S: No chief complaint reported.");
  });
});
