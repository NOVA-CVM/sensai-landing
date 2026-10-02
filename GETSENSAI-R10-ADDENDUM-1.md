# getsensai.co — Round 10, addendum 1: film v43

**To:** Claude Code (sensai-landing) · **From:** the film v2 chat (Cowork), on AA's word · **Date:** 2026-10-02
**Domain:** www.getsensai.co only. Ship on the same R10 branch if it is still open; otherwise one new branch (e.g. `r10a-film-v43`) — ask AA before opening and before merging. Deploy only on AA's word.

## The one change: film v42 → v43 (asset swap, names unchanged)

Source: `sensai-workspace/marketing/film/site-v43/` → `public/film/`

| From | To |
|---|---|
| `sensai-45.mp4` | `public/film/sensai-45.mp4` |
| `poster-45.jpg` | `public/film/poster-45.jpg` |
| `poster-45.webp` | `public/film/poster-45.webp` |

- v43 = v42 with no content change: every headline, card, the poster and the end card are now set in **Space Grotesk** (the face the site serves; before, the film rendered in an Arial fallback), the **licensed Eliho track** replaces the synthesized bed, and there is designed UI sound. 59.70 s · 1080×1350 · 12.4 MB · faststart (moov before mdat) · frame 0 = the poster · audio −17 LUFS integrated, AAC 192k.
- The poster changed (new typeface), so replace **both** poster files, not just the film.
- If R10 already shipped v42, this replaces it; if R10 hasn't shipped, skip `site-v42/`'s film and posters and use these (the two stills from `site-v42/` still apply).

## Verify

- Plays from the poster with no fade-from-black and no layout shift; poster = frame 0.
- **Audio actually plays** (unmuted) on desktop Safari/Chrome and on a phone in the browser pane; first sound within ~0.4 s.
- Nothing else on the page changes in this addendum.
- Report: append a short section to your R10 report (or `getsensai-home-build-report-2026-10-0X-r10a.md`) + one `_INDEX.md` breadcrumb.
