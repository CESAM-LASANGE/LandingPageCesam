# ADR-002 — Conteúdo em arquivos Markdown por item

## Status

Proposto (2026-10-08). Depende de aprovação humana das dependências listadas.

## Contexto

Projetos, publicações, notícias e membros da equipe vão crescer com o tempo ("bastante projetos"). Hoje todo o conteúdo fica em `content/site.ts`, um único arquivo TypeScript. Isso não escala e exige conhecimento de código para editar. As páginas de detalhe (SPEC-004, SPEC-006, SPEC-007) precisam de um item por arquivo, com texto longo formatado.

## Decisão

- Cada item vira um arquivo Markdown com metadados no topo (frontmatter YAML):

  ```text
  content/
    projetos/<slug>.md
    publicacoes/<slug>.md
    noticias/<slug>.md
    equipe/<slug>.md
    linhas-de-pesquisa/<slug>.md
    sobre/galeria.md           (lista de fotos do carrossel do Sobre)
  ```

- O nome do arquivo é o `slug` da URL (`/projetos/<slug>/`): minúsculas, sem acento, palavras separadas por hífen.
- Os metadados são validados no build por um schema tipado. Campo obrigatório ausente, data inválida ou referência quebrada (ex.: projeto citando publicação que não existe) **falha o build** com mensagem clara indicando arquivo e campo.
- O corpo em Markdown é convertido para HTML **sem permitir HTML bruto** (SECURITY.md: "evitar HTML arbitrário não sanitizado").
- `content/site.ts` continua existindo para textos fixos da home (hero, contato, rodapé).
- Dependências propostas:
  - `gray-matter`, para ler o frontmatter;
  - `marked` ou `remark` + `remark-html`, para converter o Markdown, com HTML bruto desativado;
  - `zod`, para validar o schema.

## Alternativas consideradas

- **Um arquivo TypeScript por item:** não exige dependências, mas obriga quem edita a escrever código e escapar texto longo.
- **CMS headless (Decap, Strapi, Sanity):** dá painel de edição, mas exige hospedagem, contas e manutenção. ARCHITECTURE.md pede decisão sobre CMS antes de adotá-lo.
- **JSON por item:** sem dependência de frontmatter, mas texto longo em JSON é ruim de editar e revisar.

## Consequências

- A equipe pode adicionar um projeto copiando um arquivo modelo (`content/_modelos/`) e preenchendo campos.
- Tudo continua estático: um item novo só aparece depois de um novo build.
- Um CMS pode ser adotado depois, apenas gerando esses mesmos arquivos ou trocando a camada de leitura em `lib/conteudo.ts`, sem mudar as páginas.
