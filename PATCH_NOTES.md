# Patch Notes

- Se agregó un sistema de demo seed en `lib/demoSeed.ts` para crear datos iniciales coherentes (turnos, triage, mascota y campañas).
- `lib/storage.ts` ahora encapsula acceso seguro a storage (`safeGet`/`safeSet`) y expone `ensureDemoSeed()`, `resetDemo()` y `clearDemo()`.
- Se incorporó `components/demo-bootstrap.tsx` y se montó en `app/layout.tsx` para sembrar datos automáticamente en primera visita.
- La navbar ahora muestra badge `DEMO` y botón `Reset demo` (visible en `md+`) con recarga completa.
- `app/adminv1/page.tsx` ahora vuelve a cargar estado desde storage luego de reset para evitar métricas en cero.
- Fix de robustez: se corrigieron condiciones de carrera (seed antes de cada load) y se endureció la seguridad de storage con `try/catch` en todas las rutas críticas (`safeGet/safeSet/ensureDemoSeed/resetDemo/clearDemo`).
