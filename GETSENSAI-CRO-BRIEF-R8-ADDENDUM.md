# getsensai.co — Round 8 addendum: three small things on `/cro`, then `/cro` becomes `/`

AA walked the R8 preview on his phone. Three corrections, no new structure, then the promotion:
AA has picked `/cro`. It becomes the home page in this same round (§4).

## 1. The product screens are cropped in the ink cards on phones

Row 1 of "What it does" (the rings graph) shows left-shifted at 390: the image is being fitted
by width with a `cover` crop anchored left, so the hub sits off-centre and the right edge is lost.
The screens are never to be cropped. On the `<img>` inside every ink card:

```css
display: block; width: 100%; height: auto; max-width: 100%;
object-fit: contain; object-position: center; margin: 0 auto;
```

The ink card letterboxes on ink; that is what the ink ground is for. Apply to all five rows
(the tall screens must behave the same), and check every row at 390 before pushing.

## 2. Outcome line 3, final

`Customers recovered after a product failure.` →
**`Customers hit by a product failure, in your CRM before they leave.`**

This is the line as written; do not sharpen it to "reached", "contacted" or "handled". It says a
list lands in the CRM, which is true; it does not say anyone was contacted, which the page must
never say. Lines 1 and 2 unchanged. The Act tile is unchanged.

## 3. `streams-anim.js` is replaced (v11)

`components/sensai/streams-anim.js` is already committed on `main` (`streams-anim v11`). Same
API, same two variants, same box sizes; nothing in your component changes. What changed inside:
the `$16K` figure on the single customer is gone, the `$3.1M` now appears only when the base is
summed, and the phone variant's fork caption is shorter so it clears the SENSAI marker. If you
have a local copy of the file, take the committed one.

## 4. Promote: `/cro` is the home page

AA compared the two on the live site and picked `/cro`. Do the three fixes above first, then:

- `app/page.tsx` renders `SensaiHomeCro`. The old `SensaiHome` (`home.tsx`, `home.css`) is deleted;
  git has it at `56a766d` if anyone ever wants it. Leave `/legacy`, `/sense`, `/v2` as they are.
- Rename `home-cro.tsx` → `home.tsx` and `home-cro.css` → `home.css` once the old ones are gone,
  so the tree has one home page. Keep the `.sensai-cro` class names; they are scoped rules, not a
  route. Export name `SensaiHome`.
- `app/cro/page.tsx` is deleted and `/cro` becomes a permanent redirect to `/` (`redirects()` in
  `next.config`, `permanent: true`). The preview links that were shared keep working.
- The `noindex` goes with the `/cro` route; the root has no robots override and inherits the
  layout metadata. `robots.txt` needs nothing.
- `<VisitTracking page="cro" />` → `page="home"`, so the analytics series continues under one name.
- `og-home.png` (1200×630) must show the current hero. If it was exported from the round-6 hero it
  still matches (the hero did not change in R7/R8); if it doesn't, re-export it from the promoted
  page at 1200×630 and say so in the report.
- Lighthouse on `/` once deployed (mobile), numbers in the report.

Copy audit on the promoted page, in the served HTML: "every day", "daily", "every morning",
"yesterday", "continuously", "real time", "recovered", "onboarding", "tier-1", "in production":
all absent. Screen filenames and the product screens' own chrome don't count. Anything you find,
list in the report with where it sits; don't reword it yourself.

## Done means

- Preview URL at the top of your report; AA opens `/` on the preview on his phone, then says merge.
- On the preview: `/` is the new page, `/cro` redirects to `/`, `/sense` unchanged.
- All five product screens centred and uncropped in their ink cards at 390 and 1440.
- Outcome line 3 exactly as above; grep the served HTML for "recovered": absent.
- The animation on the preview shows no `$16K` at any point and `$3.1M` only after the sum.
- The copy audit above: clean, or listed.
- `tsc --noEmit` and `next build` clean. Two commits on `main`: `Round 8 addendum: /cro`, then
  `Round 8: /cro is the home page`. Production deploy only after AA says merge.
