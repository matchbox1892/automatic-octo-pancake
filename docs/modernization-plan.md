# Modernization Strategy for the SOAPCR / MatchCloud Narrative Generator

## 1. Current-state assessment
The archived site is delivered as a single, monolithic HTML document with inlined CSS and a jQuery-driven interaction layer. It keeps all user interface sections (Incident, Patient, Insurance, SOAP narrative builder, etc.) in one page and toggles them with custom JavaScript helpers such as `hideDiv` and `toggleDiv`. Tables and nested `<div>` containers host every form control, which makes the markup rigid and hard to restyle, while multiple copies of the same structural patterns are duplicated throughout the file. 【F:soapcr.com/index.html†L21-L48】【F:soapcr.com/index.html†L896-L960】

Client-side behaviour depends entirely on legacy jQuery utilities (`$(function() { ... })`, manual DOM traversal, direct event binding) to keep fields in sync, perform calculations, and append additional rows (for example, incident personnel). Shared logic—like copying addresses between sections, calculating a patient age, handling assessment-specific toggles, or cloning the banner—is centralized in `soapcrpro.js`. Authentication state, menu interactions, and session timeouts are handled in `header.js`, with DOM selectors hard-coded against the original IDs. 【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L1-L199】【F:soapcr.com/public/includes/header.js†L1-L165】

Because the entire data model is implicit in DOM IDs (`txtInc_personnel0001_name`, `ddlInc_disposition`, etc.) instead of serialized configuration, every content change requires editing HTML or JavaScript directly. There is no structured content source that a non-technical editor can modify through a friendly GUI. 【F:soapcr.com/index.html†L650-L706】【F:soapcr.com/public/proversion/soapcrpro/soapcrpro.js†L163-L168】

## 2. Target experience
We want a responsive application that:
- Mirrors the existing report builder workflow (Incident → Patient → SOAP/CHART narrative → Export) while using modern component architecture.
- Supports theme and layout overrides without touching DOM selectors directly.
- Lets narrative text blocks, pick-list options, and protocol templates be edited by EMS staff in a secure, browser-based GUI.
- Captures state in a predictable store that can be exported as printable narrative text or JSON for downstream systems.
- Duplicates the checkbox- and select-driven UX that currently produces the SOAP narrative so existing crews can generate reports without retraining.

## 3. Proposed architecture
| Concern | Decision | Rationale |
| --- | --- | --- |
| Framework | **Next.js 14 with React and TypeScript** | Provides hybrid static/SSR rendering for future dynamic needs, routing out-of-the-box, and rich developer tooling. |
| Styling | **Tailwind CSS + Headless UI** for utility-driven layout plus a small design token file for colours/spacing | Rapid theming and responsive behaviour without manually maintaining large CSS files. |
| Form handling | **React Hook Form + Zod schemas** | Keeps complex, nested form state declarative, enables validation logic, and simplifies export of structured data. |
| State management | **Zustand store** | Lightweight global store for multi-section synchronization (e.g., subject/patient syncs) without Redux boilerplate. |
| Content storage | **Git-backed YAML/JSON files** | Each section’s prompts/options live as structured data (e.g., `content/incident.yaml`) that can be version-controlled and edited through a CMS. |
| Narrative generation | **Template engine using Handlebars** | Allows configurable narrative sentences with conditionals and loops tied to the structured form data. |
| Testing | **Playwright for E2E + Jest/Testing Library for units** | Ensures parity with the existing workflow, including regression coverage for exports and section toggles. |
| Build tooling | **Vite within Next.js** (default) + ESLint/Prettier | Modern DX and consistent formatting. |

## 4. GUI content editing strategy
1. **Adopt Decap (Netlify) CMS** as an authenticated, Git-based admin UI served from `/admin`. The CMS reads and writes YAML/Markdown files in a `content/` directory, which keeps the editing workflow within the repository while providing a friendly GUI.
2. Configure collections for each configurable aspect of the app:
   - `incident` (response codes, disposition options, mileage labels).
   - `patient` (demographics, consent wording, vital sign prompts).
   - `assessments` (OPQRST, SAMPLE, treatment protocols).
   - `narrativeTemplates` (SOAP, CHART, custom macros).
3. Editors can log into `/admin` via Git provider (GitHub or GitLab). CMS commits updates automatically, ensuring full history and easy rollback.
4. The Next.js app loads the structured content at build time (`getStaticProps`) and hydrates client-side stores so that UI widgets render options dynamically.
5. Provide a “Preview Mode” in the CMS that renders the React components with live data, giving editors immediate visual feedback.

This approach avoids hosting another external CMS while satisfying the GUI requirement. If a self-hosted database-backed solution is preferred, the same content model can be implemented in Directus or Strapi with minimal code changes because the front-end reads from a typed interface.

## 5. Functional parity goals
The rebuilt application must match today’s feature set before any enhancements ship:

- **Full narrative coverage:** Every checkbox, radio button, select list, and free-text box from the legacy generator maps to a React component with the same default values, validation, and conditional visibility. Narrative templates must consume the same inputs so the generated SOAP text remains identical unless intentionally reworded.
- **Dynamic list behaviour:** Personnel tables, vitals, medications, and interventions still support add/remove row actions, autosorted timestamps, and cloning patterns present in `soapcrpro.js`. Unit tests should cover the transformation from UI selections into structured narrative data.
- **Export fidelity:** Provide “Copy narrative,” printable report layouts, and CSV/JSON exports that mirror the Archivarix build so reports can be pasted into existing ePCR systems without formatting adjustments.
- **Authentication & session flow:** Preserve the login-gated experience (Cloudflare Access or future identity provider) and carry over session timeout warnings, ensuring the tool remains private while preventing data loss.

