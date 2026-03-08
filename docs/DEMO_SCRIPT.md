# Demo Script (60–120s) + Checklist de grabación

## Guion sugerido (voz + navegación)

### Bloque 1 — Problema y promesa (0:00–0:15)

**Pantalla:** Home.

**Narrativa sugerida:**
"Esta demo muestra cómo una veterinaria puede ordenar captación, agenda y urgencias en una sola experiencia digital, sin fricción para el cliente." 

---

### Bloque 2 — Agenda en segundos (0:15–0:40)

**Pantalla:** `/agenda`.

**Acción:** crear un turno demo en pocos clics.

**Narrativa sugerida:**
"Acá el tutor agenda rápido: selecciona servicio, horario y confirma. El equipo reduce llamadas y gana previsibilidad operativa." 

---

### Bloque 3 — Triage/Urgencias (0:40–1:05)

**Pantalla:** `/urgencias`.

**Acción:** cargar síntomas y mostrar prioridad estimada.

**Narrativa sugerida:**
"Si entra una urgencia, el sistema ayuda a priorizar con un triage orientativo para decidir el siguiente paso de atención." 

---

### Bloque 4 — Historial/continuidad (1:05–1:25)

**Pantalla:** `/mi-mascota`.

**Acción:** mostrar datos e historial para seguimiento.

**Narrativa sugerida:**
"Toda la información relevante queda visible para continuidad: historial, contexto y seguimiento del paciente." 

---

### Bloque 5 — Operación y cierre comercial (1:25–1:50)

**Pantalla:** `/adminv1` (con demo tools activo).

**Acción:** mostrar vista rápida de operación y finalizar en CTA.

**Narrativa sugerida:**
"En el panel demo vemos agenda, triage y campañas en una sola vista. Si te interesa, el próximo paso es definir integración real y plan de implementación." 

## Features que conviene nombrar explícitamente

- Agenda (reserva, confirmación y cancelación).
- Triage de urgencias (orientativo).
- Historial/portal de mascota.
- Panel de operación demo.
- Persistencia local para demo realista.
- Campañas/UTM y CTA de contacto.

## Checklist para grabar video

### Técnica

- Resolución recomendada: **1920x1080** (mínimo 1280x720).
- FPS: **30**.
- Relación: **16:9**.
- Cursor visible y zoom suave en interacciones clave.
- Cerrar notificaciones/sonidos del sistema.

### Páginas mínimas a mostrar

- Home (`/`)
- Agenda (`/agenda`)
- Urgencias (`/urgencias`)
- Mi mascota / historial (`/mi-mascota`)
- Admin demo (`/adminv1?demo=1` o con env activo)

### Calidad de mensaje

- Abrir con problema de negocio (tiempo, orden, conversión).
- Mostrar 1–2 interacciones reales por módulo (no solo scroll).
- Cerrar con **CTA final claro**: “Agendemos implementación / piloto con tu clínica”.

## Activación rápida de demo tools antes de grabar

- URL: `?demo=1` (ejemplo: `http://localhost:3000/?demo=1`).
- Entorno: `NEXT_PUBLIC_DEMO_TOOLS=true`.
- Verificación: acceso disponible a `/adminv1`.
