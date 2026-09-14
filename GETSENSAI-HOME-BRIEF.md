# getsensai.co — Home Page Brief (Round 3: rebase on /sense)

**Read this whole file before touching anything.** This round changes the base of the page, so start here rather than from your round-2 state.

Copy authority: `../../sales/sensai-offer-source-of-truth.md` (v5.3). Where this brief and that document disagree, the document wins.

---

## 0. Why we're rebasing, and what happens to round 1–2

Your round-1/2 page is correct on copy and builds clean — none of that work is thrown away, the copy moves across. But it was written from scratch, and in doing so it lost the thing `/sense` does best: it **shows the product**. A visitor who doesn't press play on the film sees text and one diagram, and never sees a Sensai screen. `/sense` has six real product frames running down the page, in the getmodus-aligned look AA approved.

AA's decision: **`/sense` is the base.** getsensai.co becomes `/sense`, aligned to the current messages, with the film added, the product stills refreshed, and the weak sections removed.

`/sense` itself must keep working exactly as it is — links to it are already in people's inboxes.

### How to set that up

1. Overwrite `components/sensai/home.tsx` with a **copy of `components/sensai/one-pager-v2.tsx`**, renaming the exported component to `SensaiHome` (so `app/page.tsx` needs no change).
2. `/sense` keeps rendering `one-pager-v2.tsx`, untouched. **Do not** refactor the two into shared components — they will diverge, and a shared edit that breaks `/sense` is worse than duplicated code. The exports you added to `one-pager-v2.tsx` in round 1 (`HeroResolutionField`, `IntegrationDiagram`, `Logo`, `useInView`, `useReducedMotion`) can stay or be dropped; nothing else should import them once the copy exists.
3. Salvage from your round-1/2 `home.tsx` — it is in git at commit `0a3b0d3`: the **`Film` component** (including your src-per-cut improvement, which is good and must survive), the leak copy, the MCP line and the trust chips.
4. Keep `home.css`; extend it for the new page rather than replacing it.

---

## 1. The page, section by section

Render exactly this list, in this order. Everything else that exists in the file stays defined but **unrendered** — do not delete the functions, we may want them back.

| # | Component | What to do |
|---|---|---|
| 1 | `VisitTracking` | `page="home"` |
| 2 | `Nav` | Keep. Add the **Book a walkthrough** button on the right (from round 1) — `/sense`'s nav has only the logo. |
| 3 | `Hero` | Rewrite copy — §2 below. Keep `HeroResolutionField` + scrim. |
| 4 | **`Film`** | **New, directly under the hero**, still inside the ink band. §3 below. |
| 5 | `ProblemSection` | Keep the headline; strip the body — §4. |
| 6 | `ValueSection` → rename `LeaksSection` | The six leaks, on the existing product artifacts — §5. **This is the main work of this round.** |
| 7 | `IntegrationSection` | Keep, `id="how-it-works"`. Three edits — §6. |
| 8 | `PartnershipSection` | Keep, copy aligned — §7. |
| 9 | `Founders` | Currently parked. **Enable it**, with corrected wording — §8. |
| 10 | `Footer` | Keep. Tagline line becomes *Finds the leaks in your customer base. You keep the revenue.* |

**Not rendered** (with the reason, so nobody re-adds them by accident):

- `TurnSection` — "Your base, now in high resolution" — a transition we no longer need.
- `RoleSection` — "A digital customer manager for every player" — **§10 bans that descriptor outright.**
- `AskSensAi` — the animated chat demo. The film shows the chat now; two demos of the same thing is the "too much to look at" note Gabi and AA both made. It is also the heaviest JS on the page.
- `CTA` — "Quick customer base scan · See where the revenue leaks. In 48 hours." **This breaks §8's print rule** (no findings claims, no magnet language for the scan). The scan survives as one quiet sentence in §7 below.
- `SocialProof`, `Walkthrough`, `Why`, `ApproachSection`, `HowItWorks` — already parked; leave parked.

Result: **six sections plus nav and footer.** Phone-first, short, and the product is visible without pressing anything.

---

## 2. Hero

- Eyebrow: `FOR GAMING OPERATORS · THE TEAMS THAT OWN CUSTOMER REVENUE`
- H1, as **two blocks with an explicit break** — it currently strands "You" at the end of a line on desktop and gives five lines on a phone:

  > **Sensai finds *the leaks* in your customer base.**
  > **You keep the revenue.**

  Accent colour (`#8fa8e0`) on *the leaks* only.
