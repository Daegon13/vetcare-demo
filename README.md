# VetCare Demo (Next.js App Router + Tailwind + TypeScript)

DEMO web “vendible” para veterinaria con:
- **Agenda de turnos** (lógica de disponibilidad + duración + buffer + .ics)
- **Triage de urgencias** (prioridad baja/media/alta)
- **Portal “Mi Mascota”** (vacunas + recordatorio WhatsApp + historial mock via API)
- **Panel Admin v1** (turnos, triage, mascotas y campañas)
- Persistencia demo en `localStorage`

## Requisitos
- Node **>= 18.18**

## Local
```bash
npm i
npm run dev
```
Abrir: http://localhost:3000

## Deploy en Vercel (recomendado)

### Opción A (GitHub → Vercel)
1. Subí este proyecto a un repo de GitHub.
2. En Vercel: **Add New → Project → Import**.
3. Framework: detecta **Next.js** automático.
4. (Opcional pero recomendado) agregá env var:
   - `NEXT_PUBLIC_SITE_URL` = `https://<tu-proyecto>.vercel.app` (o tu dominio)
5. Deploy.

### Opción B (Vercel CLI)
```bash
npm i -g vercel
vercel
```

## Notas
- No requiere backend real.
- La API mock para historial está en `app/api/history/route.ts`.
- Sitemap y robots se generan automáticamente (`/sitemap.xml` y `/robots.txt`).
