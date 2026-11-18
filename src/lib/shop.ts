/**
 * Build-time SVG for the florist's workshop: buckets of flowers on the back
 * shelf (far layer), the satin ribbon and loose petals (foreground).
 */
const C = (name: string) => `var(--color-${name})`;
const r1 = (n: number) => Math.round(n * 10) / 10;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Back shelf with enamel buckets of flowers. viewBox 0 0 1600 420. */
export function shelvesMarkup(): string {
  const rand = rng(7);
  const mixes = [
    [C('blush'), C('petal'), C('ivory')],
    [C('ivory'), C('cream'), C('leaf-light')],
    [C('coral'), C('peach'), C('butter')],
    [C('rose'), C('petal'), C('blush')],
    [C('butter'), C('sun'), C('ivory')],
    [C('lilac'), C('ivory'), C('blush')],
  ];
  let s = '';
  // shelf plank
  s += `<rect x="-20" y="300" width="1640" height="16" fill="${C('wood')}"/>`;
  s += `<rect x="-20" y="316" width="1640" height="110" fill="${C('wood-deep')}"/>`;
  s += `<rect x="-20" y="300" width="1640" height="3" fill="${C('wood-light')}" opacity="0.6"/>`;
  const xs = [70, 240, 400, 575, 745, 915, 1085, 1255, 1420, 1570];
  xs.forEach((x, i) => {
    const w = 92 + rand() * 24;
    const h = 96 + rand() * 26;
    const top = 300 - h;
    const mix = mixes[i % mixes.length];
    // greenery + tall stems behind the blooms
    let g = '';
    for (let k = 0; k < 7; k++) {
      const sx = x + (rand() - 0.5) * w * 0.9;
      const sy = top - 50 - rand() * 90;
      g += `<path d="M${r1(x + (rand() - 0.5) * 20)} ${r1(top + 10)}Q${r1(sx)} ${r1(top - 20)} ${r1(sx)} ${r1(sy)}" stroke="${C('stem')}" stroke-width="3" fill="none"/>`;
      g += `<ellipse cx="${r1(sx)}" cy="${r1(sy)}" rx="${r1(14 + rand() * 10)}" ry="${r1(22 + rand() * 14)}" fill="${rand() > 0.5 ? C('leaf') : C('euca')}"/>`;
    }
    if (i % 3 === 1) {
      // a tall spike of delphinium-like florets
      const sx = x + (rand() - 0.5) * 30;
      for (let k = 0; k < 9; k++) {
        g += `<circle cx="${r1(sx + (rand() - 0.5) * 12)}" cy="${r1(top - 40 - k * 16)}" r="${r1(11 - k * 0.7)}" fill="${C('lilac')}"/>`;
      }
    }
    // bloom mass
    for (let k = 0; k < 15; k++) {
      const bx = x + (rand() - 0.5) * w * 1.15;
      const by = top - 8 - rand() * 64;
      const rr = 13 + rand() * 15;
      const col = mix[Math.floor(rand() * mix.length)];
      g += `<circle cx="${r1(bx)}" cy="${r1(by)}" r="${r1(rr)}" fill="${col}"/><circle cx="${r1(bx - rr * 0.25)}" cy="${r1(by - rr * 0.3)}" r="${r1(rr * 0.45)}" fill="${C('ivory')}" opacity="0.35"/>`;
    }
    // bucket (enamel, slightly tapered)
    const b = `<path d="M${r1(x - w / 2)} ${r1(top)}L${r1(x + w / 2)} ${r1(top)}L${r1(x + w * 0.4)} 300L${r1(x - w * 0.4)} 300Z" fill="${C('paper')}"/>` +
      `<path d="M${r1(x + w * 0.18)} ${r1(top)}L${r1(x + w / 2)} ${r1(top)}L${r1(x + w * 0.4)} 300L${r1(x + w * 0.12)} 300Z" fill="${C('kraft')}" opacity="0.55"/>` +
      `<rect x="${r1(x - w / 2 - 4)}" y="${r1(top - 6)}" width="${r1(w + 8)}" height="9" rx="4" fill="${C('cream')}"/>`;
    s += `<g>${g}${b}</g>`;
  });
  return s;
}

/**
 * A long satin ribbon with real twists: faces alternate between the
 * front (light) and back (deeper) side every half turn. viewBox 0 0 300 1000.
 */
export function ribbonMarkup(): string {
  const N = 220;
  const pts: { x: number; y: number; nx: number; ny: number; w: number }[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const y = 20 + t * 960;
    const x = 150 + Math.sin(t * Math.PI * 2.1 + 0.4) * 80 + Math.sin(t * 9) * 8;
    pts.push({ x, y, nx: 0, ny: 0, w: 0 });
  }
  for (let i = 0; i <= N; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(N, i + 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    pts[i].nx = -dy / len;
    pts[i].ny = dx / len;
    // width follows a twist: cos goes through zero at each half turn
    pts[i].w = 22 * Math.cos((i / N) * Math.PI * 3.2 + 0.3);
  }
  let s = '';
  let seg: typeof pts = [];
  let sign = Math.sign(pts[0].w) || 1;
  const flush = () => {
    if (seg.length < 2) return;
    const left = seg.map((p) => `${r1(p.x + p.nx * p.w)} ${r1(p.y + p.ny * p.w)}`);
    const right = seg.map((p) => `${r1(p.x - p.nx * p.w)} ${r1(p.y - p.ny * p.w)}`).reverse();
    const face = sign > 0 ? C('rose') : C('rose-deep');
    s += `<path d="M${left.join('L')}L${right.join('L')}Z" fill="${face}"/>`;
    // satin sheen along the face
    const sheen = seg.map((p) => `${r1(p.x + p.nx * p.w * 0.35)} ${r1(p.y + p.ny * p.w * 0.35)}`);
    s += `<path d="M${sheen.join('L')}" fill="none" stroke="${sign > 0 ? C('petal') : C('rose')}" stroke-width="${sign > 0 ? 5 : 3}" stroke-linecap="round" opacity="0.6"/>`;
  };
  for (const p of pts) {
    const sg = Math.sign(p.w) || sign;
    if (sg !== sign) {
      seg.push(p);
      flush();
      seg = [p];
      sign = sg;
    } else seg.push(p);
  }
  flush();
  return s;
}

/** One loose rose petal, base at bottom. viewBox 0 0 60 80. */
export function petalSvg(id: string, light = 'blush', deep = 'petal') {
  return `<svg viewBox="0 0 60 80" aria-hidden="true" focusable="false"><defs><radialGradient id="${id}" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${C(light)}"/><stop offset="1" stop-color="${C(deep)}"/></radialGradient></defs><path d="M30 78C12 70 2 52 4 32C6 14 18 3 30 2C44 3 56 16 56 34C56 54 46 70 30 78Z" fill="url(#${id})"/><path d="M30 76C27 56 28 34 33 12" stroke="${C(deep)}" stroke-width="1.2" fill="none" opacity="0.45"/><path d="M16 22C22 14 30 10 38 12" stroke="${C('ivory')}" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.4"/></svg>`;
}
