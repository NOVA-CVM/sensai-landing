# getsensai.co — Round 4

**Target:** `components/sensai/home.tsx` + `home.css` (the `SensaiHome` export only).
Never touch `one-pager-v2.tsx` — `/sense` and `/` do not share components.

This round is not a copy pass. It is a **calibration**: the page currently reads as a
well-made pitch. It has to read as a **product that already exists and already runs**.
Two things do that: fewer words, and more of the real screens.

---

## 1. The spine: what the CRO has to be able to tick

A CRO lands cold, gives the page ninety seconds, and leaves. He converts only if he can
tick all eight of these on the way down. **Every change below exists to earn one of them.
If a block on the page earns none of them, it comes off.**

| # | What he has to be able to say | Where the page earns it |
|---|---|---|
| 1 | "This is about my P&L — revenue I already own, not acquisition." | Hero headline |
| 2 | "They know my world." | Hero eyebrow, problem quote |
| 3 | "I know what they mean by *leaks*." | Hero sub-line — **currently fails** |
| 4 | "This is a real product, not a deck." | Film + the product screens — **currently under-used** |
| 5 | "It fits what I already run." | Integration + the MCP block — **currently a footnote** |
| 6 | "Nothing fires without my team." | Control line + the proposed-rule screen |
| 7 | "Somebody serious is already running this." | Proof line — **currently too quiet** |
| 8 | "The next step is small." | Partnership |

Three of the eight currently fail or nearly fail. That is what this round fixes.

---

## 2. Tone: confident, not asking for anything

The page is selling a product that is live in production at a tier-1 operator. It should
sound like it. The specific failures, and the rule for each:

**a. Five buttons, three of them identical.** Hero has two, the leaks section has one,
partnership has two, and "Book a walkthrough" appears three times. Repeating an ask is
how a page begs.

- **Cut to three buttons on the whole page.** Hero: `Book a walkthrough` + `How it works`.
  Leaks section: **delete its button entirely** — it interrupts the scroll to the thing
  that actually convinces. Partnership: `Apply for a partnership` only, no second button.

**b. Apologetic qualifiers.** Delete these words:

- Scan paragraph: *"…less tuned than a live deployment, **and we say so**."* → delete
  "and we say so". The honesty is in the sentence already; announcing it is a flinch.
- Partnership: *"…shape what gets built next, **and lock early terms**."* → delete
  "and lock early terms". It reads as a discount hint and makes the partnership a
  bargain rather than a selection.
- Partnership: *"Partners work directly with the founders"* → reads small, not senior.
  Replace with what is actually scarce: **"A small number of operators, chosen for fit."**

**c. Defensive framing.** *"It doesn't talk to your players — it works through your
teams' systems."* Leading with a negation makes the reader wonder who asked. Invert it:

> **"It works through your teams' systems. It never contacts a player."**

Same two facts, stated forward. (§10 requires both facts on the page; it does not
require that order.)

**d. The proof line is the strongest sentence on the page and it is set at 12.5px grey.**
*"Live in production with a tier-1 operator · ~2.5M accounts"*. Promote it: same width as
the sub-line, ~14px, and give it a thin rule above it so it reads as a fact block rather
than a caption. Still no name, no percentage, no case number.

**e. New standing rule — every product image gets a mono caption.** One line, uppercase,
11px, saying what the screen is. Documentation captions its figures; marketing doesn't.
This is the cheapest seriousness on the page.

---

## 3. Already done — do not revert

Two changes are already in the working tree:

1. **The film is now the 57-second cut at every width.** `WIDE_CUT_READY = false` above
   `Film()` drives it, plus `.sh-film-shortonly` in `home.css`. The 113-second film is no
   longer on the page. When the 16:9 rendering of the short cut is delivered, flipping
   that constant to `true` restores wide-on-desktop and nothing else changes. **Leave
   both the constant and the wide markup in place.**