- One paragraph, and only one:

  > Every customer watched, every change caught, every finding pushed into the systems your teams already use.

  The longer "Even the best operators leak revenue they've already paid for…" paragraph **moves down** to open the leaks section (§5) — it is a good paragraph in the wrong place.
- Buttons: **Book a walkthrough** → `/book` · **How it works** → scrolls to `#how-it-works`.
- Under the buttons, one small muted line (12.5px, `#7d89a8`):

  > Live in production with a tier-1 operator · ~2.5M accounts

  This is the only proof claim on the page this round. No percentages, no case numbers, no client name.

---

## 3. The film

Directly under the hero, max-width ~1080, centred, inside the ink band.

- Desktop: `/film/sensai-product-story.mp4`, poster `/film/poster-wide.jpg`, 16:9.
- Phone (≤768px): `/film/sensai-45.mp4`, poster `/film/poster-45.jpg`, 4:5.
- Click to play; no autoplay; `playsInline`; `preload="metadata"`; native controls once playing; only the cut actually shown gets a `src` (your round-1 improvement).
- Caption under it, small and muted: *The product, shown inside the assistant your team already uses. Values transformed, accounts masked.* — **do not name the assistant in the caption.**

**The films currently in `public/film/` are stale** — `sensai-45.mp4` is an old cut with different copy and placeholder music, and the long film has the same placeholder bed. AA will drop the finals in with the **same filenames**. When he does: re-cut both posters from the new files (`poster-45.jpg` from the 4:5 at 810 wide, `poster-wide.jpg` from the long film at 1600 wide, JPEG q≈3, pick a frame showing the network graph) and commit. **Never ship a placeholder-music version deliberately** — if the finals aren't in yet, deploy with what's there and swap in a follow-up commit.

---

## 4. Problem section

Keep the existing headline — it is exactly on-message:

> **Nobody can watch a million players. So the revenue leaks.**

Remove the three failure-mode blocks (`MarkShallow` / `MarkDrifting` / `MarkUntrusted` and their copy). That is internal vocabulary, it is abstract, and it is three more paragraphs on a page we are shortening.

In their place, one short quote, styled as `/sense` styles quotes — attributed to *what we hear from the people who own the revenue line*, **never to a named person or operator**:

> *"Every angle of the customer sits with a different team. Fraud doesn't cover bonus abuse, so I lose money to abusers. VIPs go quietly. Payments fixed the deposit error — but who's acting on the customers it hit?"*

Nothing else in this section.

---

## 5. The leaks (the old ValueSection) — the main work

Keep the section's structure, grid, `ProductFrame` system, `OutChip`s, `ReasonLine`s and the `ILLUSTRATIVE · SYNTHETIC DATA` marker. **That marker stays — it is an honesty requirement, not decoration.**

- Eyebrow: `THE LEAKS WE STOP`
- Title: **Retention is the outcome. These are the leaks that drain it.**
- Lede — the paragraph moved down from the hero:

  > Even the best operators leak revenue they've already paid for — to bonuses taken by fraud rings and wasted on players who didn't need them, to VIPs who quietly churn without anyone reading their signals, to customers who drop after a failed deposit that nobody picked up.

Then six tiles. **The artifacts already exist** — you are re-labelling them and swapping two, not building new ones:

| # | Title (exact) | One line under it | Artifact |
|---|---|---|---|
| 01 | **Fraud rings take your bonuses** | Rings, syndicates, multi-accounting — taking promotional money consistently, from a budget that runs 10–20% of your revenue. | Keep the existing *Referral network* frame (`RafBurst`). |
| 02 | **VIPs quietly churn** | The signals are in the play, weeks before the revenue moves — caught while there is still someone to keep. | Keep the existing *Account health · churn curve* frame. |
| 03 | **Valuable players identified too late** | Tomorrow's VIPs, flagged in their first weeks, while nurturing still changes the outcome. | Keep the existing *FTD cohort · projected NGR* frame. |
| 04 | **Customers drop after product failures** | A failed deposit, a payment error, a disconnection. The error gets fixed; the customers it hit don't get actioned. | **New:** `/screenshots/film/leak-product-failures.png` (the deposits-by-hour chart, the night-time gap in red). Present it inside a `ProductFrame` titled `Deposits · yesterday vs expected` so it matches its neighbours. |
| 05 | **Wrong offers to the wrong players** | Over-bonused players who would have played anyway, under-bonused players who were worth keeping — the same budget, leaking both ways. | Keep the existing *Deposit → bonus ladder* frame (currently tile 06). |
| 06 | **Accounts closed or restricted without you knowing** | Over-closure — fraud shutting too many accounts, or adding too much friction — lands on your revenue line, not theirs. | No artifact. Text-only card; let it sit as the quiet last tile. |

