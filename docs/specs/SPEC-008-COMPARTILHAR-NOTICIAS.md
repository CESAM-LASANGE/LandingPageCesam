# SPEC-008 — Compartilhar notícias no Instagram e no WhatsApp

## Status

**Aprovada pela coordenação em 2026-10-09 e implementada.** Decisão técnica em [ADR-004](../architecture/ADR/004-compartilhamento-com-foto-de-capa.md).

Decisões da coordenação (antigas D-1 a D-6):

- Compartilha-se a **foto de capa** da notícia; **não há arte própria** (nem Stories, nem Feed gerados). A ideia de arte gerada foi descartada por exigir mais trabalho e peso.
- A legenda copiada segue o modelo proposto: título, resumo e link, sem hashtags.
- A imagem de pré-visualização do link (cartão no WhatsApp e no LinkedIn) continua sendo a foto de capa, como já era.
- Sem arte gerada, não há limite de notícias, nem tempo de build extra, nem endereço do site "dentro da imagem".

## Objetivo

Qualquer pessoa que apareça numa notícia (por exemplo, quem defendeu um TCC) deve conseguir divulgá-la no próprio Instagram ou WhatsApp, pelo celular, com a foto de capa, o título e o link.

## Fora do escopo

- Arte gerada ou personalizada para cada notícia (fica como evolução futura; ADR-004).
- Publicar automaticamente no Instagram ou no WhatsApp (APIs oficiais, login ou conta do CESAM).
- Botão de compartilhar no computador.
- Estatísticas de compartilhamento e qualquer rastreamento.
- Compartilhar páginas que não sejam notícias.

## O que a tecnologia permite e o que não permite

- O **WhatsApp** aceita um link com o texto pronto. Para enviar a foto, é preciso usar o menu de compartilhamento do celular.
- O **Instagram não tem endereço de compartilhamento na web.** O único caminho é o menu nativo do celular (Web Share API), onde a pessoa escolhe o Instagram e depois Stories, Feed ou mensagem. O site não escolhe esse destino.
- O Instagram **ignora a legenda** enviada pelo menu. Por isso existe "Copiar legenda".
- As capas são **paisagem** e o Stories é **vertical**: o Instagram mostra faixas ou pede um recorte, e a pessoa ajusta na hora de postar.
- O **link no Stories** (adesivo) não pode ser pré-colocado.
- Nem todo aparelho aceita enviar arquivos pelo menu. Nesses casos, o site oferece "Baixar a foto".

## Requisitos funcionais

- FR-01: a página de cada notícia (`/noticias/<slug>/`) tem o bloco "Compartilhar", depois do texto. Ele só aparece em aparelho com toque (`pointer: coarse`). No computador não aparece nada, nem botão desativado.
- FR-02: "Compartilhar a notícia" abre o menu nativo com a foto de capa (JPEG), o título, o resumo e o link canônico. Se o aparelho não aceitar arquivos mas aceitar o menu, compartilha só título, resumo e link. Se não houver menu nativo, o botão não aparece.
- FR-03: "Baixar a foto" baixa a capa como `cesam-<slug>.jpg`. Aparece sempre que o bloco aparece.
- FR-04: "Copiar legenda" copia: título, linha em branco, resumo, linha em branco e `Leia a notícia: <link>`. Confirma com mensagem.
- FR-05: "Enviar pelo WhatsApp" abre `https://wa.me/?text=<título + link>`, em nova aba.
- FR-06: se a pessoa cancelar o menu nativo, nada é mostrado como erro.
- FR-07: a foto só é preparada quando o bloco "Compartilhar" entra na tela (quem não chega até ele não baixa nada) e é reaproveitada nos toques. Isso faz o menu abrir logo após o toque, o que o iPhone exige. A página não carrega nada extra no início.
- FR-08: a foto enviada é convertida para JPEG de no máximo 1080 px de largura, no próprio aparelho, a partir da maior versão WebP já publicada da capa. Nenhum arquivo novo é criado no site.
- FR-09: sem alteração de conteúdo: uma notícia nova ganha o bloco só por ter uma capa.

## Requisitos visuais

- VR-01: o bloco segue o design system (botões `btn`, cantos e cores atuais), com título "Compartilhe esta notícia" e uma linha de apoio explicando que a legenda precisa ser colada no Instagram.
- VR-02: o bloco não empurra nem cobre o texto da notícia.

## Responsividade

- RWD-01: o bloco aparece só em toque. De 320 a 768 px, os botões se empilham quando não cabem na linha, sem rolagem horizontal.
- RWD-02: alvos de toque de pelo menos 44×44 px.

