# PROGRESS

Handoff notes for the Mary Joy Ethiopia site rebuild. Read this first.

---

## 1. What this is

A static rebuild of **https://maryjoyethiopia.org** — an Ethiopian NGO's WordPress
site whose codebase was lost. Rebuilt by reverse-engineering the live site's
compiled CSS and DOM, because no source was available.

Rebuilt as a **statically exported Next.js 16 app**: 20 pages, all 389 images
and PDFs served locally. Zero runtime dependency on the original WordPress host.

- **Local path:** `C:\Users\Esubalew\Desktop\mery joy\maryjoy-next`
- **Remote:** `https://github.com/Esubalew-kunta/maryjoyethiopia.org.git` (branch `master`)
- **Original site:** `https://maryjoyethiopia.org/`

---

## 2. Current state

| | |
|---|---|
| Build | ✅ Clean — 23/23 static pages, TypeScript passes, zero warnings |
| Dependencies | ✅ 29 packages, **0 vulnerabilities** |
| Lint | ⚠️ **Removed** — see §6. No `npm run lint` exists anymore |
| Git | ✅ All work committed and pushed (`4aee74a`) |
| Vercel deploy | 🔴 **BLOCKED on one dashboard setting** — see §3 |
| Domain | ⬜ Not configured (no `maryjoyethiopia.org` DNS yet) |

### Verify the build still works

```powershell
npm install
npm run build
npm run verify     # asserts 1 <h1> per page + 0 broken images
```

`npm run verify` must print `RESULT: all pages OK`.

---

## 3. 🔴 THE ONE BLOCKER — Vercel Output Directory

**This has failed twice. Read before touching Vercel.**

The live site must be served from **`out/`**. When Vercel's *Output Directory*
setting is anything else, you get a **404 on every HTML page while images load
fine** — a confusing symptom that looks like a routing bug but isn't.

Two failures already happened:

1. **Output Directory left at `public/`** → `/uploads/*.png` returned 200 but
   `/`, `/about-us/`, `/favicon.ico`, `/index.html` all 404'd. Diagnosis: the 5
   SVGs in `public/` served fine while everything only in `out/` 404'd.
2. **Setting `outputDirectory: "out"` in `vercel.json`** → build failed with
   `The file ".../out/routes-manifest.json" couldn't be found`. Vercel treats an
   explicit output directory as a Next.js *server* build and looks for `.next`
   metadata, which a static export never emits. **The `vercel.json` fix was
   wrong and has been removed** (commit `abd2930`).

### The correct configuration

- **Framework Preset:** `Next.js`
- **Build Command:** `npm run build`
- **Output Directory:** ⬜ **LEAVE COMPLETELY BLANK**

Vercel reads `output: "export"` from `next.config.ts` on its own and serves
`out/` correctly. **Do not set Output Directory. Do not add a `vercel.json`.**

### Deploy steps

1. Vercel dashboard → delete the old project
2. **Add New → Project → Import** `Esubalew-kunta/maryjoyethiopia.org`
3. Framework Preset `Next.js`, Build Command `npm run build`, Output Directory blank
4. Deploy (~3 min; 143 MB of assets)
5. Confirm with:
   ```
   node -e "fetch('https://<your-domain>/about-us/').then(r=>console.log(r.status))"
   ```
   Want `200`, not `404`.

---

## 4. Architecture

**Copy lives in data, never in JSX.** This is the most important convention —
editing page text should never require touching a component.

```
content/*.json               ← 20 files, ALL page copy (hand-editable)
  ↓  npm run content
scripts/build-content.mjs    ← rewrites remote URLs → local paths
  ↓
src/data/content.json        ← generated — do not hand-edit
  ↓
src/components/Blocks.tsx    ← 25 block types render the data
  ↓
out/                         ← deployable static site
```

### Editing page copy

1. Edit `content/<slug>.json`
2. Run `npm run content` (regenerates `src/data/content.json`)
3. Run `npm run build`

### Files that matter

| Path | Role |
|---|---|
| `content/*.json` | All page content. 20 files. |
| `src/components/Blocks.tsx` | Block renderer — the extension point for new layouts |
| `src/lib/types.ts` | Every block type, discriminated union |
| `src/lib/site.ts` | Nav menu, footer content, org details, socials |
| `src/app/globals.css` | Design system (all tokens at top) |
| `src/components/Header.tsx` | Nav + 3 dropdowns, client component |
| `src/components/Footer.tsx` | 3-column footer |
| `next.config.ts` | `output: "export"`, `trailingSlash: true` |
| `public/uploads/` | 389 local assets (~143 MB) |

### Available scripts

```bash
npm run dev       # dev server
npm run build     # static export → out/
npm run serve     # serve out/ at http://localhost:4321
npm run verify    # assert 1 <h1>/page + 0 broken images
npm run content   # regenerate src/data/content.json from content/
```

---

## 5. Design tokens

Reverse-engineered from the live site's compiled Elementor CSS — **not
guessed**. All in `src/app/globals.css` under `:root`.

| Token | Value | Source |
|---|---|---|
| Primary | `#032990` | `.site-footer` background, link colour |
| Accent | `#eaa108` | buttons, hovers, stat numbers |
| Navy | `#010834` | hero fallback, quote section |
| Hover blue | `#1a2779` | button hover |
| Paper | `#fbf7f7` | alternating sections |

**Type:** Playfair Display (site), Poppins (section headings), Montserrat
(stats), Bebas Neue (buttons), Roboto/Lato (body).

