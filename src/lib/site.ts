function requiredSiteEnv(name: 'SITE_CONTACT_EMAIL', fromMeta: string | undefined): string {
  const value = String(process.env[name] ?? fromMeta ?? '').trim();
  if (!value) {
    throw new Error(
      `${name} must be set (local .env). Copy .env.example to .env and add a parent contact email. Never commit the real value.`,
    );
  }
  return value;
}

function siteUrl(): string {
  const raw = String(process.env.SITE_URL ?? import.meta.env.SITE_URL ?? 'http://localhost:4321').trim();
  return (raw || 'http://localhost:4321').replace(/\/$/, '');
}

export const site = {
  name: 'Jacob Tindall',
  tagline: 'Marine mammal conservation and music',
  jobTitle: 'Conservation & Music',
  url: siteUrl(),
  email: requiredSiteEnv('SITE_CONTACT_EMAIL', import.meta.env.SITE_CONTACT_EMAIL),
  shortBio:
    'Jacob Tindall cares about protecting marine mammals — especially dolphins and manatees — and about making music at the piano.',
  description:
    'Jacob Tindall’s personal site: marine mammal conservation (dolphins and manatees), piano, and music composition.',
  knowsAbout: [
    'Marine mammal conservation',
    'Dolphins',
    'Manatees',
    'Piano',
    'Music composition',
  ],
};

export { nav } from './nav';
