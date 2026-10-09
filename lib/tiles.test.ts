import { buildTiles, TILE_SCALE } from './tiles';

describe('buildTiles', () => {
  it('gera o mesmo mosaico a cada chamada (sem divergência de hidratação)', () => {
    expect(buildTiles()).toEqual(buildTiles());
  });

  it('gera 84 células com cores da escala e 5 vazias', () => {
    const tiles = buildTiles();
    expect(tiles).toHaveLength(84);
    expect(tiles.filter((t) => t.color === 'transparent')).toHaveLength(5);
    const scale: readonly string[] = TILE_SCALE;
    expect(tiles.every((t) => t.color === 'transparent' || scale.includes(t.color))).toBe(true);
  });
});
