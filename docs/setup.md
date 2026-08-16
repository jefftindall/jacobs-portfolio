# Initial setup

Local development first. **Do not run `terraform apply` unless Jeff asks.** Staging and prod Azure exist in Jacob’s subscription; custom domain cutover is [`runbooks/custom-domain.md`](runbooks/custom-domain.md).

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
5. Production custom domain (`jaketindall.com`): follow [`docs/runbooks/custom-domain.md`](runbooks/custom-domain.md) **before** merging a `custom_domain` change to `main` (CD applies prod Terraform)
6. CD workflow (`.github/workflows/azure-static-web-apps.yml`) deploys on merge to `main`. Terraform apply jobs run only when `infra/` changed; otherwise they skip. Staging must pass **Verify Staging** (Playwright smoke + journeys) before prod. See [`docs/runbooks/testing-strategy.md`](runbooks/testing-strategy.md).

Merges to `main` go through a pull request. The **Protect main** ruleset requires CI jobs to pass; CI does not re-run on `main` after merge.

Studio, Gemini, inquiry forms, Turnstile, and GA4 wait for a later phase.

## Do not share Elyse’s Azure resources

Do not point this repo at `stelysetfstateeu2`, `kv-elyse-*`, or her GitHub App. Jacob gets his own bootstrap.