The two tiles that come out of this grid: *Responsible gaming* and *Game recommendations*. RG stays out of this page deliberately — on a landing page it invites "is this a compliance product?", which §9 says we are not. Neither capability is being dropped from the business, only from this grid.

`OutChip`s stay where they exist and stay accurate (→ Risk queue with the evidence, → CRM retention journey, → promo planning · CRM, and for 04: **→ CRM: declined deposits, for reach-out**).

---

## 6. How it works (IntegrationSection, `id="how-it-works"`)

Keep the section, the diagram, and the trust chips. Three edits:

1. **Delete the line "Scan in 48 hours. Live in 4 weeks."** (the 22px blue line). §8 forbids magnet language for the scan. Replace with, in the same slot and style: **Live within weeks.**
2. **The diagram** (`IntegrationDiagram`): outputs become `CRM · Case manager · Risk tools · BI · Other` — **drop "Compliance"**, which pulls the reader toward the risk pocket we deliberately don't sell into. Node caption: `WATCHING EVERY CUSTOMER`.
3. **Add, centred under the diagram** (13px, muted), then the chip row beneath it:

   > Works inside the assistant your team already uses — Claude, ChatGPT — through a standard connector (MCP).

   Chips: `Read-only access` · `Pseudonymised data` · `No PII`.

Optionally, if the section looks thin on a phone after the deletions, place `/screenshots/film/where-it-went.png` (one finding fanning out to CRM, watchlist, risk ticket) under the chips at modest width. Your call; don't force it.

---

## 7. Design partnership

Title: **Design partnerships — a small number, open now.**

Body (from §8):

> Read access, scripts approved by you, live within weeks. The first leak lands in your CRM with the accounts — and a measure you own. Partners work directly with the founders, shape what gets built next, and lock early terms.

Buttons: **Apply for a partnership** → `/apply` · **Book a walkthrough** → `/book`.

Then, at the very bottom of the section, one quiet muted sentence — no headline, no button, no figures:

> Need to see it on your own data first? One extract, 48 hours, no integration — a read of your base, less tuned than a live deployment, and we say so. Ask for it on the call.

**No year anywhere.** "Design partnerships open for 2026/2027" is retired: a date on a page ages while the page keeps circulating, and §10 bars calendar dates.

---

## 8. Who's building this (enable `Founders`)

The round-2 wording said "built by people who ran these teams", which is wrong for Gabi — he is engineering, not CRM. Corrected:

- Eyebrow: `WHO'S BUILDING THIS`
- Title: **Built on years inside the industry.**
- Lede: *Years on the operator side — the CRM playbooks, the abuse patterns, the churn signals — and the engineering to run it at scale.*
- Cards:
  - **Amit Assa · CEO** — 17 years in customer value management across iGaming and digital platforms.
  - **Gabi Dvir · Co-founder** — 20+ years in tech leadership. Ex-VP DevOps at 888 and Fiverr.

---

## 9. Assets provided

Four stills exported from the film master at high resolution, in `public/screenshots/film/`:

| File | What it is | Where it goes |
|---|---|---|
| `leak-product-failures.png` | Deposits by hour, the 01:00–04:00 gap in red, −$310K | Leak 04 (§5) |
| `leak-fraud-rings.png` | The referral-network graph around one hub | Spare — only if the `RafBurst` frame ever needs replacing |
| `where-it-went.png` | One finding → CRM exclusion list, watchlist, risk ticket | Optional, §6 |
| `account-tiles.png` | One account's KPI tiles (deposited, staked, balance, wagering ratio) | Spare |

All are synthetic/transformed values with masked account IDs, same as the film — safe to publish. The old `public/screenshots/*.png` files are an earlier build of the product; **do not put them on this page.**

---

## 10. Look and feel — this is now literal

Round 2 said "keep the /sense look". Now the page *is* /sense, so the rule is simpler: **don't restyle anything.** Same palette, same `ProductFrame` system, same eyebrows, same card rule and radius, same Space Grotesk, same spacing rhythm. No new component styles, colours, gradients, icon sets or fonts. Nothing purple, nothing neon, no glassmorphism.

