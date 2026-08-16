# Runbook: GitHub Actions naming (Scheme A)

Canonical naming for workflows under [`.github/workflows/`](../../.github/workflows/).

## Scheme A

Filename pattern (target): `<area>-<purpose>[-cadence].yml`

Display `name:` pattern: `"<Area>: <purpose>"`

| Prefix | Area label | Meaning |
|--------|------------|---------|
| `ci-` | `CI` | PR / push checks (no deploy) |
| `cd-` | `CD` | Deploy / promote |
| `ops-` | `Ops` | Reliability, secrets sync |
| `search-` | `Search` | SEO / analytics (not used yet) |
| `maint-` | `Maint` | Housekeeping |

Rules:

1. Prefer Scheme A for every **new** workflow (file + display name).
2. Keep plan IDs out of the Actions display `name:`.
3. Do not use product marketing titles as the workflow `name:`.
4. Do **not** add `terraform.yml`. Lint/plan live in `CI: static analysis` (PR only). Terraform apply lives in `CD: main` and is skipped when `infra/` did not change.

## Current inventory

| File | Display `name:` | Trigger |
|------|-----------------|---------|
| [`static-analysis.yml`](../../.github/workflows/static-analysis.yml) | `CI: static analysis` | **pull_request to `main` only** (merge gate) |
| [`azure-static-web-apps.yml`](../../.github/workflows/azure-static-web-apps.yml) | `CD: main` | push `main` + dispatch; Terraform apply only when `infra/**` changed; **Verify Staging** (smoke + journeys) gates prod; **Smoke Production** after prod deploy |

Filenames are legacy (same as the sister repo). Rename later if needed; GitHub treats a file rename as a new workflow.

## Protect main

The GitHub ruleset **Protect main** is the only path onto `main`: pull request required, linear history, no force-push, required CI checks (**Terraform lint**, **Site check**, **API syntax**, **Actions secret-safety**). Do not add a `push` trigger to CI — those checks already ran on the PR. Jeff may retain an emergency ruleset bypass; do not use it for routine merges.

