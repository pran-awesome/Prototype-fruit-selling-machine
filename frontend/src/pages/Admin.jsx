import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import Logo from '../components/Logo.jsx'
import { api } from '../api.js'

function AdminLogin({ onLoggedIn }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.adminLogin(username, password)
      onLoggedIn()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h1 className="card-title">Admin sign in</h1>
      <p className="muted">Username is not correct</p>
      <label className="field">
        <span>Username</span>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label className="field">
        <span>Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="anything" />
      </label>
      {error && <div className="error">{error}</div>}
      <motion.button className="btn btn-primary" type="submit" disabled={loading} whileTap={{ scale: 0.97 }}>
        {loading ? 'Signing in…' : 'Enter dashboard'}
      </motion.button>
      <Link className="btn btn-ghost" to="/">
        Back to app
      </Link>
    </form>
  )
}

function Dashboard() {
  const [status, setStatus] = useState(null)
  const [events, setEvents] = useState([])
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    const [s, e] = await Promise.all([api.adminStatus(), api.adminEvents()])
    setStatus(s)
    setEvents(e.events || [])
  }, [])

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 4000)
    return () => clearInterval(t)
  }, [refresh])

  async function manualOpen() {
    setBusy(true)
    try {
      await api.adminOpen()
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <h1 className="card-title">Admin dashboard</h1>
        <Link className="btn btn-ghost btn-small" to="/">
          Exit
        </Link>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="stat-label">Status</div>
          <div className={`stat-value ${status?.state === 'active' ? 'active' : ''}`}>
            {status ? status.state : '…'}
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Total opens</div>
          <div className="stat-value">{status ? status.total_opens : '…'}</div>
        </div>
        <div className="stat stat-wide">
          <div className="stat-label">Last opened</div>
          <div className="stat-value small">{status?.last_opened || '—'}</div>
        </div>
      </div>

      <div className="admin-cols">
        <div className="qr-card">
          <div className="stat-label">Scan to open cabinet</div>
          <img className="qr" src="/api/qr.png" alt="Cabinet QR code" />
          <div className="muted mono">{status?.cabinet_url}</div>
          <div className="muted small">
            GPIO hardware: {status?.gpio_available ? 'connected' : 'stubbed (no Pi hardware)'}
          </div>
        </div>

        <div className="events-card">
          <div className="events-head">
            <div className="stat-label">Open events log</div>
            <motion.button className="btn btn-small btn-primary" onClick={manualOpen} disabled={busy} whileTap={{ scale: 0.96 }}>
              {busy ? '…' : 'Trigger open'}
            </motion.button>
          </div>
          {events.length === 0 ? (
            <p className="muted">No opens yet.</p>
          ) : (
            <ul className="events">
              {events.map((ev) => (
                <motion.li
                  key={ev.id}
                  className="event"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className={`badge ${ev.source}`}>{ev.source}</span>
                  <span className="event-user">{ev.user}</span>
                  <span className="event-time">{ev.timestamp}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    api.me().then((me) => {
      setIsAdmin(Boolean(me.is_admin))
      setChecked(true)
    })
  }, [])

  return (
    <Screen className="screen-admin">
      <Logo small />
      {!checked ? null : isAdmin ? <Dashboard /> : <AdminLogin onLoggedIn={() => setIsAdmin(true)} />}
    </Screen>
  )
}
