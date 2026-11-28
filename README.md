# StudioDeck

Open-source portfolio builder for artists. Stateless control plane; you own GitHub + Cloudflare.

## Packages

| Path | Role |
|------|------|
| `app/` | Next.js control plane (App Router) |
| `template/` | Astro static portfolio template |

## Quick start

```bash
npm install
cp .env.example .env
npm run dev          # control plane → http://localhost:3000
npm run dev:template # portfolio preview
```

## Scripts

- `npm run typecheck` — TypeScript check for both packages
- `npm run lint` — ESLint (app) + Astro check (template)
- `npm run build:template` — builds static site to `template/dist`

## Notes

- Cloudflare adapter for the Next.js control plane is deferred past Phase 1; local `npm run dev` is the Phase 1 target.
- Full product docs land in a later phase.
