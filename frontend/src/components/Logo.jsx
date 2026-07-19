import { motion } from 'framer-motion'

export default function Logo({ small = false }) {
  return (
    <motion.div
      className={`logo ${small ? 'logo-small' : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <motion.span
        className="logo-leaf"
        animate={{ rotate: [0, -8, 0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        🥬
      </motion.span>
      <span className="logo-text">
        Fresh<span className="logo-x">X</span>
      </span>
    </motion.div>
  )
}
