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
