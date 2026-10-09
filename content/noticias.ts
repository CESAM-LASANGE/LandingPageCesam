/**
 * Notícias do CESAM (SPEC-007).
 *
 * - Cada notícia tem página própria em /noticias/<slug>/ e card na home.
 * - `data` no formato AAAA-MM-DD. Notícia com data futura não é publicada (ver `publicadas`).
 * - Corpo em blocos simples: `titulo` (subtítulo da seção) e `p` (parágrafo). Sem HTML.
 * - Fotos: chave em content/midia/manifesto.json (rode `npm run fotos` ao adicionar fotos).
 * - Todo `alt` descreve o que aparece na foto; não identifica pessoas que a coordenação não tenha nomeado.
 *
 * Provisório em TypeScript até a aprovação do ADR-002 (passa para content/noticias/<slug>.md).
 */
export type CategoriaNoticia = 'defesa' | 'evento' | 'pesquisa' | 'extensao' | 'visita-tecnica' | 'premio' | 'outro';

export const ROTULO_CATEGORIA: Record<CategoriaNoticia, string> = {
  defesa: 'Defesa',
  evento: 'Evento',
  pesquisa: 'Pesquisa',
  extensao: 'Extensão',
  'visita-tecnica': 'Visita técnica',
  premio: 'Prêmio',
  outro: 'Notícia',
};

export type FotoNoticia = {
  arquivo: string;
  alt: string;
  legenda?: string;
  /** `conter` mostra a foto inteira sobre fundo desfocado (fotos em pé na galeria em grade). */
  ajuste?: 'cobrir' | 'conter';
  /** `object-position` do recorte, ex.: '50% 30%'. */
  foco?: string;
};

export type BlocoNoticia = { tipo: 'titulo'; texto: string } | { tipo: 'p'; texto: string };

export type Noticia = {
  slug: string;
  titulo: string;
  data: string;
  categoria: CategoriaNoticia;
  /** Até 200 caracteres: aparece no card e na meta description. */
  resumo: string;
  capa: FotoNoticia;
  corpo: BlocoNoticia[];
  galeria?: FotoNoticia[];
};

const p = (texto: string): BlocoNoticia => ({ tipo: 'p', texto });
const titulo = (texto: string): BlocoNoticia => ({ tipo: 'titulo', texto });

/**
 * PENDENTE-VALIDACAO (textos escritos pelo agente a partir do material enviado; a coordenação deve revisar):
 * - TCC: data da defesa (01/10/2026, informada pela coordenação);
 * - composição da banca (conforme a folha de aprovação do TCC: Profa. Jéssica Ferreira da Silva e Prof. Nelison Ferreira Correa);
 * - nomes das pessoas que aparecem nas fotos (não identificadas no texto);
 * - Curso de geoprocessamento (08/06/2026, informado pela coordenação): "PMA" lido como Polícia Militar Ambiental;
 *   faltam carga horária, número de participantes e conteúdo programático (o texto não os cita);
 * - Curso de sonômetro (05/08/2026, informado pela coordenação): local lido como a sala do CESAM (as fotos mostram o
 *   banner do centro), "2º Batalhão" lido como da Polícia Militar Ambiental; o texto não cita conteúdo nem carga horária.
 */
