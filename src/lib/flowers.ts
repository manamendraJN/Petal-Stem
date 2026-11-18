/**
 * Build-time SVG generator for the hero bouquets.
 * Produces static markup: every stem, leaf and bloom is its own group so the
 * client can grow them stem by stem (transform + opacity only).
 *
 * Coordinate space: viewBox 0 0 600 900. The vase stands at (300, 880).
 * All colours come from the design tokens via CSS variables.
 */

const C = (name: string) => `var(--color-${name})`;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Small seeded PRNG so the art is identical on every build. */
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

interface Pal {
  base: string;
  deep: string;
  light: string;
  center?: string;
}

const P = {
  peach: { base: C('peach'), deep: C('peach-deep'), light: C('ivory') },
  cream: { base: C('cream'), deep: C('kraft'), light: C('ivory'), center: C('leaf') },
  ivory: { base: C('ivory'), deep: C('lilac'), light: C('ivory') },
  blush: { base: C('blush'), deep: C('petal'), light: C('blush-50') },
  coral: { base: C('coral'), deep: C('rose'), light: C('peach') },
  butter: { base: C('butter'), deep: C('sun'), light: C('ivory'), center: C('leaf') },
  sun: { base: C('sun'), deep: C('peach-deep'), light: C('butter'), center: C('stem-deep') },
  rose: { base: C('petal'), deep: C('rose'), light: C('blush') },
} satisfies Record<string, Pal>;

/* ───────── petal shapes ───────── */

/** A rounded petal pointing up (−y) with its base at the origin. */
function petal(len: number, w: number) {
  return `M0 0C${r1(w * 0.75)} ${r1(-len * 0.1)} ${r1(w * 1.1)} ${r1(-len * 0.6)} ${r1(w * 0.62)} ${r1(-len * 0.92)}Q0 ${r1(-len * 1.08)} ${r1(-w * 0.62)} ${r1(-len * 0.92)}C${r1(-w * 1.1)} ${r1(-len * 0.6)} ${r1(-w * 0.75)} ${r1(-len * 0.1)} 0 0Z`;
}

function leafPath(len: number, w: number) {
  return `M0 0C${r1(w)} ${r1(-len * 0.22)} ${r1(w * 0.85)} ${r1(-len * 0.72)} 0 ${r1(-len)}C${r1(-w * 0.85)} ${r1(-len * 0.72)} ${r1(-w)} ${r1(-len * 0.22)} 0 0Z`;
}

const overlay = (r: number) =>
  `<circle r="${r1(r)}" fill="url(#ps-shade)"/><circle r="${r1(r)}" fill="url(#ps-sheen)"/>`;

/* ───────── flower heads (centred on the origin) ───────── */

function rose(r: number, p: Pal, rand: () => number) {
  let s = `<g transform="scale(1 0.86)">`;
  const ring = (n: number, len: number, w: number, off: number, fill: string, so: number) => {
    for (let i = 0; i < n; i++) {
      const a = off + (360 / n) * i + (rand() - 0.5) * 14;
      s += `<path d="${petal(len * (0.92 + rand() * 0.14), w)}" transform="rotate(${r1(a)})" fill="${fill}" stroke="${p.deep}" stroke-opacity="${so}" stroke-width="1"/>`;
    }
  };
  ring(6, r, r * 0.56, rand() * 60, p.base, 0.28);
  s += `<circle r="${r1(r * 0.9)}" fill="url(#ps-shade)"/>`;
  ring(5, r * 0.72, r * 0.5, 30 + rand() * 30, p.base, 0.35);
  ring(4, r * 0.5, r * 0.46, rand() * 90, p.base, 0.45);
  s += `<ellipse rx="${r1(r * 0.34)}" ry="${r1(r * 0.27)}" fill="${p.deep}" opacity="0.5"/>`;
  // the bud-like heart: three tight, overlapping inner petals
  for (let i = 0; i < 3; i++) {
    const a = rand() * 360;
    s += `<path d="${petal(r * 0.3, r * 0.26)}" transform="rotate(${r1(a)}) translate(0 ${r1(r * 0.06)})" fill="${p.deep}" fill-opacity="0.55" stroke="${p.base}" stroke-opacity="0.8" stroke-width="1.2"/>`;
  }
  s += `<ellipse cx="${r1(-r * 0.05)}" cy="${r1(-r * 0.04)}" rx="${r1(r * 0.08)}" ry="${r1(r * 0.06)}" fill="${p.deep}" opacity="0.7"/>`;
  s += `<circle r="${r1(r)}" fill="url(#ps-sheen)"/></g>`;
  return s;
}

