import { expect, test } from '@playwright/test';
import { BRAND } from '../helpers/content';
import { waitForOk, waitForRequestOk } from '../helpers/propagation';

const samplePaths = ['/', '/conservation', '/music', '/about', '/gallery', '/news', '/contact'] as const;

test.describe('J-SEO-01 technical SEO', () => {
  for (const path of samplePaths) {
    test(`head tags on ${path}`, async ({ page }) => {
      await waitForOk(page, path);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).toMatch(new RegExp(BRAND));

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      const href = await canonical.getAttribute('href');
      expect(href).toBeTruthy();
      if (path === '/') {
        expect(href!).toMatch(/^https?:\/\//);
      } else {
        expect(href!).not.toMatch(/\/$/);
        expect(href!).toContain(path);
      }

      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    });
  }

  test('style-guide is noindex and omitted from sitemap', async ({ page, request }) => {
    await waitForOk(page, '/style-guide');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/i);

    const robots = await waitForRequestOk(request, '/robots.txt');
    expect(await robots.text()).toMatch(/Disallow:\s*\/style-guide/i);

    const index = await waitForRequestOk(request, '/sitemap-index.xml');
    const indexXml = await index.text();
    const locMatches = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    expect(locMatches.length).toBeGreaterThan(0);

    let combined = indexXml;
    for (const loc of locMatches) {
      if (!/sitemap/i.test(loc)) continue;
      const childPath = new URL(loc).pathname;
      const child = await waitForRequestOk(request, childPath);
      combined += await child.text();
    }

    expect(combined).not.toMatch(/\/style-guide/i);
    expect(combined).toMatch(/\/conservation\/?/);
    expect(combined).toMatch(/\/music\/?/);
  });
});
