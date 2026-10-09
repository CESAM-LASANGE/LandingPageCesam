/**
 * Fotos do carrossel "Sobre o CESAM" (SPEC-002, variante `fotos`).
 *
 * - `arquivo` é a chave em content/midia/manifesto.json (gerado por scripts/otimizar-fotos.sh).
 * - `alt` é obrigatório: descreve o que aparece na foto para quem usa leitor de tela.
 * - `ajuste: 'conter'` mostra a foto inteira (com fundo desfocado). Use em fotos de grupo, onde
 *   o recorte cortaria pessoas. `'cobrir'` preenche o quadro.
 * - `foco` (opcional) é o `object-position` do recorte, ex.: '50% 30%'.
 *
 * Provisório em TypeScript até a aprovação do ADR-002 (passa para content/sobre/galeria.md).
 * PENDENTE-VALIDACAO: descrições escritas a partir das fotos; a coordenação pode ajustar e incluir legendas.
 * Uso de imagem autorizado pela coordenação (SPEC-005, PRIV-01).
 */
export type FotoGaleria = {
  arquivo: string;
  alt: string;
  legenda?: string;
  ajuste?: 'cobrir' | 'conter';
  foco?: string;
};

export const galeriaSobre: FotoGaleria[] = [
  {
    arquivo: 'sobre/sala-do-cesam',
    alt: 'Sala do CESAM com mesas de trabalho, computadores e o banner do centro ao fundo.',
    foco: '50% 45%',
  },
  {
    arquivo: 'sobre/equipe-e-policia-militar-na-sala',
    alt: 'Integrantes do CESAM e policiais militares reunidos na sala do centro, com o banner do CESAM ao fundo.',
    ajuste: 'conter',
  },
  {
    arquivo: 'sobre/visita-de-campo',
    alt: 'Integrantes do CESAM e policiais militares em uma estrada de terra ao lado de uma plantação, junto a uma viatura da Polícia Militar.',
    foco: '50% 55%',
  },
];
