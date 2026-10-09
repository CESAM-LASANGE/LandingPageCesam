import '@testing-library/jest-dom/vitest';

// jsdom não implementa matchMedia. Padrão: sem preferência de movimento reduzido, tela larga.
// Testes podem sobrescrever com `mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })`.
type Consultas = Record<string, boolean>;
let consultas: Consultas = {};

export function mockMatchMedia(novas: Consultas) {
  consultas = novas;
}

beforeEach(() => {
  consultas = {};
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: consultas[query] ?? false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom não tem IntersectionObserver: o carrossel é considerado sempre visível nos testes.
class IntersectionObserverFalso {
  constructor(private avisar: IntersectionObserverCallback) {}
  observe(alvo: Element) {
    this.avisar([{ isIntersecting: true, target: alvo } as IntersectionObserverEntry], this as never);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: IntersectionObserverFalso });
