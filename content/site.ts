/**
 * Conteúdo institucional da página inicial.
 *
 * Origem: design aprovado no Claude ("CESAM Landing Page", artboards Desktop 1440 e Mobile 390).
 * Convenções:
 * - Textos entre colchetes, como "[Nome]", são placeholders do design e ainda precisam
 *   ser fornecidos pela coordenação do CESAM. Não substituir por conteúdo inventado.
 * - `href` ausente significa que o destino ainda não foi definido. O componente renderiza
 *   o rótulo sem link, para não publicar links quebrados (SPEC-001, AC-01).
 * - Textos marcados com PENDENTE-VALIDACAO vieram do design, mas ainda não foram
 *   confirmados como texto institucional oficial.
 */

export type Link = { label: string; href?: string; external?: boolean };

export type Stat = { value: string; label: string; accent: 'yellow' | 'blue' | 'green' | 'white' };

export type ResearchLine = { title: string; text: string; shortText: string; icon: IconName };

export type ProjectStatus = 'Em andamento' | 'Concluído';

export type Project = {
  title: string;
  summary: string;
  status: ProjectStatus;
  coordination: string;
  funding: string;
  tone: 'green' | 'blue' | 'yellow';
};

export type TeamMember = {
  name: string;
  role: string;
  /** Cor do avatar quando não há foto. */
  tone: 'green' | 'blue' | 'yellow';
  photo?: string;
  focus?: string;
  /** URL do Currículo Lattes; quando presente, o card inteiro vira link. */
  lattes?: string;
};

export type Coordinator = {
  name: string;
  /** Rótulo acima do nome, ex.: "Coordenação". */
  role: string;
  /** Maior titulação, como no Lattes. */
  degree: string;
  /** Área de atuação resumida. */
  area: string;
  /** Chave da foto em content/midia/manifesto.json. */
  photo?: string;
  /** Recorte da foto (object-position). */
  focus?: string;
  lattes: Link;
};

export type IconName = 'drop' | 'bin' | 'waves' | 'drain' | 'sprout' | 'cap';

export const site = {
  name: 'CESAM',
  fullName: 'Centro de Estudos em Saneamento Ambiental',
  institution: 'Universidade Estadual de Mato Grosso do Sul',
  institutionShort: 'UEMS',
  // Domínio do site (canonical, Open Graph, sitemap). Provisório até o domínio definitivo:
  // troque na Vercel com NEXT_PUBLIC_SITE_URL ou aqui, sem barra final.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cesamuems.vercel.app',
  description:
    'O Centro de Estudos em Saneamento Ambiental da UEMS reúne pesquisa, extensão e formação de pessoas para enfrentar os desafios de água, esgoto, resíduos e drenagem em Mato Grosso do Sul.',
  year: 2026,
};

export const topBar = {
  text: 'Universidade Estadual de Mato Grosso do Sul · UEMS',
  links: [{ label: 'Portal UEMS', href: 'https://www.uems.br', external: true }] satisfies Link[],
};

export const navigation: Link[] = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Plataformas', href: '#plataformas' },
  { label: 'Pesquisa', href: '#pesquisa' },
  { label: 'Notícias', href: '#noticias' },
  { label: 'Equipe', href: '#equipe' },
  { label: 'Publicações', href: '#publicacoes' },
];

export const hero = {
  eyebrow: 'Centro de Estudos · UEMS',
  // PENDENTE-VALIDACAO
  title: 'Ciência em saneamento para água limpa, ambiente saudável e cidades sustentáveis.',
  lead: site.description,
  primaryCta: { label: 'Conheça nossa pesquisa', href: '#pesquisa' },
  secondaryCta: { label: 'Fale com o centro', href: '#contato' },
};

export const stats: Stat[] = [
  { value: '[00]', label: 'Pesquisadores e estudantes', accent: 'yellow' },
  { value: '[00]', label: 'Projetos em andamento', accent: 'blue' },
  { value: '[000]', label: 'Publicações científicas', accent: 'green' },
  { value: '[Ano]', label: 'Ano de fundação', accent: 'white' },
];

export const platforms = {
  eyebrow: 'Plataformas',
  title: 'Dados abertos e ferramentas do CESAM',
  lead: 'Painéis públicos desenvolvidos pelo centro para apoiar gestores, pesquisadores e a sociedade.',
  observatorio: {
    name: 'Observatório de Saneamento',
    href: 'https://observatorio-saneamento-ms.vercel.app/',
    title: 'O retrato do saneamento em Mato Grosso do Sul, município por município.',
    text: 'Dados oficiais para análise municipal, com ranking, mapa e fichas por município.',
    shortText: 'Dados oficiais para análise municipal.',
    figures: [
      { value: '79', label: 'municípios' },
      { value: '23', label: 'indicadores' },
      { value: '1995–2023', label: 'série histórica' },
    ],
    themes: ['Água', 'Esgoto', 'Resíduos', 'Águas pluviais', 'Gestão'],
    cta: 'Acessar o Observatório',
  },
  residuos: {
    badge: 'Portal · resíduos sólidos',
    title: 'Portal de Resíduos Sólidos',
    text: '[Descrição curta do portal: o que reúne e para quem é.]',
    themes: ['[Tema 1]', '[Tema 2]', '[Tema 3]'],
    cta: 'Acessar o portal',
    // PENDENTE: endereço do portal.
    href: undefined as string | undefined,
  },
};

