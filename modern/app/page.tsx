import Banner from '../components/Banner';
import { sections } from '../lib/content';

export default function Page() {
  return (
    <div>
      <Banner variant="panel" />
      <article>
        <h2>Phase 1 — Form Builder Scaffolding</h2>
        <p>
          The modernization workspace is now ready for the iterative rebuild of the SOAP narrative generator. Upcoming phases
          will introduce form definitions, field editors, and narrative rendering that mirror the legacy site while exposing
          configuration via a friendly GUI.
        </p>
        <p>
          Use the navigation menu to explore planned sections and track development checkpoints as the modern app reaches
          feature parity with the historical SOAPCR workflow.
        </p>
        {sections.map((section) => (
          <section key={section.id} id={section.id} style={{ marginTop: '2.5rem' }}>
            <h3>{section.title}</h3>
            {section.description && <p>{section.description}</p>}
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {section.fields.map((field) => (
                <label key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{field.label}</span>
                  {field.type === 'textarea' ? (
                    <textarea
                      placeholder={field.placeholder}
                      rows={4}
                      style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #cbd5f5' }}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #cbd5f5' }}
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}
