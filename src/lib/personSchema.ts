import { site } from './site';

export function buildPersonJsonLd(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const person: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url,
    jobTitle: site.jobTitle,
    description: site.description,
    knowsAbout: site.knowsAbout,
    sameAs: site.sameAs,
  };

  return { ...person, ...overrides };
}
