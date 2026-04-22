=== api-padel — qué es ===
Web con React + Vite que muestra el ranking masculino Master de la FIP (pádel).
Los datos salen de la API pública de padelfip.com.

=== cómo está hecho ===
- React 19 (hooks: useState, useEffect, useMemo, useRef).
- Estilos: Tailwind + index.css.
- Datos: fetch al endpoint /es/wp-json/fip/v1/rankings/ con filtros (categoría Master, etc.).
- En local, Vite hace proxy /padelfip → padelfip.com (vite.config.js) para evitar CORS.
- pais.js: nombres de países en español y banderas (i18n-iso-countries + mapeos FIP).
- App.jsx: lista paginada, filtros por nombre/ranking/país, extras (ej. himno para ESP).

=== archivos importantes ===
src/main.jsx     — monta la app
src/App.jsx      — pantalla principal y lógica
src/pais.js      — países y banderas
vite.config.js   — proxy desarrollo
package.json     — scripts: dev, build, doc:pdf

=== cómo arrancarlo ===
cd api-padel
npm install
npm run dev
Abrir http://localhost:5173/

=== PDF con el código ===
npm run doc:pdf  →  crea docs/CODIGO.pdf y docs/CODIGO.md (necesita Chrome en el PC).

=== cómo documentar el código (ideas) ===
1) Comentarios cortos solo donde no se entienda solo leyendo el código.
2) Mantener este PROYECTO.txt (o un README) cuando cambies algo grande.
3) Opcional: JSDoc encima de funciones raras (/** ... */) para que el editor las explique.
4) Un CHANGELOG.txt de una línea por cambio importante si el proyecto crece.
