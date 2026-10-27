'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import './Emblema.css';

/** Variáveis de cada peça: profundidade com o mouse (--d) e janela/destino da animação de rolagem. */
const peca = (vars: Record<string, string | number>, origem?: string) =>
  ({ ...vars, ...(origem ? { transformOrigin: origem } : {}) }) as CSSProperties;

/**
 * Emblema animado do CESAM no início da página: entrada única, respiração contínua e profundidade com o mouse.
 * Respeita "reduzir movimento" (CSS), desmonta com a rolagem e pausa quando sai da tela.
 */
export function Emblema() {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    const svg = el?.querySelector('svg');
    if (!el || !svg) return;
    const parado = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mouse = window.matchMedia('(pointer: fine)');
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let quadro = 0;
    const animar = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      svg.style.setProperty('--mx', cx.toFixed(3));
      svg.style.setProperty('--my', cy.toFixed(3));
      quadro = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(animar) : 0;
    };
    const aoMover = (e: PointerEvent) => {
      if (parado.matches || !mouse.matches) return;
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height));
      if (!quadro) quadro = requestAnimationFrame(animar);
    };
    const aoSair = () => {
      tx = 0;
      ty = 0;
      if (!quadro) quadro = requestAnimationFrame(animar);
    };
    // rolagem: desmonta o emblema ao descer e monta ao subir
    let p = 0;
    let alvo = 0;
    let quadroRolagem = 0;
    const calcularAlvo = () => {
      if (parado.matches) return 0;
      const topo = el.getBoundingClientRect().top + window.scrollY;
      return Math.max(0, Math.min(1, window.scrollY / Math.max(240, topo + el.offsetHeight * 0.55)));
    };
    const animarRolagem = () => {
      p += (alvo - p) * 0.14;
      if (Math.abs(alvo - p) < 0.001) p = alvo;
      svg.style.setProperty('--p', p.toFixed(4));
      quadroRolagem = p !== alvo ? requestAnimationFrame(animarRolagem) : 0;
    };
    const aoRolar = () => {
      alvo = calcularAlvo();
      if (!quadroRolagem) quadroRolagem = requestAnimationFrame(animarRolagem);
    };
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    aoRolar();
    window.addEventListener('pointermove', aoMover, { passive: true });
    document.addEventListener('pointerleave', aoSair);
    const observador = new IntersectionObserver((entradas) =>
      entradas.forEach((x) => el.classList.toggle('is-offscreen', !x.isIntersecting)),
    );
    observador.observe(el);
    return () => {
      window.removeEventListener('pointermove', aoMover);
      document.removeEventListener('pointerleave', aoSair);
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
      observador.disconnect();
      cancelAnimationFrame(quadro);
      cancelAnimationFrame(quadroRolagem);
    };
  }, []);

  return (
    <div ref={raiz} className="ce-emblem is-intro">
      <svg viewBox="-20 -25 610 610" focusable="false" role="img" aria-labelledby="ce-title">
        <title id="ce-title">Símbolo do CESAM: engrenagem, folha, gota d&apos;água e estrela</title>
        <defs>
          <clipPath id="ce-clip-a">
            <rect className="ce-wipe" x="30" y="80" width="300" height="110" />
          </clipPath>
          <clipPath id="ce-clip-b">
            <rect className="ce-wipe" x="0" y="120" width="480" height="140" />
          </clipPath>
          <clipPath id="ce-clip-c">
            <rect className="ce-wipe" x="35" y="200" width="450" height="120" />
          </clipPath>
          <radialGradient id="ce-disc-fill" cx="50%" cy="45%" r="55%">
            <stop offset="0" stopColor="var(--ce-sky)" />
            <stop offset="1" stopColor="var(--ce-sky)" stopOpacity=".55" />
          </radialGradient>
        </defs>

        <g className="ce-px" style={peca({ '--d': 3, '--ts': '.3', '--fo': '.75' }, '285px 300px')}>
          <circle className="ce-disc" cx="285" cy="300" r="250" fill="url(#ce-disc-fill)" />
          <g className="ce-ripple" fill="none" stroke="var(--ce-blue)" strokeWidth="1.5">
            <circle cx="285" cy="300" r="250" />
            <circle cx="285" cy="300" r="250" />
          </g>
          <g className="ce-splash" fill="none" stroke="var(--ce-blue)" strokeWidth="2">
            <circle cx="285" cy="300" r="230" />
            <circle cx="285" cy="300" r="230" />
          </g>
        </g>

        <g className="ce-float">
          <g
            className="ce-px"
            style={peca({ '--d': 8, '--a': '.3', '--b': 1, '--tx': 150, '--ty': 170, '--tr': 70 }, '300px 300px')}
          >
            <g className="ce-gear-in">
              <g className="ce-gear-idle">
                <path
                  className="ce-gear-fill"
                  d="M440,177 L492,172 L510,240 L430,267 L424,312 L487,362 L450,420 L372,386 L333,410 L343,499 L272,505 L245,431 L195,422 L140,485 L80,443 L118,368 Q92,320 72,300 Q50,280 16,286"
                  fill="var(--ce-paper)"
                />
                <path
                  className="ce-gear-line"
                  pathLength="1"
                  d="M440,177 L492,172 L510,240 L430,267 L424,312 L487,362 L450,420 L372,386 L333,410 L343,499 L272,505 L245,431 L195,422 L140,485 L80,443 L118,368 Q92,320 72,300 Q50,280 16,286"
                  fill="none"
                  stroke="var(--ce-ink)"
                  strokeWidth="8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <g fill="var(--ce-ink)">
                  <rect
                    className="ce-hole"
                    x="434"
                    y="190"
                    width="48"
                    height="48"
                    rx="7"
                    transform="rotate(-12 458 214)"
                  />
                  <rect
                    className="ce-hole"
                    x="406"
                    y="347"
                    width="50"
                    height="42"
                    rx="7"
                    transform="rotate(36 431 368)"
                  />
                  <rect
                    className="ce-hole"
                    x="279"
                    y="441"
                    width="37"
                    height="34"
                    rx="6"
                    transform="rotate(-8 297 458)"
                  />
                  <circle className="ce-hole" cx="135" cy="431" r="12" />
                </g>
              </g>
            </g>
          </g>

          <g
            className="ce-px"
            style={peca(
              { '--d': 12, '--a': '.22', '--b': '.9', '--tx': -110, '--ty': 220, '--tr': -35 },
              '170px 300px',
            )}
          >
            <g className="ce-leaf-in">
              <path
                d="M214,57 C 175,70 140,100 115,135 C 88,175 74,215 76,260 C 78,320 120,370 175,388 C 230,405 300,405 358,374 L 300,370 L 153,332 L 205,290 L 212,200 C 206,160 204,110 214,57 Z"
                fill="var(--ce-green)"
              />
              <path
                className="ce-vein"
                d="M158,100 C 120,140 95,190 93,250 C 92,290 100,320 118,346 C 106,318 101,288 103,250 C 105,195 125,145 158,100 Z"
                fill="var(--ce-paper)"
              />
            </g>
          </g>

          <g
            className="ce-px"
            style={peca({ '--d': 16, '--a': '.15', '--b': '.8', '--tx': 60, '--ty': -230, '--tr': 14 }, '285px 220px')}
          >
            <g className="ce-drop-in">
              <g className="ce-drop-squash">
                <path
                  d="M266,40 C 285,90 335,140 370,188 C 395,222 406,258 405,295 C 403,350 360,385 292,385 C 240,385 190,365 153,332 L 205,292 L 214,140 Z"
                  fill="var(--ce-blue)"
                  stroke="var(--ce-paper)"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                <g className="ce-shine">
                  <path
                    className="ce-shine-idle"
                    d="M386,252 C 400,280 398,315 372,342 C 390,312 392,282 386,252 Z"
                    fill="var(--ce-paper)"
                  />
                </g>
              </g>
            </g>
          </g>

          <g
            className="ce-px"
            style={peca({ '--d': 24, '--a': '.1', '--b': '.7', '--tx': 200, '--ty': -260, '--tr': 260 }, '341px 340px')}
          >
            <g className="ce-star-in">
              <g className="ce-star-idle">
                <polygon
                  points="342.6,317.1 347.1,332.7 363.3,334.4 349.8,343.6 353.2,359.5 340.3,349.5 326.2,357.6 331.8,342.3 319.7,331.4 336.0,331.9"
                  fill="var(--ce-yellow)"
                  stroke="#C9A800"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </g>
            </g>
            <g
              className="ce-sparks"
              fill="none"
              stroke="var(--ce-yellow)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0"
            >
              <line x1="341.0" y1="310.0" x2="341.0" y2="298.0" />
              <line x1="369.5" y1="330.7" x2="380.9" y2="327.0" />
              <line x1="358.6" y1="364.3" x2="365.7" y2="374.0" />
              <line x1="323.4" y1="364.3" x2="316.3" y2="374.0" />
              <line x1="312.5" y1="330.7" x2="301.1" y2="327.0" />
            </g>
          </g>

          <g
            className="ce-px"
            style={peca({ '--d': 20, '--fo': 0 })}
            fill="var(--ce-paper)"
            stroke="var(--ce-ink)"
            strokeWidth="4.5"
            strokeLinejoin="round"
          >
            <g
              className="ce-r1 ce-sc"
              style={peca({ '--b': '.55', '--tx': 140, '--ty': -280, '--tr': 14 }, '180px 140px')}
              clipPath="url(#ce-clip-a)"
            >
              <g className="ce-rib-in">
                <g className="ce-rib-idle">
                  <path d="M54,103 C 66,135 92,153 140,156 C 200,155 250,143 302,132 C 250,146 200,164 140,169 C 92,170 64,140 54,103 Z" />
                </g>
              </g>
            </g>
            <g
              className="ce-r2 ce-sc"
              style={peca({ '--a': '.04', '--b': '.6', '--tx': 340, '--ty': -40, '--tr': 7 }, '240px 190px')}
              clipPath="url(#ce-clip-b)"
            >
              <g className="ce-rib-in">
                <g className="ce-rib-idle">
                  <path d="M22,145 C 40,185 80,203 130,205 C 200,203 290,165 360,156 C 400,152 430,165 452,188 C 425,178 395,176 360,181 C 290,192 200,236 130,239 C 75,240 30,205 22,145 Z" />
                  <g fill="none" stroke="var(--ce-streak)" strokeWidth="3.5" strokeLinecap="round">
                    <path className="ce-streak" pathLength="1" d="M34,174 C 50,195 75,205 118,208" />
                    <path className="ce-streak" pathLength="1" d="M104,231 C 150,232 195,224 236,212" />
                    <path className="ce-streak" pathLength="1" d="M356,162 C 375,160 392,161 405,165" />
                    <path className="ce-streak" pathLength="1" d="M366,176 C 390,174 408,175 422,178" />
                  </g>
                </g>
              </g>
            </g>
            <g
              className="ce-r3 ce-sc"
              style={peca({ '--a': '.08', '--b': '.65', '--tx': 300, '--ty': 170, '--tr': 12 }, '260px 260px')}
              clipPath="url(#ce-clip-c)"
            >
              <g className="ce-rib-in">
                <g className="ce-rib-idle">
                  <path d="M57,250 C 75,272 100,280 140,280 C 210,278 290,232 370,221 C 410,216 440,224 463,237 C 435,231 405,229 370,236 C 290,250 210,298 140,297 C 95,296 65,278 57,250 Z" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
