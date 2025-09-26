import subjective from "@/content/sections/subjective.json";
import objective from "@/content/sections/objective.json";
import assessment from "@/content/sections/assessment.json";
import plan from "@/content/sections/plan.json";
import soap from "@/content/narratives/soap.json";
import type { NarrativeTemplate, Section } from "@/lib/types";

export const sections = [
  subjective,
  objective,
  assessment,
  plan
] as Section[];

export const soapTemplate = soap as NarrativeTemplate;

export function getSectionById(id: string): Section | undefined {
  return sections.find((section) => section.id === id);
}
