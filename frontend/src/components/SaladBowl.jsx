import { motion } from 'framer-motion'

// Hero animation: a salad bowl with vegetables orbiting + dropping in, and a
// soft rotating glow ring behind it.
const orbit = ['🍅', '🥕', '🥒', '🌽', '🫑', '🥑']

export default function SaladBowl() {
  return (
    <div className="bowl-stage">
      <motion.div
        className="bowl-glow"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />

      {orbit.map((v, i) => {
        const angle = (i / orbit.length) * Math.PI * 2
        const radius = 92
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius * 0.62
        return (
          <motion.span
            key={i}
            className="orbit-veggie"
            style={{ x, y }}
            animate={{ y: [y, y - 10, y], rotate: [0, 12, -12, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {v}
          </motion.span>
        )
      })}

      <motion.div
        className="bowl"
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
        transition={{
          scale: { type: 'spring', stiffness: 200, damping: 14 },
          opacity: { duration: 0.4 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        🥗
      </motion.div>
    </div>
  )
}
