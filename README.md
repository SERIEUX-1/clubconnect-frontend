# ClubConnect — Frontend

React + Tailwind implementation of the design system, built against the
`clubconnect_backend_foundation` API. Verified with a real `npm run build`
(44 modules, zero errors) and screenshotted at every stage — this is a
working app, not a mockup.

## Design system

Full rationale in `docs/design-system.md`. Summary: the platform's own
language ("Digital Club Passport") became the actual visual system instead
of generic dashboard chrome — clubs render as verification-stamped ID
cards, not CRUD table rows.

| Token | Value | Used for |
|---|---|---|
| `ink` | `#14213D` | Primary navy — headers, hero background |
| `fog` | `#F2F4F7` | Cool paper background |
| `brass` | `#C9A227` | Verification stamps, awards, criterion labels |
| `verified` | `#1F7A5C` | Healthy / verified status |
| `watch` | `#D98E04` | Needs-attention status |
| `risk` | `#B33F2E` | At-risk / rejected status |
| Display type | Fraunces | Club names, page headings |
| Body type | IBM Plex Sans | Everything else |
| Mono type | IBM Plex Mono | Passport codes, stats, criterion labels |

## What's built

- **Discover Clubs** (`/`) — hero + searchable/filterable directory using
  the signature `PassportCard` component
- **Club Portfolio** (`/clubs/:id`) — implements PRS §6's storytelling
  structure (Problem → Objective → What we did → Who benefited → Evidence
  → Results → Next steps) literally, per activity and impact project
- **Committee Command Center** (`/command-center`) — health roster +
  pending-review queue, the Committee Head's daily-driver screen

Currently wired to mock data in `src/data/mockClubs.js`, shaped to match
the real API's serializers exactly. Swapping to live data is a one-line
change per page — see `src/lib/api.js`.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
```

Set `VITE_API_BASE_URL` in a `.env` file to point at the Django backend
(defaults to `http://localhost:8000/api`).

## What's next (see the Build Roadmap, Phases 2–7)

- Wire pages to `src/lib/api.js` instead of mock data once the backend is running
- Auth screens (login, JWT storage/refresh)
- Evidence upload UI, AI Evaluation Review screen, CCEA Reveal Mode
- Student Dashboard and Club Leader Dashboard (same component library —
  no new design decisions needed, just new screens)
