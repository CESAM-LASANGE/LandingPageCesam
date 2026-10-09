/** Regras puras do carrossel (SPEC-002), separadas do componente para teste. */

export const INTERVALO_PADRAO_MS = 6000;

/** Última posição inicial possível quando `porVez` itens aparecem juntos. */
export function ultimaPosicao(total: number, porVez: number): number {
  return Math.max(0, total - Math.max(1, porVez));
}

/** Próxima posição; depois da última, volta à primeira (FR-08). */
export function proximaPosicao(atual: number, total: number, porVez = 1): number {
  const ultima = ultimaPosicao(total, porVez);
  return atual >= ultima ? 0 : atual + 1;
}

export function posicaoAnterior(atual: number, total: number, porVez = 1): number {
  const ultima = ultimaPosicao(total, porVez);
  return atual <= 0 ? ultima : Math.min(atual - 1, ultima);
}

export type EstadoReproducao = {
  total: number;
  porVez: number;
  pausadoPelaPessoa: boolean;
  mouseSobre: boolean;
  focoDentro: boolean;
  movimentoReduzido: boolean;
  paginaOculta: boolean;
};

/** Avança sozinho? FR-01, FR-02, FR-06, FR-07. */
export function deveAvancarSozinho(estado: EstadoReproducao): boolean {
  return (
    estado.total > estado.porVez &&
    !estado.pausadoPelaPessoa &&
    !estado.mouseSobre &&
    !estado.focoDentro &&
    !estado.movimentoReduzido &&
    !estado.paginaOculta
  );
}

/** Quantos itens aparecem juntos na variante `cards` (1 celular, 2 tablet, 3 desktop). */
export function itensPorVez(variante: 'fotos' | 'cards', larguraJanela: number): number {
  if (variante === 'fotos') return 1;
  if (larguraJanela >= 1100) return 3;
  if (larguraJanela >= 700) return 2;
  return 1;
}
