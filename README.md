# VetCare Demo (Next.js + Tailwind + TypeScript)

Demo web “vendible” para una veterinaria. Objetivo: **servir como gancho para anuncios/video**, y si un cliente se interesa, poder **escalar** con una ruta clara.

## Qué incluye
- **Agenda de turnos**: disponibilidad real con duración + buffer (`lib/schedule.ts`).
- **Triage de urgencias**: prioridad baja/media/alta con recomendación inmediata.
- **Portal “Mi Mascota”**: vacunas + recordatorio por WhatsApp + historial mock via API.
- **Panel Admin v1**: turnos, triage, mascotas y campañas.
- **Persistencia demo**: `localStorage`.

## Modo demo “con vida” (seed)
Para evitar que el sitio se sienta vacío, la demo se “seedea” automáticamente en la primera visita.

- `ensureDemoSeed()` corre una vez por navegador (**no pisa datos del usuario**).
- `resetDemo()` vuelve la demo a un estado “vivo” (no la deja en 0).

Keys:
- `vetcare.appts.v1`
- `vetcare.triage.v1`
- `vetcare.pet.v1`
- `vetcare.campaigns.v1`
- `vetcare.seeded.v1`

## Rebrand rápido
La fuente única de datos mock está en:
- `src/data/vet.ts`

Ahí cambiás:
- nombre, WhatsApp, dirección
- servicios (duraciones/buffer)
- staff, testimonios, FAQs

## Run local
```bash
npm i
npm run dev
```
Abrir: http://localhost:3000

## Deploy (Vercel)
Recomendado setear:
- `NEXT_PUBLIC_SITE_URL` (para OG tags, metadata y sitemap/robots)

Ejemplo:
```
NEXT_PUBLIC_SITE_URL=https://vetcare-uy.vercel.app
```

## Documentación
- Arquitectura y ruta de escalado: `docs/ARCHITECTURE.md`
- Plan de patches incremental: `docs/PATCHLOAD.md`

