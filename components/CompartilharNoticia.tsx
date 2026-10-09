'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Noticia } from '@/content/noticias';
import {
  fotoComoJpeg,
  montarLegenda,
  nomeDoArquivo,
  urlDaCapaParaCompartilhar,
  urlDaNoticia,
} from '@/lib/compartilhar';
import styles from './CompartilharNoticia.module.css';

type Props = {
  noticia: Pick<Noticia, 'slug' | 'titulo' | 'resumo' | 'capa'>;
  /** Baixa a capa e a converte em JPEG. Injetável para teste. */
  converter?: (url: string, nome: string) => Promise<File>;
};

type Estado = { tipo: 'parado' } | { tipo: 'ocupado' } | { tipo: 'aviso'; texto: string };

const TOQUE = '(pointer: coarse)';

function assinarToque(avisar: () => void) {
  const consulta = window.matchMedia(TOQUE);
  consulta.addEventListener('change', avisar);
  return () => consulta.removeEventListener('change', avisar);
}
const temToque = () => window.matchMedia(TOQUE).matches;
const semToqueNoServidor = () => false;

/** Compartilhar a notícia com a foto de capa, só em aparelhos com toque (SPEC-008). */
export function CompartilharNoticia({ noticia, converter = fotoComoJpeg }: Props) {
  const toque = useSyncExternalStore(assinarToque, temToque, semToqueNoServidor);
  const [estado, setEstado] = useState<Estado>({ tipo: 'parado' });
  const secao = useRef<HTMLElement>(null);
  const fotoPronta = useRef<Promise<File> | null>(null);
  const urlDaCapa = urlDaCapaParaCompartilhar(noticia.capa.arquivo);

  /**
   * A foto é preparada uma vez, quando o bloco entra na tela, e reaproveitada nos toques.
   * Assim o menu de compartilhamento abre na hora (o iPhone exige que ele abra logo após o toque).
   */
  function obterFoto(): Promise<File> {
    if (!urlDaCapa) return Promise.reject(new Error('Capa sem versão otimizada'));
    if (!fotoPronta.current) {
      const promessa = converter(urlDaCapa, nomeDoArquivo(noticia.slug));
      promessa.catch(() => {
        if (fotoPronta.current === promessa) fotoPronta.current = null;
      });
      fotoPronta.current = promessa;
    }
    return fotoPronta.current;
  }

  useEffect(() => {
    if (!toque || !secao.current) return;
    const observador = new IntersectionObserver((entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      observador.disconnect();
      obterFoto().catch(() => {});
    });
    observador.observe(secao.current);
    return () => observador.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- obterFoto só depende de props estáveis da página
  }, [toque]);

  if (!toque) return null;

  const ocupado = estado.tipo === 'ocupado';
  const aviso = estado.tipo === 'aviso' ? estado.texto : '';
  const podeUsarMenu = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  async function compartilhar() {
    setEstado({ tipo: 'ocupado' });
    const dados: ShareData = {
      title: noticia.titulo,
      text: noticia.resumo,
      url: urlDaNoticia(noticia.slug),
    };
    try {
      const foto = await obterFoto().catch(() => null);
      if (foto && navigator.canShare?.({ files: [foto] })) dados.files = [foto];
      await navigator.share(dados);
      setEstado({ tipo: 'parado' });
    } catch (erro) {
      // Cancelar o menu não é erro (FR-06).
      if (erro instanceof DOMException && erro.name === 'AbortError') setEstado({ tipo: 'parado' });
      else setEstado({ tipo: 'aviso', texto: 'Não foi possível compartilhar. Baixe a foto e copie a legenda.' });
    }
  }

  async function baixar() {
    setEstado({ tipo: 'ocupado' });
    try {
      const foto = await obterFoto();
      const endereco = URL.createObjectURL(foto);
      const link = document.createElement('a');
      link.href = endereco;
      link.download = foto.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(endereco), 1000);
      setEstado({ tipo: 'aviso', texto: 'Foto baixada.' });
    } catch {
      setEstado({ tipo: 'aviso', texto: 'Não foi possível preparar a foto. Tente de novo mais tarde.' });
    }
  }

  async function copiarLegenda() {
    try {
      await navigator.clipboard.writeText(montarLegenda(noticia));
      setEstado({ tipo: 'aviso', texto: 'Legenda copiada. Cole no Instagram.' });
    } catch {
      setEstado({ tipo: 'aviso', texto: 'Não foi possível copiar. Selecione o título e o resumo da notícia.' });
    }
  }

  return (
    <section ref={secao} className={styles.bloco} aria-labelledby="compartilhar-titulo">
      <h2 id="compartilhar-titulo" className={styles.titulo}>
        Compartilhe esta notícia
      </h2>
      <p className={styles.apoio}>
        No Instagram, a legenda não vai junto com a foto: toque em “Copiar legenda” e cole na sua postagem.
      </p>
      <div className={styles.acoes}>
        {podeUsarMenu && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={compartilhar}
            disabled={ocupado}
            aria-busy={ocupado}
          >
            {ocupado ? 'Preparando a foto…' : 'Compartilhar a notícia'}
            <span className="visually-hidden"> no Instagram ou WhatsApp</span>
          </button>
        )}
        <button type="button" className="btn btn--ghost" onClick={baixar} disabled={ocupado}>
          Baixar a foto
        </button>
        <button type="button" className="btn btn--ghost" onClick={copiarLegenda}>
          Copiar legenda
        </button>
      </div>
      <p className={styles.status} role="status">
        {aviso}
      </p>
    </section>
  );
}
