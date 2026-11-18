import gsap from 'gsap';
import type { SceneInit } from '../motion';

/** Scene 4: on wide screens the menu travels sideways; petals drift ahead toward the order card. */
export const initOffer: SceneInit = (root, { reduce }) => {
  if (reduce) return;
  const head = root.querySelector('.offer-head');
  if (head) {
    gsap.fromTo(
      head.children,
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: head, start: 'top 85%', toggleActions: 'play none none reverse' },
      },
    );
  }

  if (window.matchMedia('(min-width: 861px)').matches) {
    root.classList.add('is-horizontal');
    const pin = root.querySelector<HTMLElement>('.offer-pin')!;
    const track = root.querySelector<HTMLElement>('.track')!;
    const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${dist()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    tl.fromTo(track, { x: 0 }, { x: () => -dist() }, 0);
    root.querySelectorAll<HTMLElement>('.drift-petal').forEach((p, i) => {
      tl.fromTo(
        p,
        { x: 0, y: 0, rotation: i * 30 },
        { x: () => -dist() * (0.3 + i * 0.05), y: (i % 2 ? -1 : 1) * 50, rotation: i * 30 + 160 },
        0,
      );
    });
  }
  return () => root.classList.remove('is-horizontal');
};
