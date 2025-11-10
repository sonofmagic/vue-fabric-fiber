const FALLBACK_SITE_URL = 'https://fabric-ports.netlify.app'

function sanitizeSiteUrl(raw?: string) {
  if (!raw || typeof raw !== 'string') {
    return FALLBACK_SITE_URL
  }
  const trimmed = raw.trim()
  if (!trimmed) {
    return FALLBACK_SITE_URL
  }
  return trimmed.replace(/\/+$/, '')
}

export const SITE_URL = sanitizeSiteUrl(import.meta.env?.VITE_SITE_URL as string | undefined)
export const SITE_NAME = 'Fabric Ports'
export const SITE_TAGLINE = 'Vue Fabric.js bindings & demo studio'
export const SITE_DESCRIPTION
  = 'Fabric Ports ships typed Vue bindings for Fabric.js plus interactive demos, JSON-driven canvases, and RenderGroup task orchestration.'
export const SITE_AUTHOR = 'Fabric Ports maintainers'
export const DEFAULT_SOCIAL_IMAGE
  = 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80'
export const DEFAULT_SOCIAL_IMAGE_ALT = 'Fabric Ports canvas hero with layered typography and overlay imagery'
export const THEME_COLOR = '#020617'
export const DEFAULT_KEYWORDS = [
  'fabric.js',
  'vue 3',
  'canvas',
  'design tooling',
  'rendergroup',
  'typed bindings',
] as const

export const DEFAULT_TITLE = `${SITE_NAME} · ${SITE_TAGLINE}`

function ensureLeadingSlash(path?: string) {
  if (!path || path === '/') {
    return '/'
  }
  return path.startsWith('/') ? path : `/${path}`
}

export function buildCanonicalUrl(path?: string) {
  if (path && /^https?:\/\//i.test(path)) {
    return path
  }

  const normalized = ensureLeadingSlash(path)

  if (normalized === '/') {
    return SITE_URL
  }

  return `${SITE_URL}${normalized}`
}
