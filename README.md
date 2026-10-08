# rasmor.dev

The static website for Rasmor, in English (`/`) and Arabic (`/ar/`). It needs no build step and has no dependencies or external requests.

## Run it locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Asset paths are root-relative (`/assets/...`), so opening `index.html` straight from the file system won't load styles.

## Deploy

Upload the folder as it is to any static host, such as Cloudflare Pages, Netlify, Vercel or GitHub Pages. Then point `rasmor.dev` at the host. `.dev` domains only load over HTTPS, and all of these hosts provide that automatically.

## Before launch

- Make sure the `ceo@rasmor.dev` mailbox receives mail. The pages link to it.
- Have a native speaker review the Arabic copy in `ar/index.html`, especially the headline "اصنع طريقًا." and the tagline "ابتكارٌ نافع.".
- The wordmark is an auto-trace of the approved option 02 artwork, done for the web. Replace `assets/img/wordmark*.svg` and the `#wm` symbol in both pages once the final vector master is drawn.
- The bridge symbol is a clean redraw of the barrier-to-bridge proposal. Update the path data in the pages and `favicon.svg` if the final geometry changes.

## Design direction

These are the rules the site was built to. Keep them when you add pages.

- **Look:** warm paper with ink type and hairline rules. Oxide appears only where something intervenes: the bridge, the main button, the accent on the r and the email underline.
- **Signature:** in the hero, the oxide segment turns from an upright obstacle into the bridge as you scroll. This is the only showpiece animation. Elsewhere, sections fade up gently.
- **Dials:** variance 6, motion 4, density 3, on a scale of 10. That suits an enterprise audience that comes for trust first.
- **Type:** Manrope for Latin text and IBM Plex Sans Arabic for Arabic. Headlines use weight 500 with tight tracking. Never set the wordmark in Manrope.
- **Don't use:** gradients, glass effects, grids of identical cards, uppercase labels on every section, invented statistics, client logos or claims about launched products.
- **Accessibility:** with reduced motion turned on, or without JavaScript, the hero shows the finished bridge and the page scrolls normally. Animations only change transform and opacity.
