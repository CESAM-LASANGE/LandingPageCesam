import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { publicacoes } from '@/content/publicacoes';
import { Publications } from './Publications';

const lista = () => within(screen.getByRole('list', { name: 'Publicações do CESAM' })).getAllByRole('listitem');

describe('Produção científica (SPEC-006)', () => {
  it('mostra as 5 mais recentes e expande para todas no próprio lugar', async () => {
    const user = userEvent.setup();
    render(<Publications />);
    expect(lista()).toHaveLength(5);
    expect(within(lista()[0]!).getByRole('heading')).toHaveTextContent(publicacoes[0]!.titulo);
    const botao = screen.getByRole('button', { name: `Mostrar todas as ${publicacoes.length} publicações` });
    expect(botao).toHaveAttribute('aria-expanded', 'false');
    await user.click(botao);
    expect(lista()).toHaveLength(publicacoes.length);
    expect(screen.getByRole('button', { name: 'Mostrar só as mais recentes' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('cada item tem um link: PDF quando há PDF aberto, senão a página do artigo pelo DOI', async () => {
    const user = userEvent.setup();
    render(<Publications />);
    await user.click(screen.getByRole('button', { name: /Mostrar todas/ }));
    lista().forEach((item, i) => {
      const p = publicacoes[i]!;
      const link = within(item).getByRole('link');
      expect(link).toHaveAttribute('href', p.pdf ?? `https://doi.org/${p.doi}`);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAccessibleName(`${p.pdf ? 'PDF' : 'Página do artigo'}: ${p.titulo} (abre em nova aba)`);
    });
  });

  it('destaca em negrito os autores do CESAM', () => {
    render(<Publications />);
    const p = publicacoes[0]!;
    const destaque = within(lista()[0]!)
      .getAllByText((_, el) => el?.tagName === 'STRONG')
      .map((el) => el.textContent);
    expect(destaque).toEqual(p.autores.filter((a) => a.cesam).map((a) => a.nome));
  });

  it('só oferece filtros de tipos que têm publicações e filtra com aria-pressed', async () => {
    const user = userEvent.setup();
    render(<Publications />);
    const grupo = screen.getByRole('group', { name: 'Filtrar publicações por tipo' });
    expect(
      within(grupo)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Todas', 'Artigos', 'Livros', 'Eventos']);
    await user.click(within(grupo).getByRole('button', { name: 'Eventos' }));
    expect(within(grupo).getByRole('button', { name: 'Eventos' })).toHaveAttribute('aria-pressed', 'true');
    const eventos = publicacoes.filter((p) => p.tipo === 'evento');
    expect(lista()).toHaveLength(eventos.length);
    expect(screen.getByRole('status')).toHaveTextContent(`${eventos.length} publicações`);
  });
});
