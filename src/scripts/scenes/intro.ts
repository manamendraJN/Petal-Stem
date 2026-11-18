import gsap from 'gsap';
import type { SceneInit } from '../motion';
import { splitWords } from '../split';

/** Inner-page opening: the title's words rise in, and the stem beside them grows and blooms. */
export const initIntro: SceneInit = (root, { reduce }) => {
  if (reduce) return;
  const title = root.querySelector<HTMLElement>('[data-intro-title]');
  const restore: (() => void)[] = [];
  const tl = gsap.timeline({ delay: 0.15 });
  if (title) {
    const s = splitWords(title);
    restore.push(s.restore);
    tl.fromTo(s.spans, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out' }, 0);
  }
  const stem = root.querySelector('.sprig-stem');
  if (stem) {
    gsap.set(stem, { transformOrigin: '50% 100%', smoothOrigin: false });
    tl.fromTo(stem, { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power2.out' }, 0.1);
  }
  root.querySelectorAll<SVGGElement>('.sprig-leaf').forEach((leaf, i) => {
    gsap.set(leaf, { transformOrigin: leaf.dataset.o, smoothOrigin: false });
    tl.fromTo(leaf, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0.5 + i * 0.15);
  });
  const bloom = root.querySelector<SVGGElement>('.sprig-bloom');
  if (bloom) {
    gsap.set(bloom, { transformOrigin: bloom.dataset.o, smoothOrigin: false });
    tl.fromTo(bloom, { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.8)' }, 1.0);
  }
  return () => restore.forEach((r) => r());
};
