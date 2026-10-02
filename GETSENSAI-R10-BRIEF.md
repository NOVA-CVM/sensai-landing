# getsensai.co — Round 10: film v42, two clean stills, "Work with us", outcomes strip out

**To:** Claude Code (sensai-landing) · **From:** the film v2 chat (Cowork), on AA's decisions of 2 Oct · **Date:** 2026-10-02
**Domain:** www.getsensai.co only. Same rules as R9: one branch (e.g. `r10-work-with-us`), ask AA before opening and before merging; deploy only on AA's word.

## 1. Film v42 (replaces v41)

Source: `sensai-workspace/marketing/film/site-v42/` → `public/film/` — `sensai-45.mp4`, `poster-45.jpg`, `poster-45.webp` (names unchanged).
v42 = v41 with one beat rebuilt: "All of it, in the chat you already use" (~48.5–53.5 s). The old v33 recording of the digest said "35 VIPs caught in their first week", "VIP tier waiting", "VIP cluster", "$295K", "Morning brief", "crossed overnight". The rebuilt screen is the same layout with Level 5 / Level 4–5, the film's own figures ($145K), "Digest · as of 07:02", "since the last pass". 59.70 s, 12.1 MB, faststart, frame 0 = poster. Same checks as R9.

## 2. Two stills in "What it does" (same names, slightly different heights)

Source: same folder → `public/screenshots/film/`
- `chat-only.webp` (row 03, 979×1375, was 979×1300): "I'll report **tomorrow morning**…" → "I'll report back here on what the exclusions stopped, and what Risk did with the 21."
- `control-approve.webp` (row 05, 1310×789, was 1310×766): "Update on **this morning's** network." → "Update on the network."
Reason: the product is not a morning report (decided on the film in Sept; cadence words are banned in copy). Alt text and captions unchanged. Check both rows at 1440 / 390 / 360 — the heights changed a little.

## 3. "Partnership" → "Work with us"

- Nav link (`Nav`, ~L350): label `Partnership` → **`Work with us`** (keep `href="#partnership"` and the section id — no URL change).
- `PartnershipSection` eyebrow (~L2504): `Design partnership` → **`Working with us`**.
- **Keep** the section headline `Design partnerships open now.` and the body copy unchanged (it is the film's closing line).
- Reason (AA): in iGaming "partners/partnership" usually means affiliates; a CRO reading "Partnership" in the nav expects an affiliate programme.
- Grep the served HTML for any other `Partnership` nav/footer label and apply the same change; list them.

## 4. Remove the "What changes for you" strip

- Remove `<OutcomesStrip />` from `SensaiHome` (~L3172). Leave the function defined-but-not-rendered and add it to the "DEFINED BUT NOT RENDERED" comment: *"OutcomesStrip: repeated the leaks section beside it (AA, 2 Oct)."*
- Check the spacing between the problem section and the leaks section after removal (no doubled padding / stray rule) at 1440 / 390 / 360.

## 5. Verify and report

`next build` clean · Lighthouse mobile not worse than R9 · browser pane at true 390/360 · served-HTML grep: `What changes for you` (none), `Partnership` as a label (none), `tomorrow morning` / `this morning` (none in any alt/caption). Report to `sensai-workspace/marketing/getsensai-home-build-report-2026-10-0X-r10.md` + one `_INDEX.md` breadcrumb.

**Not in this round:** new "What it does" rows (churn / funnel) — later, AA's call.
