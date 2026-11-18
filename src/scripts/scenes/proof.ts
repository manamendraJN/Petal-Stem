import gsap from 'gsap';
import type { SceneInit } from '../motion';
import { splitWords } from '../split';

/** Scene 3: photos sit at different depths; each note rises and writes itself. */
export const initProof: SceneInit = (root, { reduce }) => {
  if (reduce) return;
  const restores: (() => void)[] = [];

  const text = root.querySelector('.proof-text');
  if (text) {
    gsap.fromTo(
      text.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: text, start: 'top 82%', toggleActions: 'play none none reverse' },
      },
    );
  }

  root.querySelectorAll<HTMLElement>('[data-speed]').forEach((fig) => {
    const sp = Number(fig.dataset.speed);
    gsap.fromTo(
      fig,
      { y: () => -sp * window.innerHeight * 0.5 },
      {
        y: () => sp * window.innerHeight * 0.5,
        ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      },
    );
  });

  root.querySelectorAll<HTMLElement>('[data-note]').forEach((note, i) => {
    gsap.fromTo(
      note,
      { y: 70, rotation: i % 2 ? 6 : -6, opacity: 0 },
      {
        y: 0,
        rotation: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: note, start: 'top 98%', end: 'top 72%', scrub: 0.6 },
      },
    );
    const p = note.querySelector<HTMLElement>('.note-text');
    if (!p) return;
    const { spans, restore } = splitWords(p);
    restores.push(restore);
    gsap.fromTo(
      spans,
      { opacity: 0, y: 6 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: note, start: 'top 80%', toggleActions: 'play none none reverse' },
      },
    );
  });

  return () => restores.forEach((r) => r());
};
