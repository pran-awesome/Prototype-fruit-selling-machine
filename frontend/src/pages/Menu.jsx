import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'
import { api } from '../api.js'

// Item picker shown before opening the cabinet. Whatever the user picks, they
// are sent to the same Open Cabinet page (single shared door in Phase 1).
const items = [
  { id: 'salad', name: 'Salad', desc: 'Crisp mixed greens', icon: 'bowl', featured: true },
  { id: 'tomato', name: 'Tomato', desc: 'Juicy & ripe', icon: 'tomato' },
  { id: 'cucumber', name: 'Cucumber', desc: 'Cool & crunchy', icon: 'cucumber' },
  { id: 'spring-onion', name: 'Spring Onion', desc: 'Fresh & zesty', icon: 'onion' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 20 } },
}

export default function Menu() {
  const navigate = useNavigate()

  useEffect(() => {
    // Guard: must be logged in AND verified to choose an item.
    api.me().then((me) => {
      if (!me.logged_in) navigate('/login')
      else if (!me.verified) navigate('/verify')
    })
  }, [navigate])

  function choose(chosen) {
    // Any choice leads to the same Open Cabinet page.
    navigate('/open', { state: { item: chosen.name } })
  }

  return (
    <Screen className="screen-center">
      <Logo small />
      <div className="card">
        <h1 className="card-title">What would you like?</h1>
        <p className="muted">Pick your item — the cabinet opens either way.</p>

        <motion.div className="menu-grid" variants={container} initial="hidden" animate="show">
          {items.map((it) => (
            <motion.button
              key={it.id}
              type="button"
              className={`menu-item ${it.featured ? 'featured' : ''}`}
              variants={item}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => choose(it)}
            >
              {it.featured && <span className="menu-tag">Fresh pick</span>}
              <span className="menu-icon">
                <Icon name={it.icon} size={30} />
              </span>
              <span className="menu-name">{it.name}</span>
              <span className="menu-desc">{it.desc}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </Screen>
  )
}
