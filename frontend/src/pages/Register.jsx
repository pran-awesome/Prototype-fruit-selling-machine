import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import Logo from '../components/Logo.jsx'
import { api } from '../api.js'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const res = await api.register(username, password)
      setMessage(res.message || 'Account created (demo).')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen className="screen-center">
      <Logo small />
      <form className="card" onSubmit={onSubmit}>
        <h1 className="card-title">Create account</h1>
        <p className="muted">Demo only — nothing is stored.</p>
        <label className="field">
          <span>Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="pick a name" />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="pick a password"
          />
        </label>

        {error && <div className="error">{error}</div>}
        {message && <div className="success-note">{message}</div>}

        <motion.button className="btn btn-primary" type="submit" disabled={loading} whileTap={{ scale: 0.97 }}>
          {loading ? 'Creating…' : 'Register'}
        </motion.button>
        <Link className="btn btn-ghost" to="/">
          Back to sign in
        </Link>
      </form>
    </Screen>
  )
}
