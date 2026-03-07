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
- Para las páginas que necesitan Client Components (`agenda`, `urgencias`, `mi-mascota`, `lp`, `gracias`), se dejó `page.tsx` como Server Component con `export const metadata` y se movió la UI a archivos `*-client-page.tsx`.
- Se creó/ajustó:
  - `app/sitemap.ts` con todas las rutas públicas solicitadas.
  - `app/robots.ts` con `allow: /` y URL de sitemap.

## Notas

- No se tocaron iconos ni imágenes existentes.
