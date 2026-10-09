# SPEC-002 — Componente de carrossel

## Status

Implementada em 2026-10-08 na seção Sobre (variante `fotos`). A variante `cards` existe no componente e é testada, mas só entra na home com a SPEC-007 (Notícias).

Implementação: `components/Carousel.tsx`, `components/Foto.tsx`, `lib/carrossel.ts`.

Desvios provisórios, até a aprovação dos ADRs:

- **Conteúdo:** fica em `content/galeria.ts` (TypeScript), e não em `content/sobre/galeria.md`, enquanto o ADR-002 não é aprovado.
- **Fotos:** são otimizadas por `npm run fotos` (`scripts/otimizar-fotos.sh`, ImageMagick), e não pelo `sharp` no build, enquanto o ADR-003 não é aprovado. As versões geradas ficam em `public/midia/` e o manifesto em `content/midia/manifesto.json`. Os originais ficam em `content/midia/` e não são publicados.

## Objetivo

Um único componente de carrossel acessível, reutilizado em dois lugares, que troca o conteúdo automaticamente sem prejudicar quem usa teclado, leitor de tela ou prefere menos movimento.

## Fora do escopo

Gestos avançados (zoom, arrastar com inércia), vídeo, carrossel em tela cheia (lightbox).

## Variantes

| Variante | Onde              | Itens visíveis                      | Transição                  |
| -------- | ----------------- | ----------------------------------- | -------------------------- |
| `fotos`  | Sobre o CESAM     | 1                                   | troca suave (crossfade)    |
| `cards`  | Acontece no CESAM | 1 (mobile), 2 (tablet), 3 (desktop) | deslize de um card por vez |

## Requisitos funcionais

- FR-01: avança sozinho a cada **6 segundos**.
- FR-02: pausa enquanto o mouse está sobre o carrossel e enquanto algum elemento dentro dele tem foco. Retoma ao sair, se a pessoa não tiver pausado manualmente.
- FR-03: tem botão visível de **pausar/reproduzir** (WCAG 2.2.2), com rótulo que muda ("Pausar carrossel" / "Reproduzir carrossel").
- FR-04: tem botões "Anterior" e "Próximo" e indicadores de posição clicáveis ("Ir para foto 3 de 7").
- FR-05: no celular, aceita deslizar o dedo para os lados.
- FR-06: com `prefers-reduced-motion: reduce`, não avança sozinho e troca sem animação. Os controles manuais continuam funcionando.
- FR-07: com um único item, não mostra controles e não anima.
- FR-08: depois do último item, volta ao primeiro.
- FR-09: avançar sozinho não move o foco nem rola a página.

## Requisitos visuais

- VR-01: os controles seguem DESIGN_SYSTEM.md (botões redondos de 44 px, foco visível).
- VR-02: a variante `fotos` mantém a proporção e o raio do placeholder atual do Sobre (540×460 no desktop, 24 px de raio). Legenda opcional sobre um gradiente sutil no rodapé da foto.
- VR-03: transição de no máximo 600 ms.

## Responsividade

- RWD-01: sem overflow horizontal em 320, 390, 768 e 1440 px.
- RWD-02: a altura não muda ao trocar de item, para não deslocar o conteúdo abaixo.

## Acessibilidade

- A11Y-01: `<section aria-roledescription="carrossel" aria-label="…">`. Cada item é um `group` com `aria-roledescription="slide"` e rótulo "N de total".
- A11Y-02: durante a reprodução automática, a região é `aria-live="off"`. Com navegação manual, passa a `polite`.
- A11Y-03: itens fora da tela ficam `inert` e fora da ordem de Tab.
- A11Y-04: toda foto tem `alt` (ADR-003).
- A11Y-05: contraste da legenda sobre a foto ≥ 4,5:1.

## Conteúdo

- Sobre: `content/galeria.ts` (provisório; destino final `content/sobre/galeria.md`, ADR-002), com lista de fotos: arquivo, `alt`, legenda opcional, `ajuste` (`cobrir` ou `conter`, para fotos de grupo que não podem ser cortadas) e `foco` do recorte.
- Notícias: as notícias mais recentes de SPEC-007, quantidade configurável (padrão 6).

## Desempenho (Gate 6)

- PERF-01: só os itens visíveis são montados e baixados. Quando o carrossel entra na tela (com margem de 200 px), o próximo item também é montado, para a troca não piscar. Os demais entram conforme a navegação.

## Estados

- Empty: sem itens, a seção do Sobre volta a exibir o placeholder atual e a de Notícias exibe "Nenhuma notícia publicada ainda".
- Loading: a primeira foto é carregada com prioridade; as demais com `loading="lazy"`.

## Critérios de aceite

- AC-01: com o mouse fora e sem foco dentro, o item muda em 6 s (± 0,5 s).
- AC-02: com o mouse em cima, ou com foco dentro, nada muda por 12 s.
- AC-03: o botão de pausa interrompe e retoma; o estado é anunciado pelo rótulo.
- AC-04: todos os controles funcionam só com teclado.
- AC-05: com movimento reduzido, nada avança sozinho.
- AC-06: axe sem violações nos quatro viewports.

## Testes determinísticos

- T-01 (unit, timers falsos): avanço a cada 6 s, pausa com hover/foco, retomada, volta ao início, item único.
- T-02 (componente): rótulos, `aria-roledescription`, `inert` nos itens ocultos, botão de pausa.
- T-03 (e2e, 4 viewports): avanço automático, pausa com hover, teclado, `reducedMotion: 'reduce'`, axe, overflow.

## Evals qualitativos

- E-01 EVAL-VIS-002: suavidade e enquadramento das fotos.
- E-02 EVAL-A11Y-001: checagem manual com leitor de tela.

## Definition of Done

Conforme DEFINITION_OF_DONE.md e SPEC-000.
