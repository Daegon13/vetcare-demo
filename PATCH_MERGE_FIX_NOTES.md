# Merge Fix Drop-in

This drop-in overwrites:
- `components/nav.tsx` (removes merge markers, keeps Sales Mode + ?demo=1 persistence)
- `lib/utm.ts` (clean version)

It also adds missing service icons under `public/brand/icons/*.webp` to avoid 404s like:
- `/brand/icons/cirugia.webp`

After copying over your repo root, run `npm run dev`.