**Mobile is the primary device.** Test at 390 and 360 wide on a real phone, not only DevTools. Every product frame must stay legible — scroll a frame sideways in its own container rather than shrinking it to unreadable. No horizontal scroll on the page body at any width.

---

## 11. Rules that are not negotiable (source-of-truth §10)

If any request conflicts with one of these, stop and ask AA.

**Never on the page:** *AI, agent, agentic, autonomous* operator-facing (the claim is carried by *models · context · adapt · keeps learning your business*) · *daily / every day / every morning* · any client name, operator name or calendar date · *your analyst* (always *your team*) · *fraud* as a headline or *risk* as the positioning (*fraud rings* naming the perpetrator inside a leak line is fine) · *purchase, redeem, bankroll, entertainment* · *customer value manager / CVM / digital customer manager* as a descriptor · *onboarding* for any unsigned operator, and nothing at all about a second operator · money figures as impact claims · deposit-amount triggers as VIP/churn examples (behaviour and preference signals only) · *"X don't need more data, they need Y"* or *understanding* as a headline payoff · anything implying the product messages players or runs campaigns itself · a cookie banner · **"finds and stops"** (retired) · **"your revenue is leaking"** as a hook · **"managed loosely"** (say *unwatched*) · **"helps you"** · **"maximise your revenues"** · **"bonus optimisation"** (§9: we are not an offer-optimisation engine — "bonus allocation" is our version) · **"wisdom of the crowd" / patterns shared across clients**.

**Always:** *Your team stays in control* and *It doesn't talk to your players — it works through your teams' systems*, in those words · the scan last, quiet, no claims · the `ILLUSTRATIVE · SYNTHETIC DATA` marker on the product frames · brand in running copy is *Sensai* (the `Logo` wordmark renders *sensAi* — leave it) · palette and type from `/sense`.

---

## 12. What to do, in order

1. Delete `.git/index.lock` if it is back.
2. Make the copy (§0), render the section list (§1), apply §§2–8.
3. Drop the four stills into `public/screenshots/film/`.
4. `tsc --noEmit` clean, then `pnpm build` (or `npm run build`) clean.
5. Verify on a desktop browser **and a real phone**: H1 breaks as two blocks; the right film per device and no `src` on the other; posters show before play; no autoplay; the six leak tiles and their frames are legible at 390; the integration diagram is legible (sideways scroll, not shrunk); every grid stacks; **Book a walkthrough** → `/book`, **Apply** → `/apply`, **How it works** → `#how-it-works`; analytics fire (`visit` with `page: "home"`, `cta_click`, `film_play`); OG preview shows title, description and `/film/poster-wide.jpg`; Lighthouse performance not below `/sense`.
6. **Push** — your three round-2 commits are still unpushed, so nothing has deployed yet. Push them with this round's work, confirm the Vercel preview is green, and walk step 5 on the preview URL.
7. Vercel project (the one serving `www.novacvm.net`) → Settings → Domains → add `getsensai.co` and `www.getsensai.co`, `www` primary, apex redirects. **Put the DNS records Vercel gives you into your report — AA sets them at the registrar.** Don't wait on them. Note for AA: the registrar currently serves a placeholder page ("Empower Your Business with AI"); if a site-builder is switched on there it must be switched off, not just overridden.
8. `robots.txt` allows `/`; `/sense` keeps its own `noindex`. Leave both.
9. Report in one message: preview/production URL, Lighthouse numbers, devices checked, anything in step 5 that failed, the DNS records, and any copy you changed beyond this brief (there should be none).

---

## 13. Requests you may get later

- **"Change a line of copy."** Source-of-truth first, then the page. Never the reverse.
- **"Add a logo / client name / case study."** No, until AA confirms the operator cleared it in writing.
- **"Bring back the proof numbers."** Only with benchmarks AA supplies; the old 58% / "their automation" tiles were cut for needing explanation.
- **"Put the scan higher."** No. §8.
- **"Re-add the chat demo."** Ask AA — it is parked deliberately, not lost.
- **"Swap the film."** §3.
- **"Make it faster."** Compress the films first (wide ≤ 12MB at 1080p, tall ≤ 6MB).

---

## 14. Voice, for anything you must write yourself

Short sentences. Buyer's words. Outcome before mechanism. No exclamation marks, no superlatives, no "leverage". No sentence-ending periods in card titles. If a sentence could sit on a competitor's page, cut it. When unsure, take the nearest sentence from the source-of-truth verbatim.
