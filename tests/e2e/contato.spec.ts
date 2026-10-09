import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Contato do CESAM', () => {
  test('mostra e-mail, telefone e endereço reais, sem placeholders', async ({ page }) => {
    await page.goto('/');
    const secao = page.locator('#contato');
    await secao.scrollIntoViewIfNeeded();
    await expect(secao.getByRole('link', { name: 'cesam@uems.br' })).toHaveAttribute('href', 'mailto:cesam@uems.br');
    await expect(secao.getByRole('link', { name: '(67) 3902-2547' })).toHaveAttribute('href', 'tel:+556739022547');
    await expect(secao.getByText(/Unidade Universitária de Dourados/)).toBeVisible();
    await expect(secao.getByText(/\[/)).toHaveCount(0);
  });

  test('o mapa do Google só carrega depois do clique e passa na acessibilidade', async ({ page }) => {
    await page.goto('/');
    const secao = page.locator('#contato');
    await secao.scrollIntoViewIfNeeded();
    await expect(secao.locator('iframe')).toHaveCount(0);
    await expect(secao.getByRole('link', { name: /Abrir no Google Maps/ })).toHaveAttribute(
      'href',
      'https://maps.app.goo.gl/HbWZ9ySf2uagoFN56',
    );
    await secao.getByRole('button', { name: 'Carregar mapa' }).click();
    const mapa = secao.locator('iframe');
    await expect(mapa).toHaveCount(1);
    await expect(mapa).toHaveAttribute('title', /localização da UEMS em Dourados/);
    await expect(mapa).toHaveAttribute('src', /google\.com\/maps\?q=-22\.1976768,-54\.9315119/);
    const resultado = await new AxeBuilder({ page })
      .include('#contato')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(resultado.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual(
      [],
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });

  test('o formulário válido confirma o envio e a página continua no site', async ({ page }) => {
    // O conteúdo do mailto: (destinatário, assunto e corpo) é verificado em components/Contact.test.tsx;
    // o navegador não permite interceptar a abertura do aplicativo de e-mail.
    await page.goto('/');
    const form = page.getByRole('form', { name: 'Envie uma mensagem' });
    await form.scrollIntoViewIfNeeded();
    await form.getByLabel('Nome').fill('Maria Souza');
    await form.getByLabel('E-mail').fill('maria@exemplo.com');
    await form.getByLabel('Mensagem').fill('Gostaria de agendar uma visita técnica ao laboratório.');
    await form.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(form.getByRole('status')).toContainText('Abrimos seu aplicativo de e-mail');
    await expect(page).toHaveURL(/\/$/);
  });
});
