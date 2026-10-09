/**
 * Produção científica do CESAM (SPEC-006, revisão de 2026-10-08).
 *
 * Regra de inclusão (decisão da coordenação): trabalhos com **dois ou mais integrantes do CESAM** entre os autores.
 * Fonte: Lattes de Bruna e Jonailce (prints enviados pela coordenação) + registro de DOI do Crossref
 * (busca pelos nomes dos integrantes), consultado em 2026-10-08. Título, autores, veículo e ano como no registro do DOI;
 * títulos publicados em caixa alta foram passados para caixa normal.
 *
 * - `pdf`: link direto para o PDF no site do periódico, conferido em navegador. Sem `pdf`, o link vai para a página
 *   do artigo pelo DOI (periódico sem PDF aberto no registro ou com bloqueio antirrobô, caso da Revista EIA).
 * - `cesam: true` marca os autores que são integrantes do CESAM (aparecem em negrito).
 * - Não incluído por falta de DOI e de link: "Rendimento de madeira serrada para três espécies florestais comerciais
 *   do bioma amazônico em Juína/MT" (Revista de Engenharia e Tecnologia, v. 13, 2021). Entra quando houver link.
 *
 * Provisório em TypeScript até a aprovação do ADR-002.
 */
export type TipoPublicacao = 'artigo' | 'livro' | 'evento';

export type Publicacao = {
  ano: number;
  tipo: TipoPublicacao;
  tipoRotulo: string;
  titulo: string;
  autores: { nome: string; cesam?: boolean }[];
  veiculo: string;
  doi: string;
  pdf?: string;
};

