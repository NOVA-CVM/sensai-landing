# getsensai.co — Round 8, third addendum: collapse, and the 4-weeks line

Two items, both on the live home page. Do them with addendum 2 (rings still, symmetric ink cards)
if that has not shipped yet; one push.

## 1. "What it does" rows collapse

Today a row opens and stays open. On a phone that is five open screens and no way back.

- Tapping an open row's number, title or chevron closes it. The chevron turns back.
- One row open at a time: opening 3 closes 1. On desktop the same rule.
- Keyboard: Enter/Space on the row header toggles; `aria-expanded` follows the state.
- No animation beyond what the open already has. Nothing else in the section changes.

## 2. The band's last line says what their side is

The ink band ends on `Live within 4 weeks.` A CRO reads a timeline and fills in the project he
knows (a CRM, a CDP, two quarters, an IT roadmap slot). The number stays; what is missing is what
the four weeks cost him. Replace the line with:

**Live within 4 weeks. Your side is one read-only credential from your data team; there is no
project.**

Set as now: 22px white, the first sentence as it is today, the second sentence on its own line at
17px, white at 80%. Two lines at 390, keep them from breaking mid-sentence. Nothing else in the
band changes; the Connect tile and the trust block already carry the evidence for it.

Do not tighten it to "no engineers", "nothing installed" or "one day". "One read-only credential"
and "no project" are the claims; they are true and they are enough.

## Done means

- Preview or live URL at the top of your report; AA opens it on his phone.
- Rows open and close at 390 and 1440; only one open at a time.
- The band line exactly as above, two lines at 390, no mid-sentence break.
- `tsc --noEmit` and `next build` clean. Commit on `main` as `Round 8: rows collapse, the 4-weeks line`.
