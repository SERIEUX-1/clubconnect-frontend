# Design System — Rationale

## Why "passport," specifically

The PRS names the core club entity a "Digital Club Passport" (§6) and
prescribes a literal storytelling sequence for portfolios. Most competing
tools in this space (club/society management software) default to generic
SaaS dashboard visual language — sidebar, cards, a blue-to-purple gradient
hero. That's a template answer, not a choice made for this brief.

Instead, the document/verification metaphor already present in the PRS's
own vocabulary became the actual design system:

- Clubs render as **ID passport cards**, not table rows — logo/name/category
  in an "identity block," separated by a perforated tear-line from a
  "detail block" containing the description and a monospace passport
  number, the way a real ID booklet separates a photo page from its stub.
- Verification becomes a **rotated brass foil stamp**, only rendered when
  a club's status is actually `recognized` — it does real informational
  work, not decoration.
- Data-heavy surfaces (codes, stats, criterion labels) use **IBM Plex
  Mono**, which reads like a passport's machine-readable zone — this
  ties the evaluation/scoring parts of the platform to the same
  document language instead of looking like leftover dev output.

## Colors avoided on purpose

Per current AI-generated-design conventions worth avoiding: warm cream +
serif + terracotta (`#D97757`-adjacent), near-black + neon accent, and
broadsheet hairline-rule layouts. This system uses a cooler paper tone
(`#F2F4F7`, blue-gray rather than warm cream) and a brass/gold accent tied
specifically to the passport-stamp and CCEA-award content, not chosen for
its own sake.

## Where the "one risk" was spent

The signature element is the `PassportCard` component and its stamp. Once
that's clear, everything else — spacing, table design, badge colors,
button shapes — stays quiet and disciplined around it, per the "spend
your boldness in one place" principle. The Committee Command Center in
particular is intentionally plain (a clean table, calm stat cards) so it
reads fast under real daily use rather than competing for attention with
the passport metaphor.

## Status vocabulary — one mapping, everywhere

`StatusBadge` is the single place every status string in the system
(club recognition, evidence review, club health, score stage, collaboration
confirmation) maps to a color. This was a deliberate constraint: without
it, four different screens would each invent their own meaning for
"orange," and the app would stop being legible at a glance. Three tones
only — verified/settled (emerald), needs attention (amber), at risk/
rejected (brick) — plus a neutral navy-soft for anything in progress.

## Accessibility & restraint baseline

- Visible focus rings on every interactive element (`:focus-visible` in
  `index.css`), not just default browser outlines removed and forgotten.
- `prefers-reduced-motion` respected globally.
- No animation beyond a restrained card lift-on-hover — the brief calls
  for "subtle animations only where they improve comprehension" (PRS §15),
  and a passport-style product earns its personality from the metaphor,
  not from motion.
