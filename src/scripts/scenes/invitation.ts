import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneInit } from '../motion';
import { feelingById, getFeeling, onFeeling, setFeeling, waOrderLink, isFeeling } from '../feeling-state';
import type { FeelingId } from '../../content/site';
import { splitWords } from '../split';

/** Scene 6: the card writes itself with the visitor's chosen feeling. */
export const initInvitation: SceneInit = (root, { reduce, signal }) => {
  const msg = root.querySelector<HTMLElement>('[data-card-msg]')!;
  const lines = [...root.querySelectorAll<HTMLElement>('[data-card-line]')];
  const chips = [...root.querySelectorAll<HTMLButtonElement>('[data-inv-feeling]')];
  const wa = root.querySelector<HTMLAnchorElement>('[data-wa-order]');
  const orderLinks = [...root.querySelectorAll<HTMLAnchorElement>('[data-order-link]')];
  const original = msg.innerHTML;
  let current: FeelingId = getFeeling();
  let entered = false;
  let writing: gsap.core.Timeline | null = null;
  let spans: HTMLElement[] = [];

  const write = () => {
    writing?.kill();
    writing = gsap.timeline();
    writing
      .fromTo(lines[0], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 })
      .fromTo(
        spans,
        { opacity: 0, y: 10, rotation: -4 },
        { opacity: 1, y: 0, rotation: 0, duration: 0.4, stagger: 0.075, ease: 'power2.out' },
        '-=0.1',
      )
      .fromTo(lines[1], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.1');
  };

  const render = (id: FeelingId, animate: boolean) => {
    current = id;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.invFeeling === id)));
    if (wa) wa.href = waOrderLink(id);
    orderLinks.forEach((a) => (a.href = `/order?feeling=${id}`));
    const text = feelingById(id).cardMessage;
    if (reduce) {
      msg.textContent = text;
      return;
    }
    writing?.kill();
    spans = splitWords(msg, text).spans;
    if (!entered) {
      gsap.set([...lines, ...spans], { opacity: 0 });
    } else {
      gsap.set(lines, { opacity: 1, y: 0 });
      if (animate) {
        writing = gsap
          .timeline()
          .fromTo(
            spans,
            { opacity: 0, y: 10, rotation: -4 },
            { opacity: 1, y: 0, rotation: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' },
          );
      }
    }
  };

  chips.forEach((c) =>
    c.addEventListener(
      'click',
      () => {
        const id = c.dataset.invFeeling;
        if (isFeeling(id) && id !== current) setFeeling(id);
      },
      { signal },
    ),
  );
  onFeeling((id) => render(id, true), signal);
  render(current, false);

  if (!reduce) {
    ScrollTrigger.create({
      trigger: root.querySelector('[data-card]'),
      start: 'top 80%',
      onEnter: () => {
        entered = true;
        write();
      },
      onLeaveBack: () => {
        entered = false;
        writing?.kill();
        writing = gsap.timeline().to([...lines, ...spans].reverse(), { opacity: 0, duration: 0.25, stagger: 0.012 });
      },
    });
    const text = root.querySelector('.inv-text');
    if (text) {
      gsap.fromTo(
        text.children,
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: text, start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );
    }
  }

  return () => {
    writing?.kill();
    msg.innerHTML = original;
  };
};