export const about = {
  eyebrow: 'Sobre o CESAM',
  title: 'Um centro de referência em saneamento ambiental na UEMS',
  // PENDENTE-VALIDACAO
  text: 'Vinculado à Universidade Estadual de Mato Grosso do Sul, o CESAM desenvolve estudos sobre tratamento de água e esgoto, gestão de resíduos, recursos hídricos e saúde ambiental, aproximando a universidade das demandas de municípios, comunidades e setor produtivo.',
  photo: '[Foto: equipe no laboratório ou em campo]',
  // PENDENTE-VALIDACAO: missão, visão e valores oficiais.
  pillars: [
    { title: 'Missão', text: 'Produzir e difundir conhecimento que melhore o saneamento e a qualidade de vida.' },
    { title: 'Visão', text: 'Ser referência regional em pesquisa aplicada ao saneamento ambiental.' },
    { title: 'Valores', text: 'Rigor científico, compromisso público e cuidado com o ambiente.' },
  ],
};

export const research = {
  eyebrow: 'Linhas de pesquisa',
  title: 'Onde nossa pesquisa atua',
  lead: 'Seis frentes que conectam laboratório, campo e políticas públicas de saneamento.',
  // PENDENTE-VALIDACAO: linhas oficiais do grupo de pesquisa.
  lines: [
    {
      title: 'Tratamento de água e efluentes',
      text: 'Processos físico-químicos e biológicos para potabilização e tratamento de esgotos.',
      shortText: 'Processos para potabilização e tratamento de esgotos.',
      icon: 'drop',
    },
    {
      title: 'Resíduos sólidos',
      text: 'Gestão, reaproveitamento e disposição adequada de resíduos urbanos e agroindustriais.',
      shortText: 'Gestão e reaproveitamento de resíduos urbanos e agroindustriais.',
      icon: 'bin',
    },
    {
      title: 'Recursos hídricos',
      text: 'Monitoramento da qualidade da água em rios, reservatórios e bacias hidrográficas.',
      shortText: 'Qualidade da água em rios, reservatórios e bacias.',
      icon: 'waves',
    },
    {
      title: 'Drenagem urbana',
      text: 'Soluções para manejo de águas pluviais e redução de alagamentos nas cidades.',
      shortText: 'Manejo de águas pluviais e redução de alagamentos.',
      icon: 'drain',
    },
    {
      title: 'Saneamento rural',
      text: 'Tecnologias sociais e de baixo custo para comunidades rurais e tradicionais.',
      shortText: 'Tecnologias sociais para comunidades rurais e tradicionais.',
      icon: 'sprout',
    },
    {
      title: 'Educação ambiental',
      text: 'Extensão, formação e divulgação científica com escolas e municípios.',
      shortText: 'Extensão e divulgação científica com escolas e municípios.',
      icon: 'cap',
    },
  ] satisfies ResearchLine[],
};

const projectPlaceholder = (n: number, status: ProjectStatus, tone: Project['tone']): Project => ({
  title: `[Título do projeto ${n}]`,
  summary: '[Resumo do projeto em até duas linhas, com objetivo e local de atuação.]',
  status,
  coordination: '[Nome]',
  funding: '[Agência de fomento]',
  tone,
});

export const projects = {
  eyebrow: 'Projetos',
  title: 'Projetos em destaque',
  all: { label: 'Todos os projetos' } satisfies Link,
  items: [
    projectPlaceholder(1, 'Em andamento', 'green'),
    projectPlaceholder(2, 'Em andamento', 'blue'),
    projectPlaceholder(3, 'Concluído', 'yellow'),
  ],
};

