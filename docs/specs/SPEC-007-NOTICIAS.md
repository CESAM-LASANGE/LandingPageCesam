# SPEC-007 — Notícias: carrossel na home e página de cada notícia

## Status

**Notícias implementadas (2026-10-08), cada uma com card na home e página própria:**

1. "Ana Laura Eich defende TCC sobre papel higiênico no vaso sanitário" (defesa em 01/10/2026).
2. "CESAM realiza curso de sonômetro para o 2º Batalhão da Polícia Militar Ambiental" (05/08/2026), com Nélison e Elias como instrutores.
3. "CESAM realiza curso de geoprocessamento para a PMA de Dourados" (08/06/2026), com Nélison e Elias como instrutores.

- **Onde está:** `content/noticias.ts` (provisório, até a aprovação do ADR-002), com a página em `app/noticias/[slug]/`.
- **Home:** carrossel da SPEC-002 com até 6 notícias, trocando a cada 6 segundos, com pausa pelo mouse, pelo foco e por botão. Com até 3 notícias, aparece uma por vez, em destaque (card horizontal), porque 3 cards caberiam juntos e não haveria troca. Com 4 ou mais, mostra 3 cards por vez no desktop, 2 no tablet e 1 no celular.
- **Página:** trilha, categoria e data, título, resumo, capa, texto com subtítulos, galeria de fotos, "Outras notícias" e "Voltar para as notícias". Tem metadados (Open Graph e Twitter), JSON-LD `NewsArticle` e entrada no `sitemap.xml`.
- **Agendamento:** notícia com data futura só entra no build a partir do dia.
- **Pendente:** página `/noticias/` com todas as notícias, paginação e filtro por categoria (hoje o botão "Todas as notícias" foi removido, porque ainda não há destino); o link do PDF do TCC; o build diário que publica as agendadas; os vídeos dos cursos (precisam de legendas e de um componente de vídeo que ainda não existe).
- **Textos:** escritos pelo agente a partir do material enviado, para revisão da coordenação. A lista de itens a confirmar está no comentário de `content/noticias.ts` (banca do TCC, nomes nas fotos, "PMA" lido como Polícia Militar Ambiental, local do curso de sonômetro, carga horária, número de participantes e conteúdo dos cursos).

---

Draft (2026-10-08). Decisão da coordenação: cada notícia tem página própria.

## Objetivo

A seção "Acontece no CESAM" vira um carrossel (SPEC-002, variante `cards`) com as notícias mais recentes, e cada notícia abre uma página.

## Rotas

- `/noticias/`: todas as notícias, das mais recentes para as mais antigas, com filtro por categoria e paginação de 12 por página. É o destino de "Todas as notícias".
- `/noticias/<slug>/`: página da notícia.

## Conteúdo (`content/noticias/<slug>.md`)

| Campo       | Obrigatório | Observação                                                                      |
| ----------- | ----------- | ------------------------------------------------------------------------------- |
| `titulo`    | sim         |                                                                                 |
| `data`      | sim         | `AAAA-MM-DD`; datas futuras não são publicadas até o dia                        |
| `categoria` | sim         | `evento`, `pesquisa`, `extensao`, `defesa`, `visita-tecnica`, `premio`, `outro` |
| `resumo`    | sim         | até 200 caracteres; usado no card e na meta description                         |
| `capa`      | sim         | foto + `alt` (ADR-003)                                                          |
| `galeria`   | não         | fotos + `alt`                                                                   |
| `projetos`  | não         | slugs de `content/projetos/`                                                    |
| `autor`     | não         | quem escreveu                                                                   |
| corpo       | sim         | Markdown                                                                        |

## Requisitos funcionais

- FR-01: o carrossel da home mostra as 6 notícias mais recentes, troca a cada 6 s e pausa com o mouse em cima (SPEC-002).
- FR-02: cada card é um link para a página da notícia.
- FR-03: a página mostra trilha, categoria, data, título (`h1`), capa, corpo, galeria, projetos relacionados e "Outras notícias" (as 3 mais recentes, excluindo a atual).
- FR-04: notícia com `data` futura só aparece no primeiro build a partir dessa data. Isso usa o mesmo build diário de SPEC-006 RP-03.

## SEO / Metadados

- SEO-01: title "<título> · Notícias · CESAM", Open Graph com a capa, JSON-LD `NewsArticle` com `datePublished`.
- SEO-02: no sitemap, com `lastmod`.

## Estados

- Empty: sem notícias, a home mostra "Nenhuma notícia publicada ainda", sem o carrossel.

## Critérios de aceite

- AC-01: cada arquivo gera uma página; a home mostra as 6 mais recentes.
- AC-02: notícia agendada não aparece antes da data.

## Testes determinísticos

- T-01 (unit): ordenação, agendamento por data, paginação, filtro.
- T-02 (e2e): carrossel → página; lista → paginação; axe e overflow.

## Evals qualitativos

- E-01 EVAL-VIS-002: página de notícia comparada ao artboard aprovado.
