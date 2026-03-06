# VetCare deploy fix (Vercel)

This drop-in fixes:
- Missing export `buildLeadWhatsappUrl` + types `LeadPayload`/`LeadInterest` in `lib/utm.ts`.
- Service icon paths use `.webp` in `app/servicios/page.tsx`.

## How to apply
Copy/overwrite the files into your repo preserving folders:
- `lib/utm.ts`
- `app/servicios/page.tsx`

Then run:
- `npm run build`
- commit + push
