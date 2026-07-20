import { useEffect, useRef } from 'react'

// Cool dark animated background: a moving particle "constellation" on canvas,
// layered over an animated aurora glow (see .aurora in CSS). No emojis.
export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let particles = []
    let raf = 0
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function resize() {
      w = canvas.width = window.innerWidth * DPR
      h = canvas.height = window.innerHeight * DPR
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    function init() {
      const count = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 15000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35 * DPR,
        vy: (Math.random() - 0.5) * 0.35 * DPR,
        r: (Math.random() * 1.6 + 0.6) * DPR,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)
      const maxDist = 130 * DPR

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.hypot(dx, dy)
          if (dist < maxDist) {
            const a = (1 - dist / maxDist) * 0.28
            ctx.strokeStyle = `rgba(52, 211, 153, ${a})`
            ctx.lineWidth = DPR * 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = 'rgba(163, 230, 53, 0.75)'
        ctx.shadowBlur = 8 * DPR
        ctx.shadowColor = 'rgba(52, 211, 153, 0.6)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      raf = window.requestAnimationFrame(draw)
    }

    resize()
    init()
    if (prefersReduced) {
      draw()
      window.cancelAnimationFrame(raf)
    } else {
      draw()
    }

    const onResize = () => {
      resize()
      init()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="aurora" />
      <div className="grid-overlay" />
      <canvas ref={canvasRef} className="bg-canvas" />
    </div>
  )
}
