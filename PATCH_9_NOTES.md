# Patch 9 - CI Guard

## Objetivo
Prevenir errores que rompan despliegues en Vercel agregando validaciones automáticas en scripts y CI.

## Cambios realizados

1. **Scripts en `package.json`**
   - Se agregó `typecheck`: `tsc --noEmit`.
   - Se agregó `check-conflicts`: ejecuta el escaneo de markers de conflicto.
   - Se actualizó `check` para correr:
     1. `npm run check-conflicts`
     2. `npm run typecheck`
     3. `npm run build`

2. **Bloqueo de markers de conflicto**
   - Nuevo script `scripts/check-conflict-markers.sh`.
   - Falla con código de error si detecta líneas que comienzan con:
     - `<<<<<<<`
     - `=======`
     - `>>>>>>>`

3. **GitHub Actions CI**
   - Nuevo workflow `.github/workflows/ci.yml`.
   - Se ejecuta en:
     - `push` a `main`
     - `pull_request`
   - Pasos:
     - `actions/checkout@v4`
     - `actions/setup-node@v4` con Node 20 y cache de npm
     - `npm ci`
     - `npm run check`

## Resultado esperado
- El pipeline falla si hay conflict markers.
- Se validan typecheck + build antes de merge/deploy.
- No se tocaron iconos.