**Measured values worth preserving:**
- Hero `h1`: 78px / weight 900 / line-height 85px / letter-spacing 3.4px
- Hero: 100vh, black overlay at 0.5 opacity
- Stat values: Montserrat 41px `#eaa108`
- Stat labels: Poppins 27px uppercase, letter-spacing 5.2px
- Section headings: Poppins 600, letter-spacing 3px
- Buttons: Bebas Neue 20px, 1px black border → `#1a2779` on hover
- Footer: `#032990`
- Header CTA: `#eaa108` → `#032990` on hover

Original was Astra 4.8.7 theme + Elementor 3.34.1 / Pro 3.34, breakpoint 921px.
Mobile nav breakpoint in the rebuild is also 921px to match.

---

## 6. Why ESLint was removed

Every Vercel build reported **5 high-severity vulnerabilities**. All five came
from one chain:

```
eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces
```

The advisory covers `braces <= 3.0.3`, and **3.0.3 is the newest version that
has ever been published** — there is no upstream patch. npm's only suggested
fix was downgrading `eslint-config-next` to `14.2.35`, which would have dragged
the project back to Next 14 and broken it.

Dropping ESLint also eliminated two other warnings: the `eslint@9.39.5`
deprecation, and `unrs-resolver`'s unapproved postinstall script (installed
solely by `eslint-import-resolver-typescript`, itself pulled in by
`eslint-config-next`).

`cheerio` was also removed — it existed only for the one-time HTML scraper and
pulled the deprecated `whatwg-encoding`. `scripts/build-content.mjs` and the
rest of the pipeline use only Node built-ins, so content re-syncs still work.

**Result: 372 packages / 3 warning classes → 29 packages / 0 vulnerabilities /
0 warnings.** `next build` still type-checks all 20 pages.

To restore linting later: `npm i -D eslint@10 eslint-config-next@16.3.8` and
recreate `eslint.config.mjs`. It will reintroduce the 5 advisories.

---

## 7. Deliberate reproductions of upstream bugs

These look like mistakes in the rebuild but are **faithful to the live site**.
Do not "fix" them without checking the original first.

| Page | What it does | Why |
|---|---|---|
| `/gallery/` | Renders **empty** | `<div class="elementor-image-gallery">` is genuinely empty upstream |
| `/vacancy/` | Shows a heading, **no job listing** | The Pharmacist job exists only in SEO meta tags, not the page body |
| `/order/` | One tile has **no image** | `vhicle-300x200-1.png` returns **HTTP 404** on the live server |

Also preserved: two different SEO plugins ran simultaneously upstream
(All in One SEO 4.9.3 *and* Yoast 26.7), producing malformed
`twitter:site` / `sameAs` values. The rebuild emits clean metadata instead.

---

## 8. Other things the next session should know

**Forms are live Google Forms iframes** on `/sponsor-child/`,
`/in-kind-donation/`, `/feeding/`, `/membership/`, `/volunteer/`. These match the
original exactly, so they keep working and stay in sync automatically. Only
`/contact/` uses a native form (it has no backend — `submit` does nothing).

**`content/*.json` was written by scraping, and some text was lightly cleaned**
— smart quotes normalised, collapsed whitespace, obvious extraction artifacts
fixed. The organisation's real typos were deliberately **kept** ("DIFFIFFERENCE",
"vulunerable", "ans Societies", "fil the information"). If asked to "fix
spelling", confirm with the user first — they may want the original wording.

**Payment/bank details are real and were copied verbatim** (CBE, Abyssinia, Enat,
Buna, Dashen account numbers). Treat this content as sensitive.

**Repo is ~143 MB**, dominated by 12 annual-report PDFs (~110 MB). Under
GitHub's 100 MB per-file limit (largest file is 24 MB) but clones are slow. If
this becomes a problem, move PDFs to a CDN and update the 12 URLs in
`content/home.json` and `content/e-resource.json`.

**`scrape/` is gitignored** — it holds ~148 MB of raw HTML/CSS snapshots plus a
duplicate of `public/uploads/`. Regenerate with:
```bash
node scripts/scrape.mjs && node scripts/fetch-css.mjs && node scripts/build-content.mjs
```
Large PDFs need `curl -C -` (resumable) or they time out mid-download.

**`scripts/extract.mjs` was deleted** with cheerio. It only produced readable
digests from scraped HTML; its output is already baked into `content/*.json`.
Re-adding it requires `npm i -D cheerio`.

---

## 9. Shell gotchas on this machine

This is **Windows / PowerShell**, which broke two things:

- **Heredocs don't work.** `git commit -m "$(cat <<'EOF' ... EOF)"` fails with
  a parser error. Write the message to a file first, then `git commit -F <file>`.
- **Double quotes inside a `-m "..."` argument get mangled**, silently splitting
  the commit message. Same fix — use `-F`.
- `gh` CLI is **not installed**. Use `git` directly.
- `gstack browse` is **not built** (only `SKILL.md` exists), so no scripted
  screenshots. Compare manually in a browser.

---

## 10. Remaining work

- [ ] **Deploy to Vercel** with Output Directory blank (§3) — the only blocker
- [ ] Point `maryjoyethiopia.org` at the Vercel project (DNS + domain)
- [ ] Consider replacing the Facebook/Instagram embeds on the homepage with real
      live feeds — they were static cards, because the originals need OAuth
- [ ] `/contact/` form has no backend — wire to Formspree, Resend, or similar
- [ ] Ask whether homepage "recency" claims still hold (8000+ children, 1000+
      elders, 148,986 beneficiaries) — figures were copied as-is