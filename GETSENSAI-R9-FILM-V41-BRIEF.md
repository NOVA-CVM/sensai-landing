# getsensai.co — Round 9: film v41, the leaks re-set, VIP retired, SensAi in prose, /chat and /legacy retired

**To:** Claude Code (sensai-landing) · **From:** the film v2 chat (Cowork), on AA's decisions of 1–2 Oct · **Date:** 2026-10-02
**Domain:** www.getsensai.co only (repo `NOVA-CVM/sensai-landing`). **Do not touch novacvm.com.**
**Deploy:** a push to `main` is a deploy — **only on AA's explicit word.** One branch for this round, e.g. `r9-film-v41`; ask AA before opening and before merging (GIT-GUIDELINES).

Your status note of 2 Oct (`../site-status-for-cos-2026-10-02.md`) was read in full; your open items 1, 3, 4 and 5 are answered below, the rest stay as they are.

---

## 1. Film v41 and its poster (asset swap, keep the file names)

Source folder: `sensai-workspace/marketing/film/site-v41/`

| From | To | Notes |
|---|---|---|
| `sensai-45.mp4` | `public/film/sensai-45.mp4` | v41 · 59.70 s · 1080×1350 · 11.8 MB · faststart already (moov before mdat) · frame 0 = poster |
| `poster-45.jpg` | `public/film/poster-45.jpg` | frame 0 of v41 |
| `poster-45.webp` | `public/film/poster-45.webp` | same frame |

- Replaces v33 (55.8 s). New in v41: three cases (fraud rings · silent churn of Level 5 players · product failures), animated panels, card 2 now reads "SensAi finds these leaks / and you keep the revenue", promise line 3 "Every finding acted on", poster footer "59 seconds on how sensAi finds the leaks." (that one footer still reads sensAi — known, AA may change it in a later render; not your concern).
- **Your open item 3 (the 0.2 s dip at 2.6–2.8 s):** intended — it is the poster fading into card 2. No action.
- Verify as before: plays from the poster with no fade-from-black, faststart, poster = frame 0, the film's own audio, no layout shift. If any copy on the page states the film length, it is now **59 seconds**.

## 2. The "What it does" deposits still

`sensai-workspace/marketing/film/site-v41/kpi-root-cause.webp` → `public/screenshots/film/kpi-root-cause.webp` (same name; 1310×1064, was 1310×1069).
The live still is v1's (−$430K, "790 VIPs", "$295K"). The new one is the v41 panel: −$158K · 2,900 customers · $145K attempted · "Level 4–5" · "What it found". Alt text and caption stay.

## 3. Copy changes on `/` (exact strings, `components/sensai/home.tsx` unless stated)

**3a. VIP retired from our own voice** (AA, 1 Oct: regulatory exposure + the page must read for non-gaming buyers too).

