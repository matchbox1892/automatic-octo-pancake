import Handlebars from "handlebars/dist/handlebars";
import type { NarrativeFormData } from "@/lib/form-schema";
import { sections, soapTemplate } from "@/lib/content-loader";

function resolveOptionLabel(
  sectionId: string,
  fieldId: string,
  value: string
): string {
  const section = sections.find((entry) => entry.id === sectionId);
  if (!section) return value;
  const field = section.fields.find((entry) => entry.id === fieldId);
  if (!field) return value;
  if (field.type === "select" || field.type === "checkbox-group") {
    const option = field.options.find((item) => item.value === value);
    return option?.label ?? value;
  }
  return value;
}

function buildList(
  sectionId: string,
  fieldId: string,
  values: string[] | undefined
): string {
  if (!values || values.length === 0) {
    return "";
  }
  return values
    .map((value) => resolveOptionLabel(sectionId, fieldId, value))
    .filter(Boolean)
    .join(", ");
}

function formatVitals(formData: NarrativeFormData["objective"]["vitals"]): string {
  return formData
    .map((vital) => {
      const segments: string[] = [];
      if (vital.heartRate) {
        segments.push(`HR ${vital.heartRate}`);
      }
      if (vital.bloodPressure) {
        segments.push(`BP ${vital.bloodPressure}`);
      }
      if (vital.respiratoryRate) {
        segments.push(`RR ${vital.respiratoryRate}`);
      }
      if (vital.spo2) {
        segments.push(`SpO₂ ${vital.spo2}%`);
      }
      if (segments.length === 0) {
        return "";
      }
      const prefix = vital.time ? `${vital.time} - ` : "";
      return `${prefix}${segments.join(", ")}`;
    })
    .filter(Boolean)
    .join("; ");
}

const compiledSections = soapTemplate.sections.map((section) => ({
  ...section,
  compile: Handlebars.compile(section.template.trim())
}));

export function renderNarrative(formData: NarrativeFormData): string {
  const context = {
    ...formData,
    subjective: {
      ...formData.subjective,
      historyProvider: formData.subjective.historyProvider
        ? resolveOptionLabel("subjective", "historyProvider", formData.subjective.historyProvider)
        : "",
      symptomsList: buildList("subjective", "symptoms", formData.subjective.symptoms)
    },
    objective: {
      ...formData.objective,
      primaryImpression: formData.objective.primaryImpression
        ? resolveOptionLabel("objective", "primaryImpression", formData.objective.primaryImpression)
        : "",
      vitalsList: formatVitals(formData.objective.vitals ?? [])
    },
    assessment: {
      ...formData.assessment,
      clinicalFindingsList: buildList("assessment", "clinicalFindings", formData.assessment.clinicalFindings)
    },
    plan: {
      ...formData.plan,
      transportMode: formData.plan.transportMode
        ? resolveOptionLabel("plan", "transportMode", formData.plan.transportMode)
        : "",
      treatmentsList: buildList("plan", "treatments", formData.plan.treatments)
    }
  };

  const sectionsOutput = compiledSections
    .map((section) => {
      const result = section.compile(context).trim();
      if (!result) {
        return "";
      }
      return `${section.heading}\n${result}`.trim();
    })
    .filter(Boolean);

  return sectionsOutput.join("\n\n");
}
