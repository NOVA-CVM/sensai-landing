# getsensai.co — Round 8: corrections to `/cro`

AA walked `/cro` on his phone. It holds. Six corrections, all contained; nothing structural.
Target is `home-cro.tsx` / `home-cro.css` only. `/` stays untouched.

## 1. The animation on phones: no sideways scroll, ever

The brief's §C phone treatment (crop and scroll) is withdrawn. **`streams-anim.js` is replaced**
and now carries two variants of the same animation: `desktop` (1000×560, the film's type) and
`phone` (640×520, larger type, shorter labels). The file's header comment has the usage.

- Pick by breakpoint: `phone` at ≤768px, `desktop` above.
- **Scale the box as a unit to the container width**: render at native width,
  `transform: scale(containerWidth / nativeWidth)`, `transform-origin: 0 0`, inside a wrapper
  whose height is `containerWidth × nativeHeight / nativeWidth`. `overflow: hidden` on the wrapper.
  Nothing scrolls, nothing is cropped, the type is legible at 360.
- The axis labels and the TODAY marker are gone (§2). Nothing else in the animation changed.

## 2. No weeks, no TODAY: the marker just says SENSAI

The axis had `WEEK 1 … WEEK 12` and the marker said `TODAY`. Both are gone from the animation:
the horizontal axis carries no labels (it is a long stretch of time, not twelve weeks), and the
vertical marker where the two futures fork now reads **`SENSAI`**. The blue line keeps its
`WITH SENSAI` label. Don't add a time caption anywhere around it.

## 3. Outcome line 3 is broader

`Deposits recovered after a failure.` → **`Customers recovered after a product failure.`**
A failed deposit is one product failure among several; the leaks grid already says so.

## 4. A fourth quote, on KPI noise

Restore the carousel to **four**. The fourth replaces the one round 7 dropped:

> *"Every KPI has an alert on it, so I get two hundred a day and read none of them. When deposits
> really drop, I hear it from finance."* — Chief Revenue Officer, sportsbook and casino

Same `{ text, role }` shape. Order: 1, 2, 3 as now, this one fourth.

## 5. No cadence on the page

sensAi does not only run in the morning, and the page must not say when it runs at all (cadence
is not disclosed; and "near real time" is not on the page until it is true). Remove every
"every day", "daily", "every morning", "yesterday" from copy you wrote, and reword:

| Where | Now | Becomes |
|---|---|---|
| Ink band sentence | *Read access in, every customer watched every day, actions out…* | *Read access in, every customer watched, actions out through the systems you already run.* |
| Watch tile | *Every customer, every day, against what it should look like.* | *Every customer, against what it should look like.* |
| What-it-does row 2 title | *Daily KPI monitoring, with the root cause* | **KPI monitoring, with the root cause** |
| Row 2 one-liner | *Every morning against expected. When a number moves…* | *Against expected. When a number moves, the reason, the accounts behind it, and where each one went.* |
| Row 2 caption | `DEPOSITS · YESTERDAY VS EXPECTED · …` | `DEPOSITS · VS EXPECTED · THE CAUSE, THE CUSTOMERS, THE ACTIONS` |

The product screen itself still says "yesterday" in its own chrome; that is a screen, not copy,
and stays.

## 6. Connect · Watch · Act · Learn

The band gets a fourth tile and the H2 becomes **Connect. Watch. Act. Learn.**

| Tile | Line | Mark |
|---|---|---|
| **Learn** | What your team confirms becomes the logic. It proposes the rule; your CRM team approves. | a loop arrow closing on itself |

Four equal tiles on desktop, 2×2 at tablet, stacked on phones. Row 5 of "What it does" already
says the same thing with the screen; that's the point, the two agree.

## Done means

- Preview URL at the top of your report; AA opens it on his phone.
- The animation at 360, 390 and 1440: no sideways scroll, labels legible, ends on the fork.
- "every day / daily / every morning / yesterday" absent from rendered copy on `/cro`
  (grep the served HTML; the screen filenames don't count).
- Four quotes, four tiles, the third outcome line as above.
- `tsc --noEmit` and `next build` clean. Commit on `main` as `Round 8: /cro corrections`.
