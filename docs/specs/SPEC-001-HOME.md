# SPEC-001 — Home

## Status

Implementada (visual e comportamento). **Conteúdo institucional pendente**: ver "Pendências de conteúdo".

Revisão 2026-10-08: faixa de números removida da home (FR-05) e Notícias e Projetos trocados de posição; as seções Sobre, Pesquisa, Projetos, Equipe, Publicações e Notícias passam a seguir as SPEC-002 a SPEC-007.

## Objetivo

Ser a principal porta de entrada do CESAM, comunicando rapidamente identidade, propósito e caminhos para os conteúdos prioritários.

## Referência visual

Design aprovado: https://claude.ai/artifact/S49NxNehQCq65MFCghVkuN (artboards Desktop · 1440 e Mobile · 390). Tokens: `docs/design/DESIGN_SYSTEM.md`.

## Fora do escopo

Páginas internas: ficam nas specs próprias (projetos: SPEC-004; publicações: SPEC-006; notícias: SPEC-007). Equipe completa, idioma EN, busca, CMS e backend do formulário continuam fora do escopo.

## Requisitos funcionais

- FR-01: navegação global consistente. No desktop (≥ 1100 px), os links aparecem em linha. Abaixo disso, ficam num menu com botão (`aria-expanded`), que fecha com Esc ou ao escolher um item.
- FR-02: mostrar a identidade e a mensagem institucional principal num único `h1`.
- FR-03: levar aos conteúdos prioritários. O Observatório de Saneamento abre em nova aba. Os cards de pesquisa não têm link.
- FR-04: ter um rodapé institucional com navegação, links institucionais, redes e copyright.
- FR-05: seções, nesta ordem: barra UEMS, header, hero (`#inicio`), plataformas, sobre, pesquisa, **notícias**, equipe, publicações, contato, rodapé. A seção "Projetos em destaque" foi **removida da home em 2026-10-08**, por decisão da coordenação, junto com o item "Projetos" do menu e do rodapé e o link "Ver projetos" dos cards de pesquisa. O componente (`components/Projects`) e os textos de exemplo ficam no repositório, desligados, e voltam quando houver projetos reais.
  - A faixa de números (pesquisadores, projetos, publicações, ano de fundação) foi **removida** por decisão da coordenação em 2026-10-08 e volta quando houver números oficiais. O componente e os dados ficam no repositório, desligados.
- FR-09: a seção Sobre usa o carrossel de fotos (SPEC-002, variante `fotos`) no lugar do placeholder. **Implementado em 2026-10-08.** Sem fotos cadastradas, volta o placeholder.
- FR-10: os cards de "Onde nossa pesquisa atua" abrem a explicação de cada linha (SPEC-003).
- FR-11: ~~os cards de "Projetos em destaque" levam à página do projeto (SPEC-004)~~. Suspenso: a seção está fora da home.
- FR-12: os cards da equipe mostram foto, nome e função (SPEC-005).
- FR-13: as linhas de "Produção científica recente" levam à página da publicação (SPEC-006).
- FR-14: "Acontece no CESAM" vira carrossel de notícias, com cada uma levando à sua página (SPEC-007).
- FR-06: o filtro de publicações por tipo (Todas, Artigos, Livros e capítulos, Dissertações e teses, Eventos) usa `aria-pressed`, anuncia a contagem e tem estado vazio.
- FR-07: o formulário de contato valida nome, e-mail, assunto e mensagem (10 a 2000 caracteres) e abre o `mailto:` preenchido para cesam@uems.br. Se o e-mail institucional for removido da configuração, informa que o envio não está disponível.
- FR-15: a seção Contato mostra e-mail e telefone como links (`mailto:` e `tel:`) e o mapa de localização. O mapa do Google só é carregado depois do clique em "Carregar mapa", com aviso de que o Google recebe o acesso (SECURITY.md); o link "Abrir no Google Maps" fica sempre visível.
- FR-08: um link cujo destino não está definido nunca é publicado como `href="#"`. Ele aparece como texto pendente.

## Requisitos visuais

- VR-01: seguir o DESIGN_SYSTEM.md, com os desvios documentados ali.

## Responsividade

- RWD-01: sem overflow horizontal em 320, 390, 768 e 1440 px.
- RWD-02: o mobile segue o artboard 390: ilustração antes do título, projetos em carrossel e 4 membros da equipe. As notícias seguem a SPEC-007 (carrossel com 1 card por vez).

## Acessibilidade

- A11Y-01: axe sem violações WCAG 2.2 A/AA nos quatro viewports.
- A11Y-02: skip link, foco visível, hierarquia de headings sem saltos, alvos ≥ 24 px (os principais ≥ 44 px), e movimento desligado com `prefers-reduced-motion`.

## SEO / Metadados

- SEO-01: `lang="pt-BR"`, title, description, canonical, Open Graph, Twitter card, JSON-LD `ResearchOrganization`, `robots.txt` e `sitemap.xml`.

## Estados

- Empty: filtro de publicações sem itens.
- Error: erros de validação do formulário, ligados via `aria-describedby`, com foco no primeiro campo inválido.
- Success: mensagem de status após abrir o `mailto:`.
- Loading: não se aplica (site estático).

## Critérios de aceite

- AC-01: todos os links e CTAs visíveis funcionam, ou são marcados como pendentes sem `href`.
- AC-02: a página é utilizável nos viewports definidos em `RESPONSIVE.md`.
- AC-03: não há erros de console no fluxo normal.
- AC-04: elementos interativos são acessíveis por teclado.
- AC-05: metadados essenciais estão presentes.

## Testes determinísticos

- T-01 `app/page.test.tsx`: estrutura, ordem das seções, âncoras válidas, ausência de `href="#"`, menu, filtro e formulário.
- T-02 `lib/*.test.ts`, `content/site.test.ts`: validação, `mailto`, mosaico determinístico, formato dos destinos. O teste que exige os placeholders dos números muda junto com a remoção da faixa (FR-05).
- T-03 `tests/e2e/home.spec.ts` (4 viewports): console, axe, overflow, metadados, ativos, tamanho de alvos, skip link, navegação e screenshot de referência.

## Evals qualitativos

- E-01 EVAL-VIS-001: comparar os screenshots de `tests/e2e/home.spec.ts-snapshots/` com os artboards.
- E-02 EVAL-CONTENT-001: verificar que nenhum placeholder `[...]` foi trocado por fato inventado.

## Pendências de conteúdo (bloqueiam a publicação, não o desenvolvimento)

Fonte: `content/site.ts` (buscar `PENDENTE` e `[`).

- Números institucionais (pesquisadores, projetos, publicações, ano de fundação): só quando a faixa voltar.
- Projetos, equipe, coordenação, Lattes, publicações e DOIs, notícias e imagens reais.
- ~~Endereço, e-mail institucional, telefone e mapa~~ (resolvido em 2026-10-08: cesam@uems.br, (67) 3902-2547, UEMS em Dourados e mapa do Google). Ainda pendentes: rua, número e CEP, se a coordenação quiser mostrá-los, e o horário de atendimento.
- Foto da equipe e unidade/campus do laboratório.
- URLs: Portal de Resíduos Sólidos, Acessibilidade, Pró-Reitoria de Pesquisa, Pós-graduação, Instagram, YouTube, Diretório CNPq, páginas "ver todos".
- Validação dos textos do design (hero, sobre, missão/visão/valores, linhas de pesquisa).
- Domínio definitivo (`site.url`, hoje `cesam.example.org`).
