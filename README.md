# automatic-octo-pancake

This repository houses the archived SOAPCR.com narrative generator (now hosted at MatchCloud.net) alongside modernization artifacts and parity plans.

## Repository layout

```
legacy/soapcr/    # Archivarix export of the original SOAP narrative generator
modern/           # Next.js workspace powering the modernization effort
docs/             # Parity analysis, field inventories, and modernization roadmap
```

### Legacy snapshot
- The complete static export now lives in [`legacy/soapcr`](legacy/soapcr) so it can be referenced during parity work or served as-is for regression capture.
- Open [`legacy/soapcr/index.html`](legacy/soapcr/index.html) in a browser to run the archived generator locally.

### Modernization workspace
- The React/Next.js implementation lives inside [`modern/`](modern) following the phased plan in [`docs/modernization-plan.md`](docs/modernization-plan.md).
- The initial scaffold provides the header, navigation, overlay mask, and content-driven section placeholders that future phases will wire to the narrative engine and CMS.

## Documentation
- [`docs/comprehensive-parity-strategy.md`](docs/comprehensive-parity-strategy.md) — exhaustive source analysis and execution roadmap for recreating the app with full narrative parity.
- [`docs/source-analysis.md`](docs/source-analysis.md) — line-by-line field mapping tables extracted from the legacy writer.
- [`docs/field-map.json`](docs/field-map.json) — machine-readable catalog of every field consumed by the writer.
- [`docs/dropdown-options.json`](docs/dropdown-options.json) — canonical dropdown value sets for UI parity.

Refer to the parity strategy for phased modernization tasks, regression expectations, and upcoming enhancements (mileage automation, GPT-assisted phrasing, etc.).
