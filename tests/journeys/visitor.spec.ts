import { expect, test } from '@playwright/test';
import {
  BRAND,
  conservationNotes,
  galleryHasItems,
  musicNotes,
  newestNewsPost,
  primaryNav,
} from '../helpers/content';
import { expectContactMailtoNotForm, waitForOk } from '../helpers/propagation';

const conservation = conservationNotes();
const music = musicNotes();
const latestNews = newestNewsPost();

test.describe('visitor journeys', () => {
  test('VISIT-01 conservation index to notes', { tag: '@content' }, async ({ page }) => {
    await waitForOk(page, '/');
    await page.getByRole('link', { name: 'Explore conservation' }).click();
    await expect(page).toHaveURL(/\/conservation\/?$/);
    await expect(page.getByRole('heading', { name: 'Conservation', level: 1 })).toBeVisible();

    for (const note of conservation) {
      await page.getByRole('link', { name: note.title }).click();
      await expect(page).toHaveURL(new RegExp(`/conservation/${note.id}/?$`));
      await expect(page.getByRole('heading', { name: note.title, level: 1 })).toBeVisible();
      await page.getByRole('link', { name: /All conservation/i }).click();
      await expect(page).toHaveURL(/\/conservation\/?$/);
    }
  });

  test('VISIT-02 music index to notes', { tag: '@content' }, async ({ page }) => {
    await waitForOk(page, '/');
    await page.getByRole('link', { name: 'Explore music' }).click();
    await expect(page).toHaveURL(/\/music\/?$/);
    await expect(page.getByRole('heading', { name: 'Music', level: 1 })).toBeVisible();

    for (const note of music) {
      await page.getByRole('link', { name: note.title }).click();
      await expect(page).toHaveURL(new RegExp(`/music/${note.id}/?$`));
      await expect(page.getByRole('heading', { name: note.title, level: 1 })).toBeVisible();
      await page.getByRole('link', { name: /All music/i }).click();
      await expect(page).toHaveURL(/\/music\/?$/);
    }
  });

  test('VISIT-03 news list to article', { tag: '@content' }, async ({ page }) => {
    await waitForOk(page, '/');
    await page.getByRole('link', { name: /All news/i }).click();
    await expect(page).toHaveURL(/\/news\/?$/);
    await expect(page.getByRole('heading', { name: 'News', level: 1 })).toBeVisible();

    await page.getByRole('link', { name: new RegExp(latestNews.title, 'i') }).click();
    await expect(page).toHaveURL(new RegExp(`/news/${latestNews.slug}/?$`));
    await expect(page.getByRole('heading', { name: latestNews.title, level: 1 })).toBeVisible();
    await page.getByRole('link', { name: /All news/i }).click();
    await expect(page).toHaveURL(/\/news\/?$/);
  });

  test('VISIT-04 about to gallery', { tag: '@content' }, async ({ page }) => {
    await waitForOk(page, '/about');
    await expect(page.getByRole('heading', { name: 'About', level: 1 })).toBeVisible();
    await page.getByRole('link', { name: /Browse the gallery/i }).click();
    await expect(page).toHaveURL(/\/gallery\/?$/);
    await expect(page.getByRole('heading', { name: 'Gallery', level: 1 })).toBeVisible();
  });

  test('VISIT-05 gallery images and tag filter', { tag: '@content' }, async ({ page }) => {
    test.skip(!galleryHasItems(), 'No gallery markdown yet');
    await waitForOk(page, '/gallery');
    const image = page.locator('[data-gallery] img').first();
    await expect(image).toBeVisible();
    await expect
      .poll(async () => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);

    const filter = page.getByRole('tab').nth(1);
    if (await filter.count()) {
      const firstItem = page.locator('.gallery-item').first();
      await filter.click();
      await expect(filter).toHaveAttribute('aria-selected', 'true');
      await expect(page.locator('.gallery-item:not([hidden])').first()).toBeVisible();
      await expect(firstItem).toBeAttached();
    }
  });

  test('VISIT-06 primary navigation from home', { tag: '@content' }, async ({ page }) => {
    await waitForOk(page, '/');
    await expect(page.getByRole('heading', { name: BRAND, level: 1 })).toBeVisible();

    for (const item of primaryNav) {
      await page.goto('/');
      const nav = page.getByRole('navigation', { name: 'Primary' });
      await nav.getByRole('link', { name: item.label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${item.href.replace('/', '\\/')}\\/?$`));
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    }
  });

  test('VISIT-07 mobile menu to conservation', { tag: ['@content', '@mobile'] }, async ({ page }) => {
    await waitForOk(page, '/');
    const menu = page.locator('details').filter({ hasText: 'Menu' });
    await menu.getByText('Menu', { exact: true }).click();
    await menu.getByRole('link', { name: 'Conservation', exact: true }).click();
    await expect(page).toHaveURL(/\/conservation\/?$/);
    await expect(page.getByRole('heading', { name: 'Conservation', level: 1 })).toBeVisible();
  });

  test('VISIT-08 footer legal and contact', async ({ page }) => {
    await waitForOk(page, '/conservation');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' }).click();
    await expect(page).toHaveURL(/\/privacy\/?$/);
    await expect(page.getByRole('heading', { name: 'Privacy', level: 1 })).toBeVisible();
    await page.getByRole('link', { name: 'contact page' }).click();
    await expect(page).toHaveURL(/\/contact\/?$/);
    await expectContactMailtoNotForm(page);

    await page.goto('/music');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Terms' }).click();
    await expect(page).toHaveURL(/\/terms\/?$/);
    await expect(page.getByRole('heading', { name: /Terms/i, level: 1 })).toBeVisible();
  });

  test('VISIT-09 contact has no visitor form', async ({ page }) => {
    await waitForOk(page, '/contact');
    await expect(page.getByText(/parent-managed/i).first()).toBeVisible();
    await expectContactMailtoNotForm(page);
  });
});
