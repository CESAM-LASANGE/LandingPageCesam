# QUALITY GATES

## Filosofia

Quality gates são condições de passagem, não sugestões. Um gate falho bloqueia a conclusão da tarefa, salvo exceção explicitamente documentada e aprovada.

## Gate 1 — Static Quality

- Formatação.
- Lint.
- Typecheck.

## Gate 2 — Automated Tests

- Unit tests aplicáveis.
- Component/integration tests aplicáveis.
- E2E dos fluxos críticos.
- Regression tests.

## Gate 3 — Build

- Build de produção concluído.
- Sem erro relevante de runtime/console no fluxo validado.

## Gate 4 — UX técnico

- Responsividade.
- Acessibilidade automatizada + checagens manuais essenciais.
- Links/rotas.
- Estados de erro/vazio quando aplicáveis.

## Gate 5 — Visual

- Comparação com referência aprovada.
- Nenhuma regressão visual não intencional.

## Gate 6 — Performance / Web Quality

Definir budgets após baseline real. Não usar números arbitrários como garantia de qualidade antes da primeira medição.

- **Baseline:** antes de implementar SPEC-002 a SPEC-007, medir a home atual com Lighthouse (mobile e desktop) e registrar em `evals/performance/baseline.md`.
- **Regra a partir daí:** carrosséis e fotos não podem piorar LCP, CLS ou peso total da home além do budget fixado depois dessa medição.

## Gate 7 — Review

Mudanças de risco médio/alto: review independente por outro agente/modelo antes da revisão humana.

## Regra de regressão

Bug relevante encontrado após merge deve, quando tecnicamente possível, gerar teste ou eval que falhe antes da correção e passe depois dela.
