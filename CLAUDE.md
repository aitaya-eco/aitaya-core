# CLAUDE.md — Aitaya waitlist site

Read this fully before touching anything. It carries hard-won context from a long design process. Ignoring it means repeating mistakes that were already made and rejected.

## What this is
The waitlist / "coming soon" site for **Aitaya** (stylized "I tire!" — Nigerian pidgin + "AI"), a fashion **ecosystem** app for the Nigerian/African market: closet scanner, AI stylist, weather-aware outfit planner, TikTok-style Runway feed, campus Squads with Fit-of-the-Day voting, and a seller marketplace (tailors on escrow, brands, stylists) settled via Paystack.

Frame the product as a **fashion ecosystem**, never a generic "app" or "platform." Wearers, makers, sellers and stylists in one loop.

## Architecture (deliberately simple — do not "modernize" it)
- **Static site, no framework, no build step.** One `index.html` with inline `<style>` and inline `<script>`. This is intentional. Do NOT convert to React/Next/Vite.
- `api/waitlist.js` — Vercel serverless function, POST `{email}` → Postgres (`waitlist` table, auto-created). Uses `DATABASE_URL`. GET returns count. Duplicate emails → 409.
- `vercel.json` — tells Vercel to serve static + build only the api function. Overrides any dashboard settings.
- `assets/` — `brand/` (logo kit v1.1: favicons, app icons, link preview card `og-card.png`, `mark-silhouette.svg` for the giant mark's mask; the page logos themselves are inline SVG symbols, see "The logo" below), `site.webmanifest` at the root, `fonts/` (Aitaya Ari: `AitayaAri-Regular` solid and `AitayaAriStitch-Regular` stitched, woff2 + ttf), `img/looks/` (11 app screenshots), `img/paper.jpg` (texture), `vendor/three.module.js` (three.js, vendored — no CDN in production).
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
- Type: **Didot** (GFS Didot / Bodoni Moda) for display, **Aitaya Ari** (Aitaya's own embroidered uncial, bundled) for accents via `--script`; the stitched cut via `--script-stitch` only at 30px and above. The old Attire Display Script belongs to a former contributor and must never be reintroduced, **Space Grotesk** for UI/body.

## The logo (kit v1.1, October 2026)
The mark is Taya's agbada in one flowing line: ivory V neck with gold-piped lapels, Taya's gold four-hole button, split hem and spiral curl. The wordmark is Aitaya Ari converted to outlines. Never retype it in a font and never use the old v1.0 PNGs.
- In the page the logo is inline `<symbol>`s at the top of `<body>`: `#lg-h` (horizontal lockup, 753x244), `#lg-m` (mark) and the gold twin `#lg-h-g`, plus `#lg-hc` / `#lg-hc-g` for the header and footer: the same lockup with the loose thread drawn larger and 7 units thick, because at 120-130px wide the kit's 3-unit curl is half a pixel and disappears. Every lockup on the site is the full-detail one, with the curl (loose thread) and the button: the founder wants the thread kept even in the header, so the guide's small-size cut is not used on the site. Each `<svg class="lg ..."><use href="#lg-..."/></svg>` is coloured by `--lg-ink`, `--lg-v` and `--lg-gold`: emerald with an ivory V on light rooms. The mohair room and the charcoal footer wear the kit's one-colour gold logo (chosen by the founder over ivory, which glared on brown): every lockup carries two `<use>`s, `.u-n` (normal) and `.u-g` (gold), and CSS shows one. On gold, Taya's button keeps a deep-emerald rim (`--lg-btn` #153E31) so it never disappears into the gold body (the founder asked for the button to show). The doze mark and the giant mark's ink stay ivory (`.on-dark`). Gold never on light rooms.
- Rules from the usage guide that the site follows: horizontal logo at 120px wide or more, always with the wordmark in the header (124px desktop, 120px phones; footer 130px); emerald on light, gold on the dark rooms, never gold on light; no filters, stretching, tilting or drop shadows on the logo itself. The giant glass mark and the stitched lockup on the cloth are brand art built from the same outlines, not logo placements.
- The source kit (all colourways, PNG/SVG, social sizes) lives outside the repo; copy files in from it rather than redrawing.
- Site icons come from the founder's app icon (rounded emerald square, ivory agbada, deep-emerald V, gold button): `/favicon.ico` and `/apple-touch-icon.png` at the root (browsers and iOS ask there), `assets/brand/favicon.svg`, `favicon-32.png`, `icon-192/512.png`, `icon-maskable-512.png`. Links carry `?v=11`; bump it whenever the icon changes, browsers cache favicons for a long time.

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
- **Embroidered lockup on the fabric** (stitched from the kit's own outlines: `MARK_D`/`WORD_D` in the module, laid out like `aitaya-horizontal`, so it never waits for a font): `STITCH[]` in the module gives every niche its own historically-correct stitch (running for Adire, since adire alabere is literally stitch-resist; couching for Agbada and Aso-Oke goldwork; Cornely chainstitch for Streetwear; pick stitch for 50s suiting; French knots for Afro-Punk; feather for Boubou; lazy daisy for Cottagecore; herringbone for Layering; seed for Minimalist; backstitch for Gothic; satin for Aso-Ebi; stem for Contemporary), plus a thread colour and a glow colour drawn from that cloth. The agbada icon is stitched beside the wordmark in the same thread. Four strands carry it (`PLACE` map): the top strand at far right, the others mid and edge. Alpha 0.95, dark under-shadow for legibility on any band.
- **Giant mark and the stitched marks answer the scroll together**: `--mg` on `.bigmark` rises with scroll velocity, holds for 1.8s after scrolling stops, then eases to nothing by 3.8s (`MG_HOLD`/`MG_OUT`). The value is published as `window.__mg`; the module reads it and drives `emissiveIntensity` on the strands' emissive maps so the cloth marks glow in step.

## Taya, the stylist mascot (live on the site)
Taya is a female garment entity: her head is a tied emerald gele (pleated fan with gold running-stitch outline, one loose painted thread hanging from the lower right), her face is pale ivory cloth with Aitaya clothing-button eyes (cream clay, raised rim, four holes, same as the spine nav), a gele fold covers her mouth (she never shows a mouth), and her blush is the real agbada mark from `emb/mark_path.txt`, never an imitation. The striped gele cloth crosses down into a kimono collar and an agbada with Aitaya marks on the sleeves. Do not hand-draw or AI-regenerate her; all variants were edited from the final image.
- Assets: `assets/taya/head-{neutral,happy,love,thinking,dozing,wink,surprised}.webp` (360px), `head-{happy,blink,wink}-bare.webp` + `thread.webp` (CH 02 card) and `full-{love,happy,wink}.webp` (420px tall). Moods: love = heart-shaped clay buttons + glowing blush; thinking = gele tilts; dozing = stitched closed eyes + gele droops; surprised = gele flares; the blush glows only on happy, love and wink.
- `Taya.say(text,{mood,ms,action})`, `Taya.flash(mood,ms)`, `Taya.set(mood)` drive every face. Faces are two stacked `img.tm` that crossfade (`tayaFace(el, mood)`).
- Placements: TV ornament on a crocheted doily on top of the hero set (tap = channel caption, hops on channel change, winks at returning visitors, dozes with the set); picture-in-picture dock bottom right once the set scrolls away (reacts to role picker and vote, opens Ask Taya); email helper under the hero form (typo fixes); Ask Taya panel (occasion, city, vibe, rule-based looks using `window.__tayaWx` from the weather chyron, inline waitlist sign-up, WhatsApp share); green room (heart eyes, "I kept your seat", Bring your squad); guide card CH 02; weather chyron face; closing credits; tab title when hidden.
- Location: `api/weather.js` answers three ways: `?lat&lon` (device location, reverse-geocoded in the browser via BigDataCloud's free client-side endpoint, which by its terms must be called from the browser with the device's own location), `?q=` (typed city, Open-Meteo geocoding) and bare (Vercel IP headers). Network (IP) guesses are unreliable in Nigeria (Abuja phones show as Lagos or Port Harcourt), so the page asks for device location once, automatically, after the intro (`aitaya.geoAsked`); the IP guess is only the fallback for people who decline, and it is `no-store` on every cache layer. A confirmed place is saved as `aitaya.place`. Fahrenheit only for countries that use it.
- Taya the guide (`Guide` in the main script): she starts on the TV; scrolling past it she hops to the header's "Launching soon", pops out with a one-line Aitaya summary (placed once, the header is fixed), then settles bottom right. Each act tag (`.interstitial .tag`) and the niche tape is a stop where she BUILDS the heading: an `.act-build` card is laid over the tag (same tag face, same -1.6deg tilt) and unfurls up and to the right along a diagonal clip-path; the tag label rides up to become the card's kicker; a ribbon of her gele cloth runs along that diagonal and her full figure (`full-{happy,wink}.webp`) ripples into being on the card's right through the `#tayaCloth` filter. When the stitched timer (`.ab-time`, pauses on hover) runs out, the card folds back down the same diagonal into the tag and her head floats home to the corner. The card lives inside the interstitial (`.build-host`) so it scrolls natively; geometry is measured once per showing, never per frame. The filter only runs during the ~1s build and fold. Scrolling back up flies her onto the TV. One showing per stop per week (`aitaya.tour`), "Hush, Taya" stops the tour (`aitaya.tourOff`), nothing plays while chatting, typing, dozing or in the green room, and a queued stop only plays if it is still on screen. Reduced motion swaps flights for plain captions.
- Role picks (Act I chips and Act V makers) speak from the weather chip, not the corner: `chipSay(text, 4500)` opens the chip into a timed Taya note (size animated from measured before/after boxes) and closes it back into the weather. Nothing else uses the chip.
- CH 02 card: bare head (`head-happy-bare.webp`) floats; `head-blink-bare`/`head-wink-bare` swap in for blinks and the odd wink (and a wink on hover); the loose thread is a separate sprite (`thread.webp`) that sways from its knot. Animations pause when the guide is off screen.
- Niche tape: clicking a niche no longer scrolls; `roomShake()` shakes `<main>` (it holds no fixed elements, keep it that way) and bounces the tape. Taya notes each niche in `#taya-quick` above it (`NICHE_LINES`). Her tape stop walks a ring along three niches (`tapeDemo()`). Mouse-only hover ring as before.
- Email: `api/_email.js` (not an endpoint) holds the rules; `checkEmail()` in the page mirrors them. Syntax per RFC limits, known-typo domains and bad TLDs offered as one-tap fixes, near-miss providers suggested with a "No, mine is right" override, disposable and placeholder domains refused, and the server checks the domain actually receives mail (MX, then A/AAAA, failing open on slow DNS). Server answers 422 with a message the forms show.
- Taya colour tokens (`--t-*`, `--accent-fill`, `--accent-ink`, `--on-accent`) are contrast-checked in all 3 rooms x 5 roles; mohair uses dark ink on its pale accents. Brand text/fills use #7A5A0E on light rooms (the brand accent #8A6712 is 4.4:1, just under AA).
- Niche tape hover: stitched ring on mouse hover only (`hover:hover and pointer:fine`), tape pauses under the mouse.
- Ask Taya is rule-based (`OCC` table), not a live model. Referral tracking for Bring your squad is not built (would need a `ref` column in `api/waitlist.js`).

## Performance rules
- Mobile gets: pixel-ratio 1, fewer tufts/strands, thinner fur blurs, lighter backdrop-blur, `content-visibility:auto` on lower sections.
- Do NOT animate `transform`/`scale` on SVG-`filter`-fur elements every frame — it re-rasterizes and destroys mobile FPS (this was the mohair slowdown). The fur reality is deliberately *still*.
- Glare/scroll effects: only write to the DOM when scroll actually changed.
- Niche changes never block: `setNicheMood()` swaps targets, fur and strand layout at once and the cloth is woven by the `weave()` generator in three short steps between frames (plain strands first, then the stitched ones). Letter contours and fill columns are traced once and cached; each niche's textures are cached (`woven`, all 13) and old ones disposed; embroidered strands share one cloth texture through UV offsets (`PLACE` is a 0..1 position). Desktop weaves the remaining niches in idle time. Never set `material.needsUpdate` on a niche change (the shaders are built once at first paint).
- The mood easing runs on elapsed time, not frame count (`kM` 6, `kP` 4), so a niche lands in about half a second even on a phone running at 10fps. Keep it time-based.
- Phones: the cloth stops drawing while the page scrolls and picks up 160ms after (`scrolling` in the module), uses `MeshLambertMaterial` instead of Standard, keeps all 13 woven niches and weaves ahead in idle time once someone has tapped a niche (never while scrolling). The weave grain is one noise tile laid as a pattern (no `getImageData`).
- The canvas is sized to `100lvh` and only resizes when the width changes or the height jumps by 160px or more: a phone's address bar sliding away is not a resize. Page resize listeners (`reelArrows`, the guide) ignore height-only resizes too.
- Channel pictures are decoded ahead of time (`channelPics`) and the channel `<img>` decodes async, so a niche tap never decodes a JPEG on the spot.
- On phones the maker cards (`.role`) have no backdrop blur (they sit over the moving cloth and would re-blur every frame) and the header blur is 6px.
- Nothing repaints for nothing: the scroll glow on the giant mark is the opacity of one `.glow` layer (no animated filter or background), the on-air pulses are transform/opacity pseudo-elements (not box-shadow), the Runway progress bar is a WAAPI `scaleX` (not width) and the reel only runs while it is on screen, and `roomShake()` is WAAPI transform. No `void el.offsetWidth` restarts.
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
