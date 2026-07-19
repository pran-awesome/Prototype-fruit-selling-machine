import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import Logo from '../components/Logo.jsx'
import { api } from '../api.js'

export default function OpenCabinet() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Guard: must be logged in AND verified.
    api.me().then((me) => {
      if (!me.logged_in) navigate('/')
      else if (!me.verified) navigate('/verify')
    })
  }, [navigate])

  async function onOpen() {
    setError('')
    setLoading(true)
    try {
      const res = await api.openCabinet()
      navigate('/success', { state: { message: res.message } })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Screen className="screen-center">
      <Logo small />
      <div className="card">
        <h1 className="card-title">Ready to grab your salad?</h1>
        <p className="muted">One shared door · 4 compartments · same fresh product.</p>

        <div className="compartments">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="compartment"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              🥗
            </motion.div>
          ))}
        </div>

        {error && <div className="error">{error}</div>}

        <motion.button
          className="btn btn-open"
          onClick={onOpen}
          disabled={loading}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
        >
          {loading ? 'Unlocking…' : '🔓 Open Cabinet'}
        </motion.button>
      </div>
    </Screen>
  )
}
