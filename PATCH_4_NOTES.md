# PATCH 4 — Sales Mode + Landing + UTM + Conversion Tracking

- Se activó **Sales Mode por defecto** para ocultar herramientas internas en la navbar cuando no hay `?demo=1` ni `NEXT_PUBLIC_DEMO_TOOLS` habilitado.
- Se creó `lib/demoMode.ts` con `isDemoToolsEnabled(searchParams)` para centralizar la lógica de visibilidad de herramientas demo.
- La navegación ahora muestra `Admin v1`, `Reset demo` y `ThemeToggle` solo cuando demo tools están habilitadas.
- Se agregó captura global de UTMs desde cliente en `DemoBootstrap`, persistiendo datos de campaña en `localStorage` (`vetcare:utm`).
- Se creó `lib/utm.ts` con utilidades para capturar, leer y propagar UTMs a URLs y mensajes de WhatsApp.
- Se actualizó el CTA de WhatsApp en navbar para incluir contexto de implementación y UTMs en el mensaje prellenado.
- Se actualizó `FloatingCta` para propagar UTMs tanto a WhatsApp como al CTA de implementación (con bypass para `forms.gle`).
- Se incorporó tracking enriquecido con UTM en `cta_whatsapp_click` y `cta_implementation_click` (payload con `location` + UTM).
- Se añadió evento `sales_mode_enabled` cuando la app opera sin herramientas de demo visibles.
- Se creó la nueva landing `/lp` orientada a campañas, con hero claro, sección “Qué incluye”, “Implementación rápida (3 pasos)”, FAQ y 2 CTAs.
- La landing dispara `landing_view` al render y usa enlaces de CTA con UTMs propagadas para mejorar atribución.
- Se mantuvo la lógica de `resetDemo()` sin borrar `theme` ni `vetcare:utm`, preservando preferencias y atribución de marketing.