function ranunculus(r: number, p: Pal, rand: () => number) {
  let s = `<g transform="scale(1 0.9)">`;
  for (let i = 0; i < 11; i++) {
    const a = (360 / 11) * i + rand() * 8;
    s += `<path d="${petal(r, r * 0.42)}" transform="rotate(${r1(a)})" fill="${p.base}" stroke="${p.deep}" stroke-opacity="0.3" stroke-width="1"/>`;
  }
  s += `<circle r="${r1(r * 0.92)}" fill="url(#ps-shade)"/>`;
  for (let k = 1; k < 6; k++) {
    const rr = r * (0.82 - k * 0.13);
    const fill = k % 2 ? p.light : p.base;
    s += `<ellipse cx="${r1((rand() - 0.5) * r * 0.04)}" cy="${r1(k * r * 0.03)}" rx="${r1(rr)}" ry="${r1(rr * 0.9)}" fill="${fill}" stroke="${p.deep}" stroke-opacity="0.22" stroke-width="1"/>`;
  }
  s += `<circle cy="${r1(r * 0.14)}" r="${r1(r * 0.07)}" fill="${p.center ?? p.deep}" opacity="0.6"/>`;
  s += `<circle r="${r1(r)}" fill="url(#ps-sheen)"/></g>`;
  return s;
}

function peony(r: number, p: Pal, rand: () => number) {
  let s = `<g transform="scale(1 0.84)">`;
  const ring = (n: number, len: number, w: number, fill: string) => {
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i + rand() * 25;
      s += `<path d="${petal(len * (0.85 + rand() * 0.25), w * (0.9 + rand() * 0.2))}" transform="rotate(${r1(a)})" fill="${fill}" stroke="${p.deep}" stroke-opacity="0.3" stroke-width="1"/>`;
    }
  };
  ring(9, r, r * 0.6, p.base);
  s += `<circle r="${r1(r * 0.95)}" fill="url(#ps-shade)"/>`;
  ring(8, r * 0.78, r * 0.55, p.base);
  ring(7, r * 0.56, r * 0.5, p.light);
  ring(6, r * 0.34, r * 0.36, p.base);
  s += `<circle r="${r1(r * 0.12)}" fill="${p.deep}" opacity="0.4"/>`;
  s += `<circle r="${r1(r)}" fill="url(#ps-sheen)"/></g>`;
  return s;
}

function daisy(r: number, p: Pal, rand: () => number, n = 18) {
  let s = `<g transform="scale(1 0.9)">`;
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i + rand() * 6;
    s += `<ellipse cy="${r1(-r * 0.55)}" rx="${r1(r * 0.13)}" ry="${r1(r * 0.48)}" transform="rotate(${r1(a)})" fill="${p.base}" stroke="${p.deep}" stroke-opacity="0.35" stroke-width="0.8"/>`;
  }
  s += `<circle r="${r1(r * 0.3)}" fill="${p.center ?? C('sun')}"/>`;
  s += `<circle r="${r1(r * 0.3)}" fill="url(#ps-shade)"/>`;
  for (let i = 0; i < 8; i++) {
    const a = rand() * Math.PI * 2;
    const d = rand() * r * 0.2;
    s += `<circle cx="${r1(Math.cos(a) * d)}" cy="${r1(Math.sin(a) * d)}" r="${r1(r * 0.035 + 0.6)}" fill="${C('gold')}" opacity="0.8"/>`;
  }
  s += `</g>`;
  return s;
}

function gerbera(r: number, p: Pal, rand: () => number) {
  let s = `<g transform="scale(1 0.88)">`;
  for (let i = 0; i < 22; i++) {
    const a = (360 / 22) * i + rand() * 4;
    s += `<ellipse cy="${r1(-r * 0.56)}" rx="${r1(r * 0.12)}" ry="${r1(r * 0.46)}" transform="rotate(${r1(a)})" fill="${p.base}" stroke="${p.deep}" stroke-opacity="0.4" stroke-width="0.9"/>`;
  }
  for (let i = 0; i < 16; i++) {
    const a = (360 / 16) * i + 11;
    s += `<ellipse cy="${r1(-r * 0.36)}" rx="${r1(r * 0.08)}" ry="${r1(r * 0.24)}" transform="rotate(${r1(a)})" fill="${p.light}" opacity="0.9"/>`;
  }
  s += `<circle r="${r1(r * 0.22)}" fill="${p.center ?? C('stem-deep')}"/><circle r="${r1(r * 0.22)}" fill="none" stroke="${C('gold')}" stroke-width="${r1(r * 0.05)}" stroke-dasharray="1.5 2.5"/>`;
  s += overlay(r) + `</g>`;
  return s;
}

