import subjective from '../content/sections/subjective.json';
import objective from '../content/sections/objective.json';
import assessment from '../content/sections/assessment.json';
import plan from '../content/sections/plan.json';

export interface FieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
}

export interface SectionDefinition {
  id: string;
  title: string;
  description?: string;
  fields: FieldDefinition[];
}

export const sections: SectionDefinition[] = [subjective, objective, assessment, plan];
