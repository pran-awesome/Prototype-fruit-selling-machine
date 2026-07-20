import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Verify from './pages/Verify.jsx'
import OpenCabinet from './pages/OpenCabinet.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Admin from './pages/Admin.jsx'
import BrandBackground from './components/BrandBackground.jsx'

export default function App() {
  const location = useLocation()
  return (
    <div className="app-shell">
      <BrandBackground />
      <div className="device-frame">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/open" element={<OpenCabinet />} />
            <Route path="/success" element={<Confirmation />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}
