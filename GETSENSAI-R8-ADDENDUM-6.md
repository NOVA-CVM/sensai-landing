# getsensai.co — Round 8, sixth addendum: the company, and the two addresses

Facts from AA, 15 Sep. The site currently names the wrong company on `/privacy` and has no
contact address in the footer. Same deploy as addenda 4 and 5 if they haven't shipped; otherwise
its own.

## The facts

- The operator of the site and the product is **Sensai Technologies, Inc.**, a Delaware
  corporation (United States). **Not** NOVA CVM Solutions SL; NOVA never appears on this site again.
- **contact@getsensai.co** is live. AA says the mailbox exists; verify the MX record resolves
  before you publish the address (you found none on 14 Sep). If it still doesn't resolve, publish
  everything else and leave the address out, and say so in the report.
- **privacy@getsensai.co** will exist. Use it on `/privacy` now; it is the address that will
  receive the requests that page describes.

## 1. Footer

Right-hand group becomes, in this order, 14px, `SENS.inkSoft`, the links underlined on hover only:

`contact@getsensai.co` (mailto) · `Privacy` · `© 2026 Sensai Technologies, Inc.`

Drop the tagline sentence from the footer; the page has said it. Delete the B10 comment about MX.
No LinkedIn link yet (no company page URL on record); no Terms link (no source text yet).
Phone: the group wraps to its own line under the wordmark, left-aligned, 12px gap between items.

## 2. `/privacy`

Three text changes, nothing else in the policy moves:

| Now | Becomes |
|---|---|
| *This website is operated by **NOVA CVM Solutions SL**, a company registered in Spain ("we", "us").* | *This website is operated by **Sensai Technologies, Inc.**, a Delaware corporation ("we", "us").* |
| *…contact us at **privacy@novacvm.com**.* | *…contact us at **privacy@getsensai.co**.* |
| *…by emailing **privacy@novacvm.com**; we will respond…* | *…by emailing **privacy@getsensai.co**; we will respond…* |
| **Last updated:** 14 August 2026 | **Last updated:** the deploy date |

Do not add any sentence about where the company is based or operates; the entity and its state of
incorporation are the identity, and that is all the page states. Leave the standard-contractual-
clauses sentence as it is; the page stays noindexed and pending legal review, and that review is
where the transfer wording and any EU-representative requirement get settled.

## 3. Everywhere else

`grep -rn -i "nova" app components` must return only `app/legacy/page.tsx` (the novacvm.net host
split, untouched) and the analytics hostname. Anything else, list it in the report.

## Done means

- Footer as above at 390 and 1440; the mailto opens the mail client with the address.
- `/privacy` names Sensai Technologies, Inc. and privacy@getsensai.co; no "NOVA", no "novacvm.com".
- MX for getsensai.co checked and the result stated in the report (resolves / does not).
- `next build` clean. Commit on `main` as `Sensai Technologies, Inc.: footer and privacy`.
