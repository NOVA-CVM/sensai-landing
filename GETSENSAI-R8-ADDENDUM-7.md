# getsensai.co — Round 8, seventh addendum: film v32 and the new poster

The film and its poster are replaced. No component changes except one stale comment. Two commits
from the CoS chat are on `main` ahead of your last deploy: **`a6f527a`** (film + posters) and
**`f95ba1d`** (the fade-in fix). Deploy `main` as it stands; do not re-encode either file.

## What changed in the film

`public/film/sensai-45.mp4` is **v32, 55.8s** (was v29, 57.8s). Three kinds of change:

1. **Language.** The aggregate beat is now *"All these streams / are your revenue / Unwatched, they
   leak"* (was *"Together, the streams / are your revenue / Unwatched, it leaks"*), and its third
   line arrives 1.6s after the first two, as the streams finish summing. The product-failure beat
   reads *"Customers drop **due to** product failures"* (was "after"). The delivery beat reads
   *"What Sensai finds / is pushed into the systems / you already run"* (was "What it finds lands
   in…"). The word list has **"Early VIP identification"** where it had "VIP identification".
2. **A shorter entrance.** In v29 the poster overlay covered the film's own opening card for its
   whole 4.0s, so that card was never seen by anyone. It is gone; the poster is now a real opening
   segment of 2.6s, and the card that follows is 0.6s shorter. First motion is at 5.9s, was 7.8s.
3. **No fade-in.** v29 was postered after the join, so its frame 0 was already the poster. v32's
   poster is inside the join, so the old `fade=in` would have started the video from black. It is
   removed: **frame 0 IS the poster image**, pixel for pixel.

## What changed in the poster

`public/film/poster-45.webp` and `poster-45.jpg`, both 1080×1350, same image as frame 0:

- Headline is now *Even the best operators **leak** revenue* (two lines, "leak" in red), with
  *Revenue they've already paid for.* as a smaller grey sub-line beneath it.
- The footer reads **"56 seconds on how sensAi stops it."** — the film is 55.8s now, not 57.8s.

## The one code change

`components/sensai/home.tsx`, the comment above the film component (around line 467) says *"The
page plays the 57-second cut"*. Make it **56-second**. It is a comment, not copy; nothing rendered
changes. Leave the `<video>` element alone — it already points at `/film/sensai-45.mp4` with
`poster="/film/poster-45.webp"`, and both filenames are unchanged.

## Done means

- Live URL in the report. On production, `ffprobe` on `/film/sensai-45.mp4` gives **55.8s**.
- A frame grab at **0s** is the poster image, and it matches `/film/poster-45.webp` — no black
  frame, no dip, nothing that flashes between the poster and the first motion when you press play.
  Say in the report which check you ran for this; it is the thing most likely to regress.
- The poster on the page before play shows the new headline and the "56 seconds" footer.
- Play on a phone from the page: sound from the first card, the Approve click still lands in the
  "Your team stays in control" beat, the ending is unchanged.
- `grep -rn "57-second" components app` returns nothing.
- `next build` clean. Commit the comment fix as `R8 addendum 7: film v32 on the site`; the two
  media commits deploy as they are.
