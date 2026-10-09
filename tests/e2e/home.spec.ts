import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Home (SPEC-001)', () => {
  test('sem erros de console no fluxo normal (AC-03)', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.mouse.wheel(0, 20000);
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('sem violações WCAG 2.2 A/AA detectáveis pelo axe (A11Y)', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
    expect(summary).toEqual([]);
  });

  test('sem overflow horizontal acidental (RESPONSIVE)', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('metadados essenciais presentes (AC-05)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CESAM/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /saneamento/i);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /CESAM/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);
  });

  test('imagens e ativos locais carregam (AC-01)', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (r) => r.url().startsWith('http://127.0.0.1') && r.status() >= 400 && failed.push(r.url()));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(failed).toEqual([]);
    const broken = await page.$$eval('img', (imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
    );
    expect(broken).toEqual([]);
  });

  test('alvos interativos visíveis têm pelo menos 24×24 px (WCAG 2.5.8)', async ({ page }) => {
    await page.goto('/');
    const small = await page.$$eval('a, button, input, select, textarea', (els) =>
      els
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const inline = getComputedStyle(el).display === 'inline';
          return r.width > 0 && r.height > 0 && !inline && (r.width < 24 || r.height < 24);
        })
        .map((el) => el.outerHTML.slice(0, 80)),
    );
    expect(small).toEqual([]);
  });

  test('skip link leva ao conteúdo principal (AC-04)', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });
});

test.describe('Navegação por viewport', () => {
  test('navegação acessível por teclado e toque (AC-02, AC-04)', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Abrir menu' });
    const nav = page.getByRole('navigation', { name: 'Navegação principal' });
    const isDesktop = (page.viewportSize()?.width ?? 0) >= 1100;

    if (isDesktop) {
      await expect(toggle).toBeHidden();
      await expect(nav.getByRole('link', { name: 'Equipe' })).toBeVisible();
    } else {
      await expect(nav.getByRole('link', { name: 'Equipe' })).toBeHidden();
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(nav.getByRole('link', { name: 'Equipe' })).toBeVisible();
    }
    await nav.getByRole('link', { name: 'Equipe' }).click();
    await expect(page).toHaveURL(/#equipe$/);
    await expect(page.getByRole('heading', { name: 'Pessoas que fazem o CESAM' })).toBeInViewport();
  });

  test('screenshot de referência da página inteira (Gate 5)', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    // Fotos com loading="lazy" (SPEC-002): carrega todas antes da captura, para a referência ser estável.
    await page.evaluate(() =>
      Promise.all(
        Array.from(document.images, (img) => {
          img.loading = 'eager';
          return img.decode().catch(() => undefined);
        }),
      ),
    );
    await expect(page).toHaveScreenshot('home.png', { fullPage: true });
  });
});
