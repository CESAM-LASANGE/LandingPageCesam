import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockMatchMedia } from '../tests/setup';
import { noticias } from '@/content/noticias';
import { montarLegenda, nomeDoArquivo, urlDaNoticia } from '@/lib/compartilhar';
import { CompartilharNoticia } from './CompartilharNoticia';

const n = noticias[0]!;
const arquivo = new File(['x'], nomeDoArquivo(n.slug), { type: 'image/jpeg' });

function definirNavigator(recursos: Partial<Navigator> & Record<string, unknown>) {
  for (const [chave, valor] of Object.entries(recursos)) {
    Object.defineProperty(navigator, chave, { configurable: true, value: valor });
  }
}

afterEach(() => {
  for (const chave of ['share', 'canShare', 'clipboard'])
    delete (navigator as unknown as Record<string, unknown>)[chave];
});

const abrir = (converter = vi.fn().mockResolvedValue(arquivo)) => {
  render(<CompartilharNoticia noticia={n} converter={converter} />);
  return converter;
};

describe('Compartilhar notícia (SPEC-008)', () => {
  it('sem toque (computador) não mostra nada (FR-01)', () => {
    mockMatchMedia({ '(pointer: coarse)': false });
    abrir();
    expect(screen.queryByRole('heading', { name: 'Compartilhe esta notícia' })).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  describe('com toque (celular)', () => {
    beforeEach(() => mockMatchMedia({ '(pointer: coarse)': true }));

    it('mostra as quatro ações, com o link do WhatsApp apontando para a notícia', () => {
      definirNavigator({ share: vi.fn() });
      abrir();
      expect(screen.getByRole('button', { name: /Compartilhar a notícia/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Baixar a foto' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Copiar legenda' })).toBeInTheDocument();
      const whatsapp = screen.getByRole('link', { name: /Enviar pelo WhatsApp/ });
      expect(whatsapp).toHaveAttribute('target', '_blank');
      expect(new URL(whatsapp.getAttribute('href')!).searchParams.get('text')).toContain(urlDaNoticia(n.slug));
    });

    it('prepara a foto uma única vez, quando o bloco aparece, e não antes (FR-07)', async () => {
      definirNavigator({ share: vi.fn(), canShare: () => true });
      const converter = abrir();
      await waitFor(() => expect(converter).toHaveBeenCalledTimes(1));
      expect(converter).toHaveBeenCalledWith(expect.stringMatching(/^\/midia\/.+-\d+\.webp$/), nomeDoArquivo(n.slug));
      await userEvent.click(screen.getByRole('button', { name: /Compartilhar a notícia/ }));
      expect(converter).toHaveBeenCalledTimes(1);
    });

    it('compartilha a foto JPEG, o título, o resumo e o link absoluto (AC-02)', async () => {
      const share = vi.fn().mockResolvedValue(undefined);
      definirNavigator({ share, canShare: () => true });
      abrir();
      await userEvent.click(screen.getByRole('button', { name: /Compartilhar a notícia/ }));
      expect(share).toHaveBeenCalledWith({
        title: n.titulo,
        text: n.resumo,
        url: urlDaNoticia(n.slug),
        files: [arquivo],
      });
    });

    it('sem suporte a arquivos, compartilha só título, resumo e link (AC-03)', async () => {
      const share = vi.fn().mockResolvedValue(undefined);
      definirNavigator({ share, canShare: () => false });
      abrir();
      await userEvent.click(screen.getByRole('button', { name: /Compartilhar a notícia/ }));
      expect(share).toHaveBeenCalledWith({ title: n.titulo, text: n.resumo, url: urlDaNoticia(n.slug) });
    });

    it('se a foto não puder ser preparada, ainda compartilha o link', async () => {
      const share = vi.fn().mockResolvedValue(undefined);
      definirNavigator({ share, canShare: () => true });
      abrir(vi.fn().mockRejectedValue(new Error('falhou')));
      await userEvent.click(screen.getByRole('button', { name: /Compartilhar a notícia/ }));
      expect(share).toHaveBeenCalledWith({ title: n.titulo, text: n.resumo, url: urlDaNoticia(n.slug) });
    });

    it('cancelar o menu não mostra erro (FR-06)', async () => {
      definirNavigator({
        share: vi.fn().mockRejectedValue(new DOMException('cancelado', 'AbortError')),
        canShare: () => true,
      });
      abrir();
      await userEvent.click(screen.getByRole('button', { name: /Compartilhar a notícia/ }));
      expect(screen.getByRole('status')).toBeEmptyDOMElement();
    });

    it('falha no menu avisa e indica o caminho alternativo', async () => {
      definirNavigator({ share: vi.fn().mockRejectedValue(new Error('x')), canShare: () => true });
      abrir();
      await userEvent.click(screen.getByRole('button', { name: /Compartilhar a notícia/ }));
      expect(screen.getByRole('status')).toHaveTextContent('Baixe a foto e copie a legenda');
    });

    it('sem menu nativo, não oferece "Compartilhar", mas mantém baixar, copiar e WhatsApp', () => {
      abrir();
      expect(screen.queryByRole('button', { name: /Compartilhar a notícia/ })).toBeNull();
      expect(screen.getByRole('button', { name: 'Baixar a foto' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Copiar legenda' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /WhatsApp/ })).toBeInTheDocument();
    });

    it('copia a legenda com título, resumo e link e confirma (FR-04)', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      definirNavigator({ clipboard: { writeText } as unknown as Clipboard });
      abrir();
      await userEvent.click(screen.getByRole('button', { name: 'Copiar legenda' }));
      expect(writeText).toHaveBeenCalledWith(montarLegenda(n));
      expect(screen.getByRole('status')).toHaveTextContent('Legenda copiada');
    });

    it('se não conseguir copiar, avisa', async () => {
      definirNavigator({ clipboard: { writeText: vi.fn().mockRejectedValue(new Error('x')) } as unknown as Clipboard });
      abrir();
      await userEvent.click(screen.getByRole('button', { name: 'Copiar legenda' }));
      expect(screen.getByRole('status')).toHaveTextContent('Não foi possível copiar');
    });

    it('baixa a foto como cesam-<slug>.jpg e confirma (FR-03)', async () => {
      const criar = vi.fn(() => 'blob:foto');
      const revogar = vi.fn();
      Object.assign(URL, { createObjectURL: criar, revokeObjectURL: revogar });
      const baixados: string[] = [];
      const clicar = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
        this: HTMLAnchorElement,
      ) {
        baixados.push(this.download);
      });
      abrir();
      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Baixar a foto' }));
      });
      expect(baixados).toEqual([nomeDoArquivo(n.slug)]);
      expect(screen.getByRole('status')).toHaveTextContent('Foto baixada');
      clicar.mockRestore();
    });
  });
});
