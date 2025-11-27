import { test, expect } from '@playwright/test';

test.describe('App navigation', () => {
  test('landing page renders main actions', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Game of Life/i);
    await expect(page.locator('a[href="/auth"]').first()).toBeVisible();
    await expect(page.locator('a[href="/lobby"]').first()).toBeVisible();
  });

  test('auth page toggles to registration form', async ({ page }) => {
    await page.goto('/auth');

    await expect(page.getByRole('heading', { level: 1, name: /вход/i })).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();

    await page.getByRole('button', { name: /регистрация/i }).click();

    await expect(page.getByRole('heading', { level: 1, name: /регистрация/i })).toBeVisible();
    await expect(page.getByLabel(/Никнейм/i)).toBeVisible();
  });

  test('unknown routes show 404 page', async ({ page }) => {
    await page.goto('/__playwright__/missing');

    await expect(page.getByText(/Page not found/i)).toBeVisible();
  });
});
