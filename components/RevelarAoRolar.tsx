'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Gatilho de rolagem: quando o bloco aparece na tela, os filhos sobem "vindo de baixo", em sequência.
 * Sem JS ou com "reduzir movimento", o conteúdo fica visível e parado. Se o bloco já estiver na tela
 * ao carregar, nada é escondido. A animação em si está no CSS do módulo de quem usa (`data-estado`).
 */
export function RevelarAoRolar({ className, children }: { className?: string; children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    el.dataset.estado = 'oculto';
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        el.dataset.estado = 'visivel';
        observador.disconnect();
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={raiz} className={className}>
      {children}
    </div>
  );
}
