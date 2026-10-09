# AUTONOMIA PROGRESSIVA

## Objetivo

Aumentar a autonomia dos agentes somente quando existirem controles capazes de detectar falhas com confiança adequada.

## Nível 0 — Assistência

IA analisa e propõe; humano executa/aprova cada mudança.

## Nível 1 — Implementação supervisionada

IA implementa uma tarefa pequena a partir de spec aprovada. Humano revisa antes de prosseguir.

## Nível 2 — Implementação + validação

IA implementa, executa testes/gates e corrige falhas locais. Review independente obrigatório antes do merge.

## Nível 3 — Feature delimitada

IA recebe uma spec completa, cria plano, implementa e valida autonomamente dentro do escopo. Humano revisa resultado e evidências.

## Nível 4 — Autonomia ampliada

Somente para categorias de mudanças que apresentaram histórico de confiabilidade e possuem cobertura forte de testes/gates. Alterações arquiteturais, segurança, conteúdo sensível e mudança de requisitos continuam exigindo decisão humana.

## Promoção

A autonomia aumenta por classe de tarefa, não globalmente. Bom desempenho em CSS não implica autonomia para arquitetura ou segurança.

## Rebaixamento

Regressões repetidas, mudanças fora de escopo ou falhas não detectadas pelos gates exigem redução de autonomia e fortalecimento dos controles.
