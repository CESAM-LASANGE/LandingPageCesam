# SPEC-006 — Publicações: lista e página de cada publicação

## Status

**Versão simplificada implementada (2026-10-08), por decisão da coordenação:** sem página por publicação por enquanto. Cada item mostra título, autores, veículo e ano, com um link para o PDF (ou para a página do artigo, quando o PDF não está aberto).

- **Regra de inclusão:** trabalhos com dois ou mais integrantes do CESAM entre os autores. Hoje são 20 (2019–2025), em `content/publicacoes.ts`.
- **Fonte dos dados:** Lattes (prints enviados) e registro de DOI do Crossref. Autores do CESAM aparecem em negrito.
- **Links:** 13 PDFs diretos conferidos em navegador. Os demais levam à página do artigo pelo DOI. A Revista EIA bloqueia acesso automático (Cloudflare), então seus 3 artigos ficam no link do DOI até a coordenação enviar o PDF.
- **Fora da lista:** "Rendimento de madeira serrada…" (Revista de Engenharia e Tecnologia, 2021), por não ter DOI nem link localizado.
- **Pendente da coordenação:** conferir a licença de cada periódico e a data-limite de cada PDF (regra RP-01 a RP-04 abaixo), e confirmar se todos os 20 devem entrar.
- **Fica para depois:** páginas individuais, citação ABNT, metadados Google Scholar, filtro por ano e o build agendado.

---

Draft (2026-10-08). A coordenação verifica a licença de cada periódico e autoriza a publicação do PDF com prazo.

## Objetivo

Cada publicação tem uma página própria com os dados bibliográficos e, quando permitido, o PDF. O PDF sai do ar automaticamente quando o prazo autorizado termina.

## Rotas

- `/publicacoes/`: lista completa com o filtro por tipo que já existe na home (SPEC-001 FR-06) e filtro por ano. É o destino de "Ver todas".
- `/publicacoes/<slug>/`: página da publicação.
- A home continua mostrando as 4 mais recentes, e cada linha é um link para a página da publicação.

## Conteúdo (`content/publicacoes/<slug>.md`)

| Campo                         | Obrigatório | Observação                                                                     |
| ----------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `titulo`                      | sim         |                                                                                |
| `tipo`                        | sim         | `artigo`, `livro`, `capitulo`, `dissertacao`, `tese`, `evento`                 |
| `ano`                         | sim         |                                                                                |
| `autores`                     | sim         | lista na ordem da publicação; quem é da equipe pode ser referenciado pelo slug |
| `veiculo`                     | sim         | periódico, editora, programa ou evento                                         |
| `volume`, `numero`, `paginas` | não         |                                                                                |
| `doi`                         | não         | só o identificador (`10.xxxx/...`); o link é montado                           |
| `link`                        | não         | quando não há DOI                                                              |
| `resumo`                      | não         | resumo oficial da publicação                                                   |
| `palavras_chave`              | não         |                                                                                |
| `pdf`                         | não         | arquivo em `content/midia/publicacoes/`                                        |
| `pdf_disponivel_ate`          | se `pdf`    | data `AAAA-MM-DD` autorizada pela coordenação                                  |
| `licenca`                     | se `pdf`    | ex.: "CC BY 4.0", "versão do autor autorizada pelo periódico"                  |
| `projetos`                    | não         | slugs de `content/projetos/`                                                   |

## Regra do PDF com prazo

- RP-01: o PDF só é publicado se `pdf_disponivel_ate` for igual ou posterior à data do build.
- RP-02: depois do prazo, o build **não copia o arquivo** para o site (não basta esconder o link) e a página passa a mostrar só o DOI ou link do periódico.
- RP-03: como o site é estático, o PDF só sai do ar quando há um novo build depois do prazo. Para garantir isso sem depender de lembrar, propõe-se um **build agendado diário** na hospedagem (Vercel Cron ou GitHub Actions), com decisão de hospedagem pendente.
- RP-04: o build lista no log os PDFs que vencem nos próximos 30 dias, como aviso à coordenação.

## Requisitos funcionais

- FR-01: a página mostra título (`h1`), tipo, ano, autores (com link para quem é da equipe), veículo, DOI/link, resumo, palavras-chave, projetos relacionados e botão "Baixar PDF" com a licença, quando vigente.
- FR-02: botão "Copiar citação" no formato ABNT.
- FR-03: a lista é ordenada por ano decrescente e depois pelo título.

## SEO / Metadados

- SEO-01: title "<título> · Publicações · CESAM"; meta tags `citation_*` (Google Scholar) com título, autores, data, veículo, DOI e `citation_pdf_url` só quando o PDF está vigente.
- SEO-02: JSON-LD `ScholarlyArticle` (ou `Book`/`Thesis` conforme o tipo).

## Acessibilidade

- A11Y-01: o link do PDF informa formato e tamanho ("Baixar PDF, 1,2 MB").
- A11Y-02: os filtros seguem o padrão já existente.

## Critérios de aceite

- AC-01: cada arquivo gera uma página.
- AC-02: com `pdf_disponivel_ate` no passado, o PDF não existe em `out/` e a página não o menciona.
- AC-03: as tags `citation_*` são válidas.

## Testes determinísticos

- T-01 (unit): regra RP-01/RP-02 com data simulada (antes, no dia, depois do prazo); citação ABNT.
- T-02 (build): nenhum PDF vencido em `out/`; aviso de vencimento em 30 dias.
- T-03 (e2e): home → linha → página; filtros; download do PDF vigente; axe e overflow.

## Evals qualitativos

- E-01 EVAL-CONTENT-002: os dados bibliográficos conferem com o DOI.
