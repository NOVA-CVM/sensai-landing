# getsensai.co — Round 8 addendum: three small things on `/cro`

AA walked the R8 preview on his phone. Three corrections, no new structure. `home-cro.tsx` /
`home-cro.css` only; `/` stays untouched.

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

## Done means

- Preview URL at the top of your report; AA opens `/cro` on his phone.
- All five product screens centred and uncropped in their ink cards at 390 and 1440.
- Outcome line 3 exactly as above; grep the served HTML for "recovered": absent.
- The animation on the preview shows no `$16K` at any point and `$3.1M` only after the sum.
- `tsc --noEmit` and `next build` clean. Commit on `main` as `Round 8 addendum: /cro`.
