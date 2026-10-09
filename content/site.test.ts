import * as content from './site';

type AnyRecord = Record<string, unknown>;

function collectHrefs(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => collectHrefs(v, out));
  else if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value as AnyRecord)) {
      if (key === 'href' && typeof v === 'string') out.push(v);
      else collectHrefs(v, out);
    }
  }
  return out;
}

describe('Conteúdo institucional', () => {
  it('só usa destinos válidos: âncora nomeada, https, mailto ou tel', () => {
    const hrefs = collectHrefs(content);
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href, href).toMatch(/^(#[a-z][\w-]*|https:\/\/[^\s]+|mailto:[^\s]+|tel:\+\d+)$/);
    }
  });

  it('mantém placeholders explícitos (não inventa números institucionais)', () => {
    // Remover este teste somente quando a coordenação fornecer os números oficiais.
    expect(content.stats.map((s) => s.value)).toEqual(['[00]', '[00]', '[000]', '[Ano]']);
  });
});
