# ADR-001 — Next.js + TypeScript com export estático

## Status

Aceito (2026-09-28), sujeito a revisão humana.

## Contexto

O site institucional tem uma página inicial de conteúdo majoritariamente estático, sem autenticação nem área privada (SCOPE.md). ARCHITECTURE.md indicava Next.js + TypeScript como candidato e pedia preferência por geração estática e ausência de backend próprio.

## Decisão

- Next.js (App Router) + TypeScript estrito, com `output: 'export'`: o build gera HTML/CSS/JS estáticos em `out/`, hospedáveis em qualquer servidor ou CDN.
- CSS Modules + custom properties em `app/globals.css` (tokens do DESIGN_SYSTEM.md). Sem framework de CSS.
- Fontes via `next/font/google`: auto-hospedadas no build, sem requisição a terceiros em tempo de execução.
- Conteúdo versionado no repositório em `content/site.ts` (opção 1 de ARCHITECTURE.md), até decisão sobre CMS.
- Formulário de contato sem backend: valida no cliente e abre o e-mail da pessoa via `mailto:`. O site não coleta nem armazena dados.
- Qualidade: ESLint (eslint-config-next), `tsc`, Prettier, Vitest + Testing Library (unitários/componentes), Playwright + axe-core (E2E, a11y, responsividade, regressão visual).

## Alternativas consideradas

- Astro: ótimo para sites estáticos, mas não era o candidato documentado e a equipe teria duas referências de stack.
- HTML/CSS puro: menos dependências, mas sem tipagem, componentes e testes de componente.
- Backend para o formulário: adiado; exige avaliação de privacidade (SECURITY.md) e definição de destinatário.

## Consequências

- Sem SSR/rotas dinâmicas: páginas novas precisam ser geradas no build. Recursos de servidor (headers de segurança, redirects) devem ser configurados no host.
- Migrar para CMS no futuro exige trocar a origem de `content/`, sem mudar componentes.
- Reversível: os componentes são React simples e o CSS não depende do framework.
