# PATCH 4.1 — Hotfix: Demo tools persistentes

## Problema
Al navegar internamente (o tras recargar) se podía “perder” `?demo=1`, por lo que **desaparecían**:
- `Reset demo`
- `Admin v1`
- `ThemeToggle`

Esto es esperable en *Sales Mode*, pero molestaba para testing interno porque el parámetro `demo=1` no se propagaba.

## Solución
- `lib/demoMode.ts`
  - Ahora `?demo=1` **persiste** un flag en `localStorage` (`vetcare:demo_tools=1`).
  - Se puede desactivar con `?demo=0`.
  - El orden de prioridad queda: `NEXT_PUBLIC_DEMO_TOOLS` > `?demo=1` > flag guardado.
- `components/nav.tsx`
  - Cuando las demo tools están habilitadas, los links internos (`Inicio`, `Agenda`, etc.) ahora **propagan** `?demo=1` automáticamente.

## Cómo usar
- Modo ventas (público): `https://vetcare-uy.vercel.app/` (sin herramientas demo)
- Modo demo (interno): `https://vetcare-uy.vercel.app/?demo=1`
- Salir del modo demo: `https://vetcare-uy.vercel.app/?demo=0`
