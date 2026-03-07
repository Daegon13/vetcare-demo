# PATCH 8 — SEO Pack básico

## Cambios realizados

- Se centralizó la generación de metadata SEO en `lib/seo.ts`.
- Se actualizó `app/layout.tsx` para:
  - usar `BRAND` como fuente de título/description base,
  - fijar `metadataBase`/canonical con `NEXT_PUBLIC_SITE_URL`,
  - completar OpenGraph/Twitter con imagen OG existente (`/opengraph-image`),
  - inyectar JSON-LD tipo `VeterinaryCare` con campos condicionales (sin inventar datos).
- Se agregó metadata por ruta para:
  - `/`
  - `/servicios`
  - `/agenda`
  - `/urgencias`
  - `/mi-mascota`
  - `/equipo`
  - `/ubicacion`
  - `/faq`
  - `/lp`
  - `/gracias`
- Se creó/ajustó:
  - `app/sitemap.ts` con todas las rutas públicas solicitadas.
  - `app/robots.ts` con `allow: /` y URL de sitemap.

## Notas

- No se tocaron iconos ni imágenes existentes.
- Para páginas client (`agenda`, `urgencias`, `mi-mascota`, `lp`, `gracias`) se usó `layout.tsx` de segmento para exportar metadata válida en App Router.
