import { noticias } from '@/content/noticias';
import { site } from '@/content/site';
import { montarLegenda, nomeDoArquivo, urlDaCapaParaCompartilhar, urlDaNoticia, urlDoWhatsApp } from './compartilhar';

const n = noticias[0]!;

describe('compartilhar notícias (SPEC-008)', () => {
  it('o link da notícia é absoluto e termina em barra, como o canonical', () => {
    expect(urlDaNoticia(n.slug)).toBe(`${site.url}/noticias/${n.slug}/`);
  });

  it('a legenda tem título, resumo e link, separados por linha em branco, sem hashtags (FR-04)', () => {
    expect(montarLegenda(n)).toBe(`${n.titulo}\n\n${n.resumo}\n\nLeia a notícia: ${urlDaNoticia(n.slug)}`);
    expect(montarLegenda(n)).not.toContain('#');
  });

  it('o link do WhatsApp leva título e endereço, codificados (FR-05)', () => {
    const url = new URL(urlDoWhatsApp(n));
    expect(url.origin + url.pathname).toBe('https://wa.me/');
    expect(url.searchParams.get('text')).toBe(`${n.titulo}\n${urlDaNoticia(n.slug)}`);
  });

  it('o arquivo baixado se chama cesam-<slug>.jpg (FR-03)', () => {
    expect(nomeDoArquivo('exemplo')).toBe('cesam-exemplo.jpg');
  });

  it('toda capa publicada tem versão otimizada para compartilhar, sem criar arquivo novo (FR-08)', () => {
    for (const noticia of noticias) {
      expect(urlDaCapaParaCompartilhar(noticia.capa.arquivo), noticia.slug).toMatch(/^\/midia\/.+-\d+\.webp$/);
    }
    expect(urlDaCapaParaCompartilhar('nao/existe')).toBeNull();
  });
});
