# SPEC-003 — Detalhe das linhas de pesquisa

## Status

Draft (2026-10-08). Os textos serão escritos pela coordenação do CESAM.

## Objetivo

Cada card de "Onde nossa pesquisa atua" mostra uma explicação do que é aquela linha e como funciona, sem tirar a pessoa da página.

## Fora do escopo

Página própria por linha de pesquisa (pode virar spec futura se os textos crescerem).

## Interação (decidida com a coordenação)

| Dispositivo | Abre com                                  | Fecha com                                  |
| ----------- | ----------------------------------------- | ------------------------------------------ |
| Mouse       | passar o mouse sobre o card por 150 ms    | tirar o mouse do card e do painel, Esc     |
| Teclado     | foco no card (botão "Saiba mais") e Enter | Esc (o foco volta ao botão), Tab para fora |
| Toque       | tocar no card                             | tocar fora, botão "Fechar", Esc            |

## Requisitos funcionais

- FR-01: o painel aparece ancorado ao card, sem deslocar os outros cards. No celular, abre como painel inferior (bottom sheet).
- FR-02: só um painel aberto por vez.
- FR-03: o painel mostra título, o texto da linha (parágrafos curtos) e o link "Ver projetos desta linha". Esse link leva à lista de projetos filtrada por linha (SPEC-004) quando ela existir; até lá, a `#projetos`.
- FR-04: segue WCAG 1.4.13 (conteúdo em hover ou foco): **dispensável** (Esc fecha sem mover o mouse), **sobrevoável** (o mouse pode entrar no painel sem que ele feche) e **persistente** (fica aberto até a pessoa sair ou fechar).
- FR-05: sem texto cadastrado, o card não mostra "Saiba mais" e não abre painel.

## Conteúdo

`content/linhas-de-pesquisa/<slug>.md` com: `titulo`, `icone`, `resumo` (o texto curto atual do card), `ordem` e o corpo em Markdown (o texto do painel).

- Limite do corpo: até 900 caracteres, ou cerca de 3 parágrafos curtos. Textos maiores falham o build, para o painel caber sem rolagem.
- Autor: coordenação do CESAM. **O agente não escreve esses textos.**

## Requisitos visuais

- VR-01: painel com o mesmo raio e borda dos cards, sombra `--shadow-lift`, largura máxima de 420 px.
- VR-02: o card de origem mantém o estado "lift" enquanto o painel está aberto.

## Acessibilidade

- A11Y-01: o botão "Saiba mais" usa `aria-expanded` e `aria-controls`; o painel tem `role="region"` com o título como rótulo.
- A11Y-02: o foco não fica preso no painel (não é modal), exceto no bottom sheet do celular, que é modal com foco preso e Esc.
- A11Y-03: as animações de abertura respeitam `prefers-reduced-motion`.

## Critérios de aceite

- AC-01: com mouse, passar sobre o card abre o painel, e mover o mouse para dentro do painel não o fecha.
- AC-02: com teclado, Tab até "Saiba mais" e Enter abre; Esc fecha e devolve o foco.
- AC-03: no celular (390 px), tocar abre o bottom sheet, e "Fechar" fecha.
- AC-04: axe sem violações com o painel aberto.

## Testes determinísticos

- T-01 (componente): `aria-expanded`, um aberto por vez, Esc, ausência de "Saiba mais" sem texto.
- T-02 (e2e desktop): hover com atraso, sobrevoo do painel, teclado.
- T-03 (e2e mobile): toque e bottom sheet.
- T-04 (conteúdo): limite de 900 caracteres e campos obrigatórios.

## Evals qualitativos

- E-01 EVAL-CONTENT-002: os textos são claros para o público leigo e não fazem afirmações sem fonte.
