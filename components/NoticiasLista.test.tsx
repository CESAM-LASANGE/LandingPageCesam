import { render, screen, within } from '@testing-library/react';
import { noticias } from '@/content/noticias';
import { NoticiasLista } from './NoticiasLista';

describe('Lista de notícias (/noticias/)', () => {
  it('tem um h1 e um card com link para cada notícia', () => {
    render(<NoticiasLista lista={noticias} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Todas as notícias' })).toBeInTheDocument();
    const itens = within(screen.getByRole('list', { name: 'Notícias do CESAM' })).getAllByRole('listitem');
    expect(itens).toHaveLength(noticias.length);
    for (const n of noticias) {
      expect(screen.getByRole('link', { name: n.titulo })).toHaveAttribute('href', `/noticias/${n.slug}/`);
    }
  });

  it('mantém a ordem recebida (mais recente primeiro)', () => {
    render(<NoticiasLista lista={noticias} />);
    const titulos = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titulos).toEqual(noticias.map((n) => n.titulo));
  });

  it('sem notícias, informa em vez de mostrar uma lista vazia', () => {
    render(<NoticiasLista lista={[]} />);
    expect(screen.getByText('Nenhuma notícia publicada ainda.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).toBeNull();
  });
});
