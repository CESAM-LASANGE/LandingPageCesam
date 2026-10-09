import { publicacoes } from './publicacoes';

describe('produção científica (SPEC-006)', () => {
  it('só inclui trabalhos com dois ou mais integrantes do CESAM', () => {
    for (const p of publicacoes) {
      expect(p.autores.filter((a) => a.cesam).length, p.titulo).toBeGreaterThanOrEqual(2);
    }
  });

  it('está em ordem da mais recente para a mais antiga e sem DOIs repetidos', () => {
    const anos = publicacoes.map((p) => p.ano);
    expect(anos).toEqual([...anos].sort((a, b) => b - a));
    expect(new Set(publicacoes.map((p) => p.doi.toLowerCase())).size).toBe(publicacoes.length);
  });

  it('tem título, autores e links válidos (https para o PDF, DOI no formato 10.x/...)', () => {
    for (const p of publicacoes) {
      expect(p.titulo.trim().length).toBeGreaterThan(10);
      expect(p.titulo, 'título em caixa alta').not.toBe(p.titulo.toLocaleUpperCase('pt-BR'));
      expect(p.autores.every((a) => a.nome.trim().length > 3)).toBe(true);
      expect(p.doi).toMatch(/^10\.\d{4,9}\/\S+$/);
      if (p.pdf) expect(p.pdf).toMatch(/^https:\/\//);
    }
  });
});
