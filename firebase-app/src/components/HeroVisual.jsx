import { motion } from 'framer-motion'

// Dark, glowing vending-cabinet with an animated scan line. Replaces the old
// emoji salad-bowl hero.
export default function HeroVisual() {
  return (
    <div className="hero-visual">
      <motion.div
        className="hv-glow"
        animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.svg
        className="hv-svg"
        width="196"
        height="228"
        viewBox="0 0 196 228"
        fill="none"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <rect
          x="22"
          y="12"
          width="152"
          height="204"
          rx="18"
          stroke="url(#hvStroke)"
          strokeWidth="2"
          fill="rgba(52,211,153,0.05)"
        />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x="38"
            y={32 + i * 45}
            width="120"
            height="35"
            rx="8"
            stroke="rgba(163,230,53,0.4)"
            strokeWidth="1.4"
            fill="rgba(163,230,53,0.04)"
          />
        ))}
        <rect x="148" y="96" width="6" height="40" rx="3" fill="#34d399" />
        <motion.rect
          x="28"
          width="140"
          height="2"
          rx="1"
          fill="#a3e635"
          className="hv-scan"
          animate={{ y: [26, 202, 26], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="hvStroke" x1="0" y1="0" x2="196" y2="228" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#a3e635" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  )
}
