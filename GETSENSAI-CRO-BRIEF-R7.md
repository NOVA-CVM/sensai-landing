# getsensai.co — Round 7: the `/cro` version

**What this is.** A second version of the home page, at `/cro`, built for one reader: a Chief
Revenue Officer who gives the page ninety seconds and decides whether to take a meeting. It is
the round-6 page plus what a getmodus.com review showed we lack, plus the "every customer is a
stream" animation, plus a design system that holds the page together. `/` stays as it is; AA
compares the two on the live site and picks. When `/cro` wins, it becomes `/`.

**Target.** New route `app/cro/page.tsx` → `components/sensai/home-cro.tsx` (`SensaiHomeCro`),
copied from `home.tsx` at `56a766d`. `home-cro.css` for its own rules. `/cro` carries
`noindex` until it is promoted. Never touch `one-pager-v2.tsx` or `/sense`; leave `home.tsx`
alone so the comparison is honest. Your r6 report was read in full; §E answers it.

---

## A. Design system for `/cro` (this is the "design level" step)

The one thing getmodus does that we don't: **a single visual world that recurs**. Their night
sky is the hero background, the divider band, and the backdrop every product screen floats on.
Ours is the customer base at high resolution: **the dots field.** Use it the same three ways.

1. **Hero background** — the dots field with its entrance animation, as in round 6.
2. **One full-bleed ink band mid-page** — the dots field behind the "How it works" tiles (§B2).
   It breaks the white run that your post-R5 measurements flagged, in the place it matters.
3. **Product screens mounted on ink** — in "What it does", each screen sits inside an ink card
   (`SENS.ink` background, dots field at ~35% behind it, 16px radius, 20px inner padding, the
   screen at 12px radius on top). Screens on white read as pasted; screens on the brand ground
   read as designed. This one change does more for "serious product" than anything else here.

**Section skeleton, every section the same:** eyebrow (12px mono, letter-spaced) → H2, two
lines maximum → one sentence, 17px, muted → the visual → a button only where a chapter ends
(hero, how-it-works, closing). Nothing else in a section. If a section needs a paragraph, the
sentence is wrong.

**Rhythm down the page:** ink (hero) → white (problem, with the animation) → white (leaks) →
**ink band** (how it works) → white (what it does, screens on ink cards) → white (trust) →
white (partnership) → ink (closing). Thin `SENS.rule` between white sections.

**Type:** unchanged (Space Grotesk, the round-6 scale). **Buttons:** ink primary on white
sections, white primary on ink; outline secondary only in the hero.

**Integration diagram:** the source side uses the **real logos already in `public/logos/`**
(Snowflake, BigQuery, PostgreSQL, MySQL) plus text chips for the rest; the output side stays as
categories (CRM, case manager, risk tools, BI). We can prove the sources; we do not claim vendors
on the output side.

---

## B. The sections, in order

### B1. Hero — as round 6, one change
- `Talk to us` primary (white), `How it works` outline. Both, this time: the outline scrolls to §B4.
  A CRO who is not ready to talk needs a second thing to click.
- Nav: `How it works` · `Partnership` (anchor links, 14px) · `Talk to us`. Wordmark + mascot as r6.

### B2. Problem — headline, the animation, the benchmarks, then the quotes
- Headline as now: **Even the best operators leak revenue they've already paid for.**
- **Two columns.** Left, two sentences and nothing else:
  *Every customer is a stream of future revenue, and your revenue is the sum of the streams.
  A stream that stops early is revenue you've already paid to acquire.*
  Right: **the animation** (§C). On phones the animation goes under the sentences, full width.
- **Under the animation, two lines, 14px, muted, mono eyebrow above them reading
  `WHAT WE SEE ACROSS OPERATORS`:**
  *In gaming it is common for the top 10% of customers to generate 90% of lifetime revenue.*
  *Operators who don't watch for abuse give 2–4% of NGR to abusers.*
  These are AA's own benchmarks from his consulting work. They are the only numbers on the
  page besides "4 weeks". Verbatim; no "up to", no source line.
