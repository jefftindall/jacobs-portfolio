# Runbook: testing strategy (staging → production)

Post-deploy Playwright checks for Jacob’s public site. CI (`npm run lint` / **CI: static analysis**) stays the PR merge gate and does **not** run these suites.

## What runs today

| Layer | When | Command / job | What it validates |
|-------|------|---------------|-------------------|
| CI: static analysis | Every PR to `main` | `npm run lint` | Terraform, Astro check, API syntax, Actions secret-safety |
| Terraform plan | PRs touching `infra/` | CI **Plan staging/prod** | Infra diff review |
| **Build release** | App or infra change on `main` | Job **Build release** | One `npm run build`; same artifact to staging and prod |
| **Verify Staging** | After staging deploy | `npm run test:smoke` then `npm run test:journey` | Landings + visitor journeys (desktop + mobile). **Blocks production.** |
| **Smoke Production** | After prod deploy | `npm run test:smoke` | Major landings and a short home → conservation/music hop. No auto-rollback. |

Terraform apply jobs run only when `infra/**` or the CD workflow file changed. Docs-only pushes skip CD.

## Layout

```
tests/
  helpers/
    content.ts       # Slugs/titles from src/content; nav from src/lib/nav.ts
    propagation.ts   # waitForOk — SWA CDN propagation polling
  smoke/
    public.spec.ts   # Landings, mailto contact, robots/sitemap, API health
  journeys/
    visitor.spec.ts  # VISIT-01 … VISIT-09
    seo.spec.ts      # J-SEO-01

playwright.smoke.config.ts
playwright.journey.config.ts
```

### Smoke (`npm run test:smoke`)

Home (hero CTAs into conservation and music), conservation, music, about, gallery, news, contact (mailto, no form), `robots.txt` + sitemap (no `/style-guide`), `/api/health` on SWA hosts. Desktop + mobile.

### Journeys (`npm run test:journey`)

| ID | Flow |
|----|------|
| `VISIT-01` | Home → conservation notes → back to index |
| `VISIT-02` | Home → music notes → back to index |
| `VISIT-03` | Home → news list → latest article |
| `VISIT-04` | About → gallery |
| `VISIT-05` | Gallery image + tag filter |
| `VISIT-06` | Primary nav from home |
| `VISIT-07` | Mobile menu → conservation (`@mobile`) |
| `VISIT-08` | Footer privacy → contact; footer terms |
| `VISIT-09` | Contact is parent-mediated mailto (no form) |
| `J-SEO-01` | Title/canonical/description on landings; style-guide noindex and omitted from sitemap |

## Local

```powershell
npx playwright install chromium
npm run preview
# another terminal:
$env:BASE_URL = "http://localhost:4321"
npm run test:smoke
npm run test:journey
```

Keep suites aligned with public pages — see [`.cursor/rules/post-deploy-tests.mdc`](../../.cursor/rules/post-deploy-tests.mdc).
