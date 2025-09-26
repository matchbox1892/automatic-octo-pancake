# MatchCloud EMS Narrative Generator Archive

This repository tracks the static export of the narrative generator that originated on SOAPCR.com and is now hosted at MatchCloud.net.  The files were captured with the Archivarix CMS and the website assets live under [`soapcr.com/`](soapcr.com/) within this repository, including the HTML entry point, jQuery dependencies, and the JavaScript/CSS bundles that power the report builder.

## Repository layout
- `soapcr.com/index.html` – Main landing page for the generator UI (now streamlined for SOAP-only narratives).
- `soapcr.com/public/` – Supporting images, scripts, and styles used by the legacy interface.
- `soapcr.com/favicon-*.png` – Favicon set referenced by the original site.
- `modern-app/` – Next.js + Tailwind rebuild that delivers the modernized SOAP narrative studio with live preview, GUI-friendly content, and automated tests.

## Modern rebuild strategy
The legacy site is driven by a single HTML document and jQuery helpers, which makes customization and UI refreshes difficult. A
 detailed modernization plan that maps out the migration to a React/Next.js stack with a Git-backed GUI editor (Decap/Netlify C
MS) is available in [`docs/modernization-plan.md`](docs/modernization-plan.md). The document covers:

- Current architecture findings (monolithic DOM, jQuery event handlers, authentication utilities).
- Recommended technology stack (Next.js, Tailwind, React Hook Form, Zustand, Handlebars-based narrative templates).
- A GUI editing workflow powered by a `/admin` CMS that writes YAML/JSON configuration to version control.
- Functional parity checkpoints ensuring the rebuilt experience duplicates every checkbox-driven workflow that feeds the SOAP n
arrative engine.
- A phased roadmap for rebuilding the application while keeping feature parity with the existing generator and outlining future
 enhancements such as automated mileage calculation to Meritus Medical Center and optional GPT-powered grammar refinement.

Use the plan as the source of truth while duplicating the MatchCloud narrative generator in a modern, easily customizable forma
t.

## Modern App quick start

The `modern-app/` directory contains the active rebuild described in the strategy document.

```bash
cd modern-app
npm install
npm run dev
```

Key folders:

- `content/sections/` – JSON definitions for each SOAP section used to render the dynamic forms.
- `content/narratives/` – Handlebars templates that shape the generated narrative text.
- `components/` – Reusable UI primitives (phase tracker, section renderer, narrative preview, debug panel).
- `lib/` – Form schemas, Zustand store, content loader, and narrative rendering utilities.
- `app/` – Next.js App Router entry point powering the new UI.

### GUI content editing

To allow non-developers to tailor checkbox labels, prompts, and narrative wording, the modern app ships with a Decap (Netlify) CMS instance at `/admin`.

1. Run the development server and local CMS backend:

   ```bash
   cd modern-app
   npm install
   npm run cms
   npm run dev
   ```

2. Visit `http://localhost:3000/admin` to open the editor. The CMS surfaces the SOAP section JSON files and the narrative templates. Editors can add/remove fields, tweak option labels, and rewrite Handlebars templates without touching source code. Changes are committed back to Git so they can be reviewed like any other code change.

Media assets uploaded through the CMS are stored under `modern-app/public/uploads/` and served from `/uploads` when the Next.js app is deployed.

### Quality gates

- `npm run lint` – ESLint/TypeScript validation through Next.js.
- `npm run test` – Vitest coverage for narrative rendering plus a parity check against the archived legacy SOAP generator.
- Real-time debug panel and modernization checkpoints inside the app ensure each phase is functioning before moving forward.
