import { motion } from 'framer-motion'

// Animated, floating "fresh" blobs behind the device frame for a modern feel.
const blobs = [
  { size: 320, top: '-8%', left: '-15%', color: 'rgba(64, 191, 128, 0.55)', dur: 14 },
  { size: 260, top: '55%', left: '65%', color: 'rgba(150, 220, 90, 0.5)', dur: 18 },
  { size: 200, top: '75%', left: '-10%', color: 'rgba(45, 212, 191, 0.45)', dur: 16 },
  { size: 180, top: '5%', left: '70%', color: 'rgba(190, 242, 100, 0.45)', dur: 20 },
]

export default function BrandBackground() {
  return (
    <div className="brand-bg" aria-hidden="true">
      {blobs.map((b, i) => (
        <motion.span
          key={i}
          className="blob"
          style={{ width: b.size, height: b.size, top: b.top, left: b.left, background: b.color }}
          animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
