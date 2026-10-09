# Visual

- As referências ficam em `tests/e2e/home.spec.ts-snapshots/` e são geradas pelo Playwright (`npm run test:e2e`), com movimento reduzido e página inteira.
- Para atualizar, depois de uma mudança visual **aprovada**, rode `npx playwright test -g screenshot --update-snapshots`.
- EVAL-VIS-001: compare os screenshots com os artboards do design aprovado (link na SPEC-001).
  - Critério: hierarquia, espaçamento, tipografia, proporção e composição, além dos desvios documentados no DESIGN_SYSTEM.md.
  - Aprovação: nenhum desvio sem documentação.
