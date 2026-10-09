# CLAUDE.md

## Missão

Implementar e manter o site institucional da Fundação respeitando as especificações versionadas no repositório.

## Fonte de verdade

1. `docs/specs/` — comportamento e critérios de aceite da feature.
2. `docs/design/` — sistema visual e responsividade.
3. `docs/architecture/` — decisões técnicas.
4. `docs/quality/` — gates e Definition of Done.
5. Este arquivo — regras permanentes para o agente.

Em caso de conflito, não inventar solução silenciosamente. Identificar o conflito e propor a menor alteração necessária na documentação antes de implementar.

## Regras

- Ler a spec da tarefa antes de alterar código.
- Apresentar plano curto antes de mudanças não triviais.
- Fazer mudanças pequenas e rastreáveis.
- Não alterar requisitos para fazer testes passarem.
- Não remover testes sem justificativa explícita.
- Não introduzir dependências sem necessidade demonstrável.
- Preservar acessibilidade, responsividade, SEO e performance.
- Não declarar uma tarefa concluída sem executar os gates aplicáveis.
- Registrar novos bugs relevantes como testes/evals de regressão.

## IA no loop

O agente implementador não é a autoridade final de qualidade. Mudanças relevantes devem ser verificadas por testes determinísticos e, quando aplicável, review independente por outro agente/modelo e revisão humana.
