// Client-side "backend" for the Firebase-hostable, JS-only build of Fresh X.
//
// There is no server: the mocked flow (login -> verify -> open) and the admin
// open-events log all run in the browser. This mirrors the Flask API surface
// (same method names / shapes) so the React pages are unchanged. Session state
// lives in sessionStorage; the open-events log lives in localStorage so the
// admin dashboard can see events within the same browser.

import QRCode from 'qrcode'

const SESSION_KEY = 'freshx.session'
const EVENTS_KEY = 'freshx.events'

// URL encoded in the QR code. Defaults to wherever the app is hosted (e.g. the
// Firebase Hosting URL); override with VITE_CABINET_URL at build time.
const CABINET_URL =
  import.meta.env.VITE_CABINET_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://fresh-x.web.app')

function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || {}
  } catch {
    return {}
  }
}

function writeSession(s) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

function readEvents() {
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY)) || []
  } catch {
    return []
  }
}

function recordOpenEvent(user, source) {
  const events = readEvents()
  const event = {
    id: events.length + 1,
    timestamp: new Date().toISOString(),
    user,
    source, // "user" or "admin"
    mode: 'client',
    detail: 'Client-side mock unlock (no hardware)',
  }
  events.push(event)
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  return event
}

export const api = {
  async me() {
    await delay(40)
    const s = readSession()
    return {
      logged_in: Boolean(s.logged_in),
      username: s.username || null,
      verified: Boolean(s.verified),
      is_admin: Boolean(s.is_admin),
    }
  },

  async login(username, password) {
    await delay()
    const u = (username || '').trim()
    const p = (password || '').trim()
    if (!u || !p) throw new Error('Enter a username and password.')
    writeSession({ logged_in: true, username: u, verified: false, is_admin: false })
    return { ok: true, username: u }
  },

  async register(username) {
    await delay()
    const u = (username || '').trim()
    if (!u) throw new Error('Enter a username.')
    return { ok: true, message: `Welcome, ${u}! (demo account, nothing stored)` }
  },

  async verify() {
    await delay()
    const s = readSession()
    if (!s.logged_in) throw new Error('Please log in first.')
    s.verified = true
    writeSession(s)
    return { ok: true }
  },

  async openCabinet() {
    await delay()
    const s = readSession()
    if (!s.logged_in) throw new Error('Please log in first.')
    if (!s.verified) throw new Error('Please verify your identity first.')
    recordOpenEvent(s.username || 'unknown', 'user')
    return {
      ok: true,
      message: 'Cabinet unlocked. Please take your item.',
      detail: 'Client-side mock unlock (no hardware)',
    }
  },

  async logout() {
    await delay(40)
    sessionStorage.removeItem(SESSION_KEY)
    return { ok: true }
  },

  async adminLogin(username) {
    await delay()
    if ((username || '').trim() !== 'admin') throw new Error('Invalid admin username.')
    const s = readSession()
    s.is_admin = true
    writeSession(s)
    return { ok: true }
  },

  async adminEvents() {
    await delay(40)
    return { ok: true, events: [...readEvents()].reverse() }
  },

  async adminStatus() {
    await delay(40)
    const events = readEvents()
    const last = events[events.length - 1] || null
    return {
      ok: true,
      state: last ? 'active' : 'idle',
      total_opens: events.length,
      last_opened: last ? last.timestamp : null,
      cabinet_url: CABINET_URL,
      gpio_available: false,
    }
  },

  async adminOpen() {
    await delay()
    const event = recordOpenEvent('admin', 'admin')
    return { ok: true, event }
  },

  async qrDataUrl() {
    return QRCode.toDataURL(CABINET_URL, { margin: 1, width: 300, color: { dark: '#04070a', light: '#ffffff' } })
  },
}
