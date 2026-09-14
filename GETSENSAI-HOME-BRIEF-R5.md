# getsensai.co — Round 5 (final structure)

**Target:** `components/sensai/home.tsx` + `home.css`, the `SensaiHome` export only. Never touch
`one-pager-v2.tsx`. Work on top of the current working tree: the R4 fixes made directly on 14 Sep
(plain "Sensai" wordmark, no mascot, two-column hero, two-column leaks pattern, new poster) are the
base. Do not revert them.

**Already in place, not yours to do:** `public/film/sensai-45.mp4` is now v26 (57.1s), the
current cut. `public/film/poster-45.jpg` matches it.

This round restructures the page. Eight sections, in this order, nothing else rendered:

1. Nav
2. Hero (copy left, film right)
3. Problem: what operators say (3–4 quotes, carousel)
4. The leaks we stop (compact grid, no expanding rows)
5. What it does (expanding rows, product screen beside each)
6. Integration (diagram + chips)
7. Design partnership
8. Founders, then Footer

Removed: the "Every customer generates a revenue stream" band, the standalone "Where it lives"
section, the standalone "It works through your teams' systems" section. Their content moves into
§5. Keep the components defined; just stop rendering them, with a one-line comment saying why.

---

## 1. Hero

Layout stays as it is now: copy left, the 4:5 film right at max 400px, stacked on phones.

- Eyebrow: `FOR GAMING OPERATORS`
- **H1:** `Sensai stops the revenue leaks in your customer base, so you can focus on growth.`
  Highlight `revenue leaks` in the accent blue, the way `the leaks` is highlighted now. 52px
  desktop, three lines; break after "leaks" and after "so you" so no line ends on a preposition.
- Under the H1, one line only, 16px: `Bonus abuse. Silent VIP churn. Customers lost to product
  failures.` It names what "leaks" means.
- **Delete** `Every customer watched. Every change caught. Nothing missed.`
- **Delete the proof line** `Live in production with a tier-1 operator · ~2.5M accounts`, and
  its rule above it. It does not come back anywhere on the page.
- Buttons stay: `Book a walkthrough` (white) + `How it works` (outline). `How it works` scrolls to
  §5, not to the integration diagram — move the `id="how-it-works"` anchor.
- Film caption under the video stays: `The product, shown inside the assistant your team already
  uses. Values transformed, accounts masked.`

Also update `app/layout.tsx`: `TITLE` becomes `Sensai · stops the revenue leaks in your customer
base` and `DESC` becomes `Sensai stops the revenue leaks in your customer base, so you can focus on
growth. Bonus abuse, silent VIP churn, customers lost to product failures: found, actioned through
the systems your teams already run.`

## 2. Problem: what operators say

Headline stays: **`Even the best operators leak revenue they've already paid for.`**
Eyebrow `PROBLEM` goes; the headline carries it.

Under it, a **carousel of four quotes**, one visible at a time on phones, one at a time on desktop
too (a wide single card, 780px, same chrome as the current blockquote). Auto-advance every 6
seconds, pause on hover, dots underneath, swipe on touch. No arrows on phones. Respect
`prefers-reduced-motion` (no auto-advance).

Attribution is **role and operator type only. Never a name, never a company.** These four are
drafts in the voice of what we hear; AA will replace or add. Build the component so a quote is one
object `{ text, role }` and the list is trivially editable.

1. *"Every angle of the customer sits with a different team. Payments fixed the deposit error, but
   who's acting on the customers it hit?"* — Head of CRM, multi-brand operator
2. *"Fraud doesn't cover bonus abuse. So I lose promotional money to rings, and nobody owns it."*
   — Chief Revenue Officer, European operator
3. *"My VIP team finds out a player has gone when the revenue is already gone. The signals were
   there for weeks."* — VIP Director, casino operator
4. *"Thirty dashboards and one question: why did deposits drop yesterday? Nobody answers it before
   the next day drops too."* — CRM Director, sportsbook and casino

The line `WHAT WE HEAR FROM THE PEOPLE WHO OWN THE REVENUE LINE` stays as the section's small
caption, once, above the carousel.

## 3. The leaks we stop

Headline: **`The leaks we stop`**. Keep `ILLUSTRATIVE · SYNTHETIC DATA` off this section; there
are no screens here now.

**No expanding rows.** A plain 3×2 grid on desktop (2×3 at tablet, one column on phones), each
cell a title and one line. No numbers, no chevrons, no images, no button. Thin rules, generous
padding, the six titles in 17px semibold.

| Title | One line |
|---|---|
| Fraud rings take your bonuses | Rings, syndicates and multi-accounting, taking promotional money from a budget that runs 10–20% of your revenue. |
| VIPs quietly churn | The signals are in the play weeks before the revenue moves. |
| Valuable players identified too late | Tomorrow's VIPs, visible in their first weeks, while nurturing still changes the outcome. |
| Customers drop after product failures | A failed deposit, a payment error, a disconnection. The error gets fixed; the customers it hit don't get actioned. |
| Wrong offers to the wrong players | Over-bonused players who would have played anyway; under-bonused players who were worth keeping. |
| Accounts closed or restricted without you knowing | Fraud closing too many accounts, or adding too much friction, lands on your revenue line. |

