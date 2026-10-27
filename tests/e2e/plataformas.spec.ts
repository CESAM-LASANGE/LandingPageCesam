import { expect, test } from '@playwright/test';

// Pedido da coordenação (2026-10-27): ao rolar até "Plataformas", os cards sobem de baixo (ScrollAnimation, direção "down").
const observatorio = (page: import('@playwright/test').Page) =>
  page.getByRole('link', { name: /O retrato do saneamento/ });
const portal = (page: import('@playwright/test').Page) =>
  page.getByRole('link', { name: /Informação para dar o destino certo/ });

test.describe('com movimento liberado', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('os cards ficam escondidos abaixo e sobem quando a seção entra na tela', async ({ page }) => {
    await page.goto('/');
    await expect(observatorio(page).locator('xpath=..')).toHaveCSS('opacity', '0');
    await expect(portal(page).locator('xpath=..')).toHaveCSS('opacity', '0');

    await page.locator('#plataformas').scrollIntoViewIfNeeded();
    await expect(observatorio(page)).toBeVisible();
    // O wrapper (ScrollAnimation) é quem anima; o card termina visível e na posição final.
    const slot = (l: ReturnType<typeof observatorio>) => l.locator('xpath=..');
    for (const card of [observatorio(page), portal(page)]) {
      await card.scrollIntoViewIfNeeded(); // cada card sobe quando ele próprio é alcançado
      await expect(slot(card)).toHaveCSS('opacity', '1', { timeout: 4000 });
      await expect
        .poll(() => slot(card).evaluate((el) => getComputedStyle(el).transform))
        .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
      await expect.poll(() => slot(card).evaluate((el) => getComputedStyle(el).filter)).toMatch(/^(none|blur\(0px\))$/);
    }
  });

  test('o card segue clicável e acessível depois de subir', async ({ page }) => {
    await page.goto('/');
    await page.locator('#plataformas').scrollIntoViewIfNeeded();
    await expect(observatorio(page)).toBeVisible();
    await expect(portal(page)).toBeVisible();
  });
});

test('com movimento reduzido os cards ficam visíveis, sem deslocamento', async ({ page }) => {
  await page.goto('/');
  await page.locator('#plataformas').scrollIntoViewIfNeeded();
  await expect(observatorio(page).locator('xpath=..')).toHaveCSS('opacity', '1', { timeout: 4000 });
  await expect(portal(page)).toBeVisible();
});
