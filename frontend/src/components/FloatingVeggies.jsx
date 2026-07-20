import { motion } from 'framer-motion'

// Salad vegetables that gently float, drift and spin behind the content.
const VEGGIES = ['🥬', '🥕', '🍅', '🥒', '🌽', '🥑', '🫑', '🥗', '🧅', '🥦']

// Deterministic pseudo-random layout so it looks lively but stable per mount.
const items = Array.from({ length: 14 }).map((_, i) => {
  const emoji = VEGGIES[i % VEGGIES.length]
  const left = (i * 37) % 100
  const top = (i * 53) % 100
  const size = 22 + ((i * 13) % 26)
  const dur = 9 + ((i * 7) % 10)
  const delay = (i % 6) * 0.6
  const drift = i % 2 === 0 ? 24 : -24
  return { emoji, left, top, size, dur, delay, drift, key: i }
})

export default function FloatingVeggies({ dense = false }) {
  const shown = dense ? items : items.slice(0, 9)
  return (
    <div className="veggies" aria-hidden="true">
      {shown.map((it) => (
        <motion.span
          key={it.key}
          className="veggie"
          style={{ left: `${it.left}%`, top: `${it.top}%`, fontSize: it.size }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.9, 0.9, 0.8],
            y: [0, -26, 0, 18, 0],
            x: [0, it.drift, 0, -it.drift, 0],
            rotate: [0, 18, -12, 8, 0],
          }}
          transition={{ duration: it.dur, delay: it.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {it.emoji}
        </motion.span>
      ))}
    </div>
  )
}
