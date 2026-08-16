import { expect, test } from '@playwright/test';
import { BRAND, conservationNotes, musicNotes, newestNewsPost } from '../helpers/content';
import { expectContactMailtoNotForm, isStaticWebAppHost, waitForOk, waitForRequestOk } from '../helpers/propagation';

const conservation = conservationNotes();
const music = musicNotes();
const latestNews = newestNewsPost();

test.describe('public smoke', () => {
  test('home shows brand and conservation/music journeys', async ({ page }) => {
    await waitForOk(page, '/');
    await expect(page.getByRole('heading', { name: BRAND, level: 1 })).toBeVisible();
    const hero = page.getByRole('region', { name: BRAND });

    await hero.getByRole('link', { name: 'Conservation', exact: true }).click();
    await expect(page).toHaveURL(/\/conservation\/?$/);
    await expect(page.getByRole('heading', { name: 'Conservation', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: conservation[0]!.title })).toBeVisible();

    await page.goto('/');
    await page.getByRole('region', { name: BRAND }).getByRole('link', { name: 'Music', exact: true }).click();
    await expect(page).toHaveURL(/\/music\/?$/);
    await expect(page.getByRole('heading', { name: 'Music', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: music[0]!.title })).toBeVisible();
  });

  test('conservation landing loads', async ({ page }) => {
    await waitForOk(page, '/conservation');
    await expect(page.getByRole('heading', { name: 'Conservation', level: 1 })).toBeVisible();
  });

  test('music landing loads', async ({ page }) => {
    await waitForOk(page, '/music');
    await expect(page.getByRole('heading', { name: 'Music', level: 1 })).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await waitForOk(page, '/about');
    await expect(page.getByRole('heading', { name: 'About', level: 1 })).toBeVisible();
  });

  test('gallery landing loads', async ({ page }) => {
    await waitForOk(page, '/gallery');
    await expect(page.getByRole('heading', { name: 'Gallery', level: 1 })).toBeVisible();
  });

  test('news landing and latest note', async ({ page }) => {
    await waitForOk(page, '/news');
    await expect(page.getByRole('heading', { name: 'News', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: latestNews.title })).toBeVisible();
  });

  test('contact is mailto, not a stored form', async ({ page }) => {
    await waitForOk(page, '/contact');
    await expect(page.getByRole('heading', { name: 'Contact', level: 1 })).toBeVisible();
    await expectContactMailtoNotForm(page);
  });

  test('robots.txt and sitemap are served', async ({ request }) => {
    const robots = await waitForRequestOk(request, '/robots.txt');
    const robotsText = await robots.text();
    expect(robotsText).toMatch(/Disallow:\s*\/style-guide/i);

    const sitemap = await waitForRequestOk(request, '/sitemap-index.xml');
    expect(sitemap.headers()['content-type'] ?? '').toMatch(/xml/i);
    const sitemapText = await sitemap.text();
    expect(sitemapText).toMatch(/sitemap/i);
    expect(sitemapText).not.toMatch(/\/style-guide/i);
  });

  test('API health stub responds', async ({ request }) => {
    test.skip(!isStaticWebAppHost(), 'Azure Functions exist only on deployed SWA hosts');
    const health = await waitForRequestOk(request, '/api/health');
    const body = await health.json();
    expect(body).toEqual({ ok: true });
  });
});
