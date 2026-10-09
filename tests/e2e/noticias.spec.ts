import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// SPEC-007 · card na home e página da notícia do TCC da Ana Laura.
const SLUG = '/noticias/tcc-ana-laura-papel-higienico-no-vaso-sanitario/';
const TITULO = 'Ana Laura Eich defende TCC sobre papel higiênico no vaso sanitário';
const SLUG_CURSO = '/noticias/curso-de-geoprocessamento-para-a-pma-de-dourados/';
const TITULO_CURSO = 'CESAM realiza curso de geoprocessamento para a PMA de Dourados';
const TITULO_SONOMETRO = 'CESAM realiza curso de sonômetro para o 2º Batalhão da Polícia Militar Ambiental';
const carrossel = (page: Page) => page.getByRole('region', { name: 'Notícias do CESAM' });
const slideAtivo = (page: Page) => carrossel(page).locator('[aria-roledescription="slide"]:not([inert])');

test('o card da home leva à página da notícia (AC-01)', async ({ page }) => {
  await page.goto('/');
  const secao = page.locator('#noticias');
  await secao.scrollIntoViewIfNeeded();
  await expect(secao.getByText('Defesa', { exact: true })).toBeVisible();
  await slideAtivo(page).getByRole('link', { name: TITULO }).click();
  await expect(page).toHaveURL(new RegExp(`${SLUG}$`));
  await expect(page.getByRole('heading', { level: 1, name: TITULO })).toBeVisible();
});

