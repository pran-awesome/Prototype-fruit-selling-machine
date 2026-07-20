import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import Logo from '../components/Logo.jsx'
import SaladBowl from '../components/SaladBowl.jsx'
import FloatingVeggies from '../components/FloatingVeggies.jsx'

const features = [
  { icon: '🕓', title: '24 / 7', text: 'Grab a salad any time, day or night.' },
  { icon: '📱', title: 'Scan & Go', text: 'Your phone is the key — no app to install.' },
  { icon: '🌿', title: 'Always Fresh', text: 'Crisp veggies, restocked daily.' },
]

const steps = [
  { n: 1, icon: '📷', title: 'Scan', text: 'Scan the cabinet QR code.' },
  { n: 2, icon: '🛡️', title: 'Verify', text: 'Confirm it’s you in one tap.' },
  { n: 3, icon: '🥗', title: 'Grab', text: 'The door unlocks — enjoy!' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 20 } },
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <Screen className="screen-landing">
      <FloatingVeggies dense />

      <div className="landing-top">
        <Logo small />
        <Link className="pill-link" to="/admin">
          Admin
        </Link>
      </div>

      <motion.section className="hero" variants={container} initial="hidden" animate="show">
        <SaladBowl />

        <motion.h1 className="hero-title" variants={item}>
          Farm-fresh salad,
          <br />
          <span className="grad-text">on demand.</span>
        </motion.h1>

        <motion.p className="hero-sub" variants={item}>
          Fresh X is a smart cabinet stocked with crisp, ready-to-eat salads.
          Scan, verify, and grab yours in seconds.
        </motion.p>

        <motion.div className="hero-cta" variants={item}>
          <motion.button
            className="btn btn-open btn-hero"
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            🥗 Get Fresh
          </motion.button>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>
            I already have an account
          </button>
        </motion.div>

        <motion.div className="chips" variants={item}>
          <span className="chip">🥬 Vegan</span>
          <span className="chip">♻️ Zero-waste</span>
          <span className="chip">⚡ 10-sec unlock</span>
        </motion.div>
      </motion.section>

      <section className="section">
        <h2 className="section-title">Why Fresh X</h2>
        <motion.div
          className="feature-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((f) => (
            <motion.div key={f.title} className="feature" variants={item} whileHover={{ y: -4 }}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-text">{f.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section">
        <h2 className="section-title">How it works</h2>
        <div className="steps">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              className="step"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="step-badge">{s.icon}</div>
              <div className="step-body">
                <div className="step-title">
                  {s.n}. {s.title}
                </div>
                <div className="feature-text">{s.text}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.button
        className="btn btn-primary btn-block"
        onClick={() => navigate('/login')}
        whileTap={{ scale: 0.98 }}
      >
        Start now →
      </motion.button>

      <footer className="landing-footer">Fresh X · Phase 1 prototype 🌱</footer>
    </Screen>
  )
}