function tulip(r: number, p: Pal) {
  const k = (n: number) => r1(n * r);
  return (
    `<path d="M${k(-0.5)} ${k(0.35)}C${k(-0.62)} ${k(-0.2)} ${k(-0.3)} ${k(-0.78)} 0 ${k(-0.84)}C${k(0.3)} ${k(-0.78)} ${k(0.62)} ${k(-0.2)} ${k(0.5)} ${k(0.35)}C${k(0.3)} ${k(0.62)} ${k(-0.3)} ${k(0.62)} ${k(-0.5)} ${k(0.35)}Z" fill="${p.deep}"/>` +
    `<path d="M${k(-0.5)} ${k(0.34)}C${k(-0.62)} ${k(-0.28)} ${k(-0.24)} ${k(-0.74)} ${k(0.08)} ${k(-0.66)}C${k(0.06)} ${k(-0.12)} ${k(0.14)} ${k(0.38)} ${k(0.05)} ${k(0.57)}C${k(-0.22)} ${k(0.6)} ${k(-0.42)} ${k(0.5)} ${k(-0.5)} ${k(0.34)}Z" fill="${p.base}" stroke="${p.deep}" stroke-opacity="0.35"/>` +
    `<path d="M${k(0.5)} ${k(0.34)}C${k(0.6)} ${k(-0.26)} ${k(0.3)} ${k(-0.7)} ${k(0.02)} ${k(-0.6)}C${k(-0.08)} ${k(-0.1)} ${k(-0.1)} ${k(0.36)} ${k(-0.02)} ${k(0.58)}C${k(0.24)} ${k(0.6)} ${k(0.42)} ${k(0.5)} ${k(0.5)} ${k(0.34)}Z" fill="${p.base}" stroke="${p.deep}" stroke-opacity="0.3"/>` +
    `<ellipse cx="${k(-0.12)}" cy="${k(-0.1)}" rx="${k(0.14)}" ry="${k(0.42)}" fill="${p.light}" opacity="0.55" transform="rotate(8 ${k(-0.12)} ${k(-0.1)})"/>`
  );
}

function sprayBuds(r: number, p: Pal, rand: () => number) {
  let s = '';
  for (let i = 0; i < 6; i++) {
    const a = rand() * Math.PI * 2;
    const d = r * (0.25 + rand() * 0.7);
    const rr = r * (0.18 + rand() * 0.14);
    s += `<circle cx="${r1(Math.cos(a) * d)}" cy="${r1(Math.sin(a) * d)}" r="${r1(rr)}" fill="${p.base}" stroke="${p.deep}" stroke-opacity="0.4"/><circle cx="${r1(Math.cos(a) * d - rr * 0.3)}" cy="${r1(Math.sin(a) * d - rr * 0.3)}" r="${r1(rr * 0.4)}" fill="${p.light}" opacity="0.7"/>`;
  }
  return s;
}

type HeadKind = 'rose' | 'ranunculus' | 'peony' | 'daisy' | 'gerbera' | 'tulip' | 'lisianthus' | 'buds';

function head(kind: HeadKind, r: number, p: Pal, rand: () => number) {
  switch (kind) {
    case 'rose': return rose(r, p, rand);
    case 'lisianthus': return rose(r, p, rand) + `<g transform="scale(1 0.86)" opacity="0.6">${daisy(r * 0.25, P.ivory, rand, 0)}</g>`;
    case 'ranunculus': return ranunculus(r, p, rand);
    case 'peony': return peony(r, p, rand);
    case 'daisy': return daisy(r, p, rand);
    case 'gerbera': return gerbera(r, p, rand);
    case 'tulip': return tulip(r, p);
    case 'buds': return sprayBuds(r, p, rand);
  }
}

/* ───────── stems ───────── */

const BASE_Y = 862;
const TIE_Y = 652;

