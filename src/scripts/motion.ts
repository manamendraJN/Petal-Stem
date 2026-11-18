/**
 * Motion core: Lenis smooth scrolling + GSAP ScrollTrigger, started on
 * astro:page-load and fully cleaned up on astro:before-swap.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
// Phones show/hide the address bar while scrolling; don't re-measure for that.
ScrollTrigger.config({ ignoreMobileResize: true });

export type SceneInit = (root: HTMLElement, env: SceneEnv) => void | (() => void);
export interface SceneEnv {
  reduce: boolean;
  signal: AbortSignal;
}

let lenis: Lenis | null = null;
let ctx: gsap.Context | null = null;
let cleanups: (() => void)[] = [];
const tick = (time: number) => lenis?.raf(time * 1000);

export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function getLenis() {
  return lenis;
}

export function headerOffset() {
  const h = document.querySelector<HTMLElement>('[data-header]');
  return (h?.offsetHeight ?? 68) + 12;
}

/** Scroll so `el` lands just below the fixed header. */
export function scrollToEl(el: Element, immediate = false) {
  // Absolute target computed here (not by Lenis) so scroll-padding is never counted twice.
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = Math.max(0, Math.min(max, el.getBoundingClientRect().top + window.scrollY - headerOffset()));
  if (lenis) {
    if (immediate) {
      window.scrollTo(0, y);
      lenis.scrollTo(y, { immediate: true, force: true });
    } else {
      lenis.scrollTo(y, { force: true, duration: 1.2 });
    }
  } else {
    window.scrollTo({ top: y, behavior: immediate || prefersReduced() ? 'auto' : 'smooth' });
  }
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { force: true, duration: 1.1 });
  else window.scrollTo({ top: y, behavior: prefersReduced() ? 'auto' : 'smooth' });
}

function landOnHash() {
  if (!location.hash || location.hash.length < 2) return;
  let target: Element | null = null;
  try {
    target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  } catch {}
  if (target) scrollToEl(target, true);
}

/** Generic reveal for inner-page content: fade up as it enters, reverse on the way back. */
function initReveals(reduce: boolean) {
  if (reduce) return;
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        delay: Number(el.dataset.revealDelay ?? 0),
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
      },
    );
  });
}

/**
 * Seamless scene handover: a [data-sink] section sinks back and darkens while
 * the next section rises over it. Full-width, so it never shrinks.
 */
function initSinks(reduce: boolean) {
  if (reduce) return;
  gsap.utils.toArray<HTMLElement>('[data-sink]').forEach((el) => {
    const inner = el.querySelector<HTMLElement>('[data-sink-inner]') ?? el;
    const shade = el.querySelector<HTMLElement>('[data-sink-shade]');
    const st = { trigger: el, start: 'bottom bottom', end: 'bottom top', scrub: true } as const;
    gsap.fromTo(inner, { yPercent: 0 }, { yPercent: 18, ease: 'none', scrollTrigger: st });
    if (shade) gsap.fromTo(shade, { opacity: 0 }, { opacity: 0.55, ease: 'none', scrollTrigger: { ...st } });
  });
}

export function startMotion(scenes: Record<string, SceneInit>, signal: AbortSignal) {
  const reduce = prefersReduced();
  const html = document.documentElement;
  html.classList.toggle('motion', !reduce);

  if (!reduce) {
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  }

  ctx = gsap.context(() => {
    document.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => {
      const init = scenes[el.dataset.scene ?? ''];
      if (!init) return;
      const c = init(el, { reduce, signal });
      if (c) cleanups.push(c);
    });
    initSinks(reduce);
    initReveals(reduce);
  });

  html.classList.add('motion-ready');
  ScrollTrigger.refresh();
  landOnHash();

  // Fonts change line lengths → re-measure, then land on the hash again.
  document.fonts?.ready.then(() => {
    if (signal.aborted) return;
    ScrollTrigger.refresh();
    landOnHash();
  });
}

export function stopMotion() {
  cleanups.forEach((c) => c());
  cleanups = [];
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (lenis) {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  }
}
