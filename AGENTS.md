See README.md and docs/ for project guidance.

## Who does what

- **Jacob** builds pages and markdown in Cursor. Local `npm run dev` only.
- **Jeff** owns Azure, secrets, production deploys, and merges to `main`.

Do not `terraform apply`, push deploy tokens, or enable un-gated CD unless Jeff explicitly asks.

## Cursor Cloud

Node >= 22.12 is required. Cloud agent runtime is [`.cursor/environment.json`](.cursor/environment.json): `npm ci` for the root site and `api/`. The `site` terminal starts Astro on port 4321.

### Lint (required before commit)

```bash
npm run lint
```

This mirrors [`.github/workflows/static-analysis.yml`](.github/workflows/static-analysis.yml):

| Check | Local command |
|-------|----------------|
| Terraform fmt + TFLint + validate | `npm run lint:terraform` |
| Astro / TypeScript | `npm run check` |
| API JS syntax | `npm run lint:api` |
| Actions secret-safety | `npm run lint:actions-secrets` |

If Terraform or TFLint is missing, say so — do not skip the gate silently. Do not commit if lint fails.

### Never echo secrets

Never print secret values in workflows, scripts, logs, or commit messages. Full rules: [`.cursor/rules/never-echo-secrets.mdc`](.cursor/rules/never-echo-secrets.mdc).

## Privacy (never publish)

Jacob is a minor. Never add:

- School name, home address, phone, date of birth, family emails
- Friends’ names or photos of other minors
- Gamertags, Discord, or friend lists
- Exact location or travel plans

Fortnite and Minecraft may be mentioned as hobbies without account names. Contact is parent-mediated `SITE_CONTACT_EMAIL` from `.env` — never committed. Do not add analytics, comment systems, accounts, or visitor forms unless Jeff asks. See [`.cursor/rules/kid-privacy.mdc`](.cursor/rules/kid-privacy.mdc).

## Brand

Jacob Tindall: **marine mammal conservation** (dolphins, manatees) and **music** (piano, composition). Do not invent scientific claims. Do not copy theatre / lessons / casting framing from his sister’s site. See [`.cursor/rules/jacob-brand.mdc`](.cursor/rules/jacob-brand.mdc) and [`docs/style-guide.md`](docs/style-guide.md).

## Public site

- Dev: `npm run dev` (Astro, port 4321). Build: `npm run build`.
- Content is markdown under `src/content/` (`conservation`, `music`, `news`, `gallery`, `pages`).
- Adding a markdown file adds a live route (for example `src/content/news/my-update.md` → `/news/my-update`).
- **Removed pages:** if a public URL goes away, add a 301 in [`public/staticwebapp.config.json`](public/staticwebapp.config.json) and the root [`staticwebapp.config.json`](staticwebapp.config.json).

## Azure (Jeff only)

Terraform lives in `infra/` with Jacob resource names and a **separate** tfstate account from Elyse’s site. Do not apply it in this milestone. See [`docs/setup.md`](docs/setup.md).