function quadPoint(p0: number[], c: number[], p1: number[], t: number) {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
}
function quadAngle(p0: number[], c: number[], p1: number[], t: number) {
  const dx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]);
  const dy = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

interface StemSpec {
  kind: HeadKind | 'eucalyptus' | 'solidago' | 'chamomile' | 'leafy';
  x: number;
  y: number;
  r: number;
  pal?: Pal;
  leaves?: number;
}

function stemGeometry(x: number, y: number, seed: number) {
  const rand = rng(seed);
  // Spiral technique: stems cross at the tie point, so left heads come from right bases.
  const bx = 300 + (300 - x) * 0.14 + (rand() - 0.5) * 10;
  const tx = 300 + (x - 300) * 0.06;
  const p0 = [tx, TIE_Y];
  const p1 = [x, y];
  const c = [tx + (x - tx) * 0.25, TIE_Y + (y - TIE_Y) * 0.55];
  return { bx, tx, p0, c, p1, rand };
}

function buildStem(spec: StemSpec, seed: number, growOrder: number) {
  const { bx, tx, p0, c, p1, rand } = stemGeometry(spec.x, spec.y, seed);
  const d = `M${r1(bx)} ${BASE_Y}L${r1(tx)} ${TIE_Y}Q${r1(c[0])} ${r1(c[1])} ${r1(p1[0])} ${r1(p1[1])}`;
  const thin = spec.kind === 'solidago' || spec.kind === 'chamomile' || spec.kind === 'eucalyptus' || spec.kind === 'leafy';
  const sw = thin ? 3 : spec.kind === 'tulip' ? 5 : 4.4;
  let s = `<g class="st" data-ox="${r1(bx)}" data-oy="${BASE_Y}" data-o="${growOrder}">`;
  s += `<path d="${d}" fill="none" stroke="${C('stem')}" stroke-width="${sw}" stroke-linecap="round"/>`;
  s += `<path d="${d}" fill="none" stroke="${C('leaf-light')}" stroke-width="1.1" stroke-linecap="round" opacity="0.55" transform="translate(-1 0)"/>`;

  // Leaves along the upper stem
  const nLeaves = spec.leaves ?? (thin ? 0 : rand() > 0.6 ? 1 : 0);
  for (let i = 0; i < nLeaves; i++) {
    const t = 0.32 + i * 0.22 + rand() * 0.06;
    const [lx, ly] = quadPoint(p0, c, p1, t);
    const ang = quadAngle(p0, c, p1, t) + 90 + (i % 2 ? 48 : -48);
    const len = 34 + rand() * 18;
    s += `<g transform="translate(${r1(lx)} ${r1(ly)}) rotate(${r1(ang)})"><g class="lf"><path d="${leafPath(len, len * 0.3)}" fill="url(#ps-leaf)"/><path d="M0 0L0 ${r1(-len * 0.9)}" stroke="${C('stem-deep')}" stroke-opacity="0.35" stroke-width="1"/></g></g>`;
  }

  // Heads / filler foliage
  const tilt = r1(quadAngle(p0, c, p1, 1) + 90) * 0.55;
  if (spec.kind === 'leafy') {
    const ang = quadAngle(p0, c, p1, 1) + 90;
    const len = 96 + rand() * 30;
    s += `<g transform="translate(${r1(p1[0])} ${r1(p1[1])}) rotate(${r1(ang)})"><g class="lf"><path d="${leafPath(len, len * 0.34)}" fill="url(#ps-leaf)"/><path d="M0 0L0 ${r1(-len * 0.92)}" stroke="${C('stem-deep')}" stroke-opacity="0.4" stroke-width="1.4"/></g></g>`;
  } else if (spec.kind === 'eucalyptus') {
    // round silver leaves in pairs along the stem
    for (let i = 0; i < 6; i++) {
      const t = 0.3 + i * 0.13;
      const [lx, ly] = quadPoint(p0, c, p1, t);
      const ang = quadAngle(p0, c, p1, t);
      const rr = 21 - i * 2;
      for (const side of [-1, 1]) {
        s += `<g transform="translate(${r1(lx)} ${r1(ly)}) rotate(${r1(ang + 90 * side)})"><g class="lf"><ellipse cy="${r1(-rr * 0.9)}" rx="${r1(rr * 0.85)}" ry="${r1(rr)}" fill="${C('euca')}" stroke="${C('stem')}" stroke-opacity="0.25"/><ellipse cx="${r1(-rr * 0.2)}" cy="${r1(-rr)}" rx="${r1(rr * 0.35)}" ry="${r1(rr * 0.5)}" fill="${C('ivory')}" opacity="0.28"/></g></g>`;
      }
    }
  } else if (spec.kind === 'solidago') {
    let spray = '';
    for (let b = 0; b < 5; b++) {
      const t = 0.55 + b * 0.09;
      const [bx2, by2] = quadPoint(p0, c, p1, t);
      const ang = ((quadAngle(p0, c, p1, t) + (b % 2 ? 40 : -40)) * Math.PI) / 180;
      const len = 26 + rand() * 14;
      const ex = bx2 + Math.cos(ang) * len;
      const ey = by2 + Math.sin(ang) * len;
      spray += `<path d="M${r1(bx2)} ${r1(by2)}L${r1(ex)} ${r1(ey)}" stroke="${C('stem')}" stroke-width="1.4"/>`;
      for (let k = 0; k < 7; k++) {
        const tt = 0.3 + k * 0.11;
        spray += `<circle cx="${r1(bx2 + (ex - bx2) * tt + (rand() - 0.5) * 6)}" cy="${r1(by2 + (ey - by2) * tt + (rand() - 0.5) * 6)}" r="${r1(2.2 + rand() * 1.6)}" fill="${rand() > 0.4 ? C('sun') : C('butter')}"/>`;
      }
    }
    s += `<g class="bl-free">${spray}</g>`;
  } else if (spec.kind === 'chamomile') {
    let cl = '';
    for (let k = 0; k < 3; k++) {
      const ox = (k - 1) * 22 + (rand() - 0.5) * 6;
      const oy = (k === 1 ? -14 : 4) + (rand() - 0.5) * 6;
      cl += `<path d="M0 14L${r1(ox)} ${r1(oy)}" stroke="${C('stem')}" stroke-width="1.6"/><g transform="translate(${r1(ox)} ${r1(oy)})">${daisy(spec.r * (0.7 + rand() * 0.3), { base: C('ivory'), deep: C('kraft'), light: C('ivory') }, rand, 14)}</g>`;
    }
    s += `<g transform="translate(${r1(p1[0])} ${r1(p1[1])})"><g class="bl">${cl}</g></g>`;
  } else {
    s += `<g transform="translate(${r1(p1[0])} ${r1(p1[1])}) rotate(${r1(tilt)})"><g class="bl">${head(spec.kind, spec.r, spec.pal ?? P.peach, rand)}</g></g>`;
  }
  s += `</g>`;
  return s;
}

