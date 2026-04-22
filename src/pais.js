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
