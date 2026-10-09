import type { Noticia } from '@/content/noticias';
import { site } from '@/content/site';
import { fotoDoManifesto, urlDaFoto } from './fotos';

/** Largura máxima, em px, da foto enviada ao menu de compartilhamento (SPEC-008 FR-08). */
export const LARGURA_MAXIMA = 1080;

type DadosDaNoticia = Pick<Noticia, 'slug' | 'titulo' | 'resumo'>;

/** Endereço absoluto da notícia, o mesmo do canonical. */
export function urlDaNoticia(slug: string): string {
  return `${site.url}/noticias/${slug}/`;
}

/** Legenda para colar no Instagram: título, resumo e link (SPEC-008 FR-04). */
export function montarLegenda(n: DadosDaNoticia): string {
  return `${n.titulo}\n\n${n.resumo}\n\nLeia a notícia: ${urlDaNoticia(n.slug)}`;
}

export function nomeDoArquivo(slug: string): string {
  return `cesam-${slug}.jpg`;
}

/** Maior versão WebP já publicada da capa, ou `null` se ela não estiver no manifesto. */
export function urlDaCapaParaCompartilhar(arquivo: string): string | null {
  const largura = fotoDoManifesto(arquivo)?.larguras.at(-1);
  return largura ? urlDaFoto(arquivo, largura) : null;
}

/**
 * Baixa a capa e a converte para JPEG de até `LARGURA_MAXIMA` px, no próprio aparelho.
 * O WebP nem sempre é aceito pelo menu de compartilhamento nem pelo Instagram.
 */
export async function fotoComoJpeg(url: string, nome: string): Promise<File> {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Falha ao baixar a foto (${resposta.status})`);
  const imagem = await createImageBitmap(await resposta.blob());
  const escala = Math.min(1, LARGURA_MAXIMA / imagem.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(imagem.width * escala);
  canvas.height = Math.round(imagem.height * escala);
  const contexto = canvas.getContext('2d');
  if (!contexto) throw new Error('Canvas indisponível');
  contexto.fillStyle = '#fff';
  contexto.fillRect(0, 0, canvas.width, canvas.height);
  contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
  imagem.close();
  const blob = await new Promise<Blob | null>((resolver) => canvas.toBlob(resolver, 'image/jpeg', 0.9));
  if (!blob) throw new Error('Não foi possível gerar o JPEG');
  return new File([blob], nome, { type: 'image/jpeg' });
}
