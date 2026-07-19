import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import Logo from '../components/Logo.jsx'
import { api } from '../api.js'

export default function Verify() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Guard: must be logged in to reach this screen.
    api.me().then((me) => {
      if (!me.logged_in) navigate('/')
    })
  }, [navigate])

  async function onConfirm() {
    setError('')
    setLoading(true)
    try {
      await api.verify()
      navigate('/open')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen className="screen-center">
      <Logo small />
      <div className="card">
        <motion.div
          className="shield"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          🛡️
        </motion.div>
        <h1 className="card-title">Verify identity</h1>
        <p className="muted">
          This is a demo step — no real ID or OTP check. Tap below to confirm it's you.
        </p>

        {error && <div className="error">{error}</div>}

        <motion.button className="btn btn-primary" onClick={onConfirm} disabled={loading} whileTap={{ scale: 0.97 }}>
          {loading ? 'Confirming…' : 'Confirm identity'}
        </motion.button>
      </div>
    </Screen>
  )
}
