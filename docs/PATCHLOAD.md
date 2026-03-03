# Patchload (plan de cambios incremental)

Este documento define el flujo de patches para mantener la demo estable y facilitar escalado.

## Patch 1 — "Demo con vida" (seed + reset)
**Objetivo:** que el sitio no se sienta vacío en la primera visita.

Incluye:
- `lib/demoSeed.ts` (generación de datos demo)
- `lib/storage.ts` (ensure seed + reset demo)
- `components/demo-bootstrap.tsx` (ejecución client)
- `components/nav.tsx` (botón Reset demo)
- `app/layout.tsx` (montaje bootstrap)
- `app/adminv1/page.tsx` (reset consistente)

## Patch 2 — Empty states vendibles
**Objetivo:** si algo está vacío, que se vea premium y guíe a la acción.

Incluye (propuesto):
- Mejoras a `components/empty.tsx` (CTA + opcional ilustración)
- Reemplazar textos vacíos en `/urgencias`, `/agenda`, `/adminv1`, `/mi-mascota`

## Patch 3 — Hero visual (sin imágenes)
**Objetivo:** aumentar el gancho del anuncio sin cargar assets.

Incluye (propuesto):
- `components/hero-visual.tsx`
- Update `app/page.tsx` para mostrar mini-mocks (agenda/triage/portal)

## Patch 4 — Pack visual (imágenes IA)
**Objetivo:** subir estética a 8–9/10 manteniendo performance.

Incluye (propuesto):
- `/public/brand/hero.webp`
- `/public/brand/empty-*.webp`
- `/public/brand/avatars/*.webp`
- Integración con `next/image`

## Patch 5 — Eliminar "placeholder" + pulido
**Objetivo:** que nada grite “demo incompleta”.

Incluye (propuesto):
- `app/ubicacion/page.tsx` (map real o card convincente)
- Microinteracciones consistentes