2. **Three new stills** are in `public/screenshots/film/`: `chat-surface.png`,
   `proposed-rule.png`, `revenue-two-futures.png`.

---

## 4. Section by section

### Hero — fix checkmark 3

Headline stays exactly as it is. It is the film's line and it is right.

**Add a leak-naming line** between headline and sub-line — this is the single most
important addition in the round. Three nouns, no verbs, no sentence:

> **Bonus abuse. Silent VIP churn. Customers lost to product failures.**

~15px, muted, letter-spaced slightly. It turns the metaphor into a category in one glance.

**Replace the sub-line.** Currently *"Every customer watched, every change caught, every
finding pushed into the systems your teams already use"* — three abstractions welded
together from two different film cards. Use one:

> **Every customer watched. Every change caught. Nothing missed.**

**Shorten the eyebrow** from `FOR GAMING OPERATORS · THE TEAMS THAT OWN CUSTOMER REVENUE`
to `FOR GAMING OPERATORS`. Nine words to three; the rest is said by the headline.

### New band: "What leaks" — after the hero, before Problem

This is the page's missing explanation, and it is already written — it is the film's
aggregation card. Small band, two columns, no button:

- Left: **"Every customer generates a revenue stream. Together, the streams are your
  revenue. Unwatched, it leaks."** Nothing else. No paragraph under it.
- Right: **`revenue-two-futures.png`**, caption `THE WHOLE BASE · TWO FUTURES ·
  ILLUSTRATIVE`.

Stacks to one column on a phone, image second.

### Problem

- Headline → the film's opening line, which is stronger than what is there and currently
  wasted inside the leaks section: **"Even the best operators leak revenue they've
  already paid for."**
- Quote: cut from four sentences to two. Keep the first and the last — the org-seam point
  and the payments point are the two that land:
  > *"Every angle of the customer sits with a different team. Payments fixed the deposit
  > error, but who's acting on the customers it hit?"*
- Attribution line stays as is.

### Leaks

- **Headline → `The leaks we stop`.** Delete the eyebrow above it (it says the same
  thing) and delete "Retention is the outcome. These are the leaks that drain it." —
  it is a thesis the reader didn't ask for.
- **Delete the paragraph underneath entirely.** It names three leaks that the six tiles
  below then name again, and its opening sentence has moved to the Problem headline.
- **Tiles 05 and 06:** cut to one clause each, matching 01–04.
  - 05 → *"Over-bonused players who would have played anyway; under-bonused players who
    were worth keeping."*
  - 06 → *"Fraud closing too many accounts, or adding too much friction, lands on your
    revenue line."*
- **Swap drawn art for real screens:**
  - Tile 01 → `leak-fraud-rings.png` in place of `RafBurst`. A real screen beats a drawn
    SVG every time, and this is checkmark 4.
  - Tile 05 → `where-it-went.png`.
  - Tile 03 → `account-tiles.png`.
  - Tile 04 keeps `leak-product-failures.png`.
  - Keep the existing `ProductFrame` chrome around each; keep every `ReasonLine` and
    `OutChip` — the reason lines are what make it look built.
- **Delete the section's button.**
- Keep `ILLUSTRATIVE · SYNTHETIC DATA`. It reads as rigour, not as a disclaimer.

### New block: where it lives — fix checkmark 5

MCP is currently one grey 13px caption under a diagram. It is the most differentiated
thing about the product. Give it its own block, immediately after the integration
diagram, two columns:

- Left:
  - Eyebrow: `WHERE IT LIVES`
  - Headline: **"It works in the assistant your team already uses."**
  - Two lines, no more: *"Claude or ChatGPT, through a standard connector. Your team asks
    in plain language and gets the accounts, the reason and the action."*
  - Caption under, 11px mono: `CONNECTED OVER MCP`
- Right: **`chat-surface.png`**, caption `SENSAI, IN THE CHAT · VALUES TRANSFORMED,
  ACCOUNTS MASKED`.

