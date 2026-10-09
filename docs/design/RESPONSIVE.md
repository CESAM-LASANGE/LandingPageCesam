# RESPONSIVE

## Princípio

Responsividade é requisito funcional, não acabamento posterior.

## Viewports de validação

Breakpoints em `DESIGN_SYSTEM.md`. A validação automática (Playwright) cobre 320 (mobile estreito), 390 (mobile comum), 768 (tablet) e 1440 (desktop).

## Regras

- Sem overflow horizontal acidental.
- Texto legível sem zoom.
- Alvos interativos adequados ao toque.
- Navegação utilizável por teclado e toque.
- Imagens não podem provocar layout shift evitável.
- Conteúdo prioritário não pode desaparecer apenas para facilitar layout.

## Teste visual

Capturas de referência devem ser mantidas para páginas/componentes estáveis e comparadas automaticamente quando viável.
