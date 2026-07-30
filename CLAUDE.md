# CLAUDE.md — Aitaya waitlist site

Read this fully before touching anything. It carries hard-won context from a long design process. Ignoring it means repeating mistakes that were already made and rejected.

## What this is
The waitlist / "coming soon" site for **Aitaya** (stylized "I tire!" — Nigerian pidgin + "AI"), a fashion **ecosystem** app for the Nigerian/African market: closet scanner, AI stylist, weather-aware outfit planner, TikTok-style Runway feed, campus Squads with Fit-of-the-Day voting, and a seller marketplace (tailors on escrow, brands, stylists) settled via Paystack.

Frame the product as a **fashion ecosystem**, never a generic "app" or "platform." Wearers, makers, sellers and stylists in one loop.

## Architecture (deliberately simple — do not "modernize" it)
- **Static site, no framework, no build step.** One `index.html` with inline `<style>` and inline `<script>`. This is intentional. Do NOT convert to React/Next/Vite.
- `api/waitlist.js` — Vercel serverless function, POST `{email}` → Postgres (`waitlist` table, auto-created). Uses `DATABASE_URL`. GET returns count. Duplicate emails → 409.
- `vercel.json` — tells Vercel to serve static + build only the api function. Overrides any dashboard settings.
- `assets/` — `brand/` (logos, favicons), `fonts/` (AttireDisplayScript-Regular.ttf), `img/looks/` (11 app screenshots), `img/paper.jpg` (texture), `vendor/three.module.js` (three.js, vendored — no CDN in production).
- three.js is loaded locally in prod. (The chat previews swap to a CDN import + inline the assets; the repo version imports `./assets/vendor/three.module.js`.)

## The aesthetic — "the parlor edition"
A cozy 1980s Nigerian parlor at the sunset hour, filtered through a Wes Anderson (Fantastic Mr. Fox) sensibility. The whole page is a **broadcast**: you find a dusty old TV set that has been waiting, wipe it, tune it, and it plays.