export const noticias: Noticia[] = [
  {
    slug: 'tcc-ana-laura-papel-higienico-no-vaso-sanitario',
    titulo: 'Ana Laura Eich defende TCC sobre papel higiênico no vaso sanitário',
    data: '2026-10-01',
    categoria: 'defesa',
    resumo:
      'Orientado pelo coordenador do CESAM, o trabalho comparou como quatro papéis higiênicos se desfazem na água e quanto deles fica retido em um trecho experimental de tubulação.',
    capa: {
      arquivo: 'noticias/tcc-ana-laura-com-participantes',
      alt: 'Ana Laura Eich e outras três pessoas posam sorrindo ao lado do telão com o slide de abertura da apresentação do TCC.',
      foco: '50% 45%',
    },
    corpo: [
      p(
        'A acadêmica Ana Laura Pereira dos Santos Eich defendeu, em 1º de outubro de 2026, o Trabalho de Conclusão de Curso (TCC) “Papel higiênico no vaso sanitário: hidrodispersibilidade e retenção em trecho experimental de tubulação”. O trabalho é requisito para a obtenção do título de bacharel em Engenharia Ambiental e Sanitária pela Universidade Estadual de Mato Grosso do Sul (UEMS), na Unidade Universitária de Dourados, e foi orientado pelo professor Vinícius de Oliveira Ribeiro, coordenador do CESAM.',
      ),
      p(
        'A banca contou com a professora Jéssica Ferreira da Silva e com o professor Nelison Ferreira Correa, ambos da UEMS. O TCC foi estruturado no formato de artigo científico, segundo as normas da Revista DAE.',
      ),
      titulo('A pergunta da pesquisa'),
      p(
        'O que acontece com o papel higiênico depois do uso fica entre o manejo de resíduos sólidos e o esgotamento sanitário. Companhias de saneamento, como a Sabesp e a Sanepar, orientam que ele seja descartado no lixo, e não no vaso, por causa do risco de entupimentos. Por isso, dados experimentais sobre como os produtos vendidos no país se comportam na água e dentro de uma tubulação ajudam a avaliar o tema com base técnica.',
      ),
      p(
        'Foi nesse contexto que o trabalho comparou a hidrodispersibilidade, ou seja, a capacidade de o papel se desintegrar na água, de três produtos nacionais e de um produto internacional vendido como de rápida dissolução, todos de folha dupla.',
      ),
      titulo('Como o estudo foi feito'),
      p(
        'O estudo teve duas etapas. Na primeira, os papéis foram agitados em água, por um método adaptado da norma ISO 12625-17:2021, e o percentual desintegrado foi medido em 6, 30 e 120 segundos. O intervalo de 6 segundos foi acrescentado porque está na ordem de grandeza da duração de uma descarga.',
      ),
      p(
        'Na segunda etapa, o transporte do papel foi simulado em um trecho de tubo de PVC com 100 mm de diâmetro, assentado com declividade de 0,0045 m/m. Foram despejados 4,5 litros de água em cerca de 3 segundos, a condição crítica de menor tempo de descarga adotada no experimento, e depois se mediu quanto papel ficou retido na tubulação. Os produtos foram identificados apenas por letras, porque o objetivo não era avaliar fabricantes.',
      ),
      titulo('O que foi encontrado'),
      p(
        'O produto internacional atingiu 100% de desintegração já aos 6 segundos. Entre todos os produtos, a desintegração nesse tempo variou de 5,99% a 100%, e os produtos nacionais mostraram velocidades e níveis bem diferentes, mesmo tendo o mesmo número de folhas. Para a autora, isso indica que o número de folhas, sozinho, não basta para descrever o comportamento do papel na água.',
      ),
      p(
        'No ensaio de transporte, os três produtos nacionais ficaram em grande parte retidos no trecho de tubulação, entre 86,98% e 92,75%, enquanto o produto internacional reteve 43,63%. Segundo o trabalho, esse resultado mostra potencial de permanência do material celulósico na tubulação e é coerente com a recomendação das companhias de saneamento de não descartar papel higiênico convencional no vaso.',
      ),
      titulo('Limites e próximos passos'),
      p(
        'Foi avaliado um único rolo de cada produto, então os resultados descrevem as amostras ensaiadas e não devem ser generalizados para outros lotes, marcas ou redes. A autora recomenda que estudos futuros ampliem a variedade de produtos e lotes, caracterizem suas propriedades físicas e avaliem o transporte em configurações hidráulicas mais próximas das redes reais.',
      ),
    ],
    galeria: [
      {
        arquivo: 'noticias/tcc-ana-laura-apresentando-resultados',
        alt: 'Ana Laura Eich apresenta os resultados diante do telão, que mostra um gráfico de barras sobre a retenção do papel, enquanto três pessoas assistem sentadas.',
        legenda: 'Apresentação dos resultados do ensaio de retenção na tubulação.',
        foco: '50% 40%',
      },
      {
        arquivo: 'noticias/tcc-ana-laura-ao-lado-do-telao',
        alt: 'Ana Laura Eich, de camisa azul, em pé ao lado do telão com o slide de título do trabalho, em uma sala de aula.',
        foco: '50% 35%',
      },
    ],
  },
  {
    slug: 'curso-de-geoprocessamento-para-a-pma-de-dourados',
    titulo: 'CESAM realiza curso de geoprocessamento para a PMA de Dourados',
    data: '2026-06-08',
    categoria: 'extensao',
    resumo:
      'Ministrado por Nélison Ferreira Corrêa e Elias de Oliveira Junior, o curso foi realizado na sala do CESAM, na UEMS, para integrantes da Polícia Militar Ambiental de Dourados (MS).',
    capa: {
      arquivo: 'noticias/curso-geoprocessamento-pma-sala-com-participantes',
      alt: 'Sala do CESAM durante o curso: um militar em pé observa a tela de um notebook, e participantes de uniforme acompanham sentados, com o banner do CESAM ao fundo.',
      foco: '50% 45%',
    },
    corpo: [
      p(
        'No dia 8 de junho de 2026, o CESAM realizou um curso de geoprocessamento para integrantes da Polícia Militar Ambiental (PMA) de Dourados (MS). A atividade aconteceu na sala do centro, na Universidade Estadual de Mato Grosso do Sul (UEMS), e foi ministrada pelo pesquisador Nélison Ferreira Corrêa e pelo mestrando Elias de Oliveira Junior.',
      ),
      titulo('Aula na sala do CESAM'),
      p(
        'Os participantes acompanharam a aula em notebooks, nas bancadas de trabalho do centro. Equipamentos de campo, como caixas de transporte e um tripé com equipamento de medição, ficaram à vista na sala durante a atividade.',
      ),
      titulo('O geoprocessamento no CESAM'),
      p(
        'O geoprocessamento reúne técnicas para tratar e analisar informações geográficas, como mapas e imagens de satélite. É uma das ferramentas usadas nas pesquisas do CESAM, que já publicou trabalhos com mapas de áreas prioritárias para recuperação ambiental, como o da microbacia do córrego Curupaí, e de áreas potenciais para instalações de saneamento, como os estudos feitos para a região de Porto Murtinho (MS). Esses trabalhos estão na seção Publicações.',
      ),
      p(
        'Atividades como essa aproximam o CESAM de instituições que atuam diretamente na proteção do meio ambiente e levam para fora da universidade técnicas desenvolvidas nas pesquisas do centro.',
      ),
    ],
    galeria: [
      {
        arquivo: 'noticias/curso-geoprocessamento-pma-aula-com-equipamentos',
        alt: 'Participantes de uniforme sentados em volta das mesas da sala do CESAM, com notebooks e um tripé com equipamento de medição, enquanto um militar em pé sorri; o banner do CESAM aparece ao fundo.',
        legenda: 'Aula na sala do CESAM, com equipamentos de campo à vista.',
        foco: '50% 45%',
      },
      {
        arquivo: 'noticias/curso-geoprocessamento-pma-bancadas',
        alt: 'Mesas da sala do CESAM com notebooks abertos e caixas amarelas de equipamentos sobre as bancadas, com participantes ao fundo.',
        ajuste: 'conter',
      },
      {
        arquivo: 'noticias/curso-geoprocessamento-pma-quadro-e-notebooks',
        alt: 'A sala do CESAM vista de outro ângulo, com participantes diante de notebooks e o quadro branco à direita.',
        ajuste: 'conter',
      },
      {
        arquivo: 'noticias/curso-geoprocessamento-pma-fundo-da-sala',
        alt: 'Participantes sentados diante de notebooks no fundo da sala do CESAM, com equipamentos sobre as bancadas.',
        ajuste: 'conter',
      },
    ],
  },
  {
    slug: 'curso-de-sonometro-para-o-2o-batalhao-da-pma',
    titulo: 'CESAM realiza curso de sonômetro para o 2º Batalhão da Polícia Militar Ambiental',
    data: '2026-08-05',
    categoria: 'extensao',
    resumo:
      'Ministrado por Nélison Ferreira Corrêa e Elias de Oliveira Junior, o curso reuniu na sala do CESAM integrantes do 2º Batalhão da Polícia Militar Ambiental de Mato Grosso do Sul.',
    capa: {
      arquivo: 'sobre/equipe-e-policia-militar-na-sala',
      alt: 'Integrantes do CESAM e policiais militares reunidos na sala do centro, com o banner do CESAM ao fundo.',
      foco: '50% 45%',
    },
    corpo: [
      p(
        'No dia 5 de agosto de 2026, o CESAM realizou um curso de sonômetro para integrantes do 2º Batalhão da Polícia Militar Ambiental (PMA) de Mato Grosso do Sul. A atividade foi ministrada pelo pesquisador Nélison Ferreira Corrêa e pelo mestrando Elias de Oliveira Junior, os mesmos instrutores do curso de geoprocessamento oferecido à PMA de Dourados em junho.',
      ),
      titulo('O que é o sonômetro'),
      p(
        'O sonômetro é o equipamento usado para medir o nível de ruído de um ambiente. O curso levou o instrumento para a rotina de quem atua na proteção ambiental.',
      ),
      titulo('Capacitação na sala do CESAM'),
      p(
        'Os participantes acompanharam o curso nas mesas de trabalho do centro, com notebooks, e o encontro foi registrado em fotos de grupo na própria sala do CESAM.',
      ),
      p(
        'Em 8 de junho, o centro já havia realizado um curso de geoprocessamento para a PMA de Dourados. As duas atividades aproximam o CESAM de instituições que atuam diretamente na proteção do meio ambiente.',
      ),
    ],
    galeria: [
      {
        arquivo: 'noticias/curso-sonometro-pma-grupo-ao-fundo',
        alt: 'Grupo de pessoas de uniforme reunido em pé na sala do CESAM, algumas com pastas azuis, com o banner do CESAM ao fundo.',
        ajuste: 'conter',
      },
      {
        arquivo: 'noticias/curso-sonometro-pma-participantes-com-pastas',
        alt: 'Seis pessoas em pé diante do quadro branco da sala do CESAM, duas de camisa azul e quatro de uniforme escuro, quatro delas segurando pastas azuis.',
        legenda: 'Participantes reunidos na sala do CESAM.',
        ajuste: 'conter',
      },
      {
        arquivo: 'noticias/curso-sonometro-pma-sala',
        alt: 'A sala do CESAM vista de um canto, com participantes de uniforme ao fundo e uma pessoa de camisa azul em pé à direita.',
        ajuste: 'conter',
      },
    ],
  },
];

/** Notícias já publicadas na data `hoje` (AAAA-MM-DD), da mais recente para a mais antiga. */
export function publicadas(hoje: string, lista: Noticia[] = noticias): Noticia[] {
  return lista
    .filter((n) => n.data <= hoje)
    .sort((a, b) => b.data.localeCompare(a.data) || a.titulo.localeCompare(b.titulo, 'pt-BR'));
}

export function dataPorExtenso(data: string): string {
  const [ano, mes, dia] = data.split('-').map(Number) as [number, number, number];
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function dataCurta(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

/** Data de hoje (AAAA-MM-DD) no fuso de Campo Grande/Dourados, para decidir o que já foi publicado no build. */
export function hojeNoBuild(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Campo_Grande' });
}
