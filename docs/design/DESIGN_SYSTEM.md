# DESIGN SYSTEM

## Estado

Extraído do design aprovado no Claude, o canvas "CESAM Landing Page", com os artboards "Guia de estilo", "Desktop · 1440" e "Mobile · 390": https://claude.ai/artifact/S49NxNehQCq65MFCghVkuN

Implementação dos tokens: `app/globals.css`.

## Cores

| Token                          | Valor             | Uso                                        |
| ------------------------------ | ----------------- | ------------------------------------------ |
| `--green`                      | #177A35           | Cor primária: botões, rótulos, ícones      |
| `--green-dark`                 | #146B30           | Texto sobre verde claro, CTAs de texto     |
| `--green-soft`                 | #E6F3EA           | Fundo de ícones e tags "Em andamento"      |
| `--blue`                       | #6FA3EF           | Ilustração e faixas. **Não usar em texto** |
| `--blue-link`                  | #1F5AA6           | Links e anos das publicações               |
| `--yellow`                     | #F2D52B           | Toque pontual: estrela, marcadores         |
| `--ink`                        | #0F1411           | Texto, barra institucional, rodapé         |
| `--text` / `--muted`           | #3E4A44 / #5C6A63 | Texto corrido / secundário                 |
| `--bg-alt`                     | #F4F7F5           | Seções alternadas e cards                  |
| `--border` / `--border-strong` | #E3E9E5 / #CBD5CF | Bordas de card / de controle               |

O card do Observatório usa a identidade própria da plataforma (`--obs-*`, Fraunces, Public Sans, IBM Plex Mono).

O card do Portal de Resíduos Sólidos também usa a identidade própria do portal ("Dossiê público", em `docs/design-refactor` do repositório do portal): tokens `--res-*` (papel `#f5f3ec`, mata `#1b4b3a`, cerrado `#b0742e`), Spectral nos títulos, IBM Plex Sans no texto e IBM Plex Mono nos rótulos, cantos de 3–4 px e o logo do projeto. Enquanto o portal não está no ar, mostra o selo "Em breve" no estilo de aviso do próprio portal (`--warning`), em vez de link; com `platforms.residuos.href` preenchido, o card vira link e o aviso some.

## Tipografia

- **Michroma**: só rótulos curtos (eyebrows), em caixa alta, 10–12 px, tracking 0.18em.
- **Space Grotesk 600**: títulos. H1 34→60, H2 30→44, H3 18→22 (mobile→desktop, via `clamp`).
- **Source Sans 3**: texto corrido, 15–20 px, pesos 400/600/700.

## Espaçamento e forma

- Gutter lateral: 16 px (mobile) → 120 px (1440). Container máximo: 1200 px.
- Seções: 40 px → 72 px de padding vertical (token `--section-y`), ou seja, cerca de 80 px entre seções no celular, 95 px no tablet e 144 px no desktop. Reduzido em 2026-10-08, a pedido da coordenação (antes eram 112, 150 e 224 px). Gap entre o cabeçalho e o conteúdo da seção: 20 → 56 px.
- Raios: 8 · 12 · 16 · 20 · 24 · pill (999). Cards de conteúdo: 20. Destaques: 24.
- Sombras: `--shadow-card` (card flutuante), `--shadow-lift` (hover de cards).

## Breakpoints

| Nome             | Largura         | Mudanças principais                                            |
| ---------------- | --------------- | -------------------------------------------------------------- |
| mobile           | < 600           | layout do artboard 390; CTAs em coluna                         |
| mobile largo     | ≥ 600           | CTAs em linha                                                  |
| tablet           | ≥ 700 / ≥ 768   | pilares e equipe em 3 colunas; barra UEMS visível              |
| desktop compacto | ≥ 900           | grids de 2–3 colunas; "ver todos" no cabeçalho da seção        |
| desktop          | ≥ 1000 / ≥ 1100 | hero em 2 colunas; navegação completa; layout do artboard 1440 |

## Movimento

- Entrada do hero (`rise`, delays escalonados), revelação no scroll com `animation-timeline: view()` (só onde houver suporte), ilustração com flutuação/traço/ondas, `lift` no hover de cards.
- `prefers-reduced-motion: reduce` desliga animações e transições.

## Componentes-base

