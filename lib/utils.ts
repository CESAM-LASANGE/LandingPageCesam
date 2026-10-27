/** Junta nomes de classe ignorando valores vazios (versão mínima do `cn` do shadcn, sem Tailwind). */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
