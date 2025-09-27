import React from 'react';
import { PlanCardTypes, type PlanCard, type PlanCardTime, type PlanCardTemplate } from './plan-card-model';
import { type VitalSignsSchema } from './vital-signs';

/**
 * Template category definitions
 */
export const TemplateCategories = {
  ASSESSMENT: 'Assessment',
  VITALS: 'Vitals',
  AIRWAY: 'Airway',
  BREATHING: 'Breathing',
  CIRCULATION: 'Circulation',
  INTERVENTION: 'Intervention', 
  TRANSPORT: 'Transport',
  MISC: 'Miscellaneous'
} as const;

export type TemplateCategory = typeof TemplateCategories[keyof typeof TemplateCategories];

/**
 * Default template registry
 */
const defaultTemplates: PlanCardTemplate[] = [
  // Assessment templates
  {
    id: 'initial-assessment',
    name: 'Initial Assessment',
    type: PlanCardTypes.Exam,
    category: TemplateCategories.ASSESSMENT,
    description: 'General assessment findings',
    defaultDetails: 'Initial patient assessment performed.'
  },
  {
    id: 'focused-assessment',
    name: 'Focused Assessment',
    type: PlanCardTypes.Exam,
    category: TemplateCategories.ASSESSMENT,
    description: 'Focused exam of specific system/injury'
  },

  // Vital signs templates
  {
    id: 'vital-signs',
    name: 'Vital Signs',
    type: PlanCardTypes.Vitals,
    category: TemplateCategories.VITALS,
    description: 'Complete set of vital signs',
    validateCard: (card: PlanCard) => {
      if (card.type !== PlanCardTypes.Vitals) return false;
      const vitals = card.vitals as z.infer<typeof VitalSignsSchema>;
      return !!(vitals.heartRate || vitals.bloodPressure || vitals.respiratoryRate);
    }
  },
  {
    id: 'gcs',
    name: 'GCS',
    type: PlanCardTypes.GCS,
    category: TemplateCategories.VITALS,
    description: 'Glasgow Coma Scale assessment'
  },

  // Airway templates
  {
    id: 'airway-assessment',
    name: 'Airway Assessment',
    type: PlanCardTypes.Exam,
    category: TemplateCategories.AIRWAY,
    description: 'Airway patency and status'
  },
  {
    id: 'opa',
    name: 'OPA',
    type: PlanCardTypes.OPA,
    category: TemplateCategories.AIRWAY,
    description: 'Oropharyngeal airway placement'
  },
  {
    id: 'ett',
    name: 'ETT',
    type: PlanCardTypes.ETT,
    category: TemplateCategories.AIRWAY,
    description: 'Endotracheal tube placement'
  },
  {
    id: 'king',
    name: 'King Airway',
    type: PlanCardTypes.LMA,
    category: TemplateCategories.AIRWAY,
    description: 'King/supraglottic airway placement'
  },

  // Breathing templates
  {
    id: 'breathing-assessment',
    name: 'Breathing Assessment',
    type: PlanCardTypes.Exam, 
    category: TemplateCategories.BREATHING,
    description: 'Respiratory assessment'
  },
  {
    id: 'o2-therapy',
    name: 'Oxygen Therapy',
    type: PlanCardTypes.O2,
    category: TemplateCategories.BREATHING,
    description: 'Oxygen administration'
  },
  {
    id: 'capnography',
    name: 'Capnography', 
    type: PlanCardTypes.Cap,
    category: TemplateCategories.BREATHING,
    description: 'End-tidal CO2 monitoring'
  },

  // Circulation templates
  {
    id: 'circulation-assessment',
    name: 'Circulation Assessment',
    type: PlanCardTypes.Exam,
    category: TemplateCategories.CIRCULATION,
    description: 'Circulatory assessment'
  },
  {
    id: 'iv-access',
    name: 'IV Access',
    type: PlanCardTypes.IV,
    category: TemplateCategories.CIRCULATION,
    description: 'IV/IO access placement'
  },
  {
    id: 'fluid-bolus',
    name: 'Fluid Bolus',
    type: PlanCardTypes.IV,
    category: TemplateCategories.CIRCULATION,
    description: 'IV fluid administration'
  },

  // Intervention templates
  {
    id: 'medication',
    name: 'Medication',
    type: PlanCardTypes.Drug,
    category: TemplateCategories.INTERVENTION,
    description: 'Medication administration'
  },
  {
    id: 'splinting',
    name: 'Splinting',
    type: PlanCardTypes.Splint,
    category: TemplateCategories.INTERVENTION,
    description: 'Splint application'
  },
  {
    id: 'bandaging',
    name: 'Bandaging',
    type: PlanCardTypes.Bandage,
    category: TemplateCategories.INTERVENTION,
    description: 'Bandage/dressing application'
  },

  // Transport templates
  {
    id: 'patient-move',
    name: 'Patient Move',
    type: PlanCardTypes.Cot,
    category: TemplateCategories.TRANSPORT,
    description: 'Patient movement/transfer'
  },
  {
    id: 'transport-decision',
    name: 'Transport Decision',
    type: PlanCardTypes.Xport,
    category: TemplateCategories.TRANSPORT,
    description: 'Transport mode/destination'
  },
  {
    id: 'refusal',
    name: 'Transport Refusal',
    type: PlanCardTypes.Refusal,
    category: TemplateCategories.TRANSPORT,
    description: 'Patient refuses transport'
  }
];

/**
 * Global template registry
 */
export class TemplateRegistry {
  private static instance: TemplateRegistry;
  private templates: Map<string, PlanCardTemplate>;
  private categoryMap: Map<string, Set<string>>;

  private constructor() {
    this.templates = new Map();
    this.categoryMap = new Map();
    this.loadDefaultTemplates();
  }

  public static getInstance(): TemplateRegistry {
    if (!TemplateRegistry.instance) {
      TemplateRegistry.instance = new TemplateRegistry();
    }
    return TemplateRegistry.instance;
  }

  private loadDefaultTemplates() {
    defaultTemplates.forEach(template => {
      this.registerTemplate(template);
    });
  }

  public registerTemplate(template: PlanCardTemplate) {
    // Add to main registry
    this.templates.set(template.id, template);

    // Update category index
    let categoryTemplates = this.categoryMap.get(template.category);
    if (!categoryTemplates) {
      categoryTemplates = new Set();
      this.categoryMap.set(template.category, categoryTemplates);
    }
    categoryTemplates.add(template.id);
  }

  public getTemplate(id: string): PlanCardTemplate | undefined {
    return this.templates.get(id);
  }

  public listTemplates(): PlanCardTemplate[] {
    return Array.from(this.templates.values());
  }

  public getTemplatesByCategory(category: string): PlanCardTemplate[] {
    const templateIds = this.categoryMap.get(category);
    if (!templateIds) return [];
    return Array.from(templateIds).map(id => this.templates.get(id)!);
  }

  public listCategories(): string[] {
    return Array.from(this.categoryMap.keys());
  }
}

/**
 * Hook to access template registry
 */
export function useTemplateRegistry() {
  return TemplateRegistry.getInstance();
}

/**
 * Create a card from a template
 */
export function createFromTemplate(
  templateId: string, 
  name: string,
  order: number,
  initialTime?: PlanCardTime
): PlanCard | null {
  const template = TemplateRegistry.getInstance().getTemplate(templateId);
  if (!template) return null;

  return {
    id: `card_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name,
    type: template.type,
    timeId: `time_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    time: initialTime ?? '',
    order,
    details: template.defaultDetails ?? '',
    verified: false,
    templateId
  };
}