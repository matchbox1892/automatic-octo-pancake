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
  if (
    field.type === "select" ||
    field.type === "checkbox-group" ||
    field.type === "radio-group"
  ) {
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

function buildOpqrstSummary(
  data: NarrativeFormData["subjective"]
): string {
  const segments: string[] = [];
  const entries: Array<[string, string, string | undefined]> = [
    ["Onset", "opqrstOnset", data.opqrstOnset],
    ["Provokes", "opqrstProvokes", data.opqrstProvokes],
    ["Quality", "opqrstQuality", data.opqrstQuality],
    ["Radiation", "opqrstRadiates", data.opqrstRadiates],
    [
      "Severity",
      "opqrstSeverityDescription",
      data.opqrstSeverityDescription
    ],
    ["Time", "opqrstTime", data.opqrstTime]
  ];

  entries.forEach(([label, fieldId, value]) => {
    if (!value) return;
    const resolved = stripSentence(
      resolveOptionLabel("subjective", fieldId, value)
    );
    if (resolved) {
      segments.push(`${label}: ${resolved}`);
    }
  });

  return segments.join("; ");
}

function formatAgeText(age: string | undefined, units: string | undefined): string {
  const cleanedAge = stripSentence(age ?? "");
  if (!cleanedAge) {
    return "";
  }

  switch (units) {
    case "years":
      return `${cleanedAge}-year-old`;
    case "months":
      return `${cleanedAge}-month-old`;
    case "days":
      return `${cleanedAge}-day-old`;
    default:
      return cleanedAge;
  }
}

function buildDemographics(
  data: NarrativeFormData["objective"]
): string {
  const ageText = formatAgeText(data.age, data.ageUnits);
  const genderLabel = data.gender
    ? resolveOptionLabel("objective", "gender", data.gender).toLowerCase()
    : "";

  const parts = [ageText, genderLabel].filter(Boolean);
  if (parts.length === 0) {
    return "";
  }

  return `Patient is a ${parts.join(" ")}`.trim();
}

function formatWeightSummary(
  data: NarrativeFormData["objective"]
): string {
  const kg = stripSentence(data.weightKg ?? "");
  const lb = stripSentence(data.weightLb ?? "");
  const segments = [];
  if (kg) {
    segments.push(`${kg} kg`);
  }
  if (lb) {
    segments.push(`${lb} lbs`);
  }
  if (segments.length === 0) {
    return "";
  }
  return `Weight approx: ${segments.join(" / ")}`;
}

function buildAbcsSummary(
  data: NarrativeFormData["objective"]
): string {
  const airway = stripSentence(data.airwayStatus ?? "");
  const breathing = stripSentence(data.breathingStatus ?? "");
  const circulation = stripSentence(data.circulationStatus ?? "");

  const segments = [
    airway ? `Airway: ${airway}` : "",
    breathing ? `Breathing: ${breathing}` : "",
    circulation ? `Circulation: ${circulation}` : ""
  ].filter(Boolean);

  return segments.join("; ");
}

const compiledSections = soapTemplate.sections.map((section) => ({
  ...section,
  compile: Handlebars.compile(section.template)
}));

export function renderNarrative(formData: NarrativeFormData): string {
  const subjectiveChiefComplaint = lowercaseFirst(
    stripSentence(formData.subjective.chiefComplaint)
  );
  const subjectiveNoComplaintText = formData.subjective.noChiefComplaint
    ? "No chief complaint reported"
    : "";
  const subjectiveHistoryProvider = formData.subjective.historyProvider
    ? resolveOptionLabel(
        "subjective",
        "historyProvider",
        formData.subjective.historyProvider
      ).toLowerCase()
    : "";
  const subjectivePertinentPositives = buildList(
    "subjective",
    "pertinentPositives",
    formData.subjective.pertinentPositives
  ).toLowerCase();
  const subjectivePertinentNegatives = buildList(
    "subjective",
    "pertinentNegatives",
    formData.subjective.pertinentNegatives
  ).toLowerCase();
  const subjectivePainScale = formData.subjective.painScale
    ? stripSentence(
        resolveOptionLabel(
          "subjective",
          "painScale",
          formData.subjective.painScale
        )
      )
    : "";
  const subjectivePatientNarrative = stripSentence(
    formData.subjective.patientNarrative ?? ""
  );
  const subjectiveOpqrstSummary = buildOpqrstSummary(formData.subjective);
  const subjectiveSimilarHistory = stripSentence(
    formData.subjective.historySimilar ?? ""
  );
  const subjectiveNotes = sanitizeFreeText(formData.subjective.notes);
  const subjectiveHasNarrative = Boolean(
    subjectiveNoComplaintText ||
      subjectiveChiefComplaint ||
      subjectiveHistoryProvider ||
      subjectivePertinentPositives ||
      subjectivePertinentNegatives ||
      subjectivePainScale ||
      subjectivePatientNarrative ||
      subjectiveOpqrstSummary ||
      subjectiveSimilarHistory ||
      subjectiveNotes
  );

  const objectiveDemographics = buildDemographics(formData.objective);
  const objectiveWeightSummary = formatWeightSummary(formData.objective);
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
  const objectiveGeneralImpression = stripSentence(
    formData.objective.generalImpression ?? ""
  );
  const objectiveAbcsSummary = buildAbcsSummary(formData.objective);
  const objectiveSkinFindings = stripSentence(
    formData.objective.skinFindings ?? ""
  );
  const objectiveNeuroStatus = stripSentence(
    formData.objective.neuroStatus ?? ""
  );
  const objectiveVitals = formatVitals(formData.objective.vitals ?? []);
  const objectiveNotes = sanitizeFreeText(formData.objective.objectiveNotes);
  const objectiveHasNarrative = Boolean(
    objectiveDemographics ||
      objectiveWeightSummary ||
      objectivePrimaryImpression ||
      objectiveSecondaryImpression ||
      objectiveGeneralImpression ||
      objectiveAbcsSummary ||
      objectiveSkinFindings ||
      objectiveNeuroStatus ||
      objectiveVitals ||
      objectiveNotes
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
      noComplaintText: subjectiveNoComplaintText,
      historyProviderText: subjectiveHistoryProvider,
      pertinentPositivesList: subjectivePertinentPositives,
      pertinentNegativesList: subjectivePertinentNegatives,
      painScaleText: subjectivePainScale,
      patientNarrative: subjectivePatientNarrative,
      opqrstSummary: subjectiveOpqrstSummary,
      similarHistoryText: subjectiveSimilarHistory,
      notes: subjectiveNotes,
      hasNarrative: subjectiveHasNarrative
    },
    objective: {
      ...formData.objective,
      demographics: objectiveDemographics,
      weightSummary: objectiveWeightSummary,
      primaryImpressionText: objectivePrimaryImpression,
      secondaryImpressionText: objectiveSecondaryImpression,
      generalImpressionText: objectiveGeneralImpression,
      abcsSummary: objectiveAbcsSummary,
      skinFindingsText: objectiveSkinFindings,
      neuroStatusText: objectiveNeuroStatus,
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