**Settle the naming inconsistency while you're here.** The film caption says "The
assistant is deliberately not named here" and the integration line names Claude and
ChatGPT two screens later. **Name them.** Concrete beats coy, and the screenshot names
them anyway. Update the film caption to drop that clause.

### Control — fix checkmark 6

The two required sentences currently sit as centred grey text with nothing to look at.
Put `proposed-rule.png` beside them, caption `PROPOSED RULE · AWAITING CRM APPROVAL`.
That screenshot shows four actions marked *Done* and a rule *awaiting approval* — it
proves the sentence instead of asserting it. Copy, in the inverted order from §2c:

> **"It works through your teams' systems. It never contacts a player.
> Your team stays in control: nothing is armed without your confirmation."**

### Integration

Cut to two text blocks around the diagram:

- Keep: headline `Light integration. Read access in, actions out.` + `Live within weeks.`
- **Delete** the paragraph *"Read access to the source tables. We take it from there…"* —
  the diagram says it.
- Keep the three chips (`Read-only access`, `Pseudonymised data`, `No PII`). They are
  fast to read and they earn checkmark 6.
- The MCP caption moves out into its own block above.

### Partnership

- Headline stays: **"Design partnerships — a small number, open now."**
  (Becomes an en-rule per §5 — see the dash rule.)
- Paragraph → two sentences, per §2b:
  > *"Read access, scripts approved by you, live within weeks. A small number of
  > operators, chosen for fit; partners shape what gets built next."*
- One button only: `Apply for a partnership`.
- Scan paragraph: delete "and we say so", keep the rest, keep it quiet and last. No
  headline, no button, no figures. (§8 — the scan stays out of print elsewhere.)

### Founders

- **Delete the `CEO` / `Co-founder` role chips.** Names only.
- Bios stay accurate and short:
  - Amit Assa — *"17 years in customer value management across iGaming and digital
    platforms."*
  - Gabi Dvir — *"20+ years in engineering leadership. Ex-VP DevOps at 888 and Fiverr."*
- Section headline stays **"Built on years inside the industry."** — accurate, and
  deliberately not "people who ran these teams" (Gabi is engineering).
- Cut the supporting paragraph to one clause: *"The CRM playbooks and the abuse patterns,
  and the engineering to run them at scale."*

---

## 5. The dash rule

There are **39 em dashes** in `home.tsx`. Rewrite every one. Do not do this with
find-and-replace — decide per sentence:

- Most become a **comma** or a **full stop**. Prefer the full stop; it reads more certain.
- Where a break genuinely helps, use a **short hyphen with spaces**: ` - `.
- **One exception, leave it alone:** `10–20%` is an en dash in a number range and is
  typographically correct.
- Same treatment for `&mdash;` entities.

---

## 6. Mobile

Everything above assumes the `/sense` treatment, which the page already inherits. Confirm
after the changes:

- Every new two-column block stacks to one column at 768px, image second.
- No horizontal scroll at 390px except the integration diagram, which already has its own
  scroll container.
- The film is capped at 460px and centred — already in `home.css`.
- New screenshots get `max-width: 100%`.

---

## 7. Do not touch

- The never-rendered sections stay never-rendered: `TurnSection`, `RoleSection`,
  `AskSensAi`, `CTA`, `SocialProof`, `Walkthrough`, `Why`, `ApproachSection`,
  `HowItWorks`. The comment block in `SensaiHome` explaining why stays.
- No client names anywhere. No calendar dates, including in the partnership section.
- Casino vocabulary only: deposit, withdrawal, balance, wagering ratio. Never purchase,
  redeem, bankroll, entertainment.
- No AI or agentic vocabulary operator-facing.
- No percentages or money claims beyond what is already on the page.
- No purple.

---

## 8. Done means

- A CRO can tick all eight boxes in §1 without clicking anything except play.
- Three buttons on the page, not five.
- Seven product screens visible, not one.
- No em dashes.
- `tsc --noEmit` clean, and the page renders at 390px with no sideways scroll.
