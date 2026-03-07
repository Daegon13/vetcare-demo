# PATCH 6 — Lead Inbox (demo, sin DB)

## Qué se implementó

- Nuevo módulo `lib/leads.ts` para gestionar leads en `localStorage` bajo la key `vetcare:leads`.
- Tipado `LeadEvent` con los campos pedidos (`id`, `createdAtISO`, `sourcePage`, `utm`, `interest`, `channel`, `note`, `phone`, `petName`, `serviceId`).
- API del módulo:
  - `getLeads()`
  - `addLead()` (idempotente por `leadId`/`id`)
  - `clearLeads()`
  - `exportLeadsCSV()`
  - `exportLeadsJSON()`

## Captura de leads

- Se agregó guardado de lead al click del CTA WhatsApp en:
  - Navbar (`components/nav.tsx`)
  - Floating CTA (`components/floating-cta.tsx`)
  - Hero CTA de `/lp` (`app/lp/page.tsx`)
- En `/lp` submit:
  - Se genera `leadId` y se guarda en `vetcare:lead`.
  - Se registra lead con `channel="whatsapp_click"`.
- En `/gracias`:
  - Si hay interés o UTM, se registra lead con `channel="thank_you"`.
  - Usa `leadId` para idempotencia y evitar duplicados al recargar.

## Admin `/adminv1`

- Se agregó tab nueva: `leads`.
- Tabla de leads con columnas:
  - fecha
  - page
  - canal
  - interest
  - utm_campaign
  - nota
- Filtro por texto reutilizando búsqueda global del panel (busca en page/campaign/interest).
- Botones:
  - Export CSV (descarga con Blob)
  - Export JSON (descarga con Blob)
  - Clear leads

## Analytics (tracker existente)

- Se agregaron eventos mínimos:
  - `lead_saved`
  - `leads_exported` (con `format=csv|json`)
  - `leads_cleared`
- Manteniendo compatibilidad con eventos existentes de WhatsApp/UTM.

## Notas

- No se tocaron rutas de assets ni iconos de brand.
- Solución 100% demo y local (sin base de datos).
