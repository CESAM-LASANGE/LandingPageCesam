import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// SPEC-008 · compartilhar a notícia com a foto de capa, só em aparelhos com toque.
const SLUG = '/noticias/tcc-ana-laura-papel-higienico-no-vaso-sanitario/';
const CAPA_GRANDE = /\/midia\/noticias\/tcc-ana-laura-com-participantes-1600\.webp$/;

/** Simula o menu de compartilhamento e a área de transferência, que o Chromium de teste não tem. */
async function simularRecursos(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__compartilhado = [];
    w.__copiado = [];
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (dados: ShareData) => {
        const arquivo = dados.files?.[0];
        const bitmap = arquivo ? await createImageBitmap(arquivo) : null;
        (w.__compartilhado as unknown[]).push({
          title: dados.title,
          url: dados.url,
          nome: arquivo?.name,
          tipo: arquivo?.type,
          bytes: arquivo?.size,
          largura: bitmap?.width,
        });
      },
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (texto: string) => (w.__copiado as string[]).push(texto) },
    });
  });
}

test.describe('com toque (celular)', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1100, 'cobre só aparelhos de toque');
  test.use({ isMobile: true, hasTouch: true });

  test('mostra o bloco, prepara a foto só ao chegar nele e compartilha um JPEG (AC-01, AC-02, AC-05)', async ({
    page,
  }) => {
    await simularRecursos(page);
    const pedidosDaCapa: string[] = [];
    page.on('request', (r) => CAPA_GRANDE.test(r.url()) && pedidosDaCapa.push(r.url()));
    await page.goto(SLUG);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(pedidosDaCapa).toHaveLength(0);

    const bloco = page.getByRole('region', { name: 'Compartilhe esta notícia' });
    await bloco.scrollIntoViewIfNeeded();
    await expect.poll(() => pedidosDaCapa.length).toBe(1);

    await bloco.getByRole('button', { name: /Compartilhar a notícia/ }).click();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __compartilhado: unknown[] }).__compartilhado.length))
      .toBe(1);
    const [enviado] = await page.evaluate(
      () => (window as unknown as { __compartilhado: Record<string, unknown>[] }).__compartilhado,
    );
    expect(enviado).toMatchObject({
      title: expect.stringContaining('Ana Laura Eich'),
      url: expect.stringMatching(new RegExp(`^https://.+${SLUG}$`)),
      nome: 'cesam-tcc-ana-laura-papel-higienico-no-vaso-sanitario.jpg',
      tipo: 'image/jpeg',
    });
    expect(enviado!.bytes as number).toBeGreaterThan(10_000);
    expect(enviado!.largura as number).toBeLessThanOrEqual(1080);
    expect(pedidosDaCapa).toHaveLength(1);
  });

  test('copiar legenda confirma e baixar a foto inicia o download', async ({ page }) => {
    await simularRecursos(page);
    await page.goto(SLUG);
    const bloco = page.getByRole('region', { name: 'Compartilhe esta notícia' });
    await bloco.scrollIntoViewIfNeeded();

    await bloco.getByRole('button', { name: 'Copiar legenda' }).click();
    await expect(bloco.getByRole('status')).toHaveText(/Legenda copiada/);
    const [legenda] = await page.evaluate(() => (window as unknown as { __copiado: string[] }).__copiado);
    expect(legenda).toContain('Leia a notícia: https://');
    expect(legenda).not.toContain('#');

    const download = page.waitForEvent('download');
    await bloco.getByRole('button', { name: 'Baixar a foto' }).click();
    expect((await download).suggestedFilename()).toBe('cesam-tcc-ana-laura-papel-higienico-no-vaso-sanitario.jpg');
  });

  test('sem overflow, alvos de 44 px e sem violações de acessibilidade (RWD-01, RWD-02, T-05)', async ({ page }) => {
    await simularRecursos(page);
    await page.goto(SLUG);
    const bloco = page.getByRole('region', { name: 'Compartilhe esta notícia' });
    await bloco.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    for (const alvo of await bloco.locator('button, a').all()) {
      const caixa = await alvo.boundingBox();
      expect(caixa!.height).toBeGreaterThanOrEqual(44);
    }
    const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(resultado.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual(
      [],
    );
  });
});

test.describe('no computador', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1100, 'cobre só o computador');

  test('o bloco "Compartilhar" não existe (AC-01)', async ({ page }) => {
    await page.goto(SLUG);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Compartilhe esta notícia' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Compartilhar|Baixar a foto|Copiar legenda/ })).toHaveCount(0);
  });
});
