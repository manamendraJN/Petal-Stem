import gsap from 'gsap';
import type { SceneInit } from '../motion';

/** Scene 5: one stem grows past three steps; each step's bud opens as the stem reaches it. */
export const initEase: SceneInit = (root, { reduce }) => {
  if (reduce) return;
  const area = root.querySelector<HTMLElement>('.steps-area')!;
  const steps = [...root.querySelectorAll<HTMLElement>('.step')];
  const head = root.querySelector('.ease-head');
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

  {
    const desk = window.matchMedia('(min-width: 861px)').matches;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: area,
        start: desk ? 'top 72%' : 'top 80%',
        end: desk ? 'bottom 62%' : 'bottom 70%',
        scrub: 0.5,
      },
    });
    if (desk) tl.fromTo(root.querySelector('.ease-reveal'), { x: -1200 }, { x: 0, duration: 3 }, 0);
    else tl.fromTo(root.querySelector('.ease-reveal-v'), { y: -660 }, { y: 0, duration: 3 }, 0);
    steps.forEach((s, i) => {
      const at = i + 0.15;
      const bud = s.querySelector('.bud');
      gsap.set(bud, { transformOrigin: '50% 100%' });
      tl.fromTo(bud, { scale: 0, rotation: -24 }, { scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(2)' }, at);
      tl.fromTo(
        s.querySelectorAll('.step-num, .step-title, .step-text'),
        { opacity: 0.1, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' },
        at + 0.1,
      );
    });
  }
};
