# WORKFLOW DE FEATURE

## 1. Descoberta

Definir problema, usuário e resultado esperado.

## 2. Spec

Criar/atualizar `SPEC-XXX` com requisitos e critérios de aceite.

## 3. Test-first

Antes da implementação, definir quais requisitos podem ser transformados em testes determinísticos e quais exigem eval/revisão.

## 4. Plano

O agente descreve arquivos afetados, estratégia e riscos. O plano não altera a spec.

## 5. Implementação

Executar a menor mudança capaz de satisfazer a spec.

## 6. Self-check

Executar gates e comparar cada critério de aceite com evidência.

## 7. Review adversarial

Outro agente recebe spec + diff + resultados dos testes e procura razões concretas para rejeitar a mudança.

## 8. Correção

Resolver findings válidos e executar novamente os gates afetados.

## 9. Review humano

Avaliar resultado, exceções, conteúdo institucional e decisões que não devem ser delegadas.

## 10. Merge

Somente após Definition of Done.
