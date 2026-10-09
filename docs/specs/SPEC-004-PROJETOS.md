# SPEC-004 — Projetos: lista e página de cada projeto

## Status

**Suspensa em 2026-10-08:** a coordenação retirou a seção "Projetos em destaque" da home. Esta spec fica como referência para quando houver projetos reais; ao retomá-la, é preciso devolver a seção, o item "Projetos" do menu e o link "Ver projetos" das linhas de pesquisa (SPEC-003 FR-03).

---

Draft (2026-10-08). Campos aprovados pela coordenação. O modelo final será ajustado com os primeiros projetos enviados.

## Objetivo

Cada projeto tem uma página própria, e o site comporta muitos projetos ao longo do tempo sem retrabalho.

## Fora do escopo

Busca textual, área de edição online (ver ADR-002) e inscrição em projetos.

## Rotas

- `/projetos/`: todos os projetos, com filtro por status (Em andamento / Concluído) e por linha de pesquisa. É o destino de "Todos os projetos".
- `/projetos/<slug>/`: página do projeto.
- A home continua com até 3 cards "Projetos em destaque" (`destaque: true`, os mais recentes primeiro). Cada card é um link para a página do projeto.

## Conteúdo (`content/projetos/<slug>.md`)

| Campo            | Obrigatório  | Observação                                                                    |
| ---------------- | ------------ | ----------------------------------------------------------------------------- |
| `titulo`         | sim          |                                                                               |
| `status`         | sim          | `em-andamento` ou `concluido`                                                 |
| `inicio` / `fim` | `inicio` sim | ano ou mês/ano; `fim` vazio se em andamento                                   |
| `resumo`         | sim          | até 220 caracteres; usado no card e na meta description                       |
| `coordenacao`    | sim          | slug(s) de `content/equipe/` ou nome livre                                    |
| `equipe`         | não          | slugs de `content/equipe/`                                                    |
| `financiamento`  | não          | agência(s) e número do processo, se público                                   |
| `linhas`         | sim          | slugs de `content/linhas-de-pesquisa/`                                        |
| `capa`           | sim          | foto + `alt` (ADR-003)                                                        |
| `galeria`        | não          | lista de fotos + `alt`                                                        |
| `publicacoes`    | não          | slugs de `content/publicacoes/`                                               |
| `destaque`       | não          | aparece na home                                                               |
| corpo            | sim          | seções em Markdown: **Objetivos**, **Metodologia** (opcional), **Resultados** |

Referências para equipe, linhas ou publicações inexistentes falham o build.

## Requisitos funcionais

- FR-01: a página do projeto mostra trilha (Início › Projetos › título), capa, status, período, coordenação, financiamento, corpo, galeria, equipe com links e publicações relacionadas com links.
- FR-02: a lista filtra por status e linha de pesquisa, com os filtros refletidos na URL (`?status=em-andamento`), para poder compartilhar.
- FR-03: há "Voltar para projetos" e links para o projeto anterior e o próximo.
- FR-04: a lista é ordenada por status (em andamento primeiro) e depois por data de início, da mais recente para a mais antiga.

## Requisitos visuais

- VR-01: os cards da lista reutilizam o card de projeto da home.
- VR-02: a página de detalhe segue a tipografia e os espaçamentos de DESIGN_SYSTEM.md. Será feito um artboard novo no canvas de design para aprovação antes da implementação.

## SEO / Metadados

- SEO-01: title "<título> · Projetos · CESAM", description = `resumo`, canonical, Open Graph com a capa.
- SEO-02: JSON-LD `ResearchProject`.
- SEO-03: todas as páginas no `sitemap.xml`.

## Acessibilidade

- A11Y-01: um único `h1` (título do projeto); seções do corpo com `h2`.
- A11Y-02: filtros com `aria-pressed` e anúncio da contagem, como em Publicações (SPEC-001 FR-06).

## Estados

- Empty: filtro sem resultado mostra "Nenhum projeto com esses filtros" e "Limpar filtros".
- 404: slug inexistente leva à página "Página não encontrada".

## Critérios de aceite

- AC-01: cada arquivo em `content/projetos/` gera uma página acessível pela lista e pela home (se em destaque).
- AC-02: adicionar um projeto exige só criar um arquivo e as fotos, sem tocar em código.
- AC-03: links quebrados entre projetos, equipe e publicações são impossíveis, porque o build falha.

## Testes determinísticos

- T-01 (unit): validação do schema, ordenação, filtros e resolução de referências.
- T-02 (build): número de páginas geradas = número de arquivos; todas no sitemap.
- T-03 (e2e): home → card → página; lista → filtro → URL; 404; axe e overflow em 4 viewports.

## Evals qualitativos

- E-01 EVAL-VIS-002: página de detalhe comparada ao artboard aprovado.
- E-02 EVAL-CONTENT-002: o texto publicado corresponde ao material enviado, sem acréscimos.
