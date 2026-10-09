'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import {
  deveAvancarSozinho,
  INTERVALO_PADRAO_MS,
  posicaoAnterior,
  proximaPosicao,
  ultimaPosicao,
} from '@/lib/carrossel';
import { Icon } from './Icon';
import styles from './Carousel.module.css';

export type ItemCarrossel = { id: string; conteudo: ReactNode };

type Props = {
  rotulo: string;
  variante: 'fotos' | 'cards';
  itens: ItemCarrossel[];
  /** Nome no singular feminino usado nos rótulos ("foto", "notícia"). */
  nomeItem: string;
  /** Conteúdo exibido quando não há itens (SPEC-002, estado vazio). */
  vazio?: ReactNode;
  intervalo?: number;
  /**
   * Fixa quantos itens aparecem juntos. Sem isso, a variante `cards` mostra 1, 2 ou 3 conforme a largura.
   * Com poucos itens, `1` evita que todos caibam na tela e não haja o que trocar.
   */
  itensPorVez?: number;
  className?: string;
};

function useMedia(consulta: string): boolean {
  return useSyncExternalStore(
    (avisar) => {
      const lista = window.matchMedia(consulta);
      lista.addEventListener('change', avisar);
      return () => lista.removeEventListener('change', avisar);
    },
    () => window.matchMedia(consulta).matches,
    () => false,
  );
}

function usePaginaOculta(): boolean {
  return useSyncExternalStore(
    (avisar) => {
      document.addEventListener('visibilitychange', avisar);
      return () => document.removeEventListener('visibilitychange', avisar);
    },
    () => document.visibilityState === 'hidden',
    () => false,
  );
}

const capitalizar = (texto: string) => texto.charAt(0).toLocaleUpperCase('pt-BR') + texto.slice(1);

/** Carrossel acessível da SPEC-002: avança a cada 6 s, pausa com mouse/foco e tem botão de pausa. */
export function Carousel({
  rotulo,
  variante,
  itens,
  nomeItem,
  vazio = null,
  intervalo = INTERVALO_PADRAO_MS,
  itensPorVez,
  className,
}: Props) {
  const total = itens.length;
  const movimentoReduzido = useMedia('(prefers-reduced-motion: reduce)');
  const desktop = useMedia('(min-width: 1100px)');
  const tablet = useMedia('(min-width: 700px)');
  const paginaOculta = usePaginaOculta();
  const porVez = itensPorVez ?? (variante === 'fotos' ? 1 : desktop ? 3 : tablet ? 2 : 1);

  const [posicao, setPosicao] = useState(0);
  const [pausadoPelaPessoa, setPausadoPelaPessoa] = useState(false);
  const [mouseSobre, setMouseSobre] = useState(false);
  const [focoDentro, setFocoDentro] = useState(false);
  const inicioToque = useRef<number | null>(null);
  const raiz = useRef<HTMLElement>(null);
  const [naTela, setNaTela] = useState(false);
  // Gate 6: só monta (e baixa) os itens visíveis e, com o carrossel na tela, os próximos.
  const [montados, setMontados] = useState<ReadonlySet<number>>(() => new Set([0]));

  const ultima = ultimaPosicao(total, porVez);
  const atual = Math.min(posicao, ultima);
  const avancando = deveAvancarSozinho({
    total,
    porVez,
    pausadoPelaPessoa,
    mouseSobre,
    focoDentro,
    movimentoReduzido,
    paginaOculta,
  });

  useEffect(() => {
    const elemento = raiz.current;
    if (!elemento || typeof IntersectionObserver === 'undefined') return;
    const observador = new IntersectionObserver(([entrada]) => setNaTela(Boolean(entrada?.isIntersecting)), {
      rootMargin: '200px',
    });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [total]);

  // Ajuste de estado durante a renderização (padrão do React para estado derivado que acumula).
  const necessarios = Array.from({ length: porVez }, (_, i) => atual + i);
  if (naTela) necessarios.push(proximaPosicao(atual, total, porVez) + porVez - 1);
  if (!necessarios.every((i) => montados.has(i))) {
    setMontados(new Set([...montados, ...necessarios]));
  }

  // O temporizador recomeça a cada troca, inclusive manual: sempre 6 s inteiros por item.
  useEffect(() => {
    if (!avancando) return;
    const temporizador = window.setTimeout(() => setPosicao(proximaPosicao(atual, total, porVez)), intervalo);
    return () => window.clearTimeout(temporizador);
  }, [avancando, atual, intervalo, porVez, total]);

  if (total === 0) return <>{vazio}</>;

  const nome = capitalizar(nomeItem);
  const comControles = total > porVez;
  const irPara = (indice: number) => setPosicao(Math.max(0, Math.min(indice, ultima)));

  return (
    <section
      ref={raiz}
      className={[styles.carrossel, styles[variante], className].filter(Boolean).join(' ')}
      aria-roledescription="carrossel"
      aria-label={rotulo}
      onMouseEnter={() => setMouseSobre(true)}
      onMouseLeave={() => setMouseSobre(false)}
      onFocus={() => setFocoDentro(true)}
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) setFocoDentro(false);
      }}
    >
      <div
        className={styles.trilho}
        data-testid="carrossel-trilho"
        aria-live={avancando ? 'off' : 'polite'}
        style={variante === 'cards' ? { transform: `translateX(-${(atual * 100) / porVez}%)` } : undefined}
        onPointerDown={(evento) => {
          inicioToque.current = evento.clientX;
        }}
        onPointerUp={(evento) => {
          if (inicioToque.current === null || !comControles) return;
          const deslocamento = evento.clientX - inicioToque.current;
          inicioToque.current = null;
          if (Math.abs(deslocamento) < 40) return;
          setPosicao(deslocamento < 0 ? proximaPosicao(atual, total, porVez) : posicaoAnterior(atual, total, porVez));
        }}
      >
        {itens.map((item, indice) => {
          const visivel = indice >= atual && indice < atual + porVez;
          return (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${indice + 1} de ${total}`}
              className={styles.slide}
              data-ativo={visivel || undefined}
              style={variante === 'cards' ? { flexBasis: `${100 / porVez}%` } : undefined}
              inert={!visivel}
            >
              {montados.has(indice) || visivel ? item.conteudo : null}
            </div>
          );
        })}
      </div>

      {comControles && (
        <div className={styles.controles}>
          <button
            type="button"
            className={styles.botao}
            aria-label={`${nome} anterior`}
            onClick={() => setPosicao(posicaoAnterior(atual, total, porVez))}
          >
            <Icon name="chevronLeft" size={20} strokeWidth={2} />
          </button>
          <div className={styles.indicadores}>
            {Array.from({ length: ultima + 1 }, (_, indice) => (
              <button
                key={indice}
                type="button"
                className={styles.indicador}
                aria-label={`Ir para ${nomeItem} ${indice + 1} de ${ultima + 1}`}
                aria-current={indice === atual ? 'true' : undefined}
                onClick={() => irPara(indice)}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.botao}
            aria-label={`Próxima ${nomeItem}`}
            onClick={() => setPosicao(proximaPosicao(atual, total, porVez))}
          >
            <Icon name="chevronRight" size={20} strokeWidth={2} />
          </button>
          {!movimentoReduzido && (
            <button
              type="button"
              className={styles.botao}
              aria-label={pausadoPelaPessoa ? 'Reproduzir carrossel' : 'Pausar carrossel'}
              onClick={() => setPausadoPelaPessoa((valor) => !valor)}
            >
              <Icon name={pausadoPelaPessoa ? 'play' : 'pause'} size={18} strokeWidth={2} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
