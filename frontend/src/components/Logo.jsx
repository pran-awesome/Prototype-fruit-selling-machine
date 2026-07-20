import { motion } from 'framer-motion'
import Icon from './Icon.jsx'

export default function Logo({ small = false }) {
  return (
    <motion.div
      className={`logo ${small ? 'logo-small' : ''}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="logo-mark">
        <Icon name="leaf" size={small ? 18 : 22} />
      </span>
      <span className="logo-text">
        Fresh<span className="logo-x">X</span>
      </span>
    </motion.div>
  )
}
