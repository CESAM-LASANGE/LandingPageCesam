# Acessibilidade

A parte automática fica em `tests/e2e/home.spec.ts`: axe WCAG 2.2 A/AA, tamanho de alvos, skip link e navegação por teclado.

Checagem manual antes de publicar, porque a automação não prova conformidade:

1. Navegar a página inteira só com Tab, Shift+Tab, Enter e Esc. Objetivo: foco sempre visível e ordem lógica.
2. Leitor de tela (NVDA ou Orca) no menu, no filtro de publicações (anúncio da contagem) e nos erros do formulário.
3. Zoom de 200% e 400% (reflow) sem perder conteúdo.
4. Sistema com "reduzir movimento" ativo: nenhuma animação.
