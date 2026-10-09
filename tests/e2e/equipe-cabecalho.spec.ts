import { expect, test } from '@playwright/test';

// Pedidos da coordenação (2026-10-09): cards da equipe sem "buraco" e logo da UEMS no cabeçalho.
test('a última linha dos integrantes não deixa espaço vazio (número ímpar de cards)', async ({ page }) => {
  await page.goto('/');
  const itens = page.getByRole('list', { name: 'Integrantes do CESAM' }).getByRole('listitem');
  await itens.last().scrollIntoViewIfNeeded();
  const caixas = await itens.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
  const largura = Math.max(...caixas.map((c) => c.right)) - Math.min(...caixas.map((c) => c.left));
  const ultimaLinha = caixas.filter((c) => Math.abs(c.top - caixas.at(-1)!.top) < 2);
  const ocupado = Math.max(...ultimaLinha.map((c) => c.right)) - Math.min(...ultimaLinha.map((c) => c.left));
  // Na última linha, os cards juntos cobrem a largura da grade (±1px de arredondamento).
  expect(Math.abs(ocupado - largura)).toBeLessThanOrEqual(1);
});

test('o cabeçalho mostra o logo da UEMS ao lado do CESAM, sem estourar a largura', async ({ page }) => {
  await page.goto('/');
  const logo = page.locator('header img[src="/images/uems-logo.webp"]');
  await expect(logo).toBeVisible();
  await expect.poll(() => logo.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  const toggle = page.getByRole('button', { name: 'Abrir menu' });
  if (await toggle.isVisible()) {
    const [a, b] = await Promise.all([logo.boundingBox(), toggle.boundingBox()]);
    expect(a!.x + a!.width).toBeLessThanOrEqual(b!.x);
  }
});