Under the grid, one line in the accent blue, as now: `All of it lands in the systems you already
run: cases, lists, triggers and enriched profiles. No new tool.`

## 4. What it does

This is where the expanding-rows pattern lives now, exactly as built in R4 for the leaks:
**rows on the left, the active row's product screen sticky on the right; on phones the screen sits
under its row.** Reuse `.sh-2col`, `.sh-leaks-art`, `.sh-leaks-art-inline`, `ArtifactCard`,
`ProductFrame`, `ReasonLine`, `OutChip`. Put `ILLUSTRATIVE · SYNTHETIC DATA` top-right of this
section instead.

Headline: **`What it does`**. `id="how-it-works"` goes on this section.

Six rows. Row 1 open on load. Every screen is a real still from the film. The ReasonLine must agree with what the screen shows; if a screen and this table disagree, the screen wins and you tell AA.

| # | Row title | One line under the title | Screen | ProductFrame title | ReasonLine | OutChip |
|---|---|---|---|---|---|---|
| 1 | Fraud rings and bonus abuse | Linked accounts, shared payment fingerprints, one root inviter. The ring, ranked by net loss, with the evidence attached. | `leak-fraud-rings-graph.png` | Referral network | 12 accounts · one payment fingerprint · same root inviter | → Risk queue, with the evidence |
| 2 | Every account watched: VIPs, churn, early value | Signals in the play, weeks before the revenue moves. Tomorrow's VIPs flagged in their first weeks. | `account-tiles.png` | Account · first weeks | play steady 6 weeks · session depth rising · flagged day 9 | → VIP team: nurture list |
| 3 | Daily KPI monitoring, with the root cause | Deposits, wagering, bonus cost, every morning against expected. When a number moves, the reason and the accounts behind it. | `leak-product-failures.png` | Deposits · yesterday vs expected | 01:00–04:00 below expected · the accounts that failed to deposit, listed | → CRM: declined deposits, for reach-out |
| 4 | In the chat your team already uses | Claude or ChatGPT, through a standard connector (MCP). Ask in plain language; get the accounts, the reason and the action. | `chat-surface.png` | Sensai, in the chat | one question · the accounts, the reason, the action | → same chat, no new tool |
| 5 | Actions through the systems you already run | Cases, lists, triggers, enriched profiles. Into your CRM, case manager and risk tools. | `where-it-went.png` | One finding, where it went | four actions · three systems · one decision | → CRM · Risk · Case manager |
| 6 | Your team stays in control, and it learns | Nothing is armed without your confirmation. What you confirm becomes a proposed rule for your CRM team to approve. It never contacts a player. | `proposed-rule.png` | Proposed rule · awaiting approval | learned from what you confirmed · backtested on your history | → your CRM team, for approval |

Row 6 is where the two required sentences now live, verbatim inside the one-liner: *nothing is
armed without your confirmation* and *it never contacts a player*. Do not drop them.

"Tailored to your business" is **not** a separate row or claim. Row 6 says it in the only form
we can stand behind: it learns from what your team confirms.

KPI tiles inside `ProductFrame` (the `kpis` prop) are fine on rows 1 and 3 as they are now; leave
them off the rest so the screenshot is the content.

## 5. Integration

Keep as is: `INTEGRATION` eyebrow, `Light integration. Read access in, actions out.`, `Live within
weeks.`, the diagram, the three chips. The diagram node already reads `Sensai`. Remove the MCP
caption under the diagram (row 4 above says it, with the screen). Remove the two-sentence control
block under the chips (row 6 says it).

## 6. Design partnership

- Headline: **`Design partnerships open now.`** No "small number". No scarcity framing anywhere in
  the section.
- Paragraph, two sentences: `Read access, scripts approved by you, live within weeks. Partners
  shape what gets built next.`
- One button: `Apply for a partnership`.
- The scan sentence stays, last and quiet, exactly as now.

## 7. Founders and footer

Founders stays as it is. Footer: replace the tagline with `Stops the revenue leaks in your customer
base.` and **remove the `Live in production.` pill**.

---

## Rules for the whole page

- **No em dashes.** There are 25 left in the file. Every one becomes a comma, a full stop, or a
  spaced hyphen. `10–20%` is an en dash in a number range and stays.
- **No names, no operator names, no client names, no calendar dates, no percentages or money
  claims** beyond what is already on the page. No "AI" or "agentic" vocabulary operator-facing.
  Casino vocabulary only: deposit, withdrawal, balance, wagering ratio.
- Every product screen keeps its mono caption line (the `ReasonLine` and the frame footer).
- Buttons on the page: exactly three. Hero ×2, partnership ×1.
- Phones: every two-column block stacks (`.sh-2col` already does it); no sideways scroll except
  the integration diagram in its own container; the carousel swipes.

## Done means

- The eight sections above, in that order, and nothing else rendered.
- `tsc --noEmit` clean.
- Checked at 1440 and 390 before you report back: hero, carousel, the six-row section with row 1
  open, and the partnership block.
- Commit on `repositioning` as `Round 5: final structure`.
