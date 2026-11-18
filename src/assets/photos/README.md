# Real photos go here

Drop your photos in this folder (keep each under ~2000px wide and ~500 KB),
then pass them to the placeholder component, for example in
`src/components/ProofScene.astro`:

```astro
---
import hands from '../assets/photos/hands-at-workbench.jpg';
---
<PhotoPlaceholder src={hands} alt="Hands tying a bouquet at the workbench" label="…" ratio="4 / 5" />
```

Astro's built-in `<Image>` then creates resized, optimised versions at build time.
