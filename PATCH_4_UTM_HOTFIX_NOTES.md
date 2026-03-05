# UTM Hotfix — missing lib/utm.ts

## Problema
En local, `next dev` falla con:
`Module not found: Can't resolve '@/lib/utm'`

## Causa
Tu árbol de archivos tiene `components/nav.tsx` (y/o otros componentes) importando `@/lib/utm`,
pero el archivo `lib/utm.ts` no está presente en el repo local (merge incompleto / zip parcial / patch aplicado a medias).

## Solución
Este hotfix agrega `lib/utm.ts` con:
- captureUtmFromUrl()
- getStoredUtm()
- appendUtmToUrl()
- buildWhatsappUrl()

## Cómo aplicar
1) Descomprimir este zip en la raíz del repo (donde existe `app/`, `components/`, `lib/`).
2) Verificar: `Test-Path .\lib\utm.ts` (PowerShell) → debe dar `True`.
3) Reiniciar dev server:
   - Si ves errores de cache: borrar `.next` y volver a correr `npm run dev`.
