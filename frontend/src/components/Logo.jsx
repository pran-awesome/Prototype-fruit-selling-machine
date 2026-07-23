import { motion } from 'framer-motion'

// Fresh Lab emblem: a cabinet frame holding a test tube with roots and a green
// sprout growing out of it. Line-art, uses currentColor so it adapts to theme;
// the leaves use the green accent.
function Emblem({ size = 38 }) {
  const h = size
  const w = Math.round((h * 44) / 56)
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 44 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="38" height="50" rx="8" />
      <path d="M8 24H16M28 24H36" strokeWidth="1.6" />
      <path d="M14 24H30" strokeWidth="1.6" />
      <path d="M16 24V40a6 6 0 0 0 12 0V24" />
      <path d="M22 27V39M22 31 19 34M22 33 25 36M22 36 20 39" strokeWidth="1.3" />
      <path d="M22 24V14" strokeWidth="1.6" />
      <path d="M22 16C18 16 15 14 15 10c4 0 7 2 7 6Z" stroke="#34c759" strokeWidth="1.6" />
      <path d="M22 15c4 0 7-2 7-6-4 0-7 2-7 6Z" stroke="#34c759" strokeWidth="1.6" />
      <path d="M22 14c0-3 1-5 3-6" stroke="#34c759" strokeWidth="1.6" />
    </svg>
  )
}

export default function Logo({ small = false }) {
  return (
    <motion.div
      className={`logo ${small ? 'logo-small' : ''}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="logo-mark">
        <Emblem size={small ? 30 : 38} />
      </span>
      <span className="logo-text">FRESH&nbsp;LAB</span>
    </motion.div>
  )
}
