#!/usr/bin/env bash
# Gera versões WebP otimizadas das fotos de content/midia/ em public/midia/ e um manifesto
# com dimensões e cor média (evita layout shift). Remove EXIF, incluindo GPS.
# Solução provisória com ImageMagick até a aprovação do ADR-003 (sharp no build).
set -euo pipefail
cd "$(dirname "$0")/.."

ORIGEM=content/midia
DESTINO=public/midia
MANIFESTO=content/midia/manifesto.json
LARGURAS=(480 960 1600)

command -v magick >/dev/null || { echo "ImageMagick (magick) não encontrado." >&2; exit 1; }

entradas=()
while IFS= read -r -d '' arquivo; do
  relativo=${arquivo#"$ORIGEM/"}
  chave=${relativo%.*}
  mkdir -p "$DESTINO/$(dirname "$relativo")"
  read -r largura altura < <(magick identify -auto-orient -format '%w %h\n' "$arquivo[0]")
  geradas=()
  for alvo in "${LARGURAS[@]}"; do
    # Não amplia: se a foto for menor que o alvo, usa a largura original uma única vez.
    w=$(( largura < alvo ? largura : alvo ))
    saida="$DESTINO/$chave-$w.webp"
    if [[ ! -f "$saida" || "$arquivo" -nt "$saida" ]]; then
      magick "$arquivo[0]" -auto-orient -strip -resize "${w}x>" -quality 78 "$saida"
    fi
    [[ " ${geradas[*]-} " == *" $w "* ]] || geradas+=("$w")
    (( largura <= alvo )) && break
  done
  cor=$(magick "$arquivo[0]" -resize 1x1\! -format '#%[hex:p{0,0}]' info: | cut -c1-7)
  lista=$(IFS=,; echo "${geradas[*]}")
  entradas+=("  \"$chave\": { \"largura\": $largura, \"altura\": $altura, \"larguras\": [$lista], \"cor\": \"$cor\" }")
done < <(find "$ORIGEM" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0 | sort -z)

{
  echo "{"
  (IFS=$'\n'; echo "${entradas[*]-}" | sed '$!s/$/,/')
  echo "}"
} > "$MANIFESTO"
echo "Fotos otimizadas: ${#entradas[@]} · manifesto em $MANIFESTO"