/* ───────── bouquets ───────── */

const bouquets: Record<string, StemSpec[]> = {
  // Warm, open: peach roses, cream ranunculus, chamomile, eucalyptus
  'thank-you': [
    { kind: 'eucalyptus', x: 300, y: 196, r: 0 },
    { kind: 'eucalyptus', x: 78, y: 430, r: 0 },
    { kind: 'eucalyptus', x: 522, y: 420, r: 0 },
    { kind: 'leafy', x: 196, y: 612, r: 0 },
    { kind: 'leafy', x: 404, y: 608, r: 0 },
    { kind: 'leafy', x: 236, y: 636, r: 0 },
    { kind: 'leafy', x: 366, y: 638, r: 0 },
    { kind: 'chamomile', x: 196, y: 262, r: 16 },
    { kind: 'chamomile', x: 410, y: 256, r: 15 },
    { kind: 'ranunculus', x: 232, y: 314, r: 46, pal: P.cream },
    { kind: 'ranunculus', x: 372, y: 308, r: 46, pal: P.cream },
    { kind: 'rose', x: 300, y: 284, r: 56, pal: P.peach },
    { kind: 'rose', x: 164, y: 396, r: 52, pal: P.peach },
    { kind: 'rose', x: 440, y: 392, r: 52, pal: P.peach },
    { kind: 'rose', x: 252, y: 382, r: 60, pal: P.peach },
    { kind: 'ranunculus', x: 352, y: 374, r: 56, pal: P.cream },
    { kind: 'buds', x: 124, y: 494, r: 34, pal: P.cream },
    { kind: 'buds', x: 476, y: 490, r: 34, pal: P.peach },
    { kind: 'ranunculus', x: 392, y: 470, r: 52, pal: P.cream },
    { kind: 'rose', x: 212, y: 472, r: 58, pal: P.peach },
    { kind: 'rose', x: 304, y: 456, r: 62, pal: P.peach },
    { kind: 'ranunculus', x: 182, y: 560, r: 44, pal: P.cream },
    { kind: 'rose', x: 410, y: 560, r: 46, pal: P.peach },
    { kind: 'rose', x: 294, y: 556, r: 52, pal: P.peach },
  ],
  // Gentle, quiet: white lisianthus, blush tulips, sage
  sorry: [
    { kind: 'eucalyptus', x: 300, y: 168, r: 0 },
    { kind: 'eucalyptus', x: 88, y: 400, r: 0 },
    { kind: 'eucalyptus', x: 512, y: 392, r: 0 },
    { kind: 'eucalyptus', x: 120, y: 600, r: 0 },
    { kind: 'eucalyptus', x: 480, y: 600, r: 0 },
    { kind: 'leafy', x: 220, y: 630, r: 0 },
    { kind: 'leafy', x: 380, y: 630, r: 0 },
    { kind: 'tulip', x: 226, y: 250, r: 42, pal: P.blush },
    { kind: 'tulip', x: 300, y: 214, r: 44, pal: P.blush },
    { kind: 'tulip', x: 378, y: 244, r: 42, pal: P.blush },
    { kind: 'tulip', x: 150, y: 330, r: 40, pal: P.blush },
    { kind: 'tulip', x: 452, y: 326, r: 40, pal: P.blush },
    { kind: 'lisianthus', x: 250, y: 360, r: 56, pal: P.ivory },
    { kind: 'lisianthus', x: 352, y: 354, r: 56, pal: P.ivory },
    { kind: 'buds', x: 128, y: 520, r: 32, pal: P.ivory },
    { kind: 'buds', x: 472, y: 518, r: 32, pal: P.ivory },
    { kind: 'lisianthus', x: 180, y: 444, r: 54, pal: P.ivory },
    { kind: 'lisianthus', x: 422, y: 442, r: 54, pal: P.ivory },
    { kind: 'lisianthus', x: 300, y: 434, r: 60, pal: P.ivory },
    { kind: 'lisianthus', x: 238, y: 528, r: 52, pal: P.ivory },
    { kind: 'lisianthus', x: 362, y: 530, r: 52, pal: P.ivory },
    { kind: 'buds', x: 300, y: 590, r: 30, pal: P.blush },
  ],
  // Bold, celebratory: coral peonies, golden sprays, bright ranunculus, gerbera
  congratulations: [
    { kind: 'solidago', x: 300, y: 196, r: 0 },
    { kind: 'solidago', x: 186, y: 240, r: 0 },
    { kind: 'solidago', x: 416, y: 234, r: 0 },
    { kind: 'eucalyptus', x: 80, y: 460, r: 0 },
    { kind: 'eucalyptus', x: 520, y: 452, r: 0 },
    { kind: 'leafy', x: 206, y: 622, r: 0 },
    { kind: 'leafy', x: 394, y: 620, r: 0 },
    { kind: 'gerbera', x: 200, y: 330, r: 46, pal: P.sun },
    { kind: 'gerbera', x: 410, y: 328, r: 46, pal: P.sun },
    { kind: 'peony', x: 304, y: 322, r: 64, pal: P.coral },
    { kind: 'ranunculus', x: 148, y: 422, r: 46, pal: P.butter },
    { kind: 'ranunculus', x: 456, y: 420, r: 46, pal: P.butter },
    { kind: 'peony', x: 244, y: 420, r: 62, pal: P.coral },
    { kind: 'peony', x: 362, y: 412, r: 62, pal: P.rose },
    { kind: 'gerbera', x: 130, y: 512, r: 38, pal: P.sun },
    { kind: 'buds', x: 476, y: 510, r: 32, pal: P.butter },
    { kind: 'ranunculus', x: 214, y: 506, r: 48, pal: P.coral },
    { kind: 'ranunculus', x: 396, y: 506, r: 48, pal: P.butter },
    { kind: 'peony', x: 306, y: 498, r: 58, pal: P.coral },
    { kind: 'buds', x: 220, y: 578, r: 30, pal: P.coral },
    { kind: 'gerbera', x: 390, y: 576, r: 38, pal: P.sun },
    { kind: 'ranunculus', x: 300, y: 582, r: 44, pal: P.coral },
  ],
};

