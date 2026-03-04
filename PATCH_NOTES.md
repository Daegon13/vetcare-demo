# Patch Notes

- Se agregó un sistema de demo seed en `lib/demoSeed.ts` para crear datos iniciales coherentes (turnos, triage, mascota y campañas).
- `lib/storage.ts` ahora encapsula acceso seguro a storage (`safeGet`/`safeSet`) y expone `ensureDemoSeed()`, `resetDemo()` y `clearDemo()`.
- Se incorporó `components/demo-bootstrap.tsx` y se montó en `app/layout.tsx` para sembrar datos automáticamente en primera visita.
- La navbar ahora muestra badge `DEMO` y botón `Reset demo` (visible en `md+`) con recarga completa.
- `app/adminv1/page.tsx` ahora vuelve a cargar estado desde storage luego de reset para evitar métricas en cero.
- Fix de robustez: se corrigieron condiciones de carrera (seed antes de cada load) y se endureció la seguridad de storage con `try/catch` en todas las rutas críticas (`safeGet/safeSet/ensureDemoSeed/resetDemo/clearDemo`).
- Fix de compatibilidad de build: `lib/demoSeed.ts` ahora fuerza tipos de `serviceId`/`status` en turnos demo para evitar widening a `string` tras merges/conflictos.

- Se resolvieron conflictos con `main` unificando variantes en `nav`, `demoSeed`, `storage`, `demo-bootstrap` y `adminv1` para mantener compatibilidad de tipos y flujo de reset estable.
# Patch notes — Demo “con vida” + arquitectura

Este paquete actualiza la demo para que no se sienta vacía y deja documentada la arquitectura para escalar.

## Qué cambia
- Seed automático en primera visita (sin pisar datos del usuario).
- `Reset demo` vuelve a un estado “vivo” (no 0).
- Documentación de arquitectura + patchload.

## Cómo aplicar
1) Descargar el zip del patch.
2) Extraerlo **en la raíz del repo** (sobrescribe archivos).
3) Commit + push.

## Archivos incluidos
- `lib/storage.ts`
- `lib/demoSeed.ts`
- `components/demo-bootstrap.tsx`
- `components/nav.tsx`
- `app/layout.tsx`
- `app/adminv1/page.tsx`
- `docs/ARCHITECTURE.md`
- `docs/PATCHLOAD.md`
- `README.md`

- Patch: Integración completa de imágenes (hero + features + og + empty states) en `public/brand/` y uso vía `next/image`.
