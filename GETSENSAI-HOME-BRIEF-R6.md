# getsensai.co — Round 6

**Target:** `components/sensai/home.tsx`, `home.css`, `app/layout.tsx`, `app/book`, `app/apply`,
`middleware.ts`. Never touch `one-pager-v2.tsx` or `/sense`.
**Base:** the live round-5 page (`6fcb6e0`). Every item here is a contained change; nothing needs
the page rebuilt.

Your post-R5 remarks were read in full. §A below answers each one. §B is AA's round of changes
after reviewing the live page. §C is the assets already in place for you. §D is done-means.

---

## A. Your remarks, answered

**§1 The two required sentences.** Your option 1: **render every row's one-liner always; only
the screen toggles.** Row 5's one-liner carries both sentences verbatim (see B7). That closes the
§10 gap and makes the rows scannable, which is half of what was wrong with the section.

**§2 Your decisions:**
- Nav CTA gone → **reversed.** The nav gets one button again, `Talk to us` (B12). Round 5's
  "exactly three" was a count of the page's buttons, not an instruction to remove the nav's.
- `/book` headline → **replaced**, not ratified: the one-liner has moved on (B3). See B14.
- Founder cards → **superseded.** No names (AA's rule, standing), and now no cards either (B11).
- Share card → **ratified, regenerate** with the new H1 and the mark (B13).
- `leak-fraud-rings-graph.png` → **ratified.** Delete the original.
- Fullscreen on play → **ratified.** Stays; AA verifies on his phone under the new rule (D).

**§3 Unruled:**
- Diagram caption → fix: `THE CUSTOMER BASE · EVERY DOT A CUSTOMER`. One vocabulary.
- `proposed-rule.png` figures → **moot**: the screen is replaced by `control-approve.png` (B7).
- `WIDE_CUT_READY` → leave as is. The two-column hero made it a non-issue.
- `/book` and `/apply` copy → B14.

**§4 Dead weight → yes, clear it.** Delete from `public/`: `film/sensai-product-story.mp4`,
`film/poster-wide.jpg` (if nothing references it after B13), `screenshots/film/leak-fraud-rings.png`,
`revenue-two-futures.png`, `account-tiles.png`, `chat-surface.png`, `proposed-rule.png`. Compress
every remaining still to ≤300 KB (pngquant or oxipng; no visible loss). The 11 MB film stays: it
loads `preload="metadata"` behind a poster. Run Lighthouse mobile on production once after deploy
and put the four scores in your remarks.

**§5 Real-device checking → standing rule from now on:** every push goes to a Vercel preview URL
first; AA opens it on his phone; only then does it merge to main. Put the preview URL at the top
of your remarks. No Xcode.

---

## B. The round

### B1. The wordmark is `sensAi`. Everywhere. With the mark.

AA's decision, made once: **`sensAi`** (the /sense treatment: `sens` + a larger `A` + `i`,
restore that `Logo` markup). It replaces "Sensai" in the nav, the footer, the diagram node, the
`<title>` and the share card. Beside the wordmark in the nav, **the /sense mascot**
(`sensai-mascot.png`, the colour one), exactly as `/sense` renders it but at **40px**, not 56: the
nav on this page is quieter than /sense's. Wordmark to its right, 10px gap. Footer: wordmark only.
The mascot appears once on the page, in the nav, and on the share card (B13); nowhere else.
(`public/sensai-mark.png`, the blue figure, is in the repo as an alternative; not used this round.)

The film's end card still says "Sensai"; that is the Chief-of-Staff chat's re-render, not yours.

### B2. The dots come back, quieter

Re-enable `HeroResolutionField` behind the hero with its entrance animation, **dots only, no
blurred blocks**, at 60% of its /sense opacity, with the scrim kept. The film card must sit
cleanly on top of it (z-order, and the card keeps its own solid background).

### B3. Hero copy

