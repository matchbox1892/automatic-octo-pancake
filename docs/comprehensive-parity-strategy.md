# Comprehensive Parity Analysis and Execution Strategy

This document performs a deep-dive of the archived SOAPCR/MatchCloud export now stored in this repository, enumerates every behavioural dependency, and lays out the work plan required to recreate the narrative generator with exact output parity while enabling GUI-driven customization.

## 1. Source-by-Source Assessment

### 1.1 `soapcr.com/index.html` — UI Structure
- **Header shell** – Fixed menu bar, overlay mask, and modal navigation list mirror the original Cloudflare-protected deployment.【F:soapcr.com/index.html†L379-L424】
- **Banner duplication** – Hidden top banner cloned to a footer position before the report button; modernization must preserve dual placement hooks.【F:soapcr.com/index.html†L459-L467】
- **Navigation controls** – Collapse/expand utilities (`divCollapseAll`, `divExpandAll`) drive section visibility expectations and should be re-implemented in the modern UI state store.【F:soapcr.com/index.html†L472-L475】
- **Incident, Patient, Insurance panes** – Extensive form markup with over 2,600 IDs covering address, timeline, personnel, and billing data even if future builds omit these sections; their absence must be reflected in the writer.【F:soapcr.com/index.html†L483-L650】
- **Subjective section** – OPQRST inputs, admits/denies tri-state checkboxes, ROS tables, and medication/allergy textareas all feed the narrative directly.【F:soapcr.com/index.html†L820-L1038】
- **Objective section** – Mentation radios, vital input pairs, neuro/respiratory/cardiac tables, and Glasgow Coma Scale controls must remain grouped for accurate sentence assembly.【F:soapcr.com/index.html†L1085-L1462】
- **Assessment Specific (`ASSPEC_*`) blocks** – Condition-specific documentation tables (trauma, stroke, obstetrics, etc.) rely on shared ID naming (e.g., `ASSPEC_STEMI_*`) referenced in writer helpers.【F:soapcr.com/index.html†L1500-L2174】
- **Plan templating** – Hidden plan card templates and containers define reusable treatment bundles and custom plan flows invoked by `PlanItems` logic.【F:soapcr.com/index.html†L2240-L2516】
- **Report area** – Textarea with copy buttons, CHART toggle, and bottom banner duplication anchor the output experience to be replicated exactly.【F:soapcr.com/index.html†L2520-L2662】

### 1.2 `soapcr.com/public/proversion/soapcrpro/soapcrpro.js` — UI Behaviour
- **Document ready hooks** – Initial collapse logic, age calculations, gender mirroring, and incident/patient sync events defined inside the jQuery DOM-ready block dictate parity requirements for the modern form controller.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L1-L88】
- **Age calculator** – `calc_age()` computes age/units and updates both patient and objective age inputs plus the corresponding dropdowns; the modernization hook must react to birthdate changes identically.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L169-L198】
- **Address copy helper** – `copy_address_to_patient()` ensures patient location mirrors incident location when appropriate, including conditional room/city/state propagation.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L237-L261】
- **Gender sync** – Radio change listeners keep patient and objective gender selections consistent across duplicate inputs.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L40-L46】
- **Conditional UI toggles** – Mentation toggles, assessment-specific display handlers, and `setMent()` logic replicate the legacy show/hide interactions the React build must support.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L222-L233】
- **PlanItems class** – 400-line utility managing plan card cloning, ID renaming, navigation, and data serialization; modernization must deliver equivalent component factories and ordering semantics.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L396-L520】
- **Stage3 exam helpers** – `addobject`, `change3state`, and related functions power three-state exam icons; these semantics must be preserved when migrating to component state.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L264-L360】

### 1.3 `soapcr.com/public/proversion/soapcrpro/writepcrpro.js` — Narrative Writer
- **Master flow** – `writepcr()` calls every section writer, handles CHART vs SOAP selection, and manages global usage metrics; the modern narrative service must mirror this sequencing to maintain punctuation and spacing.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L24-L70】
- **Subjective composition** – `writeSubj()` handles chief complaint phrasing, OPQRST sentences, admits/denies loops, and pertinent denials with precise punctuation management (`addComma`, `addSemi`, `addPeriod`).【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L694-L803】
- **Objective composition** – `writeObj()` assembles age/weight/gender, vitals, mentation, neuro findings, and ROS outputs, including tri-state exam helpers that read from `stage3objects` definitions.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L929-L1043】
- **Assessment section** – `writeAss()` captures narrative diagnoses and severity language; modernization must replicate severity radio mapping.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L2127-L2144】
- **Plan engine** – `writePlan()` orchestrates dozens of specialized helpers (Response, Arrival, Exams, Vitals, IV, O2, CPR, Refusal, Transport, etc.) ensuring each plan card template maps to the correct paragraph snippet.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L2148-L4926】
- **Ending/Signature** – `writeEnding()` adds closing author and timestamp phrases required for parity with the legacy output.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L5067-L5076】
- **Field instrumentation** – Markdown tables in `docs/source-analysis.md` provide line-by-line cross references between field IDs and getters, while `docs/field-map.json` offers a machine-readable map to power automated validation.

### 1.4 Supporting Assets & Modern App Skeleton
- **Legacy CSS/Images** – Styling files (e.g., `soapcrpro.css`) contain layout constants informing component spacing and class naming conventions for the modern rebuild.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.css†L1-L120】
- **Modern Next.js scaffold** – The `modern-app` folder (currently missing tracked source files) will host the React rewrite, Zustand store, and Decap CMS integration described in the existing plan; repo hygiene must restore the committed app source before parity work proceeds.

## 2. Derived Functional Requirements
1. **Complete form coverage** – Every checkbox, textarea, dropdown, and tri-state control found in the Subjective, Objective, Assessment, and Plan sections must exist in the new UI, even when certain legacy panes (Incident/Patient/Insurance) are intentionally omitted, because the writer references their IDs for narratives and must be refactored accordingly.【F:soapcr.com/index.html†L820-L1462】【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L694-L1043】
2. **Behavioural parity** – Age/birthdate sync, gender mirroring, address propagation, mentation toggles, assessment-specific displays, and plan card lifecycle management must behave exactly like the jQuery implementation.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L1-L520】
3. **Narrative fidelity** – Modern services must port every helper that contributes punctuation, ordering, and clause grouping so generated narratives match byte-for-byte with the archived output across SOAP and CHART formats.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L24-L5076】
4. **Dropdown vocabularies** – Option labels and values must come from the archived markup; `docs/dropdown-options.json` serves as the authoritative dataset for populating select controls and ensuring consistent narrative wording.
5. **Pertinent negative handling** – Admits/denies loops, ROS negative lists, and refusal clauses must maintain the same grammar, including colon and semicolon placement to avoid diverging strings.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L766-L803】【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L4280-L4483】
6. **Plan templates & custom cards** – Rebuild the plan card factory to allow quick template insertion, time stamping, navigation, and serialization as described in `PlanItems`, plus support for user-defined custom plans.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L396-L520】【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L2148-L4926】
7. **Reporting UI** – Maintain copy-to-clipboard, CHART toggle, print-friendly layout, and banner duplication to preserve user workflow.【F:soapcr.com/index.html†L2520-L2662】【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L24-L70】

## 3. Execution Plan (Think-Harder Edition)

### Phase A — Repository Restoration & Automation
- Recover and commit the missing `modern-app` source tree so the Next.js scaffold and existing tests are available for continued work.
- Script regeneration of `field-map.json` and `dropdown-options.json` from `index.html` to catch future drift.
- Establish golden narrative fixtures captured from the legacy site for regression comparisons.

### Phase B — Data Schema & CMS Authoring
- Define JSON schema covering field metadata (type, section, validation, `visibleWhen`, grouping) and align it with Decap CMS collections for GUI editing.
- Implement automated importers that translate the HTML tables (e.g., admits/denies, assessment-specific) into structured JSON arrays referenced by React components.
- Introduce localization hooks so phrasing changes can happen via CMS without code edits.

### Phase C — UI Reconstruction
- Build reusable components for checkbox matrices, tri-state exam controls, plan card templates, and section accordions following the layout cues from the legacy CSS.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.css†L1-L120】
- Wire Zustand store slices to represent section collapse states, selected plan cards, and usage metrics.
- Recreate header/menu/overlay interactions with accessible toggles and keyboard support.

### Phase D — Behavioural Hooks
- Port address sync, age calculation, gender mirroring, What3Words/GPS enrichment, and assessment-specific toggles into composable React hooks mirroring jQuery logic.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L1-L261】
- Implement condition-based visibility using `visibleWhen` metadata to replace legacy inline show/hide calls.
- Introduce validation guards ensuring hidden fields clear values/errors so parity matches the original `writepcrpro` assumptions.

### Phase E — Narrative Engine Port
- Translate punctuation helpers (`addComma`, `addPeriod`, `addReturn`, etc.) into a string-builder service with deterministic whitespace handling.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L520-L640】
- Recreate section writers (Subjective through Ending) with exhaustive unit tests verifying output equality for every branch, including plan sub-functions and refusal logic.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L694-L4926】
- Support CHART mode output by mirroring `setCHART` mechanics and state transitions.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L24-L70】

### Phase F — Verification & Deployment
- Run automated regression comparing modern narratives to archived golden files on every commit.
- Perform manual QA using checklist derived from `docs/source-analysis.md` to ensure each field influences the narrative as expected.
- Prepare deployment with Cloudflare Access compatibility and document procedures for Decap CMS admins.

## 4. Gap Audit & Remediation
- **Objective exam coverage** – Ensure tri-state exam icons map to structured data; missing icons must be identified and added before narrative parity testing.【F:soapcr.com/index.html†L1085-L1462】【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L978-L1510】
- **Plan template completeness** – Confirm every hidden plan template in `index.html` has a corresponding React component and writer integration, including advanced airway, refusal, and transport cards.【F:soapcr.com/index.html†L2240-L2516】【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L2148-L4926】
- **Pertinent denial in Subjective** – Validate that all “denies” checkboxes and free-text augmentations appear with correct separators; create automated tests for colon/semi-colon placement.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L768-L803】
- **Missing sections** – If Incident/Patient/Insurance forms are intentionally removed in the modern UX, refactor the writer to avoid referencing absent fields or provide alternative inputs to maintain narrative completeness.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L70-L2148】
- **Modern-app source absence** – Prioritize restoring the React source tree to resume modernization work; current repository contains only dependencies without actual implementation files.

## 5. Validation Checklist Before Declaring Parity
1. Re-run automated extraction to verify no new IDs/options emerged in the legacy HTML since the last snapshot.【F:soapcr.com/index.html†L483-L2662】
2. Execute comprehensive narrative regression to confirm byte-level parity for SOAP and CHART outputs across multiple scenarios (transport, refusal, pediatrics, trauma, obstetrics, cardiac arrest, etc.).【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L24-L5076】
3. Manually test UI behaviours (collapse/expand, plan card lifecycle, stage3 toggles, address/age sync) to match legacy interactions.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L1-L520】
4. Validate CMS edits propagate to both form labels and narrative phrasing without code changes.
5. Confirm deployment behind Cloudflare Access and document login procedures for responders.

This analysis and execution strategy ensure every data point, dropdown option, conditional rule, and narrative phrase from SOAPCR.com is accounted for while setting the stage for future enhancements like automatic mileage calculation and GPT-assisted grammar polishing.
