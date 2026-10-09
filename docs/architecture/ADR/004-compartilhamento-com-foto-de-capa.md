# ADR-004 — Compartilhar notícias com a foto de capa, sem banco de dados e sem arte gerada

## Status

Aceito pela coordenação em 2026-10-09 (decisões D-1 a D-6 da SPEC-008). Não exige dependência nova.

## Contexto

A coordenação quer que quem aparece numa notícia (por exemplo, quem defendeu um TCC) consiga divulgá-la no próprio Instagram ou WhatsApp, pelo celular, e que isso não torne o site pesado conforme as notícias aumentam.

Uma primeira versão previa uma **arte gerada automaticamente** para cada notícia (Stories, Feed e imagem de pré-visualização). A coordenação decidiu **não ter arte própria**: o que se compartilha é a **foto de capa** que a notícia já tem. Isso elimina a geração de imagens, as fontes extras, o tempo de build adicional e o limite de notícias com arte.

Pontos de partida:

- **O site não tem banco de dados.** É estático (`output: 'export'`, ADR-001). As notícias são arquivos no repositório (hoje `content/noticias.ts`, no futuro Markdown, ADR-002). A hospedagem entrega arquivos prontos; nenhuma visita faz consulta a banco, e compartilhar não cria nenhum registro.
- A foto de capa **já é otimizada pelo pipeline do ADR-003** (WebP em várias larguras) e já é a imagem de pré-visualização (Open Graph) de cada notícia.

## Decisão

1. **Compartilhar = foto de capa + título + resumo + link da notícia.** Não há arte gerada, nem rota nova de imagem, nem `next/og`.
2. **Um bloco "Compartilhar" na página da notícia**, só em aparelhos com toque (`pointer: coarse`), com três ações: compartilhar pelo menu do celular, baixar a foto e copiar a legenda.
3. **Menu do celular (Web Share API) para chegar ao Instagram.** O Instagram não tem endereço de compartilhamento na web; o menu nativo é o único caminho, e a pessoa escolhe o Instagram nele. O WhatsApp também recebe a foto pelo mesmo menu, então não há botão separado para ele.
4. **A foto vira JPEG no próprio celular, só quando o bloco entra na tela.** O site baixa a maior versão WebP da capa que já existe, redimensiona para no máximo 1080 px de largura e converte para JPEG (via `canvas`), porque o WebP nem sempre é aceito pelo menu de compartilhamento nem pelo Instagram. Nenhum arquivo novo é criado, guardado ou publicado.
5. **Nada é carregado com a página.** A foto só é preparada quando o bloco "Compartilhar" aparece na tela, para que o menu do celular abra na hora do toque (o iPhone recusa o menu se ele demorar a abrir depois do toque). Quem não chega ao bloco não baixa nada.
6. **Nenhum serviço de terceiros**: sem SDK de rede social, sem rastreamento, sem armazenamento externo (coerente com o ADR-003).

## Alternativas consideradas

- **Arte gerada no build para cada notícia (Stories, Feed e Open Graph).** Resultado mais "pronto para postar", mas exige fontes, layout, limite de notícias e mais tempo de build. A coordenação optou por não ter arte própria. Pode ser retomada no futuro sem refazer esta decisão, porque o bloco "Compartilhar" só precisaria trocar a imagem usada.
- **Banco de dados ou armazenamento de objetos.** Guardaria algo que pode ser recalculado a qualquer momento e criaria custo, chaves, backup e um ponto de falha. Rejeitada.
- **Gerar a arte sob demanda no servidor (função serverless).** Exige sair do site estático e depende dos limites da plataforma. Rejeitada.
- **Versionar JPEGs de compartilhamento no Git.** O repositório cresceria a cada notícia. Rejeitada; a conversão no celular evita isso.
- **Compartilhar o WebP diretamente.** Não funciona de forma confiável em todos os aparelhos. Rejeitada.

## Consequências

- **Banco de dados:** nenhum. Não existe consulta nem tabela que cresça.
- **Repositório e deploy:** não crescem por causa do compartilhamento, porque nenhum arquivo novo é criado.
- **Tempo de build:** não muda.
- **Peso para quem visita:** zero no carregamento; a foto (cerca de 200 KB) só é baixada quando o bloco entra na tela.
- **Limitações assumidas:**
  - as capas são paisagem (por exemplo 4:3 ou 16:9) e o Stories é vertical, então o Instagram mostra faixas ou pede um recorte; isso é feito pela própria pessoa na hora de postar;
  - o Instagram ignora a legenda enviada pelo menu; por isso existe o botão "Copiar legenda";
  - o adesivo de link do Stories não pode ser pré-colocado;
  - se o aparelho não aceitar arquivos no menu, restam "Baixar a foto" e "Copiar legenda".
- **Reversibilidade:** alta. Remover o componente devolve o site ao estado anterior, sem migração de dados.
