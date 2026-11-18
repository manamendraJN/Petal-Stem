/**
 * Scenes 1 + 2. Scroll carries the story:
 *  hook → the camera moves toward the bench, the unspoken words drift into the
 *  vase → the turn headline arrives → the chosen bouquet grows stem by stem.
 * The feeling picker swaps the bouquet (ungrow → regrow) and sends petals
 * drifting toward the viewer.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneInit } from '../motion';
import { scrollToY } from '../motion';
import { getFeeling, setFeeling } from '../feeling-state';
import type { FeelingId } from '../../content/site';

const PHONE = '(max-aspect-ratio: 4/5)';

export const initHero: SceneInit = (root, { reduce, signal }) => {
  const stage = root.querySelector<HTMLElement>('.hero-stage')!;
  const bqs = new Map<string, SVGGElement>();
  root.querySelectorAll<SVGGElement>('.bq').forEach((g) => bqs.set(g.dataset.bq!, g));
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-feeling-btn]')];
  const orderLinks = [...root.querySelectorAll<HTMLAnchorElement>('[data-order-link]')];

  const stored = getFeeling();
  let active: string = bqs.has(stored) ? stored : 'thank-you';

  const tls = new Map<string, gsap.core.Timeline>();
  const proxy = { g: 0 };
  let switching = false;
  let switchTl: gsap.core.Timeline | null = null;
  let pinST: ScrollTrigger | null = null;

  const reflect = () => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.feelingBtn === active)));
    orderLinks.forEach((a) => (a.href = `/order?feeling=${active}`));
  };

  /* ───── growth timelines (one per bouquet, driven by progress) ───── */
  const buildGrowth = (g: SVGGElement) => {
    const tl = gsap.timeline({ paused: true });
    g.querySelectorAll<SVGGElement>('.st').forEach((st) => {
      const t0 = Number(st.dataset.o ?? 0) * 0.1;
      gsap.set(st, { svgOrigin: `${st.dataset.ox} ${st.dataset.oy}` });
      tl.fromTo(st, { scale: 0.001 }, { scale: 1, duration: 0.7, ease: 'power2.out' }, t0);
      st.querySelectorAll('.lf').forEach((lf, k) => {
        gsap.set(lf, { transformOrigin: '50% 100%', smoothOrigin: false });
        tl.fromTo(lf, { scale: 0 }, { scale: 1, duration: 0.32, ease: 'back.out(1.7)' }, t0 + 0.28 + k * 0.035);
      });
      st.querySelectorAll('.bl, .bl-free').forEach((bl) => {
        gsap.set(bl, { transformOrigin: '50% 50%', smoothOrigin: false });
        tl.fromTo(
          bl,
          { scale: 0.15, opacity: 0, rotation: -28 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'power2.out' },
          t0 + 0.42,
        );
      });
    });
    return tl;
  };

  const showOnly = (id: string) => bqs.forEach((g, k) => gsap.set(g, { autoAlpha: k === id ? 1 : 0 }));

  /* ───── petals drift toward the viewer when the feeling changes ───── */
  const burst = () => {
    if (reduce) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    root.querySelectorAll<HTMLElement>('.burst-petal').forEach((p, i) => {
      gsap.killTweensOf(p);
      const side = i % 2 ? 1 : -1;
      gsap.fromTo(
        p,
        { x: 0, y: 0, scale: 0.4, opacity: 0, rotation: gsap.utils.random(-90, 90) },
        {
          keyframes: [
            { opacity: 1, duration: 0.15 },
            {
              x: side * gsap.utils.random(0.12, 0.4) * W,
              y: gsap.utils.random(-0.28, 0.3) * H,
              scale: gsap.utils.random(2.6, 4.2),
              rotation: gsap.utils.random(-200, 200),
              opacity: 0,
              duration: gsap.utils.random(1.2, 1.7),
              ease: 'power2.out',
            },
          ],
          delay: i * 0.05,
        },
      );
    });
  };

  const switchTo = (id: string) => {
    if (id === active || !bqs.has(id)) return;
    const prev = active;
    active = id;
    reflect();
    setFeeling(id as FeelingId);
    if (reduce || !tls.size) return showOnly(id);

    switchTl?.kill();
    bqs.forEach((g, k) => {
      if (k !== prev && k !== id) {
        gsap.set(g, { autoAlpha: 0 });
        tls.get(k)!.progress(0);
      }
    });
    const outTl = tls.get(prev)!;
    const inTl = tls.get(id)!;
    inTl.progress(0);
    const target = proxy.g;
    switching = true;
    switchTl = gsap.timeline({
      onComplete: () => {
        switching = false;
        inTl.progress(proxy.g);
      },
    });
    switchTl
      .to(outTl, { progress: 0, duration: 0.1 + 0.5 * outTl.progress(), ease: 'power1.in' })
      .set(bqs.get(prev)!, { autoAlpha: 0 })
      .set(bqs.get(id)!, { autoAlpha: 1 })
      .to(inTl, { progress: target, duration: 0.3 + 1.5 * target, ease: 'power1.out' });
    burst();
  };

  buttons.forEach((b) => b.addEventListener('click', () => switchTo(b.dataset.feelingBtn!), { signal }));
  reflect();

  if (reduce) {
    showOnly(active);
    return;
  }

  /* ───── motion ───── */
  bqs.forEach((g, k) => tls.set(k, buildGrowth(g)));
  showOnly(active);
  const applyGrowth = () => {
    if (!switching) tls.get(active)?.progress(proxy.g);
  };

  const layer = (n: string) => root.querySelector<HTMLElement>(`.l-${n}`)!;
  const words = [...root.querySelectorAll<HTMLElement>('.word')];
  const petals = [...root.querySelectorAll<HTMLElement>('.petal')];
  const ribbon = root.querySelector<HTMLElement>('.ribbon')!;
  const hook = root.querySelector<HTMLElement>('.hook')!;
  const turn = root.querySelector<HTMLElement>('.turn')!;
  const picker = root.querySelector<HTMLElement>('.picker')!;
  const hint = root.querySelector<HTMLElement>('.scroll-hint')!;

  const cssPct = (name: string) => parseFloat(getComputedStyle(root).getPropertyValue(name)) / 100;

  {
    const phone = window.matchMedia(PHONE).matches;
    const nearScale = phone ? 1.05 : 1.16;

    // Where the vase mouth is (in stage px), allowing for the near layer's zoom.
    const mouth = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const px = cssPct('--px') * W;
      const py = cssPct('--py') * H;
      const vh = cssPct('--vase-h') * H;
      const k = 1 + (nearScale - 1) * 0.3;
      return { x: px, y: py - vh * 0.25 * k };
    };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: '+=200%',
        pin: stage,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => root.classList.toggle('is-turn', self.progress > 0.33),
      },
    });
    pinST = tl.scrollTrigger ?? null;

    // Camera moves toward the bench: near layers grow faster than far ones.
    tl.fromTo(layer('bg'), { scale: 1 }, { scale: 1.04, duration: 10 }, 0)
      .fromTo(layer('far'), { scale: 1, yPercent: 0 }, { scale: 1.09, yPercent: -1, duration: 10 }, 0)
      .fromTo(layer('mid'), { scale: 1 }, { scale: 1.13, duration: 10 }, 0)
      .fromTo(layer('near'), { scale: 1 }, { scale: nearScale, duration: 10 }, 0);

    // Hook leaves first…
    tl.fromTo(hint, { opacity: 1 }, { opacity: 0, duration: 0.6 }, 0.2);
    tl.fromTo(hook, { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 1.2, ease: 'power1.in' }, 1.5);

    // …while the unspoken words drift into the vase (the word becomes stems).
    words.forEach((w, i) => {
      tl.fromTo(
        w,
        { x: 0, y: 0, scale: 1, opacity: 1 },
        {
          x: () => mouth().x - w.offsetLeft,
          y: () => mouth().y - w.offsetTop,
          scale: 0.22,
          opacity: 0,
          duration: 2.1,
          ease: 'power2.in',
        },
        0.5 + i * 0.22,
      );
    });

    // The turn arrives only after the hook has gone — clean reading order.
    tl.fromTo(turn, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 3.0);
    tl.fromTo(picker, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 3.5);

    // The bouquet grows, stem by stem.
    tl.fromTo(proxy, { g: 0 }, { g: 1, duration: 5.2, onUpdate: applyGrowth }, 4.0);

    // Foreground petals pass the viewer.
    petals.forEach((p, i) => {
      const dx = Number(p.dataset.dx) / 100;
      const dy = Number(p.dataset.dy) / 100;
      tl.fromTo(
        p,
        { x: 0, y: 0, scale: 1 },
        {
          x: () => dx * stage.clientWidth,
          y: () => dy * stage.clientHeight,
          scale: 1.9,
          duration: 7 - (i % 3),
        },
        i * 0.45,
      );
    });
    tl.fromTo(
      ribbon,
      { x: 0, y: 0, rotation: 14, scale: 1 },
      {
        x: () => -0.14 * stage.clientWidth,
        y: () => -1.25 * stage.clientHeight,
        rotation: -12,
        scale: 1.5,
        duration: 7.5,
      },
      2.5,
    );
    tl.set({}, {}, 10);
  }

  // As the proof scene rises over the hero, the hero sinks back and darkens.
  gsap.fromTo(
    root.querySelector('.hero-sink'),
    { yPercent: 0 },
    { yPercent: 20, ease: 'none', scrollTrigger: { trigger: root, start: 'bottom bottom', end: 'bottom top', scrub: true } },
  );
  gsap.fromTo(
    root.querySelector('.hero-dim'),
    { opacity: 0 },
    { opacity: 0.5, ease: 'none', scrollTrigger: { trigger: root, start: 'bottom bottom', end: 'bottom top', scrub: true } },
  );

  // Keyboard users: focusing a hidden tag brings the turn into view first.
  picker.addEventListener(
    'focusin',
    () => {
      if (root.classList.contains('is-turn') || !pinST) return;
      scrollToY(pinST.start + (pinST.end - pinST.start) * 0.62);
    },
    { signal },
  );

  /* ───── idle life: words hang in the air, petals sway ───── */
  const idle: gsap.core.Tween[] = [];
  root.querySelectorAll<HTMLElement>('.word-float').forEach((el) => {
    idle.push(
      gsap.fromTo(
        el,
        { x: 0, y: 0, rotation: 0 },
        {
          x: gsap.utils.random(-8, 8),
          y: gsap.utils.random(-12, 12),
          rotation: gsap.utils.random(-2.5, 2.5),
          duration: gsap.utils.random(3, 4.6),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        },
      ),
    );
  });
  root.querySelectorAll<HTMLElement>('.petal-float').forEach((el) => {
    idle.push(
      gsap.fromTo(
        el,
        { rotation: -8, y: 0 },
        { rotation: 10, y: gsap.utils.random(-14, 14), duration: gsap.utils.random(2.6, 4), ease: 'sine.inOut', yoyo: true, repeat: -1 },
      ),
    );
  });
  ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => idle.forEach((t) => (self.isActive ? t.resume() : t.pause())),
  });

  /* ───── mouse parallax: each layer moves by its depth ───── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const movers = [...root.querySelectorAll<HTMLElement>('.layer')].map((l) => {
      const inner = l.querySelector<HTMLElement>('.depth-inner')!;
      return {
        depth: Number(l.dataset.depth ?? 0),
        x: gsap.quickTo(inner, 'x', { duration: 0.9, ease: 'power3' }),
        y: gsap.quickTo(inner, 'y', { duration: 0.9, ease: 'power3' }),
      };
    });
    root.addEventListener(
      'pointermove',
      (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(-nx * m.depth);
          m.y(-ny * m.depth * 0.5);
        });
      },
      { signal },
    );
  }

  return () => {
    switchTl?.kill();
    idle.forEach((t) => t.kill());
    tls.forEach((t) => t.kill());
    pinST = null;
  };
};
