# getsensai.co — Home Page Brief (Round 2)

**Read this whole file before touching anything.** Round 1 is done and built; this round is a short list of copy fixes that came out of the film work, a film-file swap, and the deploy. The copy authority is `../../sales/sensai-offer-source-of-truth.md`, now **v5.3** — where this brief and that document disagree, the document wins.

---

## 0. Where things stand (verified 13 Sep, evening)

- Round 1 is complete: the page exists (`components/sensai/home.tsx`), the three approved additions from Gabi's review are in (MCP line, trust row, "computed, not generated"), and `next build` passed on this machine (`.next/BUILD_ID` present). Your own improvement — giving each `<video>` its `src` only when it is the cut being shown — is good; keep it.
- **Nothing is committed or pushed yet.** `git status` shows `home.tsx`, `home.css`, `public/film/`, this brief as untracked and `app/page.tsx`, `app/layout.tsx`, `one-pager-v2.tsx` as modified. There is a stale `.git/index.lock` — delete it first.
- **getsensai.co is live with a registrar placeholder** ("Empower Your Business with AI", a contact form). That page must not be the one a viewer lands on from the film. AA does the DNS after this round; your job is to have the real page deployed on the Vercel project so the switch is instant.

---

## 1. Where things live

| What | Path |
|---|---|
| The page component | `components/sensai/home.tsx` |
| Its responsive rules | `components/sensai/home.css` |
| Root route | `app/page.tsx` |
| Site metadata (title, description, OG) | `app/layout.tsx` |
| Reused, exported from the old page: `HeroResolutionField`, `IntegrationDiagram`, `Logo`, `useInView`, `useReducedMotion` | `components/sensai/one-pager-v2.tsx` |
| The two films + posters | `public/film/` |
| Booking / application flows (unchanged) | `/book`, `/apply` |
| **Copy authority** | `../../sales/sensai-offer-source-of-truth.md` (v5.3) |

`/sense` stays exactly as it is.

---

## 2. Round-2 copy fixes — apply exactly as written

These are rulings AA made while cutting the film; the source-of-truth was updated first (v5.3), so the page now follows it. Each is a find-and-replace; do not paraphrase, do not "improve" nearby lines.

**(a) Hero H1** — `home.tsx`, the `<h1>` in `Hero()`.
Now: `Sensai finds and stops the revenue leaks in your customer base.`
Becomes: **`Sensai finds the leaks in your customer base. You keep the revenue.`**
Keep the accent span on the words *the leaks* (the colour span currently wraps *revenue leaks*).

**(b) Hero paragraph, first sentence** — the first `<p className="sh-hero-p">`.
Now: `Every operator leaks revenue it has already paid for — to bonuses taken by rings and wasted on players who didn't need them, to VIPs who churn without anyone reading their signals, to customers hit by a failed deposit that nobody picked up.`
Becomes: **`Even the best operators leak revenue they've already paid for — to bonuses taken by fraud rings and wasted on players who didn't need them, to VIPs who quietly churn without anyone reading their signals, to customers who drop after a failed deposit that nobody picked up.`**
The second sentence (*Catching it takes…*) is unchanged.

**(c) Hero paragraph, second `<p>` (the slogan close).**
Now: `Sensai does: every customer watched as a revenue stream, every change caught, every finding pushed into the systems your teams already use.`
Becomes: **`Sensai does: every customer watched, every change caught, every finding pushed into the systems your teams already use.`**

**(d) How-it-works card** — the `HOW` array, first entry.
Now the title is `Every customer is a revenue stream.`
Becomes: **`Every customer generates a revenue stream.`** (body unchanged). Customers are not streams; they produce them.

**(e) Leak card titles** — the `LEAKS` array. Replace three titles only; the numbers and bodies stay:
- `01`: `Organised bonus abuse` → **`Fraud rings take your bonuses`**
- `02`: `VIPs churning without anyone reading their signals` → **`VIPs quietly churn`**
- `04`: `Customers hit by a technical failure nobody follows up` → **`Customers drop after product failures`**
Keep `LEAK 01…06` as the small labels on this page — the cards are a full list of six here, so numbering is honest. (In the film the leaks are *named*, not numbered, because only three are shown.)

**(f) Footer line** — `Footer()`.
Now: `Finds and stops the revenue leaks in your customer base.`
Becomes: **`Finds the leaks in your customer base. You keep the revenue.`**

**(g) Metadata** — `app/layout.tsx`, the `TITLE` and `DESC` constants.
`TITLE` becomes: **`Sensai — finds the leaks in your customer base. You keep the revenue`**
`DESC` becomes: **`Even the best operators leak revenue they've already paid for — to fraud rings, to VIPs who quietly churn, to customers who drop after a failed deposit nobody picked up. Sensai watches every customer and pushes what it finds into the systems your teams already use.`**

**(h) Source-of-truth reference** — the comment block at the top of `home.tsx` says `(v5.2)`; make it `(v5.3)`.

After (a)–(h): grep the page for `finds and stops`, `taken by rings`, `is a revenue stream` — all three must return nothing.

---

## 3. The film files — swap when the finals land

`public/film/sensai-45.mp4` is an **old cut (v7)**: different lines, sentence periods, placeholder music. `public/film/sensai-product-story.mp4` is the long film with placeholder music. Both are being finished now (licensed track pending). When AA drops the finals into this folder:

