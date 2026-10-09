# BACKLOG — Evolução da home e páginas internas (2026-10-08)

Ordem pensada para que cada etapa sirva de base para a seguinte. Cada etapa passa pelos gates de QUALITY_GATES.md antes da próxima.

| #   | Etapa                                                | Spec / ADR                     | Depende de | Bloqueada por                             |
| --- | ---------------------------------------------------- | ------------------------------ | ---------- | ----------------------------------------- |
| 0   | Medir baseline de performance                        | Gate 6                         | —          | —                                         |
| 1   | Remover faixa de números                             | SPEC-001 FR-05                 | —          | —                                         |
| 2   | Leitura de conteúdo em Markdown + modelos de arquivo | ADR-002                        | —          | aprovação das dependências                |
| 3   | Pipeline de imagens + componente `Foto`              | ADR-003                        | —          | aprovação do `sharp`                      |
| 4   | Componente de carrossel + galeria do Sobre           | SPEC-002                       | 3          | fotos do lab e da equipe                  |
| 5   | Painel das linhas de pesquisa                        | SPEC-003                       | 2          | textos da coordenação                     |
| 6   | Equipe com fotos                                     | SPEC-005                       | 2, 3       | fotos, nomes e funções                    |
| 7   | Projetos: lista + página                             | SPEC-004                       | 2, 3, 6    | artboard aprovado + projetos selecionados |
| 8   | Publicações: lista + página + PDF com prazo          | SPEC-006                       | 2, 7       | artigos, licenças e prazos                |
| 9   | Notícias: carrossel + lista + página                 | SPEC-007                       | 4, 2, 3    | artboard aprovado + notícias              |
| 10  | Build agendado diário                                | SPEC-006 RP-03, SPEC-007 FR-04 | 8, 9       | decisão de hospedagem                     |

## Materiais a receber da coordenação

- **Etapa 4:** fotos do laboratório e da equipe para o carrossel, com legenda opcional.
- **Etapa 5:** texto de cada linha de pesquisa, com até 900 caracteres cada.
- **Etapa 6:** foto, nome como deve aparecer, função e categoria de cada pessoa, e Lattes (opcional).
- **Etapa 7:** projetos selecionados com os campos de SPEC-004 e fotos.
- **Etapa 8:** publicações com os campos de SPEC-006; para cada PDF, a licença e a data-limite.
- **Etapa 9:** notícias com os campos de SPEC-007 e fotos.

## Fora desta rodada

Página "Equipe completa", busca interna, CMS e versão em inglês.
