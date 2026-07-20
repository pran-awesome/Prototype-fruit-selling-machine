import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import Logo from '../components/Logo.jsx'
import FloatingVeggies from '../components/FloatingVeggies.jsx'
import { api } from '../api.js'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.login(username, password)
      navigate('/verify')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen className="screen-center">
      <FloatingVeggies />
      <Logo />
      <p className="tagline">Fresh salad, unlocked in seconds.</p>

      <form className="card" onSubmit={onSubmit}>
        <h1 className="card-title">Sign in</h1>
        <label className="field">
          <span>Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="anything works"
            autoComplete="username"
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="anything works"
            autoComplete="current-password"
          />
        </label>

        {error && <div className="error">{error}</div>}

        <motion.button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </motion.button>

        <Link className="btn btn-ghost" to="/register">
          Create an account
        </Link>
      </form>

      <div className="login-links">
        <Link className="admin-link" to="/">
          ← Home
        </Link>
        <Link className="admin-link" to="/admin">
          Admin dashboard
        </Link>
      </div>
    </Screen>
  )
}
