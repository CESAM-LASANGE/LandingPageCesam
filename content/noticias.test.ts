import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fotoDoManifesto } from '@/lib/fotos';
import { dataCurta, dataPorExtenso, noticias, publicadas, type Noticia } from './noticias';

const todasAsFotos = noticias.flatMap((n) => [n.capa, ...(n.galeria ?? [])]);

describe('notícias (SPEC-007)', () => {
  it('tem slug único, em formato de URL', () => {
    const slugs = noticias.map((n) => n.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(noticias.map((n) => [n.slug, n] as const))(
    '%s: campos obrigatórios, resumo de até 200 caracteres',
    (_, n) => {
      expect(n.titulo.trim().length).toBeGreaterThan(10);
      expect(n.data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(n.resumo.length).toBeGreaterThan(40);
      expect(n.resumo.length).toBeLessThanOrEqual(200);
      expect(n.corpo.length).toBeGreaterThan(0);
    },
  );

  it('toda foto tem descrição e versões otimizadas (A11Y-04)', () => {
    for (const foto of todasAsFotos) {
      expect(foto.alt.trim().length, foto.arquivo).toBeGreaterThan(20);
      const dados = fotoDoManifesto(foto.arquivo);
      expect(dados, `${foto.arquivo}: rode npm run fotos`).not.toBeNull();
      for (const largura of dados!.larguras) {
        expect(existsSync(join(process.cwd(), 'public/midia', `${foto.arquivo}-${largura}.webp`))).toBe(true);
      }
    }
  });
});

describe('publicação por data (FR-04)', () => {
  const base: Omit<Noticia, 'slug' | 'data' | 'titulo'> = noticias[0]!;
  const nova = (slug: string, data: string, titulo = slug): Noticia => ({ ...base, slug, data, titulo });

  it('não publica notícia com data futura e ordena da mais recente para a mais antiga', () => {
    const lista = [nova('a', '2026-09-01'), nova('futura', '2026-12-01'), nova('b', '2026-10-01')];
    expect(publicadas('2026-10-08', lista).map((n) => n.slug)).toEqual(['b', 'a']);
  });

  it('publica no próprio dia', () => {
    expect(publicadas('2026-10-01', [nova('hoje', '2026-10-01')])).toHaveLength(1);
    expect(publicadas('2026-09-30', [nova('hoje', '2026-10-01')])).toHaveLength(0);
  });
});

describe('datas', () => {
  it('formata por extenso e curta, sem deslocar o dia por fuso', () => {
    expect(dataPorExtenso('2026-10-01')).toBe('1 de outubro de 2026');
    expect(dataCurta('2026-10-01')).toBe('01/10/2026');
  });
});
