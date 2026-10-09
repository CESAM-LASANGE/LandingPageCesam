import manifesto from '@/content/midia/manifesto.json';

export type FotoManifesto = { largura: number; altura: number; larguras: number[]; cor: string };

const fotos = manifesto as Record<string, FotoManifesto>;

/** Dados de uma foto otimizada, ou `null` se ela não estiver no manifesto. */
export function fotoDoManifesto(arquivo: string): FotoManifesto | null {
  return fotos[arquivo] ?? null;
}

export function urlDaFoto(arquivo: string, largura: number): string {
  return `/midia/${arquivo}-${largura}.webp`;
}

/** `srcset` com todas as larguras geradas, da menor para a maior. */
export function srcSetDaFoto(arquivo: string, foto: FotoManifesto): string {
  return foto.larguras.map((largura) => `${urlDaFoto(arquivo, largura)} ${largura}w`).join(', ');
}
