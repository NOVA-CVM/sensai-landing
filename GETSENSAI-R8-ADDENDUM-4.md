# getsensai.co — Round 8, fourth addendum: film v29 to production

One item. The film on the site is replaced; nothing in the component changes.

## Push the film

Three commits from the CoS chat are on `main` ahead of your last deploy (`c785ea3`, `f9e2b50`,
`6751b5b`). They replace, in `public/film/`:

- `sensai-45.mp4` — **v29**, 57.8s (was 57.1s), faststart, `moov` first. The film now opens on a
  poster card (the headline on the dots field, white icon, 3.9s hold, dissolve) and the "Your team
  stays in control" beat has the Approve click.
- `poster-45.webp` and `poster-45.jpg` — the same image as the film's first frame, 1080×1350, so
  the `<video poster>` and the first frame are identical and nothing jumps at play.

Do not re-encode either; take them as they are. Deploy `main` as it stands.

## Done means

- Live URL in the report. On production, `/film/sensai-45.mp4` is 57.8s and its first frame is the
  poster (`ffprobe` duration; a frame grab at 0s).
- The poster image on the page before play is the same picture as the frame at 0s.
- Play on a phone from the page: no black frame between poster and film, sound from the first card.
- `next build` clean. Commit message `Film v29 on the site`, or nothing to commit if the three
  commits deploy as they are.