Layered design languages, all present on purpose:
- **Claymorphism** — soft pressed-dough surfaces, warm double shadows (brown, never grey), pillow highlights.
- **Skeuomorphism from the atelier** — stitched dashed seams on panels, a **measuring-tape** niche ticker, **hang-tag** act labels (punched hole + thread), **clothing-button** spine nav.
- **Glassmorphism** — warm champagne tint, felt visible *under* the glass. Never cold/blue glass.
- **Retro CRT** — screens bulge like a pregnant tube (convex highlight + barrel vignette + faint scanlines), static bursts on channel change.
- **Sunset tint** — amber (#D97B2F family) strongest at the top of the page, fading on scroll, like light through a window. Palette warmed toward the Mr. Fox sky.
- **Maximalist fur** — clay fur/pelt trim rings the base panels, tape edges, hero screen, channel cards.

### Palette (contrast-audited — respect these rules)
- Emerald `#1E5F4A`, emerald-deep `#153E31`, charcoal `#26282A`, gold `#DDC47F`, bronze `#7C6320`, sunset `#D97B2F`, rust `#A64B26`, cocoa `#4A3826`.
- **HARD RULE: light gold (#DDC47F) fails WCAG on cream (~1.5:1). Never put gold text on light surfaces.** Use **bronze #7C6320** (≥4.5:1) for gold-family text on light. Gold text only on dark surfaces.
- Type: **Didot** (GFS Didot / Bodoni Moda) for display, **Attire Display Script** (the bundled brand face) for accents/headings-script, **Space Grotesk** for UI/body.

## Interactive systems (all already built — understand before editing)
- **Power-on boot**, **power-off switch** (CRT collapse), **doze** easter egg (idle 40s → screens dim, ivory mark bounces DVD-style, header says "The set dozes… it tires").
- **Wipeable dusty glass** on screens (pointer wipes grime clean).
- **Tuning dial** + **clickable measuring-tape niches** + arrow keys → change hero channel with static burst.
- **Runway player** — vertical phone, tappable heart (count ticks), next arrow, auto-advancing progress.
- **"Who's watching" role picker** (Creator/Tailor/Brand/Stylist): re-writes hero lede + both CTA buttons + form label + guide order + goodnight copy + Runway first-look, and **re-tints the site accent** (creator=emerald, tailor=rust, brand=mustard, stylist=**plum #6E3A52**). Stylist is plum, NOT blue — blue clashed and was rejected.
- **The vote redresses the whole room** (data-fit on <body>): emerald = parlor unchanged; **"mohair shag"** = the uncanny hairy puppet reality (single column, swollen radii, SVG-fur pelts on everything, gold-family accents because greens fail on brown here); ivory = bright wash. Re-vote restores.
- **three.js background**: growing **fur tufts** (hand-drawn clay puffs) + **woven fabric ribbons** that twist/roll. Both are **niche-reactive** via the measuring tape — each niche sets fur colour/size/speed/spread and fabric palette/wave/tempo/position. Suits & Minimalist = straight parallel rows; Boubou/Afro-Punk = billowing. Fabric starts bundled, expands on selection. A giant **glassmorphic agbada mark** is fixed dead-center behind everything.

### Fur colour scoping (learned the hard way — get this exact)
Role colour touches fur ONLY on: the selected role chip, and the channel-by-channel cards. Every other pelt stays house brown on the default (emerald) page. Ivory/mohair pages keep their own treatment.

## Taste calibration — what was tried and REJECTED (do not regress)
- **3D-modeled TVs** → read as cardboard/tacky. Screens are now flat CSS framed panels with CRT bulge. Do not rebuild 3D TV geometry.
- **Text over the green paper texture** → unreadable. Paper is now whisper-faint under a ~96% ivory wash. Keep contrast high; verify every text/bg pair.
- **Generic "app/platform" copy with em-dashes** → felt AI-written and was rejected. **NO EM DASHES anywhere in visible copy.** Ecosystem framing, concrete Nigerian specifics (owambe, aso-ebi, Kano weather, Nile University), warm not corporate.
- **Empty dead space** (esp. above hero eyebrow) → fill with structure (schedule strip, panels).
- **Flat/thin "fabric" lines** → must read as actual woven cloth (twisting ribbons, per-strand woven textures, selvage edges), colourful and differentiated per niche.
- **Missing demarcation** → every section is a stitched clay panel with a numbered hang-tag act header.
- Mobile: header must stay compact and un-jumbled; Runway phone must be visible (it had a zero-width bug — always give `.rw-phone` an explicit width).

## Later additions (all live in index.html unless noted)
- **Test card** intro (brand colour bars) -> beam -> site. Shorter for returning visitors.
- **Set remembers you** via localStorage (`aitaya.visits/fit/role/joined`), all reads wrapped in try/catch. Returning visitors get "Welcome back. We kept it warm."
- **Late night vs prime time**: with no saved fit, the hour picks the theme. 05-11 ivory, 11-19 emerald parlor, 19-05 fur/mohair.
- **Weather chyron**: `api/weather.js` reads Vercel geo headers + Open-Meteo (no key), returns {city,temp,advice}; 204 on failure and the chyron simply stays hidden.
- **V-hold / Tracking mini-dials** on the hero set with a "Set auto" reset. Rolls the picture and skews/tears it.
- **Squelch**: filtered noise sweep + static on every channel change (only audible with hum on).
- **Closing credits** roll in the footer on scroll to bottom.
- **Green room**: after a successful signup an overlay shows the queue number (real count from GET /api/waitlist) plus WhatsApp/Telegram groups and socials. Links live in the `LINKS` config at the top of the main script; empty values hide their button automatically. Social icons are monochrome brand-palette on purpose, never platform brand colours, so nothing clashes.
- **Embroidered lockup on the fabric**: `STITCH[]` in the module gives every niche its own historically-correct stitch (running for Adire, since adire alabere is literally stitch-resist; couching for Agbada and Aso-Oke goldwork; Cornely chainstitch for Streetwear; pick stitch for 50s suiting; French knots for Afro-Punk; feather for Boubou; lazy daisy for Cottagecore; herringbone for Layering; seed for Minimalist; backstitch for Gothic; satin for Aso-Ebi; stem for Contemporary), plus a thread colour and a glow colour drawn from that cloth. The agbada icon is stitched beside the wordmark in the same thread. Four strands carry it (`PLACE` map): the top strand at far right, the others mid and edge. Alpha 0.95, dark under-shadow for legibility on any band.
- **Giant mark and the stitched marks answer the scroll together**: `--mg` on `.bigmark` rises with scroll velocity, holds for 1.8s after scrolling stops, then eases to nothing by 3.8s (`MG_HOLD`/`MG_OUT`). The value is published as `window.__mg`; the module reads it and drives `emissiveIntensity` on the strands' emissive maps so the cloth marks glow in step.

## Performance rules
- Mobile gets: pixel-ratio 1, fewer tufts/strands, thinner fur blurs, lighter backdrop-blur, `content-visibility:auto` on lower sections.
- Do NOT animate `transform`/`scale` on SVG-`filter`-fur elements every frame — it re-rasterizes and destroys mobile FPS (this was the mohair slowdown). The fur reality is deliberately *still*.
- Glare/scroll effects: only write to the DOM when scroll actually changed.
- The three.js loop is frame-budgeted (28ms desktop / 40ms mobile), recomputes vertex normals only every 3rd frame, and pauses entirely when the tab is hidden. Do not remove these.
- Cache layout reads (e.g. `screenH`) instead of measuring inside rAF.

## Workflow rules
- Deliverable is production HTML, not prototypes. Match the actual build target.
- After ANY change: syntax-check the inline scripts, and if possible screenshot-verify. The human is the final visual judge — show them before declaring done.
- Keep everything in the single `index.html`. Preserve the `data-fit` / `data-role` CSS-variable theming system; new theming should hang off those, not hard-coded values.
- Respect `prefers-reduced-motion` (calm fallbacks already wired).

## Deploy
Push to `main` on the `aitaya-eco` GitHub org → Vercel auto-builds (once the Vercel/Supabase migration runbook is done). `vercel.json` handles config. No dashboard steps.

## Using the UI UX Pro Max skill (installed at .claude/skills/ui-ux-pro-max)
This skill is a search-based design-intelligence + audit tool. Use it as an AUDITOR, not an art director.
- **Good for:** contrast-ratio checks, focus states, ARIA/touch-target/spacing validation, responsive breakpoints, loading/empty states, and stack best-practices. Run these audits and fix what they catch.
  - e.g. `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "accessibility contrast focus" --domain ux`
- **Do NOT** let its default recommendations (minimalism, standard SaaS palettes, conventional layouts, HTML+Tailwind class dumps) override the established parlor aesthetic. This site is intentionally maximalist, uncanny, clay-and-fur, hand-written CSS — not Tailwind. Its style suggestions are reference to translate, never paste.
- Precedence: when the skill's generic advice conflicts with the taste calibration and hard rules above, THIS FILE WINS. The skill improves accessibility and polish within the aesthetic; it does not get to change the aesthetic.
