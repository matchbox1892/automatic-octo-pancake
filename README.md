# MatchCloud EMS Narrative Generator Archive

This repository tracks the static export of the narrative generator that originated on SOAPCR.com and is now hosted at MatchCloud.net.  The files were captured with the Archivarix CMS and the website assets live under [`soapcr.com/`](soapcr.com/) within this repository, including the HTML entry point, jQuery dependencies, and the JavaScript/CSS bundles that power the report builder.

## Repository layout
- `soapcr.com/index.html` – Main landing page for the generator UI.
- `soapcr.com/public/` – Supporting images, scripts, and styles used by the legacy interface.
- `soapcr.com/favicon-*.png` – Favicon set referenced by the original site.

## Next steps
1. Review the UI assets inside `soapcr.com/public/` to identify the components that need to be restyled or removed.
2. Modernize the layout (for example by introducing a design system or updating to a newer CSS framework).
3. Customize the narrative templates and protocol language so they match your EMS workflow.

With the archived source now version-controlled, future changes can be developed locally, tested, and pushed through pull requests.
