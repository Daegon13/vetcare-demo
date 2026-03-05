# PATCH 4.2 — Service Icons (8) integration

## Qué se cambió

- Se agregó el directorio `public/brand/icons/` con un `README.md` que define **nombres esperados** y mapeo de íconos.
- Se actualizó `/servicios` para:
  - Mostrar una grilla de **8 íconos** (1:1) desde `public/brand/icons/*.webp`.
  - Incorporar un ícono por servicio en cada card (mapeo por `service.id`).
  - Mapear `estetica -> grooming` (en la demo, estética es lo más cercano a grooming).

## Importante

Este patch **no incluye** los 8 archivos `.webp` recortados (se exportan desde `public/brand/services-icons.webp`).

Luego de recortar/exportar, colocarlos en:

- `public/brand/icons/consulta.webp`
- `public/brand/icons/vacunacion.webp`
- `public/brand/icons/desparasitacion.webp`
- `public/brand/icons/laboratorio.webp`
- `public/brand/icons/cirugia.webp`
- `public/brand/icons/internacion.webp`
- `public/brand/icons/grooming.webp`
- `public/brand/icons/control.webp`
