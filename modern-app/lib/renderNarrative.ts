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

function sanitizeFreeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function stripSentence(value: string): string {
  return sanitizeFreeText(value).replace(/[.!?]+$/u, "");
}

function lowercaseFirst(value: string): string {
  if (!value) return "";
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function buildLabeledNarrative(
  entries: Array<{ label: string; value?: string }>
): string {
  return entries
    .map(({ label, value }) => {
      const formatted = stripSentence(value ?? "");
      if (!formatted) {
        return "";
      }
      const normalized =
        formatted === formatted.toUpperCase()
          ? formatted
          : lowercaseFirst(formatted);
      return `${label} ${normalized}`;
    })
    .filter(Boolean)
    .join("; ");
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
  compile: Handlebars.compile(section.template)
}));

export function renderNarrative(formData: NarrativeFormData): string {
  const subjectiveChiefComplaint = lowercaseFirst(
    stripSentence(formData.subjective.chiefComplaint)
  );
  const subjectiveHistoryProvider = formData.subjective.historyProvider
    ? resolveOptionLabel(
        "subjective",
        "historyProvider",
        formData.subjective.historyProvider
      ).toLowerCase()
    : "";
  const subjectiveSymptoms = buildList(
    "subjective",
    "symptoms",
    formData.subjective.symptoms
  ).toLowerCase();
  const subjectivePainScale = stripSentence(formData.subjective.painScale);
  const subjectiveNotes = sanitizeFreeText(formData.subjective.notes);
  const subjectiveHasBaseNarrative = Boolean(
    subjectiveChiefComplaint ||
      subjectiveHistoryProvider ||
      subjectiveSymptoms ||
      subjectivePainScale
  );
  const subjectiveOpqrstSummary = buildLabeledNarrative([
    { label: "Onset", value: formData.subjective.opqrstOnset },
    { label: "Provocation", value: formData.subjective.opqrstProvocation },
    { label: "Quality", value: formData.subjective.opqrstQuality },
    { label: "Radiation", value: formData.subjective.opqrstRadiation },
    { label: "Severity", value: formData.subjective.opqrstSeverity },
    { label: "Time", value: formData.subjective.opqrstTimeCourse }
  ]);
  const subjectiveOpqrstSentence = subjectiveOpqrstSummary
    ? `OPQRST: ${subjectiveOpqrstSummary}.`
    : "";
  const subjectiveSampleSummary = buildLabeledNarrative([
    { label: "Allergies", value: formData.subjective.sampleAllergies },
    { label: "Medications", value: formData.subjective.sampleMedications },
    { label: "Past hx", value: formData.subjective.samplePastHistory },
    { label: "Last intake", value: formData.subjective.sampleLastIntake },
    { label: "Events", value: formData.subjective.sampleEvents }
  ]);
  const subjectiveSampleSentence = subjectiveSampleSummary
    ? `SAMPLE: ${subjectiveSampleSummary}.`
    : "";
  const subjectiveHasOpqrst = Boolean(subjectiveOpqrstSentence);
  const subjectiveHasSample = Boolean(subjectiveSampleSentence);
  const subjectiveHasNarrative = Boolean(
    subjectiveHasBaseNarrative || subjectiveHasOpqrst || subjectiveHasSample
  );
  const subjectiveHasLeadBeforeSample = Boolean(
    subjectiveHasBaseNarrative || subjectiveHasOpqrst
  );

  const objectivePrimaryImpression = formData.objective.primaryImpression
    ? `Primary impression: ${resolveOptionLabel(
        "objective",
        "primaryImpression",
        formData.objective.primaryImpression
      )}`
    : "";
  const objectiveSecondaryImpression = stripSentence(
    formData.objective.secondaryImpression
  );
  const objectiveVitals = formatVitals(formData.objective.vitals ?? []);
  const objectiveNotes = sanitizeFreeText(formData.objective.objectiveNotes);
  const objectiveHasNarrative = Boolean(
    objectivePrimaryImpression ||
      objectiveSecondaryImpression ||
      objectiveVitals
  );

  const assessmentSummary = stripSentence(formData.assessment.summary);
  const assessmentDifferential = stripSentence(
    formData.assessment.differential
  );
  const assessmentFindings = buildList(
    "assessment",
    "clinicalFindings",
    formData.assessment.clinicalFindings
  ).toLowerCase();

  const planTreatments = buildList(
    "plan",
    "treatments",
    formData.plan.treatments
  ).toLowerCase();
  const planMode = formData.plan.transportMode
    ? resolveOptionLabel("plan", "transportMode", formData.plan.transportMode)
    : "";
  const planDestination = sanitizeFreeText(formData.plan.destination);
  let planTransportNarrative = "";
  if (planMode || planDestination) {
    if (planMode.toLowerCase() === "refused transport") {
      planTransportNarrative = "Refused transport";
    } else {
      const segments = [planMode, planDestination && `to ${planDestination}`]
        .filter(Boolean)
        .join(" ")
        .trim();
      if (segments) {
        planTransportNarrative = `Transported ${segments}`.trim();
      }
    }
  }
  const planMileage = sanitizeFreeText(formData.plan.mileage);
  const planNotes = sanitizeFreeText(formData.plan.planNotes);
  const planHasNarrative = Boolean(
    planTreatments || planTransportNarrative || planMileage
  );

  const context = {
    ...formData,
    subjective: {
      ...formData.subjective,
      chiefComplaintText: subjectiveChiefComplaint,
      historyProviderText: subjectiveHistoryProvider,
      symptomsList: subjectiveSymptoms,
      painScaleText: subjectivePainScale,
      notes: subjectiveNotes,
      hasNarrative: subjectiveHasNarrative,
      hasBaseNarrative: subjectiveHasBaseNarrative,
      hasOpqrst: subjectiveHasOpqrst,
      hasSample: subjectiveHasSample,
      opqrstSentence: subjectiveOpqrstSentence,
      sampleSentence: subjectiveSampleSentence,
      hasLeadBeforeSample: subjectiveHasLeadBeforeSample
    },
    objective: {
      ...formData.objective,
      primaryImpressionText: objectivePrimaryImpression,
      secondaryImpressionText: objectiveSecondaryImpression,
      vitalsList: objectiveVitals,
      objectiveNotes: objectiveNotes,
      hasNarrative: objectiveHasNarrative
    },
    assessment: {
      ...formData.assessment,
      summaryText: assessmentSummary,
      differentialText: assessmentDifferential,
      clinicalFindingsList: assessmentFindings
    },
    plan: {
      ...formData.plan,
      treatmentsList: planTreatments,
      transportNarrative: planTransportNarrative,
      mileageText: planMileage,
      planNotes: planNotes,
      hasNarrative: planHasNarrative
    }
  };

  const sectionsOutput = compiledSections
    .map((section) => {
      const result = section.compile(context).trim();
      if (result) {
        return `${section.heading} ${result}`.trimEnd();
      }
      return section.heading;
    })
    .filter(Boolean);

  return sectionsOutput.join("\n\n");
}
