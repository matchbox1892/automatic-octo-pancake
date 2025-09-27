# Copilot Instructions for MatchCloud EMS Narrative Generator

## Big Picture Architecture
- The repository contains two main apps:
  - `soapcr.com/`: Legacy static export (HTML, jQuery, CSS) captured via Archivarix CMS. Entry point: `index.html`.
  - `modern-app/`: Next.js 14 + React + Tailwind rebuild. Entry point: `app/` directory. Modernized, component-driven SOAP narrative studio.
- Modernization plan and rationale are documented in `docs/modernization-plan.md`.
- All dynamic content (form sections, narrative templates) is stored as JSON in `content/sections/` and `content/narratives/`.
- State management uses Zustand; forms use React Hook Form + Zod schemas.
- Narrative generation uses Handlebars templates for configurable output.

## Developer Workflows
- **Build:**
  - `cd modern-app && npm install && npm run build` (production)
  - `npm run dev` (development server)
- **Lint:** `npm run lint` (ESLint/TypeScript)
- **Test:** `npm run test` (Vitest; includes parity checks against legacy generator)
- **Debug:** Use the DebugPanel component in-app for real-time state and modernization checkpoints.

## Project-Specific Conventions
- All form and narrative content is defined in JSON/YAML under `content/`. Editors should update these files, not hardcode options in components.
- UI primitives (phase tracker, section renderer, preview) live in `modern-app/components/`.
- All business logic (form schema, store, narrative rendering) is in `modern-app/lib/`.
- Legacy jQuery logic is centralized in `soapcr.com/public/proversion/soapcrpro/soapcrpro.js` and `soapcr.com/public/includes/header.js`.
- Functional parity with the legacy generator is required before shipping enhancements.

## Integration Points
- Future GUI editing via Decap (Netlify) CMS at `/admin` (see modernization plan).
- Narrative export must match legacy output for ePCR compatibility.
- Authentication/session flow is planned to be preserved (Cloudflare Access or similar).

## Examples
- To add a new SOAP section: create a JSON file in `content/sections/`, update form schema in `lib/form-schema.ts`, and add UI in `components/SectionFields.tsx`.
- To update narrative output: edit Handlebars templates in `content/narratives/`, then test with `npm run test`.

## Key Files & Directories
- `modern-app/app/` – Next.js App Router entry
- `modern-app/components/` – UI primitives
- `modern-app/lib/` – Business logic
- `modern-app/content/` – Section definitions & narrative templates
- `soapcr.com/` – Legacy static export
- `docs/modernization-plan.md` – Migration strategy

---
For more details, see the README and modernization plan. If conventions or workflows are unclear, ask for clarification or review the referenced files.