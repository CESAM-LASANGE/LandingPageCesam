# SPEC-005 — Equipe com fotos e funções

## Status

Draft (2026-10-08). A coordenação confirmou ter autorização de uso de imagem de todas as pessoas. Os termos ficam arquivados pelo CESAM, fora do repositório.

**Parcialmente implementada (2026-10-08): coordenação.**

- **Cards:** dois cards, Vinícius de Oliveira Ribeiro (Coordenação) e Nélison Ferreira Corrêa (Pesquisador), com foto, titulação, área de atuação e link para o Lattes. Nomes, titulação e área foram tirados do resumo público do Currículo Lattes de cada um em 2026-10-08.
- **Onde está:** provisoriamente em `content/site.ts` (`team.coordinators`), até a aprovação do ADR-002.
- **Integrantes (cards pequenos), desde 2026-10-08:**
  - Jonailce Oliveira Diodato (Doutoranda · PGRN/UEMS), Bruna Alves de Souza Oliveira (Mestranda · PGRN/UEMS), Lucas Beraldi de Souza Oliveira (Pesquisador), todos com foto, e o card inteiro leva ao Lattes, em nova aba e sem texto de link (só uma seta ↗).
  - Elias de Oliveira Junior (Mestrando · PGRN/UEMS), com foto e Lattes.
  - Valquíria (Administrativo), com foto e sem Lattes, por decisão da coordenação.
  - Os placeholders "[Nome]" foram removidos. Novos integrantes entram conforme enviarem fotos. Só o Vinícius e o Nélison têm cards de destaque.
  - Nomes completos e situação acadêmica foram tirados do Lattes de cada um. Pendente: sobrenome da Valquíria.

## Objetivo

Os cards de "Pessoas que fazem o CESAM" mostram foto, nome e função real de cada pessoa.

## Fora do escopo

Página individual por pessoa e página "Equipe completa". Esta pode virar SPEC futura; até lá, "Equipe completa" continua como link pendente.

## Conteúdo (`content/equipe/<slug>.md`)

| Campo       | Obrigatório | Observação                                                                                                        |
| ----------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `nome`      | sim         | como deve aparecer no site                                                                                        |
| `funcao`    | sim         | ex.: "Coordenadora", "Doutorando", "Técnica de laboratório"                                                       |
| `categoria` | sim         | `coordenacao`, `docente`, `pos-graduacao`, `graduacao`, `tecnico`, `colaborador` (define a ordem e o agrupamento) |
| `foto`      | não         | foto + `alt` (ADR-003); sem foto, usa avatar com as iniciais                                                      |
| `titulacao` | não         | exibida só no card da coordenação                                                                                 |
| `lattes`    | não         | URL `http://lattes.cnpq.br/...`                                                                                   |
| `ativo`     | sim         | `false` remove da home sem apagar o histórico de projetos                                                         |

## Requisitos funcionais

- FR-01: os cards de coordenação (escuros, com foto grande) mostram as pessoas com `categoria: coordenacao`, na ordem definida pela coordenação. Hoje são dois:
  - no desktop (≥ 1100 px), ficam lado a lado à esquerda e a equipe fica em 2 colunas à direita;
  - no tablet, os dois ficam lado a lado acima da equipe;
  - no celular, ficam empilhados em formato compacto.
- FR-02: os demais cards seguem a ordem de `categoria` e depois o nome. A home mostra até 6 no desktop e 4 no celular, como no design atual.
- FR-03: com Lattes preenchido, o card pequeno inteiro é um link para o currículo (nome acessível: "<nome>, <função>. Currículo Lattes, abre em nova aba"). Sem Lattes, o card não é link.

## Requisitos visuais

- VR-01: a foto substitui o círculo colorido e mantém o tamanho atual (72 px desktop / 56 px mobile), recortada em círculo e centrada no rosto. No card de coordenação, o retângulo atual tem 260 px de altura.
- VR-02: o enquadramento usa `object-position`, com campo opcional `foco` (ex.: `50% 30%`) para fotos em que o rosto não está no centro.

## Acessibilidade e privacidade

- A11Y-01: `alt` = "Foto de <nome>". O link do Lattes tem nome acessível "Currículo Lattes de <nome>".
- PRIV-01: só pessoas com `ativo: true` e autorização confirmada aparecem. Pedido de remoção é atendido apagando o arquivo e as fotos, seguido de um novo build.
- PRIV-02: os metadados EXIF são removidos (ADR-003).

## Critérios de aceite

- AC-01: cada pessoa ativa aparece com foto (ou iniciais), nome e função.
- AC-02: as fotos não distorcem nem causam layout shift.

## Testes determinísticos

- T-01 (unit): ordenação por categoria, limite de cards, fallback de iniciais.
- T-02 (e2e): imagens carregam, `alt` presente, axe, screenshot de referência.
