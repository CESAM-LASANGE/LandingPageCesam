# Baseline de performance — home (antes da SPEC-002)

- **Data:** 2026-10-08
- **Ferramenta:** Lighthouse 12, Chromium headless, perfis padrão (mobile com 4G simulado; `--preset=desktop`).
- **Ambiente:** build estático servido localmente por nginx:alpine sem compressão gzip/brotli. Na hospedagem definitiva, com compressão, os números tendem a melhorar; **refazer a medição lá**.

| Perfil  | Performance | Acessib. | Boas práticas | SEO | LCP   | CLS | TBT   | Peso total |
| ------- | ----------- | -------- | ------------- | --- | ----- | --- | ----- | ---------- |
| Mobile  | 78          | 100      | 96            | 100 | 5,6 s | 0   | 20 ms | 797 KiB    |
| Desktop | 98          | 100      | 96            | 100 | 1,0 s | 0   | 0 ms  | 797 KiB    |

- **Elemento LCP no mobile:** o logo do header (`/images/cesam-logo.webp`).
- **Maiores recursos:** dois chunks JS (229 KB e 165 KB sem compressão), o HTML (124 KB) e as fontes (seis famílias).

## Budget a partir da SPEC-002 (carrossel e fotos)

- CLS ≤ 0,05 (hoje 0).
- LCP não pode piorar mais que 0,2 s em nenhum perfil. As fotos do carrossel ficam abaixo da dobra e não podem virar o elemento LCP.
- Peso total da home ≤ 1 MiB no carregamento inicial (sem rolar).
- Acessibilidade, SEO e boas práticas não podem cair.

## Problemas pré-existentes (fora da SPEC-002)

- LCP mobile de 5,6 s: investigar a prioridade do logo, o número de famílias de fonte e a compressão no servidor.

## Medição após a SPEC-002 (carrossel do Sobre) — 2026-10-08

Método a partir daqui: **mediana de 3 execuções** no mobile. Uma execução isolada variou de 4,6 s a 5,9 s de LCP.

| Perfil                | Performance | LCP   | CLS | Peso total | Fotos baixadas no carregamento |
| --------------------- | ----------- | ----- | --- | ---------- | ------------------------------ |
| Mobile (mediana de 3) | 81          | 5,0 s | 0   | 892 KiB    | 1 (`sala-do-cesam-960.webp`)   |
| Desktop               | 98          | 1,1 s | 0   | 892 KiB    | 1                              |

Resultado frente ao budget:

- **CLS:** 0, dentro do limite de ≤ 0,05.
- **LCP:** não piorou. O elemento LCP continua sendo o logo, e não as fotos.
- **Peso total:** 892 KiB, dentro do limite de ≤ 1 MiB. A primeira versão do carrossel baixava as 3 fotos e chegava a 1.053 KiB; isso foi corrigido montando só a foto visível e a próxima.
- **Acessibilidade, SEO e boas práticas:** sem queda.

## Medição em produção (Vercel, com compressão) — 2026-10-09

URL: `https://cesamuems.vercel.app/`. Lighthouse 12, Chromium headless; mobile = mediana de 3 execuções.

| Perfil                | Performance | Acessib. | Boas práticas | SEO | LCP   | CLS | TBT   | Peso total |
| --------------------- | ----------- | -------- | ------------- | --- | ----- | --- | ----- | ---------- |
| Mobile (mediana de 3) | 96          | 100      | 100           | 100 | 2,8 s | 0   | 72 ms | 417 KiB    |
| Desktop               | 100         | 100      | 100           | 100 | 0,6 s | 0   | 0 ms  | 485 KiB    |

- Dentro do budget: CLS 0 (≤ 0,05), peso inicial 417–485 KiB (≤ 1 MiB), LCP melhor que antes (5,0 s → 2,8 s no mobile) por causa da compressão e do cache da CDN.
- Os cabeçalhos de segurança (CSP, HSTS, X-Frame-Options etc.) vêm de `vercel.json`; sem erros de CSP no console nas páginas da home, da lista e de uma notícia; o mapa carrega depois do clique.
