import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../service.js'

export default function OpenCabinet() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const item = state?.item || null
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Guard: must be logged in AND verified.
    api.me().then((me) => {
      if (!me.logged_in) navigate('/login')
      else if (!me.verified) navigate('/verify')
    })
  }, [navigate])

  async function onOpen() {
    setError('')
    setLoading(true)
    try {
      const res = await api.openCabinet()
      navigate('/success', { state: { message: res.message, item } })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Screen className="screen-center">
      <Logo small />
      <div className="card">
        <h1 className="card-title">Ready to grab your {item ? item.toLowerCase() : 'salad'}?</h1>
        <p className="muted">One shared door · 4 compartments · same fresh product.</p>

        {item && (
          <div className="selected-chip">
            <Icon name="check" size={14} /> Selected: {item}
          </div>
        )}

        <div className="compartments">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="compartment"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Icon name="leaf" size={26} />
            </motion.div>
          ))}
        </div>

        {error && <div className="error">{error}</div>}

        <motion.button
          className="btn btn-open btn-icon"
          onClick={onOpen}
          disabled={loading}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
        >
          <Icon name="unlock" size={20} />
          {loading ? 'Unlocking…' : 'Open Cabinet'}
        </motion.button>
      </div>
    </Screen>
  )
}
