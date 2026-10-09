import { render, screen, within } from '@testing-library/react';
import { noticias } from '@/content/noticias';
import { act, fireEvent } from '@testing-library/react';
import { News } from './News';

const tcc = noticias.find((n) => n.slug.startsWith('tcc-ana-laura'))!;
const curso = noticias.find((n) => n.slug.startsWith('curso-de-geoprocessamento'))!;

describe('Notícias na home (SPEC-007)', () => {
  it('mostra o card da notícia com categoria, data, título e resumo', () => {
    render(<News lista={[tcc]} />);
    const card = screen.getByRole('article');
    expect(within(card).getByText('Defesa')).toBeInTheDocument();
    expect(within(card).getByText('01/10/2026')).toBeInTheDocument();
    expect(within(card).getByRole('heading', { level: 3 })).toHaveTextContent(tcc.titulo);
    expect(within(card).getByText(tcc.resumo)).toBeInTheDocument();
  });

  it('o card inteiro leva à página da notícia, sem abrir nova aba (FR-02)', () => {
    render(<News lista={[tcc]} />);
    const link = screen.getByRole('link', { name: tcc.titulo });
    expect(link).toHaveAttribute('href', `/noticias/${tcc.slug}/`);
    expect(link).not.toHaveAttribute('target');
  });

  it('mostra a foto de capa com descrição', () => {
    render(<News lista={[tcc]} />);
    expect(screen.getByRole('img', { name: tcc.capa.alt })).toBeInTheDocument();
  });

  it('não deixa links pendentes nem "[Imagem da notícia]" (sem placeholders)', () => {
    render(<News lista={[tcc]} />);
    expect(screen.queryByText(/\[/)).toBeNull();
    expect(document.querySelectorAll('[data-pending-link]')).toHaveLength(0);
  });

  it('sem notícias, informa em vez de mostrar uma seção vazia (estado vazio)', () => {
    render(<News lista={[]} />);
    expect(screen.getByText('Nenhuma notícia publicada ainda.')).toBeInTheDocument();
    expect(screen.queryByRole('article')).toBeNull();
  });

  it('com várias notícias usa o carrossel de cards (SPEC-002)', () => {
    const outras = [1, 2, 3, 4].map((i) => ({ ...tcc, slug: `n${i}`, titulo: `Notícia número ${i} de teste` }));
    render(<News lista={outras} />);
    expect(screen.getByRole('region', { name: 'Notícias do CESAM' })).toHaveAttribute(
      'aria-roledescription',
      'carrossel',
    );
  });

  it('com poucas notícias, troca uma por vez a cada 6 segundos, em destaque (FR-01)', () => {
    vi.useFakeTimers();
    try {
      render(<News lista={[tcc, curso]} />);
      const regiao = screen.getByRole('region', { name: 'Notícias do CESAM' });
      const visivel = () =>
        within(regiao)
          .getAllByRole('group')
          .find((g) => !g.hasAttribute('inert'))!;
      expect(visivel()).toHaveAttribute('aria-label', '1 de 2');
      expect(within(visivel()).getByRole('heading', { level: 3 })).toHaveTextContent(tcc.titulo);
      act(() => void vi.advanceTimersByTime(6100));
      expect(visivel()).toHaveAttribute('aria-label', '2 de 2');
      expect(within(visivel()).getByRole('heading', { level: 3 })).toHaveTextContent(curso.titulo);
      fireEvent.click(within(regiao).getByRole('button', { name: 'Pausar carrossel' }));
      act(() => void vi.advanceTimersByTime(20000));
      expect(visivel()).toHaveAttribute('aria-label', '2 de 2');
    } finally {
      vi.useRealTimers();
    }
  });

  it('o card do curso leva à própria página', () => {
    render(<News lista={[tcc, curso]} />);
    expect(screen.getByRole('link', { name: curso.titulo })).toHaveAttribute('href', `/noticias/${curso.slug}/`);
  });
});
