export type FieldOption = {
  value: string;
  label: string;
  helperText?: string;
};

export type VisibilityOperator = "equals" | "notEquals" | "contains" | "notEmpty";

export type VisibilityCondition = {
  fieldId: string;
  operator?: VisibilityOperator;
  value?: string | string[];
};

export type BaseField = {
  id: string;
  label: string;
  helperText?: string;
  placeholder?: string;
  visibleWhen?: VisibilityCondition | VisibilityCondition[];
  conditions?: VisibilityCondition | VisibilityCondition[];
};

export type TextField = BaseField & {
  type: "text" | "textarea" | "number" | "time";
  rows?: number;
};

export type SelectField = BaseField & {
  type: "select";
  options: FieldOption[];
};

export type RadioGroupField = BaseField & {
  type: "radio-group";
  options: FieldOption[];
};

export type CheckboxGroupField = BaseField & {
  type: "checkbox-group";
  options: FieldOption[];
};

export type CheckboxField = BaseField & {
  type: "checkbox";
};

export type ArrayField = BaseField & {
  type: "array";
  itemLabel: string;
  addButtonLabel?: string;
  itemFields: (TextField | SelectField | CheckboxGroupField | RadioGroupField)[];
};

export type Field =
  | TextField
  | SelectField
  | RadioGroupField
  | CheckboxGroupField
  | CheckboxField
  | ArrayField;

export type Section = {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
};

export type NarrativeTemplateSection = {
  id: string;
  heading: string;
  template: string;
};

export type NarrativeTemplate = {
  id: string;
  sections: NarrativeTemplateSection[];
};
