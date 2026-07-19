// Small fetch helper. All requests are same-origin (Vite proxies /api to Flask
// in dev; Flask serves the built app in production), so cookies flow normally.
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }
  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

export const api = {
  me: () => request('/api/me'),
  login: (username, password) =>
    request('/api/login', { method: 'POST', body: { username, password } }),
  register: (username, password) =>
    request('/api/register', { method: 'POST', body: { username, password } }),
  verify: () => request('/api/verify', { method: 'POST' }),
  openCabinet: () => request('/api/open-cabinet', { method: 'POST' }),
  logout: () => request('/api/logout', { method: 'POST' }),
  adminLogin: (username, password) =>
    request('/api/admin/login', { method: 'POST', body: { username, password } }),
  adminEvents: () => request('/api/admin/events'),
  adminStatus: () => request('/api/admin/status'),
  adminOpen: () => request('/api/admin/open', { method: 'POST' }),
}
