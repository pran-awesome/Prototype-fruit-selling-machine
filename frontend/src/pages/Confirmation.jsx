import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import Logo from '../components/Logo.jsx'
import { api } from '../api.js'

export default function Confirmation() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const message = state?.message || 'Cabinet unlocked. Please take your item.'

  async function onDone() {
    await api.logout().catch(() => {})
    navigate('/')
  }

  useEffect(() => {
    // If someone lands here directly without state, still fine — show default.
  }, [])

  return (
    <Screen className="screen-center">
      <Logo small />
      <div className="card card-success">
        <motion.div
          className="checkmark"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        >
          ✓
        </motion.div>
        <h1 className="card-title">Unlocked!</h1>
        <p className="muted">{message}</p>

        <motion.button className="btn btn-primary" onClick={onDone} whileTap={{ scale: 0.97 }}>
          Done
        </motion.button>
      </div>
    </Screen>
  )
}
