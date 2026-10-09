# AGENTS.md

## Objetivo

Contrato operacional para agentes de programação que atuarem neste repositório.

## Antes de codificar

1. Ler a spec correspondente.
2. Identificar requisitos funcionais e não funcionais afetados.
3. Identificar testes existentes.
4. Propor plano de implementação.
5. Sinalizar ambiguidades em vez de presumir requisitos.

## Durante a implementação

- Trabalhar somente no escopo solicitado.
- Preferir componentes reutilizáveis quando houver repetição real.
- Evitar abstrações prematuras.
- Manter tipagem estrita.
- Tratar estados de loading, erro, vazio e sucesso quando aplicáveis.
- Manter HTML semântico e navegação por teclado.

## Depois da implementação

Executar os quality gates aplicáveis, comparar o resultado com os critérios de aceite e informar explicitamente qualquer requisito não atendido.

## Proibições

- Não mascarar falhas de teste.
- Não usar `any` como correção conveniente sem justificativa.
- Não inserir conteúdo institucional fictício como definitivo.
- Não alterar o design aprovado por preferência estética própria.
- Não fazer refactors amplos não solicitados durante uma feature isolada.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