export const bouquetIds = Object.keys(bouquets);

/** Returns the inner markup for one bouquet: a list of stem groups. */
export function bouquetMarkup(id: string): string {
  const specs = bouquets[id];
  if (!specs) return '';
  // Draw back-to-front (array order). Growth order (data-o) runs from the centre outward,
  // with the greenery last, so the bouquet appears stem by stem.
  const isFiller = (k: StemSpec['kind']) => k === 'eucalyptus' || k === 'leafy' || k === 'solidago';
  const order = specs
    .map((sp, i) => ({ i, d: Math.hypot(sp.x - 300, sp.y - 400) + (isFiller(sp.kind) ? 400 : 0) }))
    .sort((a, b) => a.d - b.d)
    .map((o) => o.i);
  return specs.map((spec, i) => buildStem(spec, (id.length * 977 + i * 131) >>> 0, order.indexOf(i))).join('');
}

/** Shared gradient definitions used by every bouquet. */
export const flowerDefs = `
<radialGradient id="ps-shade" cx="50%" cy="50%" r="50%">
  <stop offset="0" stop-color="${C('shade')}" stop-opacity="0.3"/>
  <stop offset="0.5" stop-color="${C('shade')}" stop-opacity="0.08"/>
  <stop offset="1" stop-color="${C('shade')}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="ps-sheen" cx="34%" cy="28%" r="62%">
  <stop offset="0" stop-color="${C('ivory')}" stop-opacity="0.5"/>
  <stop offset="1" stop-color="${C('ivory')}" stop-opacity="0"/>
</radialGradient>
<linearGradient id="ps-leaf" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="${C('leaf-light')}"/>
  <stop offset="1" stop-color="${C('stem')}"/>
</linearGradient>
<linearGradient id="ps-glass" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${C('ivory')}" stop-opacity="0.55"/>
  <stop offset="0.18" stop-color="${C('ivory')}" stop-opacity="0.12"/>
  <stop offset="0.7" stop-color="${C('ivory')}" stop-opacity="0.05"/>
  <stop offset="0.9" stop-color="${C('shade')}" stop-opacity="0.12"/>
  <stop offset="1" stop-color="${C('ivory')}" stop-opacity="0.4"/>
</linearGradient>
<linearGradient id="ps-water" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${C('water')}" stop-opacity="0.45"/>
  <stop offset="1" stop-color="${C('leaf')}" stop-opacity="0.4"/>
</linearGradient>`;

