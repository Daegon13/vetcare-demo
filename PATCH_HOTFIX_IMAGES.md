# Hotfix — Integración de imágenes (fix de build)

## Problema
`npm run dev` fallaba con:

- `Unexpected token div. Expected jsx identifier` en `app/page.tsx`.

La causa era que el archivo `app/page.tsx` quedó **corrupto**: se inyectó el array de features dentro de un `className`/JSX, rompiendo la sintaxis TSX.

## Cambios en este hotfix
- **Reescritura completa** de `app/page.tsx` para recuperar una estructura TSX válida.
- Integración correcta de:
  - `public/brand/hero.webp` en el hero (con `next/image`, `priority`, `sizes`).
  - `feature-appointments.webp`, `feature-triage.webp`, `feature-portal.webp`, `feature-admin.webp` en la grilla de "Diferenciales" (lazy).
- No cambia rutas ni APIs: solo arregla el render del Home y mantiene las integraciones de imágenes.

## Cómo validar
1. `npm install`
2. `npm run dev`
3. Abrir Home y verificar:
   - se ve el hero image
   - se ven las 4 tarjetas con imágenes en "Diferenciales"
   - no hay error 500
