import { expect, type APIRequestContext, type Page } from '@playwright/test';

export const PROPAGATION_DEADLINE_MS = 4 * 60 * 1000;
export const PROPAGATION_POLL_MS = 5_000;

/** True when BASE_URL targets a deployed Azure Static Web App (API routes exist). */
export function isStaticWebAppHost(): boolean {
  const base = process.env.BASE_URL ?? '';
  return /\.azurestaticapps\.net/i.test(base) || /jaketindall\.com/i.test(base);
}

/** Wait until the host serves HTTP 2xx/3xx for a path (SWA CDN propagation). */
export async function waitForOk(page: Page, path: string) {
  const deadline = Date.now() + PROPAGATION_DEADLINE_MS;
  let lastStatus = 0;
  let lastError = '';
  while (Date.now() < deadline) {
    try {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      lastStatus = response?.status() ?? 0;
      if (lastStatus >= 200 && lastStatus < 400) return response!;
      lastError = `HTTP ${lastStatus}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
    await page.waitForTimeout(PROPAGATION_POLL_MS);
  }
  throw new Error(`Timed out waiting for ${path} (last: ${lastError || lastStatus})`);
}

/** Poll until a request returns HTTP 2xx/3xx (for assets/API without navigation). */
export async function waitForRequestOk(
  request: APIRequestContext,
  path: string,
  options?: { maxRedirects?: number },
) {
  const deadline = Date.now() + PROPAGATION_DEADLINE_MS;
  let lastStatus = 0;
  let lastError = '';
  while (Date.now() < deadline) {
    try {
      const response = await request.get(path, options);
      lastStatus = response.status();
      if (lastStatus >= 200 && lastStatus < 400) return response;
      lastError = `HTTP ${lastStatus}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
    await new Promise((resolve) => setTimeout(resolve, PROPAGATION_POLL_MS));
  }
  throw new Error(`Timed out waiting for ${path} (last: ${lastError || lastStatus})`);
}

export function expectMailto(href: string | null) {
  expect(href, 'expected mailto link').toBeTruthy();
  expect(href!).toMatch(/^mailto:/i);
}
