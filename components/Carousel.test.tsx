import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { mockMatchMedia } from '@/tests/setup';
import { Carousel } from './Carousel';

const itens = ['Primeira', 'Segunda', 'Terceira'].map((texto) => ({ id: texto, conteudo: <p>{texto}</p> }));

function renderCarousel(props: Partial<React.ComponentProps<typeof Carousel>> = {}) {
  return render(<Carousel rotulo="Fotos do CESAM" variante="fotos" itens={itens} nomeItem="foto" {...props} />);
}

function ativo() {
  return screen.getAllByRole('group').find((g) => !g.hasAttribute('inert'));
}

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('Carousel (SPEC-002)', () => {
  it('expõe papel de carrossel e rótulo de cada slide (A11Y-01)', () => {
    renderCarousel();
    const regiao = screen.getByRole('region', { name: 'Fotos do CESAM' });
    expect(regiao).toHaveAttribute('aria-roledescription', 'carrossel');
    const slides = within(regiao).getAllByRole('group');
    expect(slides).toHaveLength(3);
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide');
    expect(slides[0]).toHaveAccessibleName('1 de 3');
  });

  it('só o slide visível fica fora de inert (A11Y-03)', () => {
    renderCarousel();
    const slides = screen.getAllByRole('group');
    expect(slides.filter((s) => !s.hasAttribute('inert'))).toHaveLength(1);
    expect(ativo()).toHaveTextContent('Primeira');
  });

  it('avança sozinho a cada 6 segundos e volta ao início (FR-01, FR-08)', () => {
    renderCarousel();
    act(() => void vi.advanceTimersByTime(5900));
    expect(ativo()).toHaveTextContent('Primeira');
    act(() => void vi.advanceTimersByTime(200));
    expect(ativo()).toHaveTextContent('Segunda');
    // Um ciclo por vez: cada troca agenda a próxima depois de renderizar.
    act(() => void vi.advanceTimersByTime(6000));
    expect(ativo()).toHaveTextContent('Terceira');
    act(() => void vi.advanceTimersByTime(6000));
    expect(ativo()).toHaveTextContent('Primeira');
  });

  it('pausa com o mouse em cima e retoma ao sair (FR-02)', () => {
    renderCarousel();
    const regiao = screen.getByRole('region', { name: 'Fotos do CESAM' });
    fireEvent.mouseEnter(regiao);
    act(() => void vi.advanceTimersByTime(13000));
    expect(ativo()).toHaveTextContent('Primeira');
    fireEvent.mouseLeave(regiao);
    act(() => void vi.advanceTimersByTime(6100));
    expect(ativo()).toHaveTextContent('Segunda');
  });

  it('pausa enquanto há foco dentro (FR-02)', () => {
    renderCarousel();
    fireEvent.focus(screen.getByRole('button', { name: 'Próxima foto' }));
    act(() => void vi.advanceTimersByTime(13000));
    expect(ativo()).toHaveTextContent('Primeira');
  });

  it('botão pausar/reproduzir alterna e muda o rótulo (FR-03)', () => {
    renderCarousel();
    fireEvent.click(screen.getByRole('button', { name: 'Pausar carrossel' }));
    act(() => void vi.advanceTimersByTime(13000));
    expect(ativo()).toHaveTextContent('Primeira');
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir carrossel' }));
    act(() => void vi.advanceTimersByTime(6100));
    expect(ativo()).toHaveTextContent('Segunda');
  });

  it('anterior, próximo e indicadores navegam (FR-04)', () => {
    renderCarousel();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
    expect(ativo()).toHaveTextContent('Segunda');
    fireEvent.click(screen.getByRole('button', { name: 'Foto anterior' }));
    fireEvent.click(screen.getByRole('button', { name: 'Foto anterior' }));
    expect(ativo()).toHaveTextContent('Terceira');
    const ir1 = screen.getByRole('button', { name: 'Ir para foto 1 de 3' });
    fireEvent.click(ir1);
    expect(ativo()).toHaveTextContent('Primeira');
    expect(ir1).toHaveAttribute('aria-current', 'true');
  });

  it('a região só anuncia trocas quando a navegação é manual (A11Y-02)', () => {
    renderCarousel();
    const trilho = screen.getByTestId('carrossel-trilho');
    expect(trilho).toHaveAttribute('aria-live', 'off');
    fireEvent.click(screen.getByRole('button', { name: 'Pausar carrossel' }));
    expect(trilho).toHaveAttribute('aria-live', 'polite');
  });

  it('com movimento reduzido não avança sozinho, mas os controles funcionam (FR-06)', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    renderCarousel();
    act(() => void vi.advanceTimersByTime(20000));
    expect(ativo()).toHaveTextContent('Primeira');
    fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
    expect(ativo()).toHaveTextContent('Segunda');
  });

  it('desliza com o dedo (FR-05)', () => {
    renderCarousel();
    const trilho = screen.getByTestId('carrossel-trilho');
    fireEvent.pointerDown(trilho, { clientX: 300, pointerType: 'touch' });
    fireEvent.pointerUp(trilho, { clientX: 200, pointerType: 'touch' });
    expect(ativo()).toHaveTextContent('Segunda');
  });

  it('com um item só, não mostra controles nem anima (FR-07)', () => {
    renderCarousel({ itens: itens.slice(0, 1) });
    expect(screen.queryByRole('button')).toBeNull();
    act(() => void vi.advanceTimersByTime(13000));
    expect(ativo()).toHaveTextContent('Primeira');
  });

  it('só monta o item visível e o próximo; os demais entram conforme a navegação (Gate 6)', () => {
    renderCarousel();
    expect(screen.queryByText('Primeira')).toBeInTheDocument();
    expect(screen.queryByText('Segunda')).toBeInTheDocument();
    expect(screen.queryByText('Terceira')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
    expect(screen.queryByText('Terceira')).toBeInTheDocument();
  });

  it('sem itens, mostra o conteúdo alternativo (estado vazio)', () => {
    renderCarousel({ itens: [], vazio: <p>Nenhuma foto ainda</p> });
    expect(screen.getByText('Nenhuma foto ainda')).toBeInTheDocument();
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('variante cards em tela larga: sem itensPorVez, 2 itens cabem juntos e não há o que trocar', () => {
    mockMatchMedia({ '(min-width: 1100px)': true });
    renderCarousel({ variante: 'cards', nomeItem: 'notícia', itens: itens.slice(0, 2) });
    expect(screen.queryByRole('button', { name: 'Próxima notícia' })).toBeNull();
  });

  it('variante cards com itensPorVez=1: dois itens formam um carrossel que troca sozinho, mesmo em tela larga', () => {
    mockMatchMedia({ '(min-width: 1100px)': true });
    renderCarousel({ variante: 'cards', itensPorVez: 1, nomeItem: 'notícia', itens: itens.slice(0, 2) });
    expect(screen.getByRole('button', { name: 'Próxima notícia' })).toBeInTheDocument();
    expect(ativo()).toHaveTextContent('Primeira');
    act(() => void vi.advanceTimersByTime(6100));
    expect(ativo()).toHaveTextContent('Segunda');
    act(() => void vi.advanceTimersByTime(6000));
    expect(ativo()).toHaveTextContent('Primeira');
  });
});
