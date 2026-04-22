# api-padel — código y comentarios

## PROYECTO.txt

````````````````````````
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
package.json     — scripts: npm run dev, npm run build

=== cómo arrancarlo ===
cd api-padel
npm install
npm run dev
Abrir http://localhost:5173/

=== cómo documentar el código (ideas) ===
1) Comentarios cortos solo donde no se entienda solo leyendo el código.
2) Mantener este PROYECTO.txt (o un README) cuando cambies algo grande.
3) Opcional: JSDoc encima de funciones raras (/** ... */) para que el editor las explique.
4) Un CHANGELOG.txt de una línea por cambio importante si el proyecto crece.

````````````````````````

## src/main.jsx

````````````````````````
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Sin tocar App.jsx: si fetch va a padelfip.com (p. ej. otra IP en la red), pasa por el proxy de vite.config.js
const origFetch = globalThis.fetch.bind(globalThis)
globalThis.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : ''
  if (
    url.startsWith('https://www.padelfip.com') &&
    typeof location !== 'undefined'
  ) {
    const p = location.port
    const h = location.hostname
    const enVite =
      p === '5173' ||
      p === '4173' ||
      h === 'localhost' ||
      h === '127.0.0.1' ||
      h === '[::1]'
    if (enVite) {
      try {
        const u = new URL(url)
        return origFetch('/padelfip' + u.pathname + u.search + u.hash, init)
      } catch (_) {}
    }
  }
  return origFetch(input, init)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

````````````````````````

## src/pais.js

````````````````````````
import countries from 'i18n-iso-countries'
import es from 'i18n-iso-countries/langs/es.json'

countries.registerLocale(es)

/** Códigos que usa la API/FIP (no siempre ISO 3166) → nombre en español */
const NOMBRES_FIP = {
  ALG: 'Argelia',
  BOT: 'Botswana',
  BUL: 'Bulgaria',
  CHI: 'Chile',
  CRC: 'República de Costa Rica',
  CRO: 'Croacia',
  DEN: 'Dinamarca',
  GER: 'Alemania',
  GRE: 'Grecia',
  INA: 'Indonesia',
  IRI: 'Irán',
  KOS: 'Kosovo',
  KSA: 'Arabia Saudí',
  KUW: 'Kuwait',
  LAT: 'Letonia',
  BLR: 'Bielorrusia',
  MAD: 'Madagascar',
  MAS: 'Malasia',
  MON: 'Mónaco',
  NED: 'Holanda',
  NEP: 'Nepal',
  PAR: 'Paraguay',
  PHI: 'Filipinas',
  POR: 'Portugal',
  RSA: 'Sudáfrica',
  SUI: 'Suiza',
  UAE: 'Emiratos Árabes Unidos',
  USA: 'Estados Unidos',
  GBR: 'Reino Unido',
  SLO: 'Eslovenia',
  SVK: 'Eslovaquia',
  ISV: 'Islas Vírgenes de EE. UU.',
  PUR: 'Puerto Rico',
  BER: 'Bermudas',
  TTO: 'Trinidad y Tobago',
  BAR: 'Barbados',
  ANT: 'Antillas Neerlandesas',
  SAM: 'Samoa Americana',
  URU: 'Uruguay',
  ZIM: 'Zimbabue',
  TPE: 'Taipéi',
  SUD: 'Sudán',
  BUR: 'Burkina Faso',
  SIN: 'Singapur',
  TAN: 'Tanzania',
}

/**
 * Mismo código → ISO alpha-2 para bandera emoji cuando @see countries.alpha3ToAlpha2 falla
 */
const FIP_A_ISO2 = {
  ALG: 'DZ',
  BOT: 'BW',
  BUL: 'BG',
  CHI: 'CL',
  CRC: 'CR',
  CRO: 'HR',
  DEN: 'DK',
  GER: 'DE',
  GRE: 'GR',
  INA: 'ID',
  IRI: 'IR',
  KOS: 'XK',
  KSA: 'SA',
  KUW: 'KW',
  LAT: 'LV',
  BLR: 'BY',
  MAD: 'MG',
  MAS: 'MY',
  MON: 'MC',
  NED: 'NL',
  NEP: 'NP',
  PAR: 'PY',
  PHI: 'PH',
  POR: 'PT',
  RSA: 'ZA',
  SUI: 'CH',
  UAE: 'AE',
  USA: 'US',
  GBR: 'GB',
  SLO: 'SI',
  SVK: 'SK',
  ISV: 'VI',
  PUR: 'PR',
  BER: 'BM',
  TTO: 'TT',
  BAR: 'BB',
  SAM: 'AS',
  URU: 'UY',
  ZIM: 'ZW',
  TPE: 'TW',
  SUD: 'SD',
  BUR: 'BF',
  SIN: 'SG',
  TAN: 'TZ',
}

