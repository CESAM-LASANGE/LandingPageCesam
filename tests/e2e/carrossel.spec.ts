import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// SPEC-002 · carrossel de fotos do Sobre.
const carrossel = (page: Page) => page.getByRole('region', { name: 'Fotos do CESAM' });
const slideAtivo = (page: Page) => carrossel(page).locator('[aria-roledescription="slide"]:not([inert])');

test.describe('com movimento liberado', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('avança sozinho em ~6 s e pausa com o mouse em cima (AC-01, AC-02)', async ({ page, isMobile }) => {
    await page.goto('/');
    await carrossel(page).scrollIntoViewIfNeeded();
    await expect(slideAtivo(page)).toHaveAttribute('aria-label', '1 de 3');
    // A precisão de 6 s ± 0,5 s é coberta pelo teste unitário com relógio simulado (Carousel.test.tsx).
    // Aqui, com o navegador sob carga dos testes paralelos, só confirmamos que não troca antes de 5 s
    // e que troca sozinho até 9 s.
    await page.waitForTimeout(5000);
    await expect(slideAtivo(page)).toHaveAttribute('aria-label', '1 de 3');
    await expect(slideAtivo(page)).toHaveAttribute('aria-label', '2 de 3', { timeout: 4000 });

    test.skip(isMobile === true, 'sem mouse no celular');
    await carrossel(page).hover();
    await page.waitForTimeout(7000);
    await expect(slideAtivo(page)).toHaveAttribute('aria-label', '2 de 3');
  });

  test('botão de pausa interrompe e retoma (AC-03)', async ({ page }) => {
    await page.goto('/');
    const pausar = carrossel(page).getByRole('button', { name: 'Pausar carrossel' });
    await pausar.click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(6800);
    await expect(slideAtivo(page)).toHaveAttribute('aria-label', '1 de 3');
    await carrossel(page).getByRole('button', { name: 'Reproduzir carrossel' }).click();
    await expect(carrossel(page).getByRole('button', { name: 'Pausar carrossel' })).toBeVisible();
  });
});

test('com movimento reduzido não avança sozinho e não mostra pausa (AC-05)', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(6800);
  await expect(slideAtivo(page)).toHaveAttribute('aria-label', '1 de 3');
  await expect(carrossel(page).getByRole('button', { name: /carrossel/ })).toHaveCount(0);
});

test('controles funcionam só com teclado (AC-04)', async ({ page }) => {
  await page.goto('/');
  const regiao = carrossel(page);
  // Ordem de Tab: anterior → indicadores (3) → próxima.
  await regiao.getByRole('button', { name: 'Foto anterior' }).focus();
  await page.keyboard.press('Tab');
  await expect(regiao.getByRole('button', { name: 'Ir para foto 1 de 3' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(slideAtivo(page)).toHaveAttribute('aria-label', '2 de 3');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(regiao.getByRole('button', { name: 'Próxima foto' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(slideAtivo(page)).toHaveAttribute('aria-label', '3 de 3');
  await page.keyboard.press('Space');
  await expect(slideAtivo(page)).toHaveAttribute('aria-label', '1 de 3');
});

test('fotos carregam, têm descrição e não causam overflow nem violação de acessibilidade (AC-06)', async ({ page }) => {
  await page.goto('/');
  await carrossel(page).scrollIntoViewIfNeeded();
  // Percorre as 3 fotos: cada uma é montada ao ficar visível e precisa ter descrição.
  for (let i = 0; i < 3; i++) {
    const foto = slideAtivo(page).locator('img:not([aria-hidden="true"])');
    await expect(foto).toHaveCount(1);
    expect((await foto.getAttribute('alt'))?.length).toBeGreaterThan(15);
    await carrossel(page).getByRole('button', { name: 'Próxima foto' }).click();
  }
  await expect
    .poll(() =>
      slideAtivo(page)
        .locator('img:not([aria-hidden])')
        .evaluate((i: HTMLImageElement) => i.naturalWidth),
    )
    .toBeGreaterThan(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const resultado = await new AxeBuilder({ page })
    .include('#sobre')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(resultado.violations.map((v) => v.id)).toEqual([]);
});

test('a altura do carrossel não muda ao trocar de foto (RWD-02)', async ({ page }) => {
  await page.goto('/');
  const altura = () => carrossel(page).evaluate((el) => el.getBoundingClientRect().height);
  const antes = await altura();
  await carrossel(page).getByRole('button', { name: 'Próxima foto' }).click();
  await carrossel(page).getByRole('button', { name: 'Próxima foto' }).click();
  expect(await altura()).toBe(antes);
});