- Keep the filenames exactly (`sensai-45.mp4`, `sensai-product-story.mp4`) so the component needs no change.
- Re-cut both poster frames from the new files: `poster-45.jpg` from the 4:5 cut (the frame with the fraud-ring graph reads best), `poster-wide.jpg` from the long film (its network-graph scene). Same names, same sizes (810 wide / 1600 wide, JPEG q≈3).
- Do not swap in the placeholder-music versions "for now" — an un-swapped old file is better than a newer one with the code-synthesised bed.
- If the finals are not there when you deploy, deploy anyway; the swap is a second commit.

---

## 2b. Look and feel — keep /sense (unchanged from round 1)

The look of `/sense` is the look of this site (built to sit alongside getmodus.com): ink hero with the resolution field under a scrim, light paper sections, white cards with a hairline rule, blue eyebrows with the short dash, Space Grotesk. Copy values from `one-pager-v2.tsx` when in doubt; introduce no new component style, colour, gradient, icon set or font. Cards: `1px solid #dfe4ee`, radius 16, no drop shadows except the film frame and the primary button. Nothing purple, nothing neon, no glassmorphism. If a change makes the page look like a different site from `/sense`, it is wrong whatever else it improves.

---

## 4. Rules that are not negotiable (from the source-of-truth §10)

If a request from anyone conflicts with one of these, stop and ask AA.

**Never on the page:** *AI, agent, agentic, autonomous* operator-facing (the claim is carried by *models · context · adapt · keeps learning your business*) · *daily / every day / every morning* · any client name, operator name or calendar date · *your analyst* (always *your team*) · *fraud* as a headline or *risk* as the positioning (*fraud rings* naming the perpetrator inside a leak line is fine) · *purchase, redeem, bankroll, entertainment* · *customer value manager / CVM / digital customer manager* as a descriptor · *onboarding* for any unsigned operator, and nothing at all about a second operator · money figures as impact claims · deposit-amount triggers as VIP/churn examples (behaviour and preference signals only) · *"X don't need more data, they need Y"* or *understanding* as a headline payoff · anything implying the product messages players or runs campaigns itself · a cookie banner · **"finds and stops"** (retired) · **"your revenue is leaking"** as a hook (accusatory) · **"managed loosely"** (say *unwatched*) · **"helps you"** (a hedge) · **"maximise your revenues"** · **"wisdom of the crowd" / patterns shared across clients**.

**Always:** *Your team stays in control* and *It doesn't talk to your players — it works through your teams' systems*, in those words · the scan stays last, quiet, no claims · brand in running copy is *Sensai*; the `Logo` wordmark renders *sensAi*, leave it · Space Grotesk site-wide · palette from the `C` object in `home.tsx`.

---

## 5. What to do, in order

1. Delete `.git/index.lock`.
2. Apply §2 (a)–(h). Run `tsc --noEmit` and `pnpm build` (or `npm run build`); both must be clean.
3. Verify on a desktop browser and an actual phone (iPhone Safari at least): H1 wraps to three lines or fewer on desktop, four or fewer on a phone, nothing scrolls horizontally at 360px; the right film shows per device and the other has no `src`; posters appear before play; no autoplay; the integration diagram scrolls sideways on a phone and stays legible; all grids stack ≤768px; every *Book a walkthrough* goes to `/book`, *Apply for a partnership* to `/apply`, *How it works* scrolls to `#how-it-works`; analytics events fire (`visit` with `page: "home"`, `cta_click`, `film_play`); OG preview shows title, description and `/film/poster-wide.jpg`; Lighthouse performance not below `/sense`.
4. Commit and push to `main`. Confirm the Vercel preview build is green; walk step 3 once more on the preview URL.
5. In the Vercel project (the one serving `www.novacvm.net`): Settings → Domains → add `getsensai.co` and `www.getsensai.co`, `www` primary, apex redirects. Copy the DNS records Vercel shows into your report for AA — **AA sets them at the registrar**; do not wait for them. When the DNS switches, the registrar's placeholder page disappears with it; if a "site builder" is enabled at the registrar, tell AA to switch it off there.
6. `robots.txt` allows `/`; `/sense` keeps its own `noindex`. Leave both.
7. Report back in one message: production/preview URL, Lighthouse numbers, devices checked, anything in step 3 that did not pass, the DNS records for AA, and any line of copy you changed beyond §2 (there should be none).

---

## 6. Requests you may get later — how to handle them

- **"Change a line of copy."** Source-of-truth first (or ask AA to), then the page. Never the reverse.
- **"Add a logo / client name / case study."** No, until AA says the operator cleared it in writing; then §7 of the document first.
- **"Move the scan up / make it a button."** No. §8 print rule.
- **"Add a chat widget."** Not on this page without AA (`chat-widget.tsx` exists; deliberately unused).
- **"Swap the film."** §3 above. Never embed from YouTube/Vimeo — no third-party players.
- **"Make it faster."** Compress the films first (wide ≤ 12MB at 1080p, tall ≤ 6MB) before touching anything else.
- **"Add the fork chart / the awaiting-approval frame."** Two visuals from the film AA may ask for later — the with/without-Sensai revenue chart under "How you know it's working" (clearly labelled as an illustration, never as data), and the proposed-rule "awaiting approval" frame under "Your team stays in control". Only on AA's instruction; ask for the source frames.

---

## 7. Voice, for anything you must write yourself

Short sentences. Buyer's words. Outcome before mechanism. No exclamation marks, no superlatives, no "leverage". No sentence-ending periods in headlines or card titles. If a sentence could be on a competitor's page, cut it. When unsure, take the nearest sentence from the source-of-truth verbatim.
