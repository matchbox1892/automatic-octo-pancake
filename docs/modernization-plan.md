# Modern SOAP Narrative Generator Reconstruction Plan

This plan translates the archived SOAPCR/MatchCloud static export into a maintainable, CMS-driven web application that reproduces the original narrative output exactly while enabling GUI-based customization.

## 1. Source Inventory and Baseline Understanding

- **HTML structure** — `soapcr.com/index.html` contains every UI panel (Subjective, Objective, Assessment, Plan, etc.) plus supporting banners, menu shell, and over 2,600 unique element IDs that drive narrative assembly and dynamic behaviors.【F:soapcr.com/index.html†L1-L320】
- **Client logic** — `soapcr.com/public/proversion/soapcrpro/soapcrpro.js` wires UI behaviors: collapsing sections, syncing age/sex, copying addresses, conditionally showing elements, plan item cards, and global state updates (e.g., `setUsage`).【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L1-L120】
- **Narrative writer** — `soapcr.com/public/proversion/soapcrpro/writepcrpro.js` contains 5,600 lines of output rules, mapping every checkbox, text field, and dropdown to the final SOAP narrative with contextual punctuation and phrasing.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L1-L160】
- **Field map artifacts** — Generated references in `docs/field-map.json` enumerate which writer function consumes each field. Tables in `docs/source-analysis.md` present the same data in Markdown for human review. Dropdown vocabularies are captured in `docs/dropdown-options.json` to guarantee menu parity.

## 2. Functional Requirements for Parity

1. **UI equivalence**
   - Recreate all Subjective, Objective, Assessment, and Plan inputs, preserving checkbox groups, free-text areas, dropdowns, and dynamic sub-panels (e.g., Assessment Specific tables) from the legacy HTML.【F:soapcr.com/index.html†L160-L320】
   - Maintain header/menu interactions and dual-banner placement so the modernization feels familiar.
2. **State & validation**
   - Mirror age/sex synchronization, address copying, and conditional visibility logic from `soapcrpro.js`. Ensure RHF/Zustand equivalents react to blur/change events as the legacy jQuery implementation does.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L1-L120】
3. **Narrative composition**
   - Port every section writer from `writepcrpro.js`, retaining sentence structure, comma handling, and branching logic for options like refusals, transport, or ROS findings.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L1-L160】
   - Guarantee parity for special flows: Pertinent negatives, objective exam subsections, plan templates/cards, refusal protocols, and TOC/transport paragraphs.
4. **Dropdown/catalog coverage**
   - Reuse option lists extracted into `docs/dropdown-options.json` so label/value pairs stay identical to the source UI.
5. **Persistence & tooling**
   - Provide CMS-driven editing (Decap or similar) for section JSON definitions, field labels, and narrative phrase templates to enable GUI updates without code changes.
6. **Testing**
   - Build regression tests comparing generated narratives against fixtures captured from the legacy output. Include jsdom-powered DOM snapshots and data-driven test vectors covering every writer function.

## 3. Implementation Phases

### Phase 0 — Repository Hygiene & Content Capture
- Normalize repository layout (`legacy/` vs `modern/` directories) and document run instructions.
- Convert extracted artifacts (`field-map.json`, `dropdown-options.json`) into automated data generation scripts for future refreshes.

### Phase 1 — Data Model & CMS Schema
- Design JSON schema for sections/fields mirroring the legacy IDs, control types, and option lists.
- Configure Decap CMS collections for Subjective, Objective, Assessment, and Plan definitions, ensuring GUI edits feed the same schema consumed by the app.

### Phase 2 — Modern UI Shell
- Implement Next.js app shell with global menu/banner components, responsive layout, and Zustand store representing all legacy toggles/state.
- Render sections dynamically from the JSON schema, supporting grouped checkboxes, nested accordions, and conditional visibility metadata.

### Phase 3 — Interaction Logic Parity
- Rebuild helper hooks for address sync, birthdate/age calculation, gender mirroring, and condition-driven field display based on the legacy jQuery behaviors.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L1-L120】
- Implement What3Words/GPS linking placeholders (legacy API calls) with stubs or progressive enhancement.

### Phase 4 — Narrative Engine Port
- Translate each `write*` function into modular TypeScript services that consume form state and emit narrative fragments while preserving punctuation helpers (`addComma`, `addReturn`, etc.).【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L1-L160】
- Ensure plan cards and assessment-specific modules map to the same output text as in the legacy writer.

### Phase 5 — Regression Harness
- Capture golden narratives from the static site for varied scenarios (transport, refusal, pediatrics, etc.).
- Author Jest/Vitest suites that feed identical input payloads into the new engine and assert string equality.
- Integrate snapshot tests for UI renderings and interactions.

### Phase 6 — Deployment & QA
- Configure build pipeline (e.g., Vercel/Netlify) with CMS backend, environment secrets, and Cloudflare Access compatibility.
- Conduct manual QA using checklists derived from `docs/source-analysis.md` to confirm every field impacts the narrative as expected.

## 4. Gap Analysis & Additional Tasks

- **Insurance/Incident removal impacts** — Confirm which legacy sections are intentionally omitted in the modern build and update narrative writer accordingly to avoid referencing missing inputs.
- **Plan templates** — Map `PlanItems` definitions from `soapcrpro.js` into CMS data to retain quick-add treatment bundles.【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L1-L80】
- **Objective exam tables** — Ensure each exam subsection (Neuro, Respiratory, Assessment Specific variants) supports multiple simultaneous findings with accurate grammar.
- **Pertinent negatives & denials** — Validate that every “denies” checkbox toggles the correct phrase order in the Subjective narrative.【F:soapcr.com/public/proversion/soapcrpro/writepcrpro.js†L700-L760】
- **Export & printing** — Preserve print-ready styling and the ability to copy/export the narrative text area contents verbatim.
- **Analytics & tracking** — Decide whether to keep or replace Google Analytics events triggered throughout the legacy code.

## 5. Verification Checklist Before Launch

1. Re-run automated extraction scripts to confirm no fields/options are missing compared to the legacy HTML.
2. Execute full regression tests; any mismatches trigger a diff review of helper utilities vs. legacy writer.
3. Perform manual QA across all section tabs, verifying UI show/hide logic, synchronized fields, and plan card behaviors.
4. Validate CMS editing workflow: update a field label/phrase in the GUI and confirm the change appears in both UI and generated narrative.
5. Smoke-test deployment behind Cloudflare Access to ensure authenticated users reach the app and data flows persist.

Adhering to this plan and checklists ensures the rebuilt application attains full parity with SOAPCR.com/MatchCloud while positioning the project for future enhancements like automated mileage calculations and GPT-assisted phrasing.
