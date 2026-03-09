# VetCare Demo Kit

Este repositorio contiene una **demo comercial interactiva** para clínicas veterinarias.

## Resumen ejecutivo (para abrir una llamada en 15s)

- **Problema:** la operación veterinaria se fragmenta entre agenda, urgencias y seguimiento.
- **Demo:** una experiencia única para mostrar orden operativo y mejor respuesta al tutor.
- **Resultado esperado:** menos fricción, mejor visibilidad y siguiente paso claro de implementación.

## ¿Qué es esta demo?

- Una experiencia navegable para mostrar el flujo punta a punta de una operación veterinaria moderna (captación, agenda, urgencias y seguimiento).
- Un entorno orientado a ventas y validación con datos mock persistidos localmente para que se sienta real en una reunión o video.
- Una base técnica preparada para escalar a integraciones reales (login, calendario real, mensajería, CRM, analytics productivo).

## ¿Qué NO es esta demo? (alcance)

- No es un sistema clínico productivo ni reemplaza criterio veterinario.
- No incluye autenticación robusta, permisos por rol, auditoría, backups, ni integraciones de producción activas.
- No emite tickets reales de guardia ni procesa pagos reales.
- No reemplaza implementación, QA y hardening antes de salir a producción.

## Flujo recomendado para mostrar (60–120s)

> Objetivo: contar una historia breve de “problema → operación → resultado”.

1. **Inicio (10–15s):** Home + propuesta de valor.
2. **Agenda (20–30s):** crear/confirmar un turno para evidenciar rapidez operativa.
3. **Urgencias/Triage (20–30s):** cargar síntomas y mostrar prioridad estimada.
4. **Portal mi mascota / historial (15–25s):** mostrar continuidad clínica.
5. **Panel admin demo (15–20s):** validar operación (agenda + triage + campañas/reset).
6. **Cierre CTA (5–10s):** invitar a implementación/piloto y próxima reunión.

### Runbook express (versión 90s)

1. Home (valor)
2. Agenda (crear turno)
3. Urgencias (triage)
4. Mi mascota (historial)
5. Admin + CTA final

## Features clave para mencionar en la demo

- Triage orientativo para priorización de urgencias.
- Agenda operativa con reserva, confirmación y cancelación.
- Vista de urgencias recientes y prioridad.
- Historial y datos de mascota (portal “Mi mascota”).
- Panel admin demo para lectura rápida de operación.
- Persistencia local para continuidad de la historia de demo.
- Enlaces/UTM para campañas comerciales.
- CTA de contacto para implementación.

## Checklist para grabar video

### Calidad técnica

- Resolución recomendada: **1920x1080** (mínimo 1280x720).
- FPS: **30**.
- Formato: **16:9**.
- Cursor visible y sin notificaciones del sistema.

### Páginas a mostrar

- Home (`/`)
- Agenda (`/agenda`)
- Urgencias (`/urgencias`)
- Mi mascota / historial (`/mi-mascota`)
- Admin demo (`/adminv1`) con demo tools habilitado

### Cierre comercial

- Terminar con CTA claro: “Agendemos implementación/piloto para tu clínica”.

## Quickstart local (demo)

```bash
npm install
npm run dev
# abrir http://localhost:3000/?demo=1
```

Si querés dejar demo tools fijo en local:

```bash
# .env.local
NEXT_PUBLIC_DEMO_TOOLS=true
```

## Modo demo tools

El proyecto permite habilitar herramientas internas de demo (por ejemplo `/adminv1`) por **query param** y/o **env var**.

### Opción A: por URL

- Abrí cualquier página con `?demo=1` o `?demo=true`.
- Ejemplo: `http://localhost:3000/?demo=1`
- Para desactivar explícitamente: `?demo=0` o `?demo=false`.

### Opción B: por variable de entorno

Configurar en `.env.local` o en el proveedor de deploy:

```bash
NEXT_PUBLIC_DEMO_TOOLS=true
```

### Prioridad de activación

1. `NEXT_PUBLIC_DEMO_TOOLS` (build-time)
2. `?demo=1|true` o `?demo=0|false`
3. estado persistido en `localStorage`

Además, para rutas admin, el middleware también persiste la bandera en cookie y restringe `/adminv1` cuando demo tools no está habilitado.

### Troubleshooting rápido

- **No abre `/adminv1`:** volver a Home con `?demo=1` y refrescar.
- **Sigue bloqueado:** verificar `NEXT_PUBLIC_DEMO_TOOLS=true` y reiniciar `npm run dev`.
- **Confusión de estado:** limpiar `localStorage`/cookies de demo y volver a activar por URL.
- **Demo en video:** dejar explícito en la toma inicial que demo tools está activo.

## Demo script + checklist de grabación

Para un guion listo para grabar y checklist de video, ver:

- `docs/DEMO_SCRIPT.md`

## Entrega como patch (`git apply`)

Si necesitás mover este cambio entre repos sin merge directo:

```bash
git format-patch -1 --stdout > patch-13-demo-kit-followup.diff
git apply patch-13-demo-kit-followup.diff
```
