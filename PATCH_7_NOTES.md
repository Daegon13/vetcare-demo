# PATCH 7 — Marketing links internos

## Objetivo
Se agregó una herramienta interna para generar links con UTM listos para campañas desde `/adminv1/marketing`, con preview y copia en un click.

## Cambios incluidos
- Nueva página `app/adminv1/marketing/page.tsx`.
- Destinos rápidos incluidos:
  - Home (`/`)
  - Servicios (`/servicios`)
  - Agenda (`/agenda`)
  - Urgencias (`/urgencias`)
  - LP (`/lp`)
- Campos editables:
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
  - `utm_content`
  - `utm_term`
  - `ref`
- Presets rápidos:
  - Canales: `IG Reels`, `IG Stories`, `TikTok`, `WhatsApp` (autocompleta `utm_source` + `utm_medium`)
  - Campañas: `marin_dev_demo`, `vetcare_demo`, `promo_control`
- Toggle: `Incluir demo=1`.
- Lógica de URL base:
  - usa `NEXT_PUBLIC_SITE_URL` si existe;
  - si no, usa `window.location.origin` (con fallback SSR a `http://localhost:3000`).
- Botón `Copy link` usando Clipboard API.
- Preview del link generado.
- Tracking agregado al copiar:
  - evento `marketing_link_copied`
  - payload `{ destination, utm_campaign, utm_source }`.
- Acceso desde `/adminv1` con botón `Marketing links`.

## Verificación
- Build de Next completado con `npm run build`.
- No se realizaron cambios en `iconos/brand/icons` ni en assets.