/** Da mais recente para a mais antiga. */
export const publicacoes: Publicacao[] = [
  {
    ano: 2025,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo:
      'Urban Parks in Permanent Preservation Areas as a Tool for Conservation and Environmental Education: a Bibliometric Study',
    autores: [
      { nome: 'Aiana Rodrigues Leonel da Silva' },
      { nome: 'Pamela Alves Carvalho' },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Nelison Ferreira Corrêa', cesam: true },
    ],
    veiculo: 'Revista de Gestão Social e Ambiental',
    doi: '10.24857/rgsa.v19n2-001',
    pdf: 'https://rgsa.openaccesspublications.org/rgsa/article/download/10843/5898',
  },
  {
    ano: 2024,
    tipo: 'livro',
    tipoRotulo: 'Livro',
    titulo: 'Notas de Projeto: Redes Coletoras de Esgoto',
    autores: [
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Nelison Ferreira Correa', cesam: true },
      { nome: 'João Victor Maciel de Andrade Silva' },
    ],
    veiculo: '',
    doi: '10.56238/livrosindi202446-001',
  },
  {
    ano: 2024,
    tipo: 'evento',
    tipoRotulo: 'Trabalho em evento',
    titulo: 'Implementação de taxa municipal de resíduos sólidos urbanos',
    autores: [
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Pamela Alves Carvalho' },
      { nome: 'Nelison Ferreira Correa', cesam: true },
      { nome: 'Laércio Alves de Carvalho' },
    ],
    veiculo: 'I Congresso Internacional Multidisciplinar (I CIM)',
    doi: '10.56238/i-cim-045',
  },
  {
    ano: 2024,
    tipo: 'evento',
    tipoRotulo: 'Trabalho em evento',
    titulo: 'Survey of environmental education actions in solid waste in the state of Mato Grosso do Sul',
    autores: [
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Marjolly Priscilla Bais Shinzato' },
      { nome: 'Nelison Ferreira Correa', cesam: true },
      { nome: 'Laércio Alves de Carvalho' },
    ],
    veiculo: 'I Congresso Internacional Multidisciplinar (I CIM)',
    doi: '10.56238/i-cim-024',
  },
  {
    ano: 2024,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'Cienciometria e bibliometria do estudo de geotecnologias e saneamento na região de Porto Murtinho-MS',
    autores: [
      { nome: 'Nelison Ferreira Corrêa', cesam: true },
      { nome: 'Antonio Conceição Paranhos Filho' },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
    ],
    veiculo: 'Revista de Gestão Social e Ambiental',
    doi: '10.24857/rgsa.v18n2-066',
    pdf: 'https://rgsa.openaccesspublications.org/rgsa/article/download/4937/1880',
  },
  {
    ano: 2024,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'Systematic Review on Geotechnology Studies Applied to Sanitation and Possibilities for Porto Murtinho/MS',
    autores: [
      { nome: 'Nelison Ferreira Corrêa', cesam: true },
      { nome: 'Antonio Conceição Paranhos Filho' },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Valmor Nazario Martins' },
      { nome: 'Bruna Alves de Souza Oliveira', cesam: true },
    ],
    veiculo: 'Revista de Gestão Social e Ambiental',
    doi: '10.24857/rgsa.v18n1-161',
    pdf: 'https://rgsa.openaccesspublications.org/rgsa/article/download/7718/3289',
  },
  {
    ano: 2024,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo:
      'Preparation of a Map of Potential Areas For the Installation of a Sewage Treatment Plant in the Porto Murtinho/MS Region',
    autores: [
      { nome: 'Nelison Ferreira Corrêa', cesam: true },
      { nome: 'Antonio Conceição Paranhos Filho' },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Valmor Nazario Martins' },
      { nome: 'Bruna Alves de Souza Oliveira', cesam: true },
      { nome: 'Elias de Oliveira Junior', cesam: true },
    ],
    veiculo: 'Revista de Gestão Social e Ambiental',
    doi: '10.24857/rgsa.v18n10-081',
    pdf: 'https://rgsa.openaccesspublications.org/rgsa/article/download/8943/4179',
  },
  {
    ano: 2024,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo:
      'Preparation of a Map of Potential Areas For the Installation of a Sanitary Landfill in the Porto Murtinho/MS Region',
    autores: [
      { nome: 'Nelison Ferreira Corrêa', cesam: true },
      { nome: 'Antonio Conceição Paranhos Filho' },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Bruna Alves de Souza Oliveira', cesam: true },
      { nome: 'Elias de Oliveira Junior', cesam: true },
      { nome: 'Victor Hugo Costa' },
    ],
    veiculo: 'Revista de Gestão Social e Ambiental',
    doi: '10.24857/rgsa.v18n10-328',
    pdf: 'https://rgsa.openaccesspublications.org/rgsa/article/download/9525/4616',
  },
  {
    ano: 2023,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'Bibliometric Analysis: Remote Sensing Applied to Urban Permanent Preservation Areas',
    autores: [
      { nome: 'Petersson Cardoso De Souza' },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Nelison Ferreira Corrêa', cesam: true },
      { nome: 'Pamela Alves Carvalho' },
    ],
    veiculo: 'Revista de Gestão Social e Ambiental',
    doi: '10.24857/rgsa.v18n2-010',
    pdf: 'https://rgsa.openaccesspublications.org/rgsa/article/download/4449/1457',
  },
  {
    ano: 2023,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo:
      'Brazilian Forest Code as an Instrument for Environmental Conservation – Case Study of the Curupaí and Engano Watersheds, Mato Grosso do Sul/Brazil',
    autores: [
      { nome: 'João Lucas Alves Da Silva' },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
      { nome: 'Nelison Ferreira Corrêa', cesam: true },
    ],
    veiculo: 'Revista de Gestão Social e Ambiental',
    doi: '10.24857/rgsa.v18n3-024',
    pdf: 'https://rgsa.openaccesspublications.org/rgsa/article/download/4484/1578',
  },
  {
    ano: 2023,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'Avaliação da qualidade ambiental das nascentes urbanas do córrego Gameleira, Campo Grande-MS',
    autores: [
      { nome: 'Edwaldo Henrique Bazana Barbosa' },
      { nome: 'Vinicius de Oliveira Ribeiro', cesam: true },
      { nome: 'João Lucas Alves Da Silva' },
      { nome: 'Shaline Séfara Lopes Fernandes' },
      { nome: 'Nelison Ferreira Correa', cesam: true },
      { nome: 'Amanda Bianchi Corsino' },
      { nome: 'Danilo Henrique De Siqueira' },
    ],
    veiculo: 'Geofronter',
    doi: '10.61389/geofronter.v9i1.7488',
    pdf: 'https://periodicosonline.uems.br/index.php/GEOF/article/download/7488/5549',
  },
  {
    ano: 2022,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'Índice de obstrução de rede coletora de esgoto para o município de Dourados/MS',
    autores: [
      { nome: 'Luana Araujo Amancio' },
      { nome: 'Vinícius De Oliveira Ribeiro', cesam: true },
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
      { nome: 'Nelison Ferreira Correa', cesam: true },
    ],
    veiculo: 'Gaia Scientia',
    doi: '10.22478/ufpb.1981-1268.2022v16n2.61882',
    pdf: 'https://periodicos.ufpb.br/index.php/gaia/article/download/61882/36103',
  },
  {
    ano: 2022,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'Carta de áreas prioritárias à recuperação para a microbacia do córrego Curupaí, Mato Grosso do Sul',
    autores: [
      { nome: 'Bruna Alves de Souza', cesam: true },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Nelison Ferreira Correa', cesam: true },
      { nome: 'João Lucas Alves da Silva' },
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
      { nome: 'Lucimara Gonçalves Narcizo' },
    ],
    veiculo: 'Research, Society and Development',
    doi: '10.33448/rsd-v11i6.29416',
    pdf: 'https://rsdjournal.org/index.php/rsd/article/download/29416/25410',
  },
  {
    ano: 2022,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'Incorporación de lodos de eta como sustituto parcial del árido fino en bloques de hormigón con fugas',
    autores: [
      { nome: 'Alfred Föster' },
      { nome: 'Aguinaldo Lenine Alves' },
      { nome: 'Antônio Aparecido Zanfolim' },
      { nome: 'Vinícius De Oliveira Ribeiro', cesam: true },
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
    ],
    veiculo: 'Revista EIA',
    doi: '10.24050/reia.v19i38.1568',
  },
  {
    ano: 2022,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'Análise gravimétrica dos resíduos sólidos urbanos do município de Dourados, MS',
    autores: [
      { nome: 'Rhaissa Hissae Maezawa de Souza' },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
      { nome: 'Anderson Secco Dos Santos' },
    ],
    veiculo: 'Multitemas',
    doi: '10.20435/multi.v27i66.3608',
    pdf: 'https://interacoes.ucdb.br/multitemas/article/download/3608/2704',
  },
  {
    ano: 2022,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo:
      'Influência do uso e cobertura do solo na qualidade da água - estudo de caso do córrego Laranja Doce, Dourados/MS',
    autores: [
      { nome: 'Thayne Danieli Schmidt Zolin' },
      { nome: 'Shaline Sefara Lopes Fernandes' },
      { nome: 'Vinícius De Oliveira Ribeiro', cesam: true },
      { nome: 'Nelison Ferreira Corrêa', cesam: true },
      { nome: 'Laercio Alves de Carvalho' },
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
    ],
    veiculo: 'Gaia Scientia',
    doi: '10.22478/ufpb.1981-1268.2022v16n1.61337',
    pdf: 'https://periodicos.ufpb.br/index.php/gaia/article/download/61337/35800',
  },
  {
    ano: 2022,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'AltBlock - Design Storms Software',
    autores: [
      { nome: 'Elizandra Biá Viana' },
      { nome: 'Taís Arriero Shinma Galbetti' },
      { nome: 'Marcus Vinicius Galbetti' },
      { nome: 'Vinícius de Oliveira Ribeiro', cesam: true },
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
    ],
    veiculo: 'Terr@ Plural',
    doi: '10.5212/terraplural.v.16.2220175.036',
  },
  {
    ano: 2021,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo:
      'Comparação dos métodos da Média Aritmética, dos Polígonos de Thiessen e do IPD na avaliação espacial de dados pluviométricos',
    autores: [
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
      { nome: 'Taís Arriero Shinma Galbetti' },
      { nome: 'Marcus Vinícius Galbetti' },
      { nome: 'Vinícius De Oliveira Ribeiro', cesam: true },
      { nome: 'Max Dante' },
    ],
    veiculo: 'Revista EIA',
    doi: '10.24050/reia.v19i37.1500',
  },
  {
    ano: 2020,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'Carta de susceptibilidade erosiva da Bacia Hidrográfica do Córrego Curral de Arame, Dourados/MS',
    autores: [
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
      { nome: 'Vinícius De Oliveira Ribeiro', cesam: true },
    ],
    veiculo: 'Revista EIA',
    doi: '10.24050/reia.v17i34.1409',
  },
  {
    ano: 2019,
    tipo: 'artigo',
    tipoRotulo: 'Artigo',
    titulo: 'Morphometry of the hydrographic basins inserted in the urban area of Dourados – MS – Brazil',
    autores: [
      { nome: 'Leonardo Lima dos Santos' },
      { nome: 'Vinícius De Oliveira Ribeiro', cesam: true },
      { nome: 'Jonailce Oliveira Diodato', cesam: true },
    ],
    veiculo: 'Raega - O Espaço Geográfico em Análise',
    doi: '10.5380/raega.v46i3.67039',
    pdf: 'https://revistas.ufpr.br/raega/article/viewFile/67039/39190',
  },
];
