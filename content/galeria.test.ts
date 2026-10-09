import { galeriaSobre } from './galeria';
import { fotoDoManifesto } from '@/lib/fotos';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

describe('galeria do Sobre (SPEC-002, A11Y-04)', () => {
  it.each(galeriaSobre.map((f) => [f.arquivo, f]))('%s tem descrição e versões otimizadas', (_, foto) => {
    expect(foto.alt.trim().length, 'alt obrigatório').toBeGreaterThan(15);
    const dados = fotoDoManifesto(foto.arquivo);
    expect(dados, 'rodar scripts/otimizar-fotos.sh').not.toBeNull();
    for (const largura of dados!.larguras) {
      expect(existsSync(join(process.cwd(), 'public/midia', `${foto.arquivo}-${largura}.webp`))).toBe(true);
    }
  });

  it('não repete fotos', () => {
    expect(new Set(galeriaSobre.map((f) => f.arquivo)).size).toBe(galeriaSobre.length);
  });
});