Header/navigation (`SiteHeader`, `TopBar`), Hero, botões (`.btn--primary`, `.btn--ghost`, `.more`), cards (linha de pesquisa, projeto, membro, notícia, plataforma), `SectionHeader`, formulário (`ContactForm`), Footer com faixa de marca verde/azul/amarelo na proporção 3:3:1.

## Regra

Valores visuais recorrentes devem ser tokens/componentes, não números arbitrários repetidos em páginas diferentes.

## Fidelidade e desvios documentados

A implementação reproduz a intenção, a hierarquia, as proporções e o comportamento do design aprovado. Desvios intencionais:

1. **"PT · EN" removido da barra UEMS**: idiomas adicionais estão "a confirmar" no SCOPE.md.
2. **Links sem destino** aparecem como texto com sublinhado pontilhado (`.pending-link`), e não como `href="#"`, para atender ao AC-01.
3. **Indicador de pontos do carrossel de projetos (mobile)**: não implementado. A rolagem horizontal com scroll-snap cumpre a função sem um indicador falso.
4. **Filtro "Eventos"** também aparece no mobile, com rolagem horizontal. No artboard, ele ficava cortado.
5. **Campo "Assunto"** fica oculto no mobile, como no artboard, e envia o valor padrão.
6. **Tamanho mínimo dos alvos**: links de texto ("Ver todas", "DOI", "Lattes") têm ≥ 44 px de altura.
7. **Dois cards em destaque na equipe** (2026-10-08): o design previa um card de coordenação; agora são dois cards no mesmo estilo, o do coordenador (Vinícius) e o do pesquisador Nélison.
   - No desktop, os dois ficam lado a lado à esquerda e os 6 cards da equipe passam para 2 colunas, em formato horizontal (avatar à esquerda), para manter a mesma altura.
   - No tablet, os dois ficam lado a lado acima da equipe.
   - No celular, ficam empilhados no formato compacto do artboard 390.
8. **Equipe no desktop** (2026-10-08): os dois cards de destaque ficam lado a lado, em formato horizontal (foto à esquerda), e os demais integrantes ficam abaixo, em uma grade que cresce com novos integrantes (5 por linha em 1440 px).
9. **Lista de publicações** (2026-10-08): sem o botão "DOI" do design. Cada item tem um link "PDF" ou "Artigo". Mostra as 5 mais recentes e o botão "Mostrar todas". Autores do CESAM em negrito.
10. **Notícias** (2026-10-08): com uma única notícia, o card é horizontal (foto à esquerda), em vez de um terço da largura; o card inteiro é um link para a página. A página da notícia usa coluna de texto de 46 rem, capa em 16:10 e galeria com fotos na mesma altura. Esse layout ainda não tem artboard no design e deve ser aprovado pela coordenação.
11. **Ordem das seções** (2026-10-08): Notícias e Projetos em destaque trocaram de lugar em relação ao design. Para manter a alternância de fundos (branco e cinza), Notícias passou a ter fundo branco e Projetos fundo cinza. O menu do cabeçalho segue a nova ordem (Sobre e Plataformas continuam na ordem do design aprovado).
12. **Faixa de números** removida da home até haver números oficiais.
13. **Galeria da notícia** (2026-10-08): com 1 a 2 fotos, ficam lado a lado no formato natural, na mesma altura. Com 3 ou mais, entram em grade de quadros 4:3 (3 colunas com 3 fotos, 2 colunas nos demais casos), e as fotos em pé aparecem inteiras sobre um fundo desfocado, para não cortar pessoas.
14. **Espaçamento entre seções** (2026-10-08): o padding vertical das seções caiu de 56–112 px para 40–72 px (`--section-y`), e o fim da área de abertura passou de 88 para 72 px. O ajuste é só nesse token e vale para o site todo. O primeiro card do carrossel de notícias passou a alinhar com o título da seção.
15. **Mapa de contato** (2026-10-08): o quadro tracejado "[Mapa de localização]" virou um cartão com botão "Carregar mapa" (mapa do Google só carregado ao clicar) e link "Abrir no Google Maps" embaixo. Depois de carregado, o mapa ocupa o mesmo quadro, com borda sólida.
16. **Seção Projetos removida** (2026-10-08): saiu da home, do menu e do rodapé, junto com o link "Ver projetos" dos cards de pesquisa. O fundo alternado ficou: pesquisa (cinza), notícias (branco), equipe (cinza), publicações e contato (branco).
