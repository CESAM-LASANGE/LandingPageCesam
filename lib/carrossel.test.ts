import {
  deveAvancarSozinho,
  itensPorVez,
  posicaoAnterior,
  proximaPosicao,
  ultimaPosicao,
  type EstadoReproducao,
} from './carrossel';

const base: EstadoReproducao = {
  total: 3,
  porVez: 1,
  pausadoPelaPessoa: false,
  mouseSobre: false,
  focoDentro: false,
  movimentoReduzido: false,
  paginaOculta: false,
};

describe('posições do carrossel (SPEC-002)', () => {
  it('avança e volta ao início depois do último (FR-08)', () => {
    expect([0, 1, 2].map((i) => proximaPosicao(i, 3))).toEqual([1, 2, 0]);
  });

  it('volta para o último a partir do primeiro', () => {
    expect([0, 1, 2].map((i) => posicaoAnterior(i, 3))).toEqual([2, 0, 1]);
  });

  it('com vários itens por vez, para na última posição que ainda enche a tela', () => {
    expect(ultimaPosicao(6, 3)).toBe(3);
    expect(proximaPosicao(3, 6, 3)).toBe(0);
    expect(posicaoAnterior(0, 6, 3)).toBe(3);
    expect(ultimaPosicao(2, 3)).toBe(0);
  });

  it('mostra 1, 2 ou 3 cards conforme a largura; fotos sempre 1', () => {
    expect([390, 768, 1440].map((w) => itensPorVez('cards', w))).toEqual([1, 2, 3]);
    expect(itensPorVez('fotos', 1440)).toBe(1);
  });
});

describe('reprodução automática', () => {
  it('avança quando nada impede', () => {
    expect(deveAvancarSozinho(base)).toBe(true);
  });

  it.each([
    ['mouse sobre (FR-02)', { mouseSobre: true }],
    ['foco dentro (FR-02)', { focoDentro: true }],
    ['pausado pela pessoa (FR-03)', { pausadoPelaPessoa: true }],
    ['movimento reduzido (FR-06)', { movimentoReduzido: true }],
    ['página em segundo plano', { paginaOculta: true }],
    ['item único (FR-07)', { total: 1 }],
    ['todos os cards já visíveis', { total: 3, porVez: 3 }],
  ])('não avança com %s', (_, mudanca) => {
    expect(deveAvancarSozinho({ ...base, ...mudanca })).toBe(false);
  });
});
