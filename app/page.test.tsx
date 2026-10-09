import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './page';

function renderPage() {
  return render(<HomePage />);
}

describe('Página inicial — estrutura (SPEC-001)', () => {
  it('tem exatamente um h1 com a mensagem institucional (FR-02)', () => {
    renderPage();
    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent(/Ciência em saneamento/);
  });

  it('não pula níveis de heading', () => {
    const { container } = renderPage();
    const levels = [...container.querySelectorAll('main h1, main h2, main h3, main h4')].map((h) =>
      Number(h.tagName[1]),
    );
    levels.forEach((level, i) => {
      if (i > 0) expect(level - levels[i - 1]!).toBeLessThanOrEqual(1);
    });
  });

  it('renderiza as seções na ordem do design aprovado', () => {
    const { container } = renderPage();
    const ids = [...container.querySelectorAll('main > section[id]')].map((s) => s.id);
    expect(ids).toEqual(['inicio', 'plataformas', 'sobre', 'pesquisa', 'noticias', 'equipe', 'publicacoes', 'contato']);
  });

  it('não mostra a faixa de números, que sai até haver números oficiais (SPEC-001 FR-05)', () => {
    renderPage();
    expect(screen.queryByRole('region', { name: 'O CESAM em números' })).toBeNull();
    expect(screen.queryByText('Pesquisadores e estudantes')).toBeNull();
    expect(screen.queryByText('[00]')).toBeNull();
  });

  it('não tem a seção "Projetos em destaque" nem links que levem a ela (SPEC-001 FR-05)', () => {
    const { container } = renderPage();
    expect(screen.queryByRole('heading', { name: 'Projetos em destaque' })).toBeNull();
    expect(container.querySelector('#projetos')).toBeNull();
    expect(container.querySelectorAll('a[href="#projetos"]')).toHaveLength(0);
    expect(screen.queryByText('[Título do projeto 1]')).toBeNull();
    expect(screen.queryByRole('link', { name: /Ver projetos/ })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Projetos' })).toBeNull();
  });

  it('o menu segue a ordem da página nas seções de conteúdo', () => {
    renderPage();
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' });
    const ids = within(nav)
      .getAllByRole('link')
      .map((l) => l.getAttribute('href')!.slice(1));
    const naPagina = [...document.querySelectorAll('main > section[id]')].map((s) => s.id);
    // Sobre e Plataformas ficam de fora: no design aprovado o menu lista Sobre primeiro, a página abre com Plataformas.
    const conteudo = ['pesquisa', 'noticias', 'equipe', 'publicacoes'];
    expect(ids.filter((id) => conteudo.includes(id))).toEqual(naPagina.filter((id) => conteudo.includes(id)));
  });

  it('todo link interno aponta para um id existente (AC-01)', () => {
    const { container } = renderPage();
    const anchors = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    expect(anchors.length).toBeGreaterThan(10);
    for (const a of anchors) {
      const id = a.getAttribute('href')!.slice(1);
      expect(id, `href="${a.getAttribute('href')}"`).not.toBe('');
      expect(container.querySelector(`[id="${id}"]`), `destino de #${id}`).not.toBeNull();
    }
  });

  it('não publica links vazios nem externos sem rel seguro (AC-01)', () => {
    const { container } = renderPage();
    expect(container.querySelectorAll('a:not([href]), a[href=""], a[href="#"]')).toHaveLength(0);
    for (const a of container.querySelectorAll('a[target="_blank"]')) {
      expect(a.getAttribute('rel')).toContain('noopener');
    }
  });

  it('tem navegação principal e rodapé institucional (FR-01, FR-04)', () => {
    renderPage();
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' });
    expect(
      within(nav)
        .getAllByRole('link')
        .map((l) => l.textContent),
    ).toEqual(['Sobre', 'Plataformas', 'Pesquisa', 'Notícias', 'Equipe', 'Publicações', 'Contato']);
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Universidade Estadual de Mato Grosso do Sul');
  });

  it('abre o Observatório em nova aba no endereço oficial (FR-03)', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /Observatório de Saneamento/ });
    expect(link).toHaveAttribute('href', 'https://observatorio-saneamento-ms.vercel.app/');
    expect(link).toHaveAttribute('target', '_blank');
  });
});

