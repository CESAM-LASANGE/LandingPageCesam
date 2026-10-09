# EVALS

## Objetivo

Usar evals para aspectos importantes que não são completamente verificáveis por assertions determinísticas.

## Pirâmide de avaliação

1. Compilador/typechecker/linter.
2. Testes determinísticos.
3. Ferramentas especializadas (a11y, performance, visual diff).
4. Evals com modelo para critérios qualitativos.
5. Revisão humana para decisões finais relevantes.

## Evals iniciais

### EVAL-VIS-001 — Fidelidade visual

Entrada: screenshot da implementação + referência aprovada.
Avaliar: hierarquia, espaçamento, tipografia, proporções e composição.
Não usar como substituto de visual regression determinística.

### EVAL-CONTENT-001 — Coerência institucional

Verificar se conteúdo apresentado é coerente, claro e não inventa fatos não fornecidos.

### EVAL-CODE-001 — Review adversarial

Um agente diferente do implementador procura bugs, violações de spec, regressões, problemas de acessibilidade, segurança e complexidade desnecessária.

## Evals adicionados em 2026-10-08 (SPEC-002 a SPEC-007)

### EVAL-VIS-002 — Templates de páginas e componentes novos

- **Entrada:** screenshots, em 390 e 1440 px, das páginas de projeto, publicação e notícia e dos carrosséis + o artboard aprovado de cada um.
- **Avaliar:** hierarquia, espaçamento, enquadramento das fotos (rostos não cortados), legibilidade de legenda sobre foto e consistência com a home.
- **Aprovação:** nenhum desvio sem registro no DESIGN_SYSTEM.md.

### EVAL-CONTENT-002 — Fidelidade ao material enviado

- **Entrada:** o arquivo de conteúdo publicado + o material original enviado pela coordenação (texto, DOI, dados do projeto).
- **Avaliar:** nenhuma informação acrescentada, removida ou alterada; dados bibliográficos conferem com o DOI; datas, nomes e funções corretos.
- **Aprovação:** zero divergências factuais. Ajustes de forma (pontuação, quebra de parágrafo) são permitidos e listados.

### EVAL-A11Y-001 — Interações com movimento e sobreposição (manual)

- **Entrada:** carrosséis (SPEC-002) e painéis das linhas de pesquisa (SPEC-003).
- **Avaliar com leitor de tela (NVDA ou Orca) e só teclado:**
  - O carrossel não anuncia trocas automáticas.
  - A pausa é encontrável.
  - O painel abre e fecha sem perder o foco.
  - Com "reduzir movimento", nada se move sozinho.
- **Aprovação:** todos os itens cumpridos, com registro em `evals/accessibility/`.

## Evolução

A suíte deve crescer a partir de falhas reais. Não criar dezenas de evals especulativos sem evidência de valor.
