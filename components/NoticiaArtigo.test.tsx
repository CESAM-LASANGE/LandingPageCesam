import { render, screen, within } from '@testing-library/react';
import { dataPorExtenso, noticias } from '@/content/noticias';
import { NoticiaArtigo } from './NoticiaArtigo';

const tcc = noticias.find((n) => n.slug.startsWith('tcc-ana-laura'))!;
const curso = noticias.find((n) => n.slug.startsWith('curso-de-geoprocessamento'))!;

describe('Página da notícia (SPEC-007 FR-03)', () => {
  it('tem um único h1 com o título, categoria e data', () => {
    render(<NoticiaArtigo noticia={tcc} outras={[]} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(tcc.titulo);
    expect(screen.getByText('Defesa')).toBeInTheDocument();
    const data = screen.getByText(dataPorExtenso(tcc.data));
    expect(data.tagName).toBe('TIME');
    expect(data).toHaveAttribute('datetime', tcc.data);
  });

  it('mostra a trilha Início › Notícias › título com link para a home', () => {
    render(<NoticiaArtigo noticia={tcc} outras={[]} />);
    const trilha = screen.getByRole('navigation', { name: 'Trilha de navegação' });
    expect(within(trilha).getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/');
    expect(within(trilha).getByRole('link', { name: 'Notícias' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/noticias\/?$/),
    );
    expect(within(trilha).getByText(tcc.titulo)).toHaveAttribute('aria-current', 'page');
  });

  it('renderiza todo o corpo, com subtítulos em h2', () => {
    render(<NoticiaArtigo noticia={tcc} outras={[]} />);
    const subtitulos = tcc.corpo.filter((b) => b.tipo === 'titulo');
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(
      expect.arrayContaining(subtitulos.map((b) => b.texto)),
    );
    for (const bloco of tcc.corpo.filter((b) => b.tipo === 'p')) {
      expect(screen.getByText(bloco.texto)).toBeInTheDocument();
    }
  });

  it('mostra a capa e a galeria, todas com descrição e legenda quando houver', () => {
    render(<NoticiaArtigo noticia={tcc} outras={[]} />);
    for (const foto of [tcc.capa, ...(tcc.galeria ?? [])]) {
      expect(screen.getByRole('img', { name: foto.alt })).toBeInTheDocument();
      if (foto.legenda) expect(screen.getByText(foto.legenda)).toBeInTheDocument();
    }
  });

  it('lista outras notícias, sem a atual, e volta para a seção na home', () => {
    const outra = { ...tcc, slug: 'outra', titulo: 'Outra notícia do CESAM para teste' };
    render(<NoticiaArtigo noticia={tcc} outras={[outra]} />);
    const secao = screen.getByRole('region', { name: 'Outras notícias' });
    expect(within(secao).getByRole('link', { name: outra.titulo })).toHaveAttribute('href', '/noticias/outra/');
    expect(within(secao).queryByRole('link', { name: tcc.titulo })).toBeNull();
    expect(screen.getByRole('link', { name: /Voltar para as notícias/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/noticias\/?$/),
    );
  });

  it('sem outras notícias, não mostra a seção "Outras notícias"', () => {
    render(<NoticiaArtigo noticia={tcc} outras={[]} />);
    expect(screen.queryByRole('region', { name: 'Outras notícias' })).toBeNull();
  });

  it('galeria com 4 fotos: todas aparecem, com descrição, e as fotos em pé ficam inteiras (A11Y-04)', () => {
    render(<NoticiaArtigo noticia={curso} outras={[tcc]} />);
    const fotos = [curso.capa, ...(curso.galeria ?? [])];
    expect(fotos).toHaveLength(5);
    for (const foto of fotos) expect(screen.getByRole('img', { name: foto.alt })).toBeInTheDocument();
    expect((curso.galeria ?? []).filter((f) => f.ajuste === 'conter')).toHaveLength(3);
  });

  it('mostra o curso como Extensão, com a data de 8 de junho de 2026', () => {
    render(<NoticiaArtigo noticia={curso} outras={[]} />);
    expect(screen.getByText('Extensão')).toBeInTheDocument();
    expect(screen.getByText('8 de junho de 2026')).toHaveAttribute('datetime', '2026-06-08');
  });
});
