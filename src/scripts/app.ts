/**
 * Client entry. Everything starts on astro:page-load and is torn down on
 * astro:before-swap, so ClientRouter navigations never leak triggers or listeners.
 */
import { startMotion, stopMotion, scrollToEl, type SceneInit } from './motion';
import { initUI } from './ui';
import { initHero } from './scenes/hero';
import { initProof } from './scenes/proof';
import { initOffer } from './scenes/offer';
import { initEase } from './scenes/ease';
import { initInvitation } from './scenes/invitation';
import { initOrder } from './scenes/order';
import { initIntro } from './scenes/intro';

const scenes: Record<string, SceneInit> = {
  hero: initHero,
  proof: initProof,
  offer: initOffer,
  ease: initEase,
  invitation: initInvitation,
  order: initOrder,
  intro: initIntro,
};

let ac: AbortController | null = null;

function teardown() {
  ac?.abort();
  ac = null;
  stopMotion();
}

function init() {
  teardown();
  ac = new AbortController();
  initUI(ac.signal);
  startMotion(scenes, ac.signal);
}

document.addEventListener('astro:page-load', init);

// Scenes build for the current layout. When the layout crosses a breakpoint (rotating a
// phone, resizing a window, DevTools device mode) or motion preference changes, rebuild
// everything in page order so every pin and scroll position is measured afresh.
let rebuildTimer = 0;
['(max-aspect-ratio: 4/5)', '(min-width: 861px)', '(prefers-reduced-motion: reduce)'].forEach((q) => {
  window.matchMedia(q).addEventListener('change', () => {
    window.clearTimeout(rebuildTimer);
    rebuildTimer = window.setTimeout(() => {
      if (ac) init();
    }, 150);
  });
});

document.addEventListener('astro:before-swap', teardown);

// In-page links (#section): smooth-scroll to just below the fixed header.
// Handled before the router sees the click, so the two never fight.
window.addEventListener(
  'click',
  (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || (a.target && a.target !== '_self')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    let el: HTMLElement | null = null;
    try {
      el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    } catch {}
    if (!el) return;
    e.preventDefault();
    history.replaceState(history.state, '', url.hash);
    scrollToEl(el);
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  },
  { capture: true },
);