test('a página mostra o texto completo, as fotos e a trilha', async ({ page }) => {
  await page.goto(SLUG);
  await expect(page.getByRole('heading', { level: 2, name: 'O que foi encontrado' })).toBeVisible();
  await expect(page.getByText('86,98% e 92,75%')).toBeVisible();
  const fotos = page.locator('article figure img');
  await expect(fotos).toHaveCount(3);
  for (const foto of await fotos.all()) {
    await foto.scrollIntoViewIfNeeded();
    await expect.poll(() => foto.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
    expect((await foto.getAttribute('alt'))?.length).toBeGreaterThan(20);
  }
  await expect(
    page.getByRole('navigation', { name: 'Trilha de navegação' }).getByRole('link', { name: 'Notícias' }),
  ).toHaveAttribute('href', '/noticias/');
});

test('metadados e dados estruturados da notícia (SEO-01, SEO-02)', async ({ page }) => {
  await page.goto(SLUG);
  await expect(page).toHaveTitle(/Ana Laura Eich defende TCC .* · Notícias · CESAM/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /Orientado pelo coordenador do CESAM/,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /midia\/noticias\/tcc-ana-laura-com-participantes-1600\.webp/,
  );
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(ld['@type']).toBe('NewsArticle');
  expect(ld.datePublished).toBe('2026-10-01');
});

test('sem erros de console, sem overflow e sem violações de acessibilidade (A11Y-01)', async ({ page }) => {
  const erros: string[] = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
  page.on('pageerror', (e) => erros.push(e.message));
  await page.goto(SLUG);
  await page.mouse.wheel(0, 20000);
  await page.waitForLoadState('networkidle');
  expect(erros).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(resultado.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
});

test('o cabeçalho da página leva de volta às seções da home', async ({ page }) => {
  await page.goto(SLUG);
  const largura = page.viewportSize()?.width ?? 0;
  if (largura < 1100) await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Equipe' }).click();
  await expect(page).toHaveURL(/\/#equipe$/);
  await expect(page.getByRole('heading', { name: 'Pessoas que fazem o CESAM' })).toBeInViewport();
});

test('endereço de notícia inexistente mostra a página 404', async ({ page }) => {
  const resposta = await page.goto('/noticias/nao-existe/');
  expect(resposta?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
});

test.describe('carrossel de notícias com movimento liberado', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('troca de notícia sozinho e pausa com o botão (FR-01)', async ({ page }) => {
    await page.goto('/');
    await carrossel(page).scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await expect(slideAtivo(page)).toHaveAttribute('aria-label', '1 de 3');
    // O tempo exato (6 s) é coberto no teste unitário; aqui basta trocar entre 5 s e 11 s.
    await page.waitForTimeout(5000);
    await expect(slideAtivo(page)).toHaveAttribute('aria-label', '1 de 3');
    await expect(slideAtivo(page)).toHaveAttribute('aria-label', '2 de 3', { timeout: 6000 });
    await expect(slideAtivo(page).getByRole('link', { name: TITULO_SONOMETRO })).toBeVisible();
    await carrossel(page).getByRole('button', { name: 'Pausar carrossel' }).click();
    await page.waitForTimeout(7000);
    await expect(slideAtivo(page)).toHaveAttribute('aria-label', '2 de 3');
  });
});

test('o carrossel de notícias tem controles por teclado e leva ao curso (AC-04)', async ({ page }) => {
  await page.goto('/');
  await carrossel(page).getByRole('button', { name: 'Próxima notícia' }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await expect(slideAtivo(page)).toHaveAttribute('aria-label', '3 de 3');
  await slideAtivo(page).getByRole('link', { name: TITULO_CURSO }).click();
  await expect(page).toHaveURL(new RegExp(`${SLUG_CURSO}$`));
});

test.describe('página do curso de geoprocessamento', () => {
  test('mostra o texto, as 5 fotos com descrição e sem erros', async ({ page }) => {
    const erros: string[] = [];
    page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(SLUG_CURSO);
    await expect(page.getByRole('heading', { level: 1, name: TITULO_CURSO })).toBeVisible();
    await expect(page.locator('article header time')).toHaveText('8 de junho de 2026');
    await expect(page.getByText('Nélison Ferreira Corrêa e pelo mestrando Elias de Oliveira Junior')).toBeVisible();
    const fotos = page.locator('article figure img:not([aria-hidden="true"])');
    await expect(fotos).toHaveCount(5);
    for (const foto of await fotos.all()) {
      await foto.scrollIntoViewIfNeeded();
      await expect.poll(() => foto.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
      expect((await foto.getAttribute('alt'))?.length).toBeGreaterThan(20);
    }
    await page.waitForLoadState('networkidle');
    expect(erros).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test('sem violações de acessibilidade e com "Outras notícias" levando ao TCC', async ({ page }) => {
    await page.goto(SLUG_CURSO);
    const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(resultado.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual(
      [],
    );
    await page.getByRole('region', { name: 'Outras notícias' }).getByRole('link', { name: TITULO }).click();
    await expect(page).toHaveURL(new RegExp(`${SLUG}$`));
  });

  test('metadados e dados estruturados (SEO)', async ({ page }) => {
    await page.goto(SLUG_CURSO);
    await expect(page).toHaveTitle(/CESAM realiza curso de geoprocessamento .* · Notícias · CESAM/);
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
    expect(ld.datePublished).toBe('2026-06-08');
  });
});

test.describe('página do curso de sonômetro', () => {
  const SLUG_SONOMETRO = '/noticias/curso-de-sonometro-para-o-2o-batalhao-da-pma/';

  test('mostra data, instrutores, 4 fotos com descrição e passa na acessibilidade', async ({ page }) => {
    await page.goto(SLUG_SONOMETRO);
    await expect(page.getByRole('heading', { level: 1, name: TITULO_SONOMETRO })).toBeVisible();
    await expect(page.locator('article header time')).toHaveText('5 de agosto de 2026');
    await expect(page.getByText('Nélison Ferreira Corrêa e pelo mestrando Elias de Oliveira Junior')).toBeVisible();
    const fotos = page.locator('article figure img:not([aria-hidden="true"])');
    await expect(fotos).toHaveCount(4);
    for (const foto of await fotos.all()) {
      await foto.scrollIntoViewIfNeeded();
      await expect.poll(() => foto.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
      expect((await foto.getAttribute('alt'))?.length).toBeGreaterThan(20);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(resultado.violations.map((v) => v.id)).toEqual([]);
    await expect(page.getByRole('region', { name: 'Outras notícias' }).getByRole('link')).toHaveCount(2);
  });
});

test.describe('Lista de notícias (/noticias/)', () => {
  test('a home leva à lista e a lista leva a cada notícia', async ({ page }) => {
    await page.goto('/');
    await page
      .locator('#noticias')
      .getByRole('link', { name: /Ver todas as notícias/ })
      .click();
    await expect(page).toHaveURL(/\/noticias\/$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Todas as notícias' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Notícias do CESAM' }).getByRole('listitem')).toHaveCount(3);
    await page.getByRole('link', { name: TITULO }).click();
    await expect(page).toHaveURL(new RegExp(`${SLUG}$`));
  });

  test('sem erros de console, sem overflow e sem violações de acessibilidade', async ({ page }) => {
    const erros: string[] = [];
    page.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto('/noticias/');
    await page.mouse.wheel(0, 20000);
    await page.waitForLoadState('networkidle');
    expect(erros).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(resultado.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual(
      [],
    );
  });
});
