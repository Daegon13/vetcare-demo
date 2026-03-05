# PATCH 5 — Oferta + Precalificación + Conversión

- Se rediseñó `/lp` con una nueva sección **Planes** (3 cards) y CTA “Quiero este plan” para preseleccionar oferta.
- Se incorporó un formulario embebido de precalificación en `/lp` (nombre, clínica, ciudad, whatsapp e intereses por checkbox).
- El submit del formulario ahora:
  - dispara `trackEvent("lead_submit", { plan, ...utm })`,
  - guarda el payload en `localStorage` bajo `vetcare:lead`,
  - navega por cliente a `/gracias`,
  - abre WhatsApp con mensaje prellenado incluyendo plan, clínica/ciudad, intereses y UTMs/ref.
- Se creó `app/gracias/page.tsx` con:
  - mensaje de confirmación,
  - evento `lead_thanks_view` con UTM,
  - botón “Abrir WhatsApp” con el mismo enlace prellenado desde `vetcare:lead`.
- Se extendió `lib/utm.ts` con tipos de lead y helper `buildLeadWhatsappUrl` para unificar armado de mensaje comercial con contexto.
- Se evitó spam del evento `sales_mode_enabled`: ahora se registra **una sola vez por sesión/localStorage** usando `vetcare:sales_mode_logged`.
- Se pulió Sales Mode:
  - Home oculta “Ver panel admin” cuando demo tools no están habilitadas.
  - Navbar oculta badge “DEMO” cuando no hay demo tools habilitadas.