## 5. Data model blueprint
Each section will have a normalized schema. Example YAML structures:

```yaml
# content/incident.yaml
responseCodes:
  - id: emergent
    label: Emergent
  - id: nonEmergent
    label: Non-emergent
transportCodes:
  - id: code2
    label: Code 2
  - id: code3
    label: Code 3
mileagePrompts:
  - id: responding
    label: At Responding
  - id: scene
    label: At Scene
  - id: destination
    label: At Destination
  - id: other
    label: At Other
    requiresDescription: true
```

```yaml
# content/narratives/soap.yaml
sections:
  - id: subjective
    heading: Subjective Information
    template: |
      {#if chiefComplaint}Chief Complaint: {{chiefComplaint}}. {/if}
      {{subjectiveNotes}}
  - id: objective
    heading: Objective Information
    template: |
      Primary Impression: {{primaryImpression}}.
      Vital Signs: {{#each vitals}}{{this.time}} - {{this.summary}}; {{/each}}
```

The React application will load these documents through a typed content loader, automatically rendering forms and narrative outputs based on metadata rather than hard-coded DOM IDs.

## 6. UI/UX modernization themes
- **Responsive layout:** Replace table-based grids with CSS Grid and flexbox layouts; collapse long sections into accordion panels to reduce scrolling.
- **Component library:** Build reusable primitives (Section, FieldGroup, NarrativePreview) that consume the structured content and can be themed globally.
- **Accessibility:** Use semantic HTML inputs, aria attributes, and keyboard navigation, something the current nested tables hinder.
- **User feedback:** Display inline validation, autosave status, and summary cards (e.g., incident quick view) using toast/snackbar components.
- **Export workflows:** Provide PDF/print exports via browser print styles and a “Copy narrative” button tied to the template engine output.

## 6. Migration roadmap
1. **Inventory** – Catalogue current fields, options, and business rules by exporting them into structured YAML/JSON (can be scripted by parsing the existing DOM or manually curated).
2. **Set up Next.js workspace** – Initialize the new app (`modern-app/`), configure TypeScript, Tailwind, ESLint, Prettier, Jest, and Playwright.
3. **Build content loader** – Implement a content abstraction (`loadContent('incident')`) that loads YAML/JSON and exposes typed interfaces.
4. **Create base components** – Section accordion, multi-step navigation, form field components (text, select, checkbox groups), and narrative preview panel.
5. **Wire up form state** – Mirror existing behaviours (e.g., auto-syncing ages, address copy) as React effects using the structured store.
6. **Integrate CMS** – Add `/admin` with Decap CMS configuration, define collections, and document the editing workflow.
7. **Feature parity testing** – Use Playwright to script end-to-end flows (build a report, add personnel, export narrative) and compare outputs with the legacy generator.
8. **Styling + theming** – Apply updated typography and colour tokens to match MatchCloud branding, and ensure dark-mode readiness if desired.
9. **Deployment** – Configure Vercel (for Next.js) or similar hosting with preview environments on pull requests. Set up CI to run lint/tests and build the static export.
10. **Cutover** – Run side-by-side UAT with EMS staff, validate narratives, then update DNS to point to the modern build.

## 7. Deliverables checklist
- `modern-app/` Next.js project with modular components and narrative engine.
- `content/` directory hosting YAML/JSON data managed via Decap CMS (`/admin`).
- Automated testing suite covering core workflows.
- Documentation for editors (CMS usage, previewing, publishing) and developers (component architecture, data contracts).
- Migration scripts or manual mapping notes aligning every old DOM ID to a new schema key.

## 8. Supporting documentation to add next
- Field inventory spreadsheet exported from the legacy DOM (to drive content creation).
- Narrative template reference mapping current auto-generated phrasing to Handlebars templates.
- CMS user guide with screenshots and role-based access notes.

## 9. Future enhancements roadmap
Once feature parity is achieved, plan the following incremental upgrades:

1. **Automated mileage calculation:** Integrate the Google Maps Distance Matrix API (or an equivalent provider) to compute round-trip mileage between the incident address and Meritus Medical Center in Hagerstown, MD. Store API credentials in server-side environment variables and surface the calculated mileage as read-only fields that can be overridden manually when required.
2. **AI-assisted narrative polishing:** Add an optional “Refine with GPT” action that submits the generated SOAP narrative to the OpenAI ChatGPT API for grammar and phrasing suggestions. Respect HIPAA by stripping identifiers before sending any text to the API, log activity for auditing, and give users a diff/preview before accepting the AI-edited copy.
3. **Protocol-localization presets:** Package content bundles (checkbox labels, templates, default vitals ranges) tied to local EMS protocols so agencies can switch configurations without redeploying code.

This roadmap balances modern engineering practices with the requirement for a GUI-driven editing experience, paving the way to reproduce the current MatchCloud narrative generator in a customizable, future-proof stack while leaving space for targeted enhancements like mileage automation and GPT-powered copy support.
