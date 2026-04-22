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