| Where | Now | Change to |
|---|---|---|
| Hero sub-line (~L573) | `Bonus abuse. Silent VIP churn. Customers lost to product failures.` | `Bonus abuse. Silent churn. Customers lost to product failures.` |
| `OutcomesStrip` (~L2527) | `VIPs kept before they’re gone.` | `Churn caught while there’s still time.` |
| `CAPABILITIES` (~L1274) | live: `VIP identification` · uncommitted local edit: `Customer value signals` | **`Early value signals`** (matches the film's capability card). This answers your open item 1 — the uncommitted edit was ours in spirit; ship this wording instead. |
| `app/layout.tsx` DESC | `Bonus abuse, silent VIP churn, customers lost to product failures. sensAi finds them and actions them through the systems your teams already run.` | `Bonus abuse, silent churn, customers lost to product failures. SensAi finds them and actions them through the systems your teams already run.` |

**Keep unchanged:** the "Sound familiar?" quote `My VIP team finds out a player has gone…` and its role `VIP Director, casino operator` — it is a buyer speaking in his own words, not our claim (AA).

**3b. The six leaks (`LEAKS`, ~L1164) — tile 3 replaced, tile 2 retitled.** Grid stays 3×2.

| # | Mark | Title | Sub-line |
|---|---|---|---|
| 1 | MarkRings | Fraud rings take your bonuses | *(unchanged)* |
| 2 | MarkChurn | **Your best customers leave unnoticed** | *(unchanged)* The signals are in the play weeks before the revenue moves. |
| 3 | **new mark** (see below) | **New customers slip away before their first deposit** | **Sign-ups that stall at one step, on one device or one payment method. The total looks steady, so nobody sees it.** |
| 4 | MarkFailure | Customers drop after product failures | *(unchanged)* |
| 5 | MarkOffer | Wrong offers to the wrong players | *(unchanged)* |
| 6 | MarkClosed | Accounts closed or restricted without you knowing | *(unchanged)* |

- Tile 3 removes **"Valuable players identified too late" / "Tomorrow's VIPs…"** entirely (AA: "high-value player" nurturing is the exact practice regulators scrutinise). `MarkEarlyValue` becomes unused — delete it or leave it, your call.
- **New mark for tile 3:** a funnel in the same 24px line style as the other marks (stroke weight, colour, one accent dot): three narrowing horizontal strokes, the accent dot falling out of the side of the middle one. If it doesn't hold up next to the others at 24px, reuse `MarkFailure`'s construction rather than inventing a new style, and say so in the report.
- "Best customers" now appears **once** on the page, in tile 2 (it is the film's line). Don't add it anywhere else.

**3c. SensAi in prose** (AA, 2 Oct: lowercase-s "sensAi" is hard on the eye and pulls attention as an unusual spelling).

- Every **rendered prose, caption, alt text and metadata** occurrence of `sensAi` on `/` and in `app/layout.tsx` → `SensAi`. Known ones: hero H1 (`SensAi stops the revenue leaks, so you can focus on growth.`), the Learn tile (`SensAi finds new ones and proposes them…`), the "What it does" row 03 alt + caption (`SensAi answering…`, `SensAi, in the chat · no new tool`), `TITLE` and `DESC` in `app/layout.tsx`, and any other rendered prose your grep finds. Code comments and the unrendered sections: leave.
- **Unchanged:** the logo/wordmark treatment (nav mark, its alt, any image), and the legal name `Sensai Technologies, Inc.` in the footer and `/privacy`.
- `/sense`, `/book`, `/privacy`: apply the same prose rule there too if they contain "sensAi" in prose; list what you changed.

## 4. Retire `/chat` (AA: it must not be live anywhere)

Today getsensai.co/chat is a working chat page backed by `/api/chat` (paid API key), and novacvm.net/chat forwards to it.
- Delete `app/chat/`, `app/api/chat/`, `components/sensai/chat-page.tsx`, `components/sensai/chat-widget.tsx` (confirm nothing else imports them — our grep found nothing).
- Remove `/chat` from `KNOWN_ROUTES` in `middleware.ts` and the `Disallow: /chat` line from `public/robots.txt`.
- `/chat` → **308 → `/`**. `/api/chat` → 404 (or 410) — it must not execute anything.
- After deploy, verify on production: getsensai.co/chat → 308 → `/`; getsensai.co/api/chat (GET and POST) → 404/410; novacvm.net/chat → ends on getsensai.co `/`.
- **For AA, in your report:** the name of the env var holding the key, so he can delete/rotate it in Vercel (removing the code does not revoke the key).

## 5. Retire `/legacy`

- Delete `app/legacy/` and `components/sensai/one-pager.tsx` if nothing else imports it (only `app/legacy/page.tsx` does today). Update the comment at `middleware.ts:13`.
- `/legacy` → **308 → `/`**.

## 6. Rules for this round (supersede the old copy-rule list where they differ)

- **SensAi in prose** (replaces "sensAi in prose"). Logo unchanged.
- **Money figures:** as few as possible on the site; where a product still shows them, they are the film's invented figures and must match the film exactly (AA, 2 Oct). No real figures, no figures in body copy (the "10–20% of your revenue" share stays).
- **VIP** never in our own voice; allowed only inside a quoted buyer line.
- Unchanged: no cadence words (every day, daily, yesterday…) in body copy · no AI / ML / models / agents vocabulary · no client names · no certifications we don't hold.

## 7. Verify and report

- `next build` clean; Lighthouse mobile on `/` not worse than 94 / 92 / 100 / 100.
- Browser pane at a **true 390 and 360 px**: hero sub-line, the six leak tiles (tile 3 wraps cleanly; the new mark is aligned with the other five), outcomes strip, capability chips.
- Grep the **served HTML** of `/` for: `VIP` (only the quote), `sensAi` (none in prose), `Valuable players`, `Tomorrow` (none), `Customer value signals` (none).
- Report to `sensai-workspace/marketing/getsensai-home-build-report-2026-10-0X-r9.md` and one breadcrumb line in `Nova/_INDEX.md`. Include the env-var name for §4.
- **Not in this round:** new "What it does" rows (churn / funnel screens) — AA will decide later. Your open items 2 (Learn tile at 390), 6 and 7 stay as they are.