- Eyebrow: `FOR GAMING OPERATORS`
- **H1:** `sensAi stops the revenue leaks, so you can focus on growth.` Two lines at 52px, break
  after `leaks,`. `revenue leaks` in the accent blue. ("in your customer base" is gone; the line
  under it carries that meaning.)
- Under it, one line, 16px: `Bonus abuse. Silent VIP churn. Customers lost to product failures.`
- **One button:** `Talk to us` (white). `How it works` is deleted; scrolling does that.
- **Delete the caption under the film** ("The product, shown inside the assistant…"). Nothing
  under the video.
- `app/layout.tsx`: `TITLE` = `sensAi · stops the revenue leaks, so you can focus on growth`;
  `DESC` = `Bonus abuse, silent VIP churn, customers lost to product failures. sensAi finds them
  and actions them through the systems your teams already run.`

### B4. Poster

`public/film/poster-45.jpg` is already replaced: the ring graph alone on ink, no headline text.
Nothing to do but not overwrite it.

### B5. Problem: unchanged

Carousel stays as built. AA may swap quotes later; the `{ text, role }` list is the interface.

### B6. The leaks we stop: add a mark to each cell

Six small line marks, one per cell, above the title. Same drawing language as the /sense problem
marks (`MarkShallow` / `MarkDrifting` / `MarkUntrusted`): 24px, 1.5px stroke, accent blue,
monochrome, no fill. Draw them as inline SVG components. Meaning per cell:

| Cell | Mark |
|---|---|
| Fraud rings take your bonuses | a hub with spokes to small nodes |
| VIPs quietly churn | a line that flattens and fades, dotted at the end |
| Valuable players identified too late | a small seed/star with a rising line |
| Customers drop after product failures | a bar chart with one broken bar |
| Wrong offers to the wrong players | a gift/ticket with a small cross |
| Accounts closed or restricted without you knowing | a padlock with a question mark |

Nothing else in the grid changes.

### B7. What it does: rebuilt, five rows, screens raw

This is the section AA called dull, and the cause is chrome: a screenshot that already has app
chrome inside, wrapped in a `ProductFrame` with its own title bar, six times, same shape.

- **Five rows** (table below). **Every row's one-liner always rendered** (A §1); only the screen
  toggles. Row 1 open on load.
- **Screens shown raw.** No `ArtifactCard`, no `ProductFrame`, no `ReasonLine`, no `OutChip`.
  The image, `border-radius: 12px`, a 1px `SENS.rule` border, a soft shadow, and **one mono
  caption line under it** (11px, uppercase, muted). Same two-column pattern as now: rows left,
  screen sticky right, inline under the row on phones.
