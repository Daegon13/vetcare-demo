# Patch — Integración completa de imágenes (Brand pack)

## Qué se agregó
- Carpeta `public/brand/` con assets en formato **.webp**:
  - `hero.webp`
  - `og.webp`
  - `feature-admin.webp`
  - `feature-portal.webp`
  - `feature-triage.webp`
  - `feature-appointments.webp`
  - `services-icons.webp`
  - (compat) `empty-agenda.webp`, `empty-urgencias.webp`, `empty-portal.webp`
  - `avatars/avatar-01.webp` … `avatars/avatar-05.webp` (opcionales)

> Nota: en este ZIP los `.webp` son **placeholders livianos** para que el proyecto corra y puedas validar integración.
> Podés reemplazarlos por tus imágenes finales manteniendo los mismos nombres.

## Integración en UI
- **Home**
  - Se integra `public/brand/hero.webp` como Hero visual con `next/image` y `priority`.
  - En la sección “Diferenciales”, las 4 tarjetas principales muestran ilustraciones:
    - Turnos → `feature-appointments.webp`
    - Urgencias → `feature-triage.webp`
    - Portal → `feature-portal.webp`
    - Admin → `feature-admin.webp`
- **Empty states**
  - `components/empty.tsx` ahora soporta `illustrationSrc` (lazy, sin `priority`).
  - Agenda / Urgencias / Mi Mascota usan ilustraciones de brand pack para estado vacío:
    - Agenda → `feature-appointments.webp`
    - Urgencias → `feature-triage.webp`
    - Portal → `feature-portal.webp`
- **Servicios**
  - Si existe `app/servicios/page.tsx`, se agrega una “vista rápida” usando `services-icons.webp` con `next/image`.

## SEO / Sharing
- Se agrega `openGraph.images` apuntando a `/brand/og.webp`.
- Se agrega `twitter.images` apuntando a `/brand/og.webp`.

## Criterios de calidad
- Se evita PNG pesado: todo en `.webp`.
- Todas las imágenes se usan vía `next/image`.