function a2(code) {
  const u = String(code || '').toUpperCase()
  if (u.length === 2) return u
  if (u.length === 3) {
    const fromLib = countries.alpha3ToAlpha2(u)
    if (fromLib) return fromLib
    return FIP_A_ISO2[u] || ''
  }
  return ''
}

export function nombrePais(code) {
  const u = String(code || '').toUpperCase()
  if (NOMBRES_FIP[u]) return NOMBRES_FIP[u]
  const n = countries.getName(code, 'es')
  return n || String(code || '')
}

export function banderaEmoji(code) {
  const x = a2(code)
  if (x.length !== 2) return ''
  if (x === 'XK') return '🇽🇰'
  return String.fromCodePoint(...[...x].map((c) => 127397 + c.charCodeAt(0)))
}

/** Misma lógica que el select: primero emoji (código país); si no hay, imagen de la API */
export function banderaJugador(code, countryFlagUrl) {
  const e = banderaEmoji(code)
  if (e) return { tipo: 'emoji', e }
  if (countryFlagUrl) return { tipo: 'img', url: countryFlagUrl }
  return null
}

````````````````````````

## src/App.jsx

````````````````````````
import { useState, useEffect, useMemo, useRef } from 'react'
import { nombrePais, banderaEmoji, banderaJugador } from './pais.js'

// Query para obtener los rankings de la API
const URL_API =
  'category=4fa3a8c3-c5fb-457a-a793-c0c3b5cfbc79&circuit=6ea3dc15-1c19-42ad-99b7-bab78d9fb871&category_name=Master&gender=male'