- Then the quotes carousel, **trimmed to three** (drop #4).

### B3. Outcomes strip — new, short
Three lines in a row on white, each with one of the leak marks from round 6, 17px semibold,
no sub-copy, no headline above them beyond the eyebrow `WHAT CHANGES FOR YOU`:
- **Bonus budget spent on real players.**
- **VIPs kept before they're gone.**
- **Deposits recovered after a failure.**
This is the page saying "this is your P&L" out loud. It sits between Problem and Leaks.

### B4. The leaks we stop — as round 6, no change. `id="leaks"`.

### B5. How it works — new, the ink band. `id="how-it-works"`
Full-bleed `SENS.ink` band, dots field behind at ~40%. Eyebrow `HOW IT WORKS`. H2:
**Connect. Watch. Act.** One sentence: *Read access in, every customer watched every day, actions
out through the systems you already run.* Then **three equal tiles** (white text on ink, 1px
`rgba(255,255,255,.12)` border, 16px radius), each: a word, one line, one small mark:

| Tile | Line | Mark |
|---|---|---|
| **Connect** | Read-only access to your source tables. Nothing moves, nothing changes. | a database cylinder with an arrow in |
| **Watch** | Every customer, every day, against what it should look like. | the dots field, one dot lit |
| **Act** | Cases, lists, triggers and rules, into your CRM, case manager and risk tools. Your team approves. | an arrow out into three boxes |

Under the tiles: **the integration diagram**, on the ink band, inverted to light-on-dark (the
chips white on ink, the lines at 40% white, the node white). Under it the four chips as now
(read-only · pseudonymised, no PII · encrypted in transit and at rest · nothing armed without
your approval). Then `Live within 4 weeks.` as the band's last line, 22px, white. **No button.**

### B6. What it does — as round 6, with the screens mounted on ink (§A3)
Five rows unchanged. The right-column screen (and the inline phone screen) now sits in the ink
card. Captions move outside the card, under it, as now.

### B7. Trust block — new. Eyebrow `BUILT FOR REGULATED OPERATORS`
H2: **Nothing leaves your control.** Six lines in two columns, each with a 20px mark, 15px:
- Read-only access to your data.
- Pseudonymised. No PII.
- Encrypted in transit and at rest. *(approved by Gabi, 14 Sep)*
- Nothing is armed without your confirmation.
- It never contacts a player.
- Runs through your systems. Nothing new to adopt.
**No certifications, no "highest standards", no badges.** SOC 2 is budgeted, not held; the page
does not get ahead of that. When a certification exists it goes here.

### B8. Design partnership — as round 6.

### B9. Closing band — as round 6, plus the shape of the meeting
Under the `Talk to us` button, one line, 15px, muted:
*Thirty minutes. We show it on synthetic data; you tell us which leak you'd want first.*

### B10. Footer
Wordmark · `contact@getsensai.co` (or the address AA gives) · LinkedIn (the company page) ·
Privacy · Terms. Privacy and Terms can be short static pages; a form on the site needs them
anyway. The `Live in production` pill stays gone.

---

## C. The animation: `streams-anim.js`

Delivered at `components/sensai/streams-anim.js`. **Do not edit its markup**; it is generated
from the film's own code (`page_agg.py`, v8) and regenerated there.

- Exports `STREAMS_CSS`, `STREAMS_MARKUP`, `mountStreams(root, {duration})` → `{ render, play, stop }`.
- The root is a 1000×560 box (`aspect-ratio: 1000/560`, `width: 100%`). The SVG scales with it;
  the HUD (captions, `$16K`, `WEEK 1`/`WEEK 12`) is positioned in px of that box, so **scale the
  root as a unit**: render it at 1000px and `transform: scale(w/1000)` with `transform-origin: 0 0`,
  inside a wrapper whose height is `w * 0.56`. That keeps the type proportional on a phone.
- Inject `STREAMS_CSS` once (a `<style>` in the component).
- Play once when 50% visible (`IntersectionObserver`), never replay. Reduced motion: `render(1)`.
- Duration 12000ms. Ends on the fork and stays there.
- Its labels are the film's mono at 10.5px in the 1000px box; on a 360px phone that is ~3.8px,
  which is not readable. **On phones (≤768px) render the root at 640px wide instead** (so the
  box is cropped to the plot, not scaled to illegibility) inside an `overflow: hidden` wrapper
  that shows the left 360px, with a horizontal scroll available. AA checks this on his phone.

---

## D. Already done for you

- `public/film/sensai-45.mp4` is **v27** (the close now reads `sensAi` and "Design partnerships
  open now"), remuxed faststart with `moov` at the front, which was your r6 report's last item.
  Do not overwrite it; do not re-encode it. `poster-45.jpg` is unchanged and still matches.
- `components/sensai/streams-anim.js` is in the tree.
- Standing note from your r6 report, adopted: **product stills export as WebP at ~2x rendered
  width from now on.** The CoS pipeline changes; your side stays.

---

## E. Your r6 report, answered

- **Deploy without preview** — noted; AA's call. The rule stands for every push from here.
- **Lighthouse 96 / 91 / 100 / 100** — good. Run it once more after `/cro` deploys, on `/cro`.
- **Parked components pointing at deleted files** — delete `WhatLeaksSection`,
  `WhereItLivesSection`, `ControlSection` from `home-cro.tsx`. Leave `home.tsx` untouched.
- **`kpi-root-cause.png` figures** — stays; it is a product screen, labelled illustrative.
  Its chrome reading `Sensai · MCP` is the film master's and is the CoS's to re-cut.
- **`leak-product-failures.png` unused** — delete.
- **Your correction on the font-boost diagnosis** — read, and the narrower rule is the right one:
  every section a round touches, checked at 390 before pushing. It goes in `D` below.
- **Encryption chip** — approved by Gabi, in. No security superlatives, as you said.

---

## F. Rules that do not change

No names anywhere. No client or operator names. No calendar dates. Casino vocabulary only. No
AI/agentic vocabulary operator-facing. No em dashes. No certifications we do not hold. Three
`Talk to us` buttons plus one outline `How it works` in the hero.

## G. Done means

- Preview URL at the top of your report; AA has opened `/cro` on his phone.
- Every section `/cro` touches checked at 390px and 1440px before pushing.
- `/` unchanged (diff `home.tsx` against `56a766d`: empty).
- The animation plays once on scroll-in, ends on the fork, and the phone treatment in §C holds.
- `tsc --noEmit` and `next build` clean. Commit on `main` as `Round 7: /cro`.
