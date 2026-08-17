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

export const socials = {
  soundcloud: {
    label: 'SoundCloud',
    href: 'https://soundcloud.com/jacob-tindall-official',
  },
  facebook: {
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Jacob-Tindall/pfbid05jcM6JwUeou1SQDT17QiWTRKDSJPWhmHoZfGdT9i4F45MPwm3WRhyxkt7MR5Hd1cl/',
  },
} as const;

export const soundcloud = {
  ...socials.soundcloud,
  tracks: [
    // Newest first (Natures Wedding 2026-03-14, then February 2026 tracks).
    {
      title: 'Natures Wedding',
      href: 'https://soundcloud.com/jacob-tindall-official/natures-wedding',
    },
    {
      title: 'NASCAR',
      href: 'https://soundcloud.com/jacob-tindall-official/untitled-song-1',
    },
    {
      title: 'Battle Cry in C Minor',
      href: 'https://soundcloud.com/jacob-tindall-official/battle-cry-c-minor1',
    },
  ],
} as const;

export const site = {
  name: 'Jacob Tindall',
  tagline: 'Marine mammal conservation and music',
  jobTitle: 'Conservation & Music',
  url: siteUrl(),
  email: requiredSiteEnv('SITE_CONTACT_EMAIL', import.meta.env.SITE_CONTACT_EMAIL),
  shortBio:
    'Jacob Tindall cares about protecting marine mammals — especially dolphins and manatees — and about making music at the piano. He has joined Belize manatee health assessments with Clearwater Marine Aquarium Research Institute.',
  description:
    'Jacob Tindall’s personal site: marine mammal conservation (dolphins and manatees), Belize field work, piano, and music composition.',
  knowsAbout: [
    'Marine mammal conservation',
    'Dolphins',
    'Manatees',
    'Piano',
    'Music composition',
  ],
  sameAs: [socials.soundcloud.href, socials.facebook.href],
};

export { nav } from './nav';