/** Clear glass vase. Back wall goes behind the stems, front glass + water go over them. */
export const vaseBack = `
<path d="M222 642C222 700 230 820 238 868Q240 880 252 880H348Q360 880 362 868C370 820 378 700 378 642Z" fill="${C('ivory')}" opacity="0.16"/>
<ellipse cx="300" cy="642" rx="78" ry="9" fill="none" stroke="${C('ivory')}" stroke-opacity="0.5" stroke-width="1.5"/>`;

export const vaseFront = `
<path d="M226 702C228 760 233 830 239 866Q241 876 252 876H348Q359 876 361 866C367 830 372 760 374 702Z" fill="url(#ps-water)"/>
<ellipse cx="300" cy="702" rx="74" ry="7" fill="${C('ivory')}" opacity="0.35"/>
<path d="M222 642C222 700 230 820 238 868Q240 880 252 880H348Q360 880 362 868C370 820 378 700 378 642Z" fill="url(#ps-glass)" stroke="${C('ivory')}" stroke-opacity="0.75" stroke-width="2"/>
<path d="M242 862Q244 874 254 874H346Q356 874 358 862Z" fill="${C('ivory')}" opacity="0.35"/>
<path d="M236 660C236 720 242 800 248 852" stroke="${C('ivory')}" stroke-width="7" stroke-linecap="round" opacity="0.5" fill="none"/>
<path d="M252 664C252 700 254 740 256 760" stroke="${C('ivory')}" stroke-width="2.5" stroke-linecap="round" opacity="0.55" fill="none"/>
<path d="M366 668C364 730 360 800 354 850" stroke="${C('shade')}" stroke-width="2" stroke-linecap="round" opacity="0.18" fill="none"/>
<path d="M222 642A78 9 0 0 0 378 642" fill="none" stroke="${C('ivory')}" stroke-width="2.2" opacity="0.9"/>`;
