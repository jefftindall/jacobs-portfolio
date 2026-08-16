# Jacob Tindall

Personal site for **Jacob Tindall** — marine mammal conservation (dolphins and manatees) and music (piano and composition). Built with Astro so Jacob can edit pages in Cursor. Azure hosting is scaffolded but not applied yet.

This repo follows the same platform pattern as his sister’s site (Astro + Azure Static Web Apps + Terraform), with a different brand and kid-safe agent rules. Studio (voice publishing) is not in this milestone.

## Quick start

You need [Node.js](https://nodejs.org/) 22 or newer.

```bash
copy .env.example .env
# Put a parent contact email in SITE_CONTACT_EMAIL (never commit .env)

npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

### Lint

```bash
npm run lint
```

Run this before every commit. It checks Terraform, the Astro site, the API stub, and GitHub Actions secret-safety.

## How to add a page

| Topic | Folder | Shows up on |
|-------|--------|-------------|
| Conservation | `src/content/conservation/` | `/conservation` |
| Music | `src/content/music/` | `/music` |
| News | `src/content/news/` | `/news` |
| About | `src/content/pages/about.md` | `/about` |
| Photos | `public/images/` + `src/content/gallery/` | `/gallery` |

Copy an existing `.md` file, change the title and body, save, and refresh the browser.

**Work on a branch.** Jeff reviews and merges `main` before anything is public on the internet.

## Documentation

- [AGENTS.md](AGENTS.md) — rules for Cursor (privacy, brand, lint)
- [Initial setup](docs/setup.md) — local first; Azure later (do not apply unless Jeff asks)
- [Brand & UI style guide](docs/style-guide.md) — tokens and type (visual: `/style-guide`)

## Security model (later)

When Azure is applied, only Jeff provisions secrets. Jacob does not deploy. Contact email stays in `.env` / Key Vault, never in git.
