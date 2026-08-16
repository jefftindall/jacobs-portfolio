# Initial setup

Local development first. **Do not run `terraform apply` unless Jeff asks.** Azure scaffolding is copied from the family portfolio pattern and renamed for Jacob; it is not provisioned yet.

## Local (Jacob + Jeff)

Prerequisites: Node.js >= 22.12.

```bash
copy .env.example .env
```

Set `SITE_CONTACT_EMAIL` to a **parent-managed** address. Never commit `.env`.

```bash
npm install
npm run dev
```

Site: [http://localhost:4321](http://localhost:4321).

```bash
npm run lint
npm run build
```

Work on a branch. Jeff reviews `main`.

## Azure later (Jeff only)

Same subscription and region as the sister site (`eastus2`), **separate** resource names and tfstate:

| Piece | Jacob name |
|-------|------------|
| Tfstate RG / account | `rg-jacob-tfstate` / `stjacobtfstateeu2` |
| State keys | `jacobs-portfolio/staging.tfstate`, `jacobs-portfolio/prod.tfstate` |
| App RGs | `rg-jacob-portfolio-staging`, `rg-jacob-portfolio-prod` |
| Key Vaults | `kv-jacob-staging`, `kv-jacob-prod`, `kv-jacob-shared` |
| SWA | `swa-jacob-portfolio-staging`, `swa-jacob-portfolio-prod` |
| GitHub repo | `jefftindall/jacobs-portfolio` (numeric id `1336264113`) |

When Jeff is ready:

1. `az login` and set the subscription
2. `cd infra/bootstrap` → `terraform init` / `plan` / `apply` (local state — back it up; it is gitignored). Bootstrap does **not** look up staging/prod GitHub Actions apps — those do not exist yet.
3. Apply `infra/environments/staging`, then `prod` (each grants its own GHA identity on `kv-jacob-shared`)
4. Put `SITE-CONTACT-EMAIL` in `kv-jacob-shared` (not in git)
5. Leave custom domain empty until a real hostname exists
6. CD workflow (`.github/workflows/azure-static-web-apps.yml`) stays skipped until GitHub OIDC vars exist

Studio, Gemini, inquiry forms, Turnstile, and GA4 wait for a later phase.

## Do not share Elyse’s Azure resources

Do not point this repo at `stelysetfstateeu2`, `kv-elyse-*`, or her GitHub App. Jacob gets his own bootstrap.
