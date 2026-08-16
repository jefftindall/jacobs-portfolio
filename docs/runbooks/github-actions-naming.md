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
4. Do **not** add `terraform.yml`. Lint/plan live in `CI: static analysis`.

## Current inventory

| File | Display `name:` | Trigger |
|------|-----------------|---------|
| [`static-analysis.yml`](../../.github/workflows/static-analysis.yml) | `CI: static analysis` | PR + push `main` |
| [`azure-static-web-apps.yml`](../../.github/workflows/azure-static-web-apps.yml) | `CD: main` | push `main` + dispatch; **skipped until Azure OIDC vars exist** |

Filenames are legacy (same as the sister repo). Rename later if needed; GitHub treats a file rename as a new workflow.