## Acessibilidade

- A11Y-01: cada botão tem nome acessível claro (por exemplo "Compartilhar a notícia no Instagram ou WhatsApp").
- A11Y-02: as respostas ("Foto pronta", "Legenda copiada", "Não foi possível compartilhar; baixe a foto") aparecem em uma região `role="status"`.
- A11Y-03: durante a preparação da foto, o botão fica `aria-busy` e não aceita toque duplo.
- A11Y-04: o texto da notícia continua em HTML; a imagem compartilhada não o substitui.

## SEO / Metadados

- SEO-01: a pré-visualização do link (Open Graph e Twitter) continua sendo a foto de capa (SPEC-007), sem mudança.
- SEO-02: nenhuma rota nova de imagem entra no `sitemap.xml`.

## Estados

- Loading: botão com "Preparando a foto…" enquanto a imagem é convertida.
- Empty: sem toque, o bloco não existe (FR-01). Com toque, só aparecem as ações que funcionam.
- Error: falha ao preparar a foto → mensagem em `role="status"`; "Baixar a foto", "Copiar legenda" e WhatsApp seguem disponíveis. Falha ao copiar → mensagem pedindo para copiar manualmente.
- Success: menu nativo aberto; "Legenda copiada" ou "Foto baixada" nos demais botões.

## Crescimento: o que impede o site de ficar pesado

| O que cresce          | Como é controlado                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------- |
| Banco de dados        | Não existe. O site é estático e compartilhar não cria nenhum registro.                   |
| Repositório e deploy  | Nenhum arquivo novo por notícia; a capa já existe e já é otimizada (ADR-003).            |
| Tempo de build        | Não muda.                                                                                |
| Peso para quem visita | Zero no carregamento; a capa só é baixada ao tocar em "Compartilhar" ou "Baixar a foto". |

## Critérios de aceite

- AC-01: no celular (toque) o bloco "Compartilhar" aparece em cada notícia publicada; no computador não aparece.
- AC-02: com o menu nativo e suporte a arquivos, o toque chama `navigator.share` com um arquivo `image/jpeg`, o título, o texto e o link canônico (absoluto); cancelar não mostra erro.
- AC-03: sem suporte a arquivos, "Compartilhar a notícia" envia só título, texto e link; "Baixar a foto" e "Copiar legenda" funcionam.
- AC-04: a legenda copiada segue o modelo de FR-04.
- AC-05: o carregamento inicial da página da notícia não baixa nenhuma imagem além das que já mostra; a foto de compartilhar só é pedida quando o bloco entra na tela, e uma única vez.
- AC-06: uma notícia nova, só com o arquivo de conteúdo, ganha o bloco sem nenhuma outra alteração.

## Testes determinísticos

- T-01 (unit): montagem da legenda, link do WhatsApp, nome do arquivo, link absoluto da notícia.
- T-02 (unit, componente): `navigator.share` e `canShare` simulados — caminho feliz com arquivo, sem suporte a arquivo, cancelamento (`AbortError`), falha, bloco ausente sem toque.
- T-03 (e2e, 390 px com toque): o bloco aparece; "Copiar legenda" confirma; `navigator.share` simulado recebe um arquivo `image/jpeg`; "Baixar a foto" inicia um download.
- T-04 (e2e, 1440 px): o bloco não existe.
- T-05 (e2e): nenhuma requisição extra de capa antes de o bloco entrar na tela, e só uma depois; axe sem violações; sem overflow em 320, 390 e 768 px.

## Evals qualitativos

- E-01 (humano, em celulares reais, Android e iPhone): compartilhar uma notícia no Instagram (Stories e Feed) e no WhatsApp; a foto chega nítida e o texto e o link estão corretos.
- E-02 (humano): conferir se a mensagem do bloco deixa claro que a legenda precisa ser colada no Instagram.

## Evidências esperadas

- Relatório de testes unitários e e2e.
- Medição Lighthouse da página de notícia, para confirmar que o bloco não piora o desempenho.
- Registro da verificação em celular real (E-01).

## Definition of Done

- [ ] Critérios de aceite atendidos.
- [ ] Testes aplicáveis passando.
- [ ] Quality gates passando.
- [ ] Acessibilidade revisada.
- [ ] Responsividade revisada.
- [ ] Sem regressão visual não aprovada.
- [ ] Review independente quando exigido.
- [ ] Verificação em celular real (E-01) registrada.