export const team = {
  eyebrow: 'Equipe',
  title: 'Pessoas que fazem o CESAM',
  all: { label: 'Equipe completa' } satisfies Link,
  // Cards em destaque (escuros, com foto grande), na ordem de exibição. Uso de imagem autorizado (SPEC-005, PRIV-01).
  // Nome, titulação e área conforme o resumo do Currículo Lattes de cada um (consultado em 2026-10-08).
  coordinators: [
    {
      name: 'Vinícius de Oliveira Ribeiro',
      role: 'Coordenação',
      degree: 'Doutor em Saneamento Ambiental e Recursos Hídricos (UFMS)',
      area: 'Engenharia sanitária e ambiental, recursos hídricos e geotecnologias',
      photo: 'equipe/vinicius-de-oliveira-ribeiro',
      focus: '50% 30%',
      lattes: { label: 'Currículo Lattes', href: 'https://lattes.cnpq.br/7060729285519533', external: true },
    },
    {
      name: 'Nélison Ferreira Corrêa',
      role: 'Pesquisador',
      degree: 'Doutor em Tecnologias Ambientais (UFMS)',
      area: 'Geoprocessamento, saneamento ambiental e licenciamento ambiental',
      photo: 'equipe/nelison-ferreira-correa',
      focus: '50% 10%',
      lattes: { label: 'Currículo Lattes', href: 'https://lattes.cnpq.br/5432377107139002', external: true },
    },
  ] satisfies Coordinator[],
  // Cards pequenos. Nome e situação acadêmica conforme o Currículo Lattes (consultado em 2026-10-08).
  // Sem `lattes`, o card não é link (ex.: equipe administrativa). Novos integrantes entram conforme enviam fotos.
  members: [
    {
      name: 'Jonailce Oliveira Diodato',
      role: 'Doutoranda · PGRN/UEMS',
      tone: 'green',
      photo: 'equipe/jonailce-oliveira-diodato',
      focus: '50% 25%',
      lattes: 'https://lattes.cnpq.br/7372237966579605',
    },
    {
      name: 'Bruna Alves de Souza Oliveira',
      role: 'Mestranda · PGRN/UEMS',
      tone: 'blue',
      photo: 'equipe/bruna-alves-de-souza-oliveira',
      focus: '55% 28%',
      lattes: 'https://lattes.cnpq.br/3977340630312154',
    },
    {
      name: 'Elias de Oliveira Junior',
      role: 'Mestrando · PGRN/UEMS',
      tone: 'blue',
      photo: 'equipe/elias-de-oliveira-junior',
      focus: '62% 22%',
      lattes: 'https://lattes.cnpq.br/7679581190983869',
    },
    {
      name: 'Lucas Beraldi de Souza Oliveira',
      role: 'Pesquisador',
      tone: 'green',
      photo: 'equipe/lucas-beraldi-de-souza-oliveira',
      focus: '45% 30%',
      lattes: 'https://lattes.cnpq.br/4817723878667471',
    },
    {
      name: 'Valquíria Nascimento',
      role: 'Administrativo',
      tone: 'yellow',
      photo: 'equipe/valquiria',
      focus: '45% 25%',
    },
  ] satisfies TeamMember[],
};

export const publications = {
  eyebrow: 'Publicações',
  title: 'Produção científica recente',
  // Itens em content/publicacoes.ts (SPEC-006).
};

export const news = {
  eyebrow: 'Notícias',
  title: 'Acontece no CESAM',
  // Notícias em content/noticias.ts (SPEC-007).
};

export const contact = {
  eyebrow: 'Contato',
  title: 'Fale com o CESAM',
  lead: 'Parcerias, análises, visitas técnicas ou interesse em fazer parte da equipe: escreva para nós.',
  // Endereço da Unidade Universitária de Dourados, conforme o site da UEMS (CEP e Caixa Postal);
  // a rodovia é a Dourados–Itahum, informada pela coordenação.
  address:
    'UEMS, Unidade Universitária de Dourados · Rodovia Dourados–Itahum, Cidade Universitária · CEP 79804-970 · Dourados – MS',
  email: 'cesam@uems.br',
  phone: '(67) 3902-2547',
  phoneHref: 'tel:+556739022547',
  // PENDENTE: horário de atendimento.
  mapa: {
    // Link informado pela coordenação; o ponto marcado é "UEMS - Universidade Estadual de Mato Grosso do Sul".
    href: 'https://maps.app.goo.gl/HbWZ9ySf2uagoFN56',
    latitude: -22.1976768,
    longitude: -54.9315119,
    titulo: 'Mapa com a localização da UEMS em Dourados, onde fica o CESAM',
  },
  subjects: ['Parceria ou projeto', 'Análises laboratoriais', 'Processo seletivo / estágio', 'Imprensa', 'Outro'],
};

export const footer = {
  about: `${site.fullName} da ${site.institution}.`,
  columns: [
    {
      title: 'Navegação',
      links: [
        { label: 'Sobre', href: '#sobre' },
        { label: 'Linhas de pesquisa', href: '#pesquisa' },
        { label: 'Equipe', href: '#equipe' },
      ],
    },
    {
      title: 'Institucional',
      links: [
        { label: 'UEMS', href: 'https://www.uems.br', external: true },
        { label: 'Pró-Reitoria de Pesquisa', href: 'https://www.uems.br/pro-reitoria/proppi', external: true },
        { label: 'Programas de pós-graduação', href: 'https://www.uems.br/cursos/pos-graduacao', external: true },
      ],
    },
    {
      title: 'Redes',
      links: [
        { label: 'Instagram', href: 'https://www.instagram.com/cesam_uems/', external: true },
        { label: 'YouTube', href: 'https://www.youtube.com/@CESAM_UEMS', external: true },
      ],
    },
  ] satisfies { title: string; links: Link[] }[],
  copyright: `© ${site.year} CESAM · ${site.institution}`,
  credit: 'Desenvolvido pelo CESAM',
};
