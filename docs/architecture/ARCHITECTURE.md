# ARCHITECTURE

## Princípios

- Arquitetura proporcional à complexidade de um site institucional.
- Preferir geração estática/SSR quando adequado.
- Evitar backend próprio sem necessidade.
- Componentes reutilizáveis sem abstração prematura.
- Conteúdo desacoplado da apresentação quando isso facilitar manutenção.
- Tipagem estrita e automação de qualidade.

## Stack

Next.js + TypeScript com export estático (`out/`). Ver [ADR-001](ADR/001-stack-next-static.md).

## Camadas sugeridas

- `app/` ou equivalente: rotas e composição de páginas.
- `components/`: componentes compartilhados.
- `features/`: funcionalidades com domínio próprio, se necessárias.
- `content/` ou CMS: conteúdo institucional.
- `lib/`: utilidades e integrações.
- `tests/`: testes de integração/E2E quando não co-localizados.

## Conteúdo

Decisão atual: versionado no repositório (`content/site.ts`), até que haja avaliação de CMS.

Definir antes do desenvolvimento se será:

1. versionado no repositório;
2. gerenciado por CMS; ou
3. híbrido.

A decisão deve considerar frequência de atualização e quem manterá o site.

## ADRs

Decisões arquiteturais relevantes devem ser registradas em `docs/architecture/ADR/`.
