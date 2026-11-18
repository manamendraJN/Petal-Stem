# Deploying Petal & Stem to Cloudflare Pages

This site is a fully static Astro build. Cloudflare Pages builds it from GitHub and
serves the `dist/` folder. No server or database is needed.

| Setting | Value |
| --- | --- |
| Framework preset | **Astro** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave empty)* |
| Node version | **24** (set by `.node-version`; Astro 7 needs 22.23.4 or newer) |

---

## 1. Before you deploy

1. **Get the code onto `main`.** The site is on the branch `feature/petal-stem-site`.
   Open the pull request on GitHub and merge it, or locally:
   ```bash
   git checkout main
   git merge feature/petal-stem-site
   git push origin main
   ```
2. **Check it builds on your machine:**
   ```bash
   npm install
   npm run check     # should report 0 errors
   npm run build     # should end with "7 page(s) built"
   npm run preview   # open http://localhost:4321 and click through
   ```

---

## 2. Create the Cloudflare Pages project (one time)

1. Log in at **dash.cloudflare.com**.
2. In the left menu, open **Workers & Pages**, then click **Create**.
3. Choose the **Pages** tab, then **Connect to Git**.
4. Connect your GitHub account if asked, and pick the repository **`manamendraJN/Petal-Stem`**.
5. On **Set up builds and deployments**, enter:
   - **Project name:** `petal-stem` (this becomes `petal-stem.pages.dev`)
   - **Production branch:** `main`
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Open **Environment variables (advanced)** and add:
   - `NODE_VERSION` = `24`

   (The `.node-version` file already asks for this. The variable is a safety net.)
7. Click **Save and Deploy**. The first build takes a minute or two.
8. When it finishes, open the `https://petal-stem.pages.dev` link it shows.

From now on, **every push to `main` redeploys the live site automatically.**
Pushes to other branches get their own preview link, so you can check changes before merging.

---

## 3. Point the site at its real address

The site uses its own address for canonical links and the social preview image.
Once you know the final URL (the `pages.dev` one or a custom domain), update it in **two places**:

- `astro.config.mjs`: `site: 'https://petal-and-stem.example'`
- `src/content/site.ts`: `siteUrl: 'https://petal-and-stem.example'`

Commit and push. Cloudflare rebuilds on its own.

### Optional: use your own domain

1. In the Pages project, open **Custom domains**, then **Set up a custom domain**.
2. Enter the domain (for example `petalandstem.yourstudio.com`) and follow the DNS steps.
   If the domain already uses Cloudflare DNS, the record is added for you.
3. Wait for the status to show **Active** (usually a few minutes). HTTPS is automatic.
4. Update the two `site` values above to the new domain and push.

---

## 4. Connect the forms (Formspree)

The Order, Contact and Weddings forms post to Formspree. Until this is set up,
the forms show a polite “not connected yet” message and point people to WhatsApp, phone or email.

1. Create a free account at **formspree.io** and click **New form**.
2. Copy the form endpoint. It looks like `https://formspree.io/f/abcdwxyz`.
3. In `src/content/site.ts`, replace:
   ```ts
   formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
   ```
   with your endpoint.
4. In Formspree's form settings, add your site's domain under allowed domains (if offered).
5. Push, wait for the deploy, then send a test message from each form.

---

## 5. Things to check before sharing the link

- [ ] Home: scroll the whole story on a phone and a laptop, then scroll back up.
- [ ] The feeling picker (Thank you / Sorry / Congratulations) grows a different bouquet.
- [ ] “Order for today” buttons open WhatsApp with a pre-filled message.
- [ ] Phone menu opens full-screen anywhere on the page; Escape or ✕ closes it.
- [ ] The chat helper (“Ask us”) answers and keeps its messages when you change page.
- [ ] Links like `/bouquets#sorry` land just below the header.
- [ ] Footer shows “Concept project designed by Depthwyn. Not a real business.” and the
      Depthwyn link goes to your studio site (`studio.url` in `src/content/site.ts`).
- [ ] Sharing the URL in WhatsApp or Slack shows the preview image (`public/og.jpg`).

---

## 6. Search engines

Every page includes `<meta name="robots" content="noindex">` because Petal & Stem is a
fictional business. This keeps it out of Google search results while the link still works
for anyone you share it with. If a real client ever takes the site over, remove that line from
`src/layouts/BaseLayout.astro`.

---

## 7. Deploy without GitHub (optional)

If you just want to upload a build by hand:

```bash
npm run build
npx wrangler login                                    # opens the browser once
npx wrangler pages deploy dist --project-name petal-stem
```

The first run creates the project if it doesn't exist. Use either Git deploys or manual uploads
for a project, not both, or they will overwrite each other.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Build fails with a Node version error | Make sure `NODE_VERSION` is `24` in the project's environment variables, then **Retry deployment**. |
| Build fails while downloading fonts | Fonts come from Google at build time. This is usually a short network hiccup, so retry the deployment. |
| The site shows an old version | Check **Deployments** in the Pages project: the newest one should say *Production* and *Success*. Then hard-refresh the browser (Ctrl + Shift + R). |
| A page shows “This page has wilted” | That's the 404 page. Check the link spelling (pages are `/bouquets`, `/weddings-events`, `/subscription`, `/order`, `/contact`). |
| Forms say they're not connected | Formspree isn't set up yet. See step 4. |
| Social preview shows an old image | Platforms cache previews. Re-check with the Facebook Sharing Debugger or LinkedIn Post Inspector to refresh it. |

Caching is already set in `public/_headers`: hashed files under `/_astro/` are cached for a
year (their names change on every build). Pages keep Cloudflare's default, which checks for a
new version on each visit.