- Keep `ILLUSTRATIVE · SYNTHETIC DATA` top-right of the section.
- **Under the rows, a chip row** (the film's capability card, already approved copy), quiet,
  wrapping, 12.5px, `SENS.rule` border, no fill:
  `Bonus abuse prevention · Account linkage · VIP identification · Churn signals · Behavioural
  triggers · Bonus allocation · Funnel analysis · Root-cause analysis · Business KPI monitoring`.

| # | Row title | One-liner (always visible) | Screen | Caption |
|---|---|---|---|---|
| 1 | Fraud rings and bonus abuse | Linked accounts, shared payment fingerprints, one root inviter. The ring, ranked by net loss, with the evidence attached. | `leak-fraud-rings-graph.png` | REFERRAL NETWORK · RANKED BY NET LOSS |
| 2 | Daily KPI monitoring, with the root cause | Every morning against expected. When a number moves, the reason, the accounts behind it, and where each one went. | `kpi-root-cause.png` | DEPOSITS · YESTERDAY VS EXPECTED · THE CAUSE, THE CUSTOMERS, THE ACTIONS |
| 3 | In the chat your team already uses | Claude or ChatGPT, through a standard connector (MCP). Ask in plain language; get the accounts, the reason and the action. | `chat-only.png` | sensAi, IN THE CHAT · NO NEW TOOL |
| 4 | Actions through the systems you already run | Cases, lists, triggers, enriched profiles. Into your CRM, case manager and risk tools. | `where-it-went.png` | ONE FINDING · FOUR ACTIONS · THREE SYSTEMS |
| 5 | Your team stays in control | Nothing is armed without your confirmation. What you confirm becomes a proposed rule, for your CRM team to approve. It never contacts a player. | `control-approve.png` | PROPOSED RULE · SENT FOR APPROVAL · APPROVED AT 13:40 |

Row 5's one-liner is where §10's two sentences live, and it now renders in the served HTML on
load. Do not paraphrase it.

### B8. Integration

- `Live within weeks.` → **`Live within 4 weeks.`** (AA + Gabi.)
- Diagram node reads `sensAi`; caption `THE CUSTOMER BASE · EVERY DOT A CUSTOMER`.
- Otherwise unchanged.

### B9. Design partnership

- Headline: **`Design partnerships open now.`**
- Paragraph: `Work directly with the founders. Tailor it to your operation, and shape what gets
  built next. Read access, scripts approved by you, live within 4 weeks.`
- **No button in this section** (the closing band right after has it).
- The scan sentence stays, last and quiet, as now.

### B10. Closing band replaces Founders

Delete the Founders section (cards, eyebrow, headline). In its place, one short band on `SENS.bg`:

- One line, 17px: `Built by a team from analytics, CRM and customer value management, and
  engineering, with years inside gaming operators.` **No names, no employers, no years-count.**
- Then, 30px: `Want to hear how we can find and stop your leaks?`
- Then the button: `Talk to us`.

### B11. Founder names: standing rule

No founder names anywhere on the site, `/book` and `/apply` included. Not in copy, not in
metadata, not in the share card. AA's reason is operational and it stands until he lifts it.

### B12. One CTA label on the whole site: `Talk to us`

Three buttons on the home page: nav, hero, closing band. All three read `Talk to us` and all go
to `/book`. `Book a walkthrough`, `Apply for a partnership` and `How it works` are gone.

### B13. Share card

Regenerate the 1200×630 card: the mascot, the `sensAi` wordmark, the new H1, the three-noun line.
Same hero treatment you used. Point `og:image` and `twitter:image` at it.

### B14. `/book` and `/apply`

- `/book` headline: **`Talk to us.`** Sub: `Tell us a little about your operation. You'll hear
  back from one of the founders.` Form unchanged.
- `/apply` → **308 redirect to `/book`** in `middleware.ts`. Keep the file; nothing links to it.
- Both pages: `sensAi` wordmark, the `Talk to us` label wherever a button says anything else.

### B15. Dashes

Whatever em dashes remain, in rendered sections or not: comma, full stop, or spaced hyphen.
`10–20%` stays.

---

## C. Already in place (do not overwrite)

| File | What it is |
|---|---|
| `public/sensai-mark.png` | the blue mark, transparent, unused this round |
| `public/film/poster-45.jpg` | the text-free poster |
| `public/screenshots/film/kpi-root-cause.png` | row 2 |
| `public/screenshots/film/chat-only.png` | row 3 |
| `public/screenshots/film/control-approve.png` | row 5 |
| `public/screenshots/film/leak-fraud-rings-graph.png` | row 1 (yours) |
| `public/screenshots/film/where-it-went.png` | row 4 |
| `public/film/sensai-45.mp4` | v26, the cut in use |

---

## D. Done means

- Preview URL at the top of your remarks; **AA has opened it on his phone before merge.**
- `sensAi` + the colour mascot in the nav at 40px; no "Sensai" wordmark anywhere on the home page.
- Both §10 sentences present in the served HTML of `/` on load (curl it and grep).
- Three buttons, all `Talk to us`.
- Five rows, five raw screens, one-liners always visible, chip row under.
- No founder names in HTML or metadata.
- Unused assets deleted; stills ≤300 KB; Lighthouse mobile scores in your remarks.
- `tsc --noEmit` and `next build` clean. Commit on `repositioning` as `Round 6`, push, preview.
