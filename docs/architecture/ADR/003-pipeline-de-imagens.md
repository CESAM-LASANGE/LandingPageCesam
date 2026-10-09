# ADR-003 — Otimização automática de imagens no build

## Status

Proposto (2026-10-08). Depende de aprovação humana da dependência `sharp`.

## Contexto

O site vai receber muitas fotos (galeria do Sobre, equipe, projetos, notícias), geralmente de celular ou câmera, com vários MB cada. Com `output: 'export'`, o Next.js não otimiza imagens em tempo de execução (`images.unoptimized`, ADR-001). Sem tratamento, as fotos dominariam o tempo de carregamento (Gate 6) e causariam layout shift (RESPONSIVE.md).

## Decisão

- As fotos originais ficam em `content/midia/` e não são publicadas.
- Um script de pré-build (`scripts/imagens.mjs`, com `sharp`) gera versões WebP em larguras fixas (por exemplo 480, 960 e 1600 px) em `public/midia/`, e um manifesto com largura, altura e um placeholder de cor média.
- Um componente `Foto` usa o manifesto para renderizar `srcset`/`sizes`, `width`/`height` (evita layout shift) e `loading="lazy"`, exceto na primeira imagem visível.
- Toda foto exige texto alternativo. Fotos sem `alt` falham o build; fotos decorativas declaram `alt: ""` explicitamente.
- Os metadados EXIF, incluindo GPS, são removidos das versões publicadas.

## Alternativas consideradas

- **Publicar originais:** sem esforço inicial, mas inviável em performance.
- **Otimizar manualmente antes de enviar:** depende de disciplina humana e não é verificável.
- **Serviço externo de imagens (Cloudinary etc.):** adiciona conta, custo e terceiro processando fotos de pessoas.

## Consequências

- O build fica mais lento quando há muitas fotos novas, o que pode ser mitigado com cache por hash do arquivo.
- As fotos de pessoas não saem do repositório para serviços de terceiros.
