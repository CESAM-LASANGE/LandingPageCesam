import { expect, test } from '@playwright/test';

// Pedido da coordenação (2026-10-27): ao rolar até "Plataformas", os cards sobem como se viessem de baixo.

test.describe('com movimento liberado', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('os cards ficam escondidos abaixo e sobem quando a seção entra na tela', async ({ page }) => {
    await page.goto('/');
    const cards = page
      .locator('#plataformas')
      .locator('a, article')
      .filter({ hasText: /Observatório|Informação para dar/ });
    const grid = page.locator('#plataformas [data-estado]');
    await expect(grid).toHaveAttribute('data-estado', 'oculto');
    await expect(cards.first()).toHaveCSS('opacity', '0');

    await page.locator('#plataformas').scrollIntoViewIfNeeded();
    await expect(grid).toHaveAttribute('data-estado', 'visivel');
    for (const card of await cards.all()) {
      await expect(card).toHaveCSS('opacity', '1', { timeout: 4000 });
    }
    const [a, b] = await Promise.all(
      (await cards.all()).map((c) => c.evaluate((el) => getComputedStyle(el).translate)),
    );
    expect([a, b].map((t) => (t === 'none' ? 0 : parseFloat(t!.split(' ').pop()!)))).toEqual([0, 0]);
  });

  test('o card segue clicável e acessível depois de subir', async ({ page }) => {
    await page.goto('/');
    await page.locator('#plataformas').scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', { name: /O retrato do saneamento/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Informação para dar o destino certo/ })).toBeVisible();
  });
});

test('com movimento reduzido os cards ficam visíveis e parados, sem gatilho', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#plataformas [data-estado]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /O retrato do saneamento/ })).toHaveCSS('opacity', '1');
});
