import { motion } from 'framer-motion'

// Minimal line-art vending cabinet with a subtle green scan line. Clean and
// monochrome to suit the Apple-style light UI.
export default function HeroVisual() {
  return (
    <div className="hero-visual">
      <motion.svg
        className="hv-svg"
        width="180"
        height="212"
        viewBox="0 0 180 212"
        fill="none"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <rect x="18" y="10" width="144" height="192" rx="20" stroke="#1d1d1f" strokeWidth="1.5" />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x="34"
            y={28 + i * 42}
            width="112"
            height="32"
            rx="9"
            stroke="#d2d2d7"
            strokeWidth="1.2"
          />
        ))}
        <rect x="138" y="90" width="5" height="34" rx="2.5" fill="#34c759" />
        <motion.rect
          x="26"
          width="128"
          height="2"
          rx="1"
          fill="#34c759"
          animate={{ y: [24, 188, 24], opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>
    </div>
  )
}
