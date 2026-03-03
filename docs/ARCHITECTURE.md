# Arquitectura (Demo → escalable)

Este proyecto está pensado como **demo “vendible”**: se usa para mostrar el producto en un video y, si un cliente se interesa, poder **escalar** sin reescribir todo.

## Capas

1) **Branding / Rebrand (single source of truth)**
- `src/data/vet.ts`
  - Nombre, WhatsApp, dirección
  - Servicios (duración + buffer)
  - Staff, testimonios, FAQ

2) **Dominio (tipos y lógica)**
- `lib/types.ts`: tipos (`Appointment`, `TriageCase`, `PetProfile`, etc.)
- `lib/schedule.ts`: disponibilidad real por duración + buffer

3) **Persistencia (modo demo)**
- `lib/storage.ts`: fachada de almacenamiento.
  - Hoy: `localStorage`.
  - Mañana: se puede reemplazar por un adapter/API sin tocar las páginas.

### Keys de localStorage
- `vetcare.appts.v1`
- `vetcare.triage.v1`
- `vetcare.pet.v1`
- `vetcare.campaigns.v1`
- `vetcare.seeded.v1` (flag para seed inicial)

4) **Demo Seed (evita “sitio vacío”)**
- `lib/demoSeed.ts`: genera un set de datos demo (turnos + triage + mascota + campañas).
- `lib/storage.ts` expone:
  - `ensureDemoSeed()` → se ejecuta una vez por navegador; **no pisa datos del usuario**.
  - `resetDemo()` → vuelve a un estado “vivo” (no borra a vacío).

5) **Bootstrap del lado cliente**
- `components/demo-bootstrap.tsx` se monta en `app/layout.tsx`.
- Extra: los `load*()` también llaman `ensureDemoSeed()` para evitar race conditions.

## Ruta de escalado (cuando un cliente muerde)

### Objetivo
Mantener el UI y la lógica del dominio (tipos + scheduling) y cambiar **solo la capa de persistencia**.

### Paso recomendado
1) Crear una interfaz “repository” (o adapter) para `Appointments/Triage/Pet/Campaigns`.
2) Implementar:
   - `LocalStorageRepository` (ya existe implícito en `lib/storage.ts`)
   - `ApiRepository` (fetch a `/api/*`)
3) En producción:
   - DB (Postgres/Supabase/Neon)
   - Auth (WhatsApp OTP o magic link)
   - Multi-tenant por `clinicId`

## Convenciones
- Todo lo “vendible” debe funcionar sin backend (demo).
- Nada debe decir “placeholder” en UI si se usa en anuncios.
