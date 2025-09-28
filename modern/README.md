# Modern Application Workspace

This directory now contains the Next.js-based workspace that will evolve into the modern SOAP narrative generator.

## Getting started

```bash
cd modern
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the foundational layout, banner, and section scaffolding. The main menu, overlay mask, and basic authentication stub demonstrate the component architecture that future phases will extend.

## Structure

- `app/` — Next.js App Router entry point, global layout, and placeholder page rendering the initial section definitions.
- `components/` — Shared UI components including the header, navigation menu, overlay mask, and reusable banner.
- `content/sections/` — JSON-driven field definitions that will ultimately feed the form generator and narrative engine.
- `lib/` — Shared utilities such as the Zustand-powered menu store, authentication stub, and content loader.

See [`docs/modernization-plan.md`](../docs/modernization-plan.md) for the full roadmap that will layer on CMS editing, form logic, and narrative rendering.