// URL para obtener los rankings
function urlRankings() {
  const path = `/es/wp-json/fip/v1/rankings/?${URL_API}`
  const local =
    typeof location !== 'undefined' &&
    (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  // Si es local, devuelve la URL de la API local
  if (local) return '/padelfip' + path
  // Si no es local, devuelve la URL de la API de producción
  return 'https://www.padelfip.com' + path
}

// Numero de jugadores por pagina
const POR_PAGINA = 30
// Margen de paginas
const MARGEN = 5

const PAIS_ESP = 'ESP'
const HIMNO_SRC = '/himno-es.mp3'

function itemsPagina(cur1, total) {
  // Margen de paginas
  const start = Math.max(1, cur1 - MARGEN)
  const end = Math.min(total, cur1 + MARGEN)
  const out = []
  // Si el inicio es mayor a 1, agrega el numero 1
  if (start > 1) {
    out.push({ t: 'n', n: 1 })
    // Si el inicio es mayor a 2, agrega los puntos suspensivos ...
    if (start > 2) out.push({ t: '…' })
  }
  // Agrega los numeros de las paginas
  for (let i = start; i <= end; i++) out.push({ t: 'n', n: i })
  // Si el final es menor al total, agrega los puntos suspensivos ...
  if (end < total) {
    // Si el final es menor a total - 1, agrega los puntos suspensivos ...
    if (end < total - 1) out.push({ t: '…' })
    // Agrega el numero total de paginas
    out.push({ t: 'n', n: total })
  }
  return out
}

// Componente principal
export default function App() {
  // Lista de jugadores
  const [lista, setLista] = useState([])
  // Estado de carga
  const [cargando, setCargando] = useState(true)
  // Estado de error
  const [error, setError] = useState(null)
  // Estado de pagina
  const [pagina, setPagina] = useState(0)
  // Estado de busqueda por nombre
  const [qNombre, setQNombre] = useState('')
  // Estado de busqueda por rango
  const [qRank, setQRank] = useState('')
  // Estado de busqueda por pais
  const [qPais, setQPais] = useState('')
  const [openPais, setOpenPais] = useState(false)
  // Referencia al elemento de audio para reproducir el himno
  const refHimno = useRef(null)
  // Referencia al dropdown de país
  const refPaisDd = useRef(null)

  const stopHimno = () => {
    // Obtiene el elemento de audio para parar el himno
    const h = refHimno.current
    // Si el elemento de audio existe, se para el himno
    if (h) {
      // Se establece el loop del himno a false
      h.loop = false
      // Se para el himno
      h.pause()
    }
  }

  const playHimno = () => {
    // Obtiene el elemento de audio para reproducir el himno
    const a = refHimno.current
    if (!a) return
    a.loop = true
    // Establece el volumen del himno
    a.volume = 0.4
    a.currentTime = 0
    const go = () => void a.play().catch(() => {})
    go()
    // Si el estado del audio no es 2, se añade un evento para reproducir el himno
    if (a.readyState < 2) {
      const once = () => {
        // Se elimina el evento para reproducir el himno
        a.removeEventListener('canplay', once)
        // Se reproduce el himno
        go()
      }
      a.addEventListener('canplay', once)
    }
  }
  // Se elimina el evento para reproducir el himno
  useEffect(() => () => refHimno.current?.pause(), [])

  useEffect(() => {
    // Si el dropdown de país no está abierto, se retorna
    if (!openPais) return
    const close = (e) => {
      // Si el dropdown de país no contiene el target, se cierra
      if (refPaisDd.current && !refPaisDd.current.contains(e.target)) setOpenPais(false)
    }
    // Se añade un evento para cerrar el dropdown de país
    document.addEventListener('pointerdown', close)
    // Se elimina el evento para cerrar el dropdown de país
    return () => document.removeEventListener('pointerdown', close)
  }, [openPais])

  useEffect(() => {
    // Variable para verificar si el componente esta vivo (true)
    let vivo = true
    // Funcion asincrona para obtener los rankings
    ;(async () => {
      // Setea el estado de carga a true
      setCargando(true)
      // Setea el estado de error a null
      setError(null)
      // Try para obtener los rankings
      try {
        const res = await fetch(urlRankings())
        // Si la respuesta no es ok, lanza un error
        if (!res.ok) throw new Error('HTTP ' + res.status)
        // Convierte la respuesta a json
        const json = await res.json()
        // Si el componente esta vivo, setea la lista de jugadores
        if (vivo) setLista(json)
        // Si el componente esta vivo, setea el estado de error
      } catch (e) {
        // Si el componente esta vivo, setea el estado de error
        if (vivo) setError(e.message)
        // Si el componente esta vivo, setea el estado de carga a false
      } finally {
        if (vivo) setCargando(false)
      }
    })()
    return () => {
      // Si el componente no esta vivo, setea la variable vivo a false
      vivo = false
    }
  }, [])
  // Lista de paises
  const paisesInfo = useMemo(() => {
    // Crea un nuevo mapa
    const m = new Map()
    // Recorre la lista de jugadores
    for (const p of lista) {
      // Obtiene el nombre del pais
      const c = p.country_name
      // Si el pais no existe o ya existe en el mapa, continua
      if (!c || m.has(c)) continue
      // Agrega el pais al mapa
      m.set(c, {
        code: c,
        nombre: nombrePais(c),
        emoji: banderaEmoji(c),
      })
    }
    // Devuelve la lista de los paises que estan ordenados de manera alfabetica
    return [...m.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  }, [lista])

  const filtrados = useMemo(() => {
    // Crea una nueva lista
    let L = lista
    // Obtiene el nombre del jugador
    const t = qNombre.trim().toLowerCase()
    if (t) L = L.filter((p) => `${p.name} ${p.surname}`.toLowerCase().includes(t))
    // Obtiene el rango del jugador
    const r = parseInt(qRank, 10)
    // Si el rango no es un numero, continua
    if (qRank.trim() !== '' && !Number.isNaN(r)) L = L.filter((p) => p.rank === r)
    // Si el pais no es un pais, continua
    if (qPais) L = L.filter((p) => p.country_name === qPais)
    // Devuelve la lista de los jugadores que coinciden con los criterios de busqueda
    return L
  }, [lista, qNombre, qRank, qPais])

  // Setea la pagina a 0 cuando cambia el nombre, rango o pais
  useEffect(() => setPagina(0), [qNombre, qRank, qPais])
  // Obtiene el total de paginas

  const totalPag = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA) || 1)
  // Obtiene el inicio de la pagina
  const inicio = pagina * POR_PAGINA
  // Obtiene el trozo de la pagina
  const trozo = filtrados.slice(inicio, inicio + POR_PAGINA)
  // Obtiene el numero de la pagina actual
  const cur1 = pagina + 1
  // Obtiene el bloque de paginas
  const bloque = useMemo(() => itemsPagina(cur1, totalPag), [cur1, totalPag])
  // Obtiene si hay filtros
  const hayFiltros = qNombre.trim() !== '' || qRank.trim() !== '' || qPais !== ''

  const textoPais = useMemo(() => {
    if (!qPais) return 'Todas'
    const row = paisesInfo.find((p) => p.code === qPais)
    if (!row) return qPais
    return `${row.emoji ? `${row.emoji} ` : ''}${row.nombre}`
  }, [qPais, paisesInfo])

  // Si se esta cargando el ranking muestra el mensaje
  if (cargando) return <p className="app-loading">Cargando ranking...</p>
  // Si hay un error, muestra el mensaje de error
  if (error) return <p className="app-err">Error: {error}</p>

  return (
    <div
      className={
        qPais === PAIS_ESP ? 'app-shell app-shell--espana' : 'app-shell'
      }
    >
      <audio
        ref={refHimno}
        src={HIMNO_SRC}
        preload="auto"
        playsInline
        loop={qPais === PAIS_ESP}
        {...{ 'webkit-playsinline': '' }}
      />
      <h1 className="app-title">Ranking FIP (Master, hombres)</h1>

      <section className="app-filters">
        <p className="app-filters__lead">Buscar y filtrar</p>
        <label className="app-label">
          <span className="app-label__text">Nombre o apellido</span>
          <input
            // Input para buscar por nombre o apellido
            type="search"
            value={qNombre}
            onChange={(e) => setQNombre(e.target.value)}
            placeholder="Ej. Tapia"
            className="app-input"
          />
        </label>
        <label className="app-label">
          <span className="app-label__text">Puesto en el ranking</span>
          <input
            // Input para buscar por rango
            type="number"
            min={1}
            value={qRank}
            onChange={(e) => setQRank(e.target.value)}
            placeholder="Ej. 1"
            className="app-input"
          />
        </label>
        <div className="app-label" role="group" aria-labelledby="filtro-pais-lbl">
          <span className="app-label__text" id="filtro-pais-lbl">
            Nacionalidad
          </span>
          <div className="app-dd" ref={refPaisDd}>
            <button
              type="button"
              className="app-input app-dd__open"
              onClick={() => setOpenPais((o) => !o)}
              aria-expanded={openPais}
              aria-haspopup="listbox"
            >
              {textoPais}
            </button>
            {openPais && (
              <ul className="app-dd__list">
                <li>
                  <button
                    type="button"
                    className="app-dd__opt"
                    onClick={() => {
                      setQPais('')
                      setOpenPais(false)
                      stopHimno()
                    }}
                  >
                    Todas
                  </button>
                </li>
                {paisesInfo.map((row) => (
                  <li key={row.code}>
                    <button
                      type="button"
                      className="app-dd__opt"
                      onClick={() => {
                        setQPais(row.code)
                        setOpenPais(false)
                        if (row.code === PAIS_ESP) playHimno()
                        else stopHimno()
                      }}
                    >
                      {row.emoji ? `${row.emoji} ` : ''}
                      {row.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <p className="app-stats">
        {hayFiltros ? (
          <>
            {filtrados.length} de {lista.length} jugadores
          </>
        ) : (
          <>{lista.length} jugadores</>
        )}
      </p>
      {/* Lista de jugadores que se muestran en la pagina tras aplicar los filtros */}
      <ul className="app-list">
        {trozo.map((p) => {
          const b = banderaJugador(p.country_name, p.country_flag)
          return (
            <li key={p.player_id} className="app-row">
              <img src={p.thumbnail} alt="" className="app-photo" />
              <div className="app-main">
                <span className="app-rank">{p.rank}.</span>{' '}
                <span className="app-name">
                  {p.name} {p.surname}
                </span>
                <span className="app-meta"> — {p.points} pts</span>
              </div>
              <div className="app-side">
                {b?.tipo === 'emoji' ? (
                  <span className="app-flag-emoji" aria-hidden="true">
                    {b.e}
                  </span>
                ) : b?.tipo === 'img' ? (
                  <img src={b.url} alt="" className="app-flag" />
                ) : null}
                <span className="app-country">{nombrePais(p.country_name)}</span>
              </div>
            </li>
          )
        })}
      </ul>

      {filtrados.length === 0 && (
        <p className="app-empty">No hay jugadores con estos criterios.</p>
      )}

      <p className="app-pag-info">
        Página {cur1} de {totalPag} · {POR_PAGINA} por página
      </p>

      <nav className="app-pag" aria-label="Paginación">
        <button
          type="button"
          className="app-pag__btn"
          disabled={pagina === 0}
          onClick={() => setPagina((n) => n - 1)}
        >
          Anterior
        </button>

        {bloque.map((it, i) =>
          it.t === '…' ? (
            <span key={'e' + i} className="app-dots">
              …
            </span>
          ) : (
            <button
              key={it.n}
              type="button"
              onClick={() => setPagina(it.n - 1)}
              className={it.n === cur1 ? 'app-page-num app-page-num--on' : 'app-page-num'}
            >
              {it.n}
            </button>
          ),
        )}

        <button
          type="button"
          className="app-pag__btn"
          disabled={pagina >= totalPag - 1 || filtrados.length === 0}
          onClick={() => setPagina((n) => n + 1)}
          >
          Siguiente
        </button>
      </nav>
    </div>
  )
}

````````````````````````

## vite.config.js

````````````````````````
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/padelfip': {
        target: 'https://www.padelfip.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/padelfip/, ''),
      },
      '/wikimedia': {
        target: 'https://upload.wikimedia.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wikimedia/, ''),
      },
    },
  },
  preview: {
    proxy: {
      '/padelfip': {
        target: 'https://www.padelfip.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/padelfip/, ''),
      },
      '/wikimedia': {
        target: 'https://upload.wikimedia.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wikimedia/, ''),
      },
    },
  },
})

````````````````````````

