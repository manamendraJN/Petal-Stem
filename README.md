# Petal & Stem — concept florist website

A concept project by **Depthwyn**. Petal & Stem is a fictional florist in [Kandy], Sri Lanka.
Every price, phone number, address and review on the site is a `[placeholder]` or marked “Sample”.

**Big idea:** start with the feeling, not the product. A bouquet grows from a feeling: every
scene starts with a word, and the word becomes stems, leaves and petals.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve the build
npm run check     # TypeScript + Astro type check
```

Node 22+ recommended. Stack: Astro 7 (static), TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis.

## Deploy (Cloudflare Pages)

Step-by-step instructions: **[DEPLOY.md](DEPLOY.md)**. Quick reference:

- Build command: `npm run build`
- Output directory: `dist`
- `public/_headers` sets long caching for hashed assets.
- Set the real domain in `astro.config.mjs` (`site`) and `src/content/site.ts` (`siteUrl`).
- Pages carry `noindex` because the business is fictional. Remove the robots tag in
  `src/layouts/BaseLayout.astro` if a real client takes it over.

## Where things live

| What | Where |
| --- | --- |
| All text, prices, contact details, chat answers | `src/content/site.ts` |
| Colours, fonts, spacing (design tokens) | `src/styles/global.css` (`@theme`) |
| Home scenes | `src/components/HeroScene.astro` (scenes 1–2), `ProofScene`, `OfferScene`, `EaseScene`, `InvitationScene` |
| Scroll animation per scene | `src/scripts/scenes/*.ts` |
| Lenis + ScrollTrigger lifecycle | `src/scripts/motion.ts`, `src/scripts/app.ts` |
| Bouquet / workshop illustrations (SVG, generated at build) | `src/lib/flowers.ts`, `src/lib/shop.ts` |
| Chat helper (scripted, no AI) | `src/components/ChatHelper.astro`, `src/scripts/chat.ts` |
| Real photos | `src/assets/photos/` (see the README there) |

## Replacing photos

Every photo spot uses `PhotoPlaceholder` with the right shape and a note of the size it needs.
Pass a real image as `src` and Astro optimises it:

```astro
import hands from '../assets/photos/hands.jpg';
<PhotoPlaceholder src={hands} alt="Hands tying a bouquet" label="…" ratio="4 / 5" />
```

## Contact form

Forms post to Formspree. Create a form at formspree.io and replace `YOUR_FORM_ID` in
`formspreeEndpoint` in `src/content/site.ts`. Until then, the form tells the visitor to use WhatsApp, phone or email instead.
