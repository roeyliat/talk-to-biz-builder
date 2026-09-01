# AGENTS.md

## Cursor Cloud specific instructions

TalkBiz is a single-page frontend app (Vite + React + TypeScript + shadcn-ui + Tailwind).
There is no local backend to run: it talks to a hosted Supabase project via the
`VITE_SUPABASE_*` values already committed in `.env`. Supabase Edge Functions live under
`supabase/functions/` but are deployed remotely; you do not run them locally for normal dev.

Standard commands are defined in `package.json` scripts — use those rather than duplicating here:
- `npm run dev` — Vite dev server on port **8080** (`http://localhost:8080`).
- `npm run build` — production build. `npm run test` — Vitest. `npm run lint` — ESLint.

Non-obvious caveats:
- The dev server listens on port `8080` (set in `vite.config.ts`), not Vite's default 5173.
- `npm run lint` reports pre-existing errors in the repo (e.g. `no-explicit-any` in
  `supabase/functions/*`, `no-useless-escape` in `src/lib/menuToBoards.ts`). These are not caused
  by the environment; treat them as baseline unless your change touches those files.
- Case-sensitive filesystem gotcha: `src/components/aac/AACDashboard.tsx` imports three assets with
  a lowercase `.png` extension (`אני רוצה.png`, `עוד.png`, `כמה עולה.png`) but the actual files on
  disk are uppercase `.PNG`. This works on macOS (case-insensitive) but breaks `npm run dev` and
  `npm run build` on Linux with a "Failed to resolve import" error. The update script creates
  lowercase symlinks to fix this; they are hidden from `git status` via `.git/info/exclude`, so do
  not commit them (they cannot coexist with the uppercase originals on case-insensitive filesystems).
- Good no-auth smoke test for the core AAC feature: open `http://localhost:8080/board?type=cafe`
  and tap tiles — words accumulate in the sentence bar. Auth-gated flows (Dashboard, saved boards)
  require signing in against the hosted Supabase.
