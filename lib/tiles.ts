/** Mosaico decorativo do card do Observatório: 7×12 células com cores de uma escala sequencial. */
export const TILE_SCALE = ['#EAF6F2', '#B4DDD0', '#7FC4AE', '#45876F', '#0B4A3C'] as const;
const EMPTY = new Set([0, 1, 11, 72, 83]);

export type Tile = { color: string; delay: string };

export function buildTiles(count = 84, columns = 12): Tile[] {
  return Array.from({ length: count }, (_, i) => {
    // Pseudoaleatório determinístico: o mesmo mosaico no servidor e no cliente.
    const v = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    const color = EMPTY.has(i) ? 'transparent' : TILE_SCALE[Math.floor(v * TILE_SCALE.length)]!;
    const delay = `${(((i % columns) + Math.floor(i / columns)) * 0.12).toFixed(2)}s`;
    return { color, delay };
  });
}