describe('Menu mobile', () => {
  it('alterna aria-expanded e fecha com Esc devolvendo o foco', async () => {
    const user = userEvent.setup();
    renderPage();
    const button = screen.getByRole('button', { name: 'Abrir menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAccessibleName('Fechar menu');
    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  it('fecha ao escolher um item', async () => {
    const user = userEvent.setup();
    renderPage();
    const button = screen.getByRole('button', { name: 'Abrir menu' });
    await user.click(button);
    await user.click(within(screen.getByRole('navigation', { name: 'Navegação principal' })).getByText('Equipe'));
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});

// Filtro e lista de publicações: testados em components/Publications.test.tsx (SPEC-006, conteúdo real desde 2026-10-08).

describe('Formulário de contato', () => {
  it('mostra erros acessíveis e foca o primeiro campo inválido', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    const name = screen.getByLabelText('Nome');
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Informe seu nome.');
    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription(/e-mail válido/);
  });

  // Envio, mailto e estado sem e-mail: testados em components/Contact.test.tsx (cesam@uems.br definido desde 2026-10-08).
});

describe('Cabeçalho, tarja e rodapé (pedidos da coordenação, 2026-10-09)', () => {
  it('mostra o logo da UEMS ao lado do CESAM, como link para o portal da UEMS', () => {
    const { container } = renderPage();
    const link = container.querySelector('header a[href="https://www.uems.br"]');
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute('aria-label', expect.stringContaining('Universidade Estadual de Mato Grosso do Sul'));
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link?.querySelector('img')).toHaveAttribute('src', '/images/uems-logo.webp');
  });

  it('a tarja preta não traz mais o texto "Acessibilidade" sem destino', () => {
    renderPage();
    expect(screen.queryByText('Acessibilidade')).toBeNull();
  });

  it('todos os links do rodapé têm destino (nenhum item pendente)', () => {
    const { container } = renderPage();
    const rodape = container.querySelector('footer')!;
    expect(rodape.querySelectorAll('[data-pending-link]')).toHaveLength(0);
    const destinos = Object.fromEntries(
      [...rodape.querySelectorAll('a[href^="https://"]')].map((a) => [
        a.textContent?.replace(/\s*\(abre em nova aba\)/, ''),
        a.getAttribute('href'),
      ]),
    );
    expect(destinos).toMatchObject({
      'Pró-Reitoria de Pesquisa': 'https://www.uems.br/pro-reitoria/proppi',
      'Programas de pós-graduação': 'https://www.uems.br/cursos/pos-graduacao',
      Instagram: 'https://www.instagram.com/cesam_uems/',
      YouTube: 'https://www.youtube.com/@CESAM_UEMS',
    });
  });
});

describe('Hero (pedido da coordenação, 2026-10-09)', () => {
  it('não mostra o cartão "Análises de água e efluentes" sobre a ilustração', () => {
    renderPage();
    expect(screen.queryByText(/Análises de água e efluentes/)).toBeNull();
    expect(screen.queryByText('[Unidade / Campus] · MS')).toBeNull();
  });
});

describe('Hero · eyebrow (pedido da coordenação, 2026-10-09)', () => {
  it('o texto "Centro de Estudos · UEMS" aparece sem a estrela giratória antes', () => {
    const { container } = renderPage();
    const eyebrow = screen.getByText('Centro de Estudos · UEMS');
    expect(eyebrow.querySelector('svg')).toBeNull();
    expect(container.querySelector('#inicio p.eyebrow svg')).toBeNull();
  });
});
