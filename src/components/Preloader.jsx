import { useState, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import cyberCarImg from './cyber-supercar.png'

// Paste your Base64 string inside these quotes. 
// If left empty, it will use an awesome fallback animated SVG car!
const USER_BASE64_CAR = ""  

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
  opacity: Math.random() * 0.5 + 0.1,
}))

function GlitchText({ text }) {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 120)
    }, 2800 + Math.random() * 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {glitch && (
        <>
          <span style={{
            position: 'absolute', top: 0, left: 0,
            color: '#ff3cac', clipPath: 'polygon(0 20%, 100% 20%, 100% 40%, 0 40%)',
            transform: 'translate(-3px, 1px)', opacity: 0.85, pointerEvents: 'none',
            fontFamily: 'inherit', fontWeight: 'inherit', fontSize: 'inherit',
            letterSpacing: 'inherit',
          }}>{text}</span>
          <span style={{
            position: 'absolute', top: 0, left: 0,
            color: '#00f0ff', clipPath: 'polygon(0 55%, 100% 55%, 100% 75%, 0 75%)',
            transform: 'translate(3px, -1px)', opacity: 0.85, pointerEvents: 'none',
            fontFamily: 'inherit', fontWeight: 'inherit', fontSize: 'inherit',
            letterSpacing: 'inherit',
          }}>{text}</span>
        </>
      )}
      <span style={{ opacity: glitch ? 0.7 : 1, transition: 'opacity 0.05s' }}>{text}</span>
    </span>
  )
}

function ScanLine() {
  return (
    <motion.div
      animate={{ y: ['0%', '100%'] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
      style={{
        position: 'absolute', left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.15), rgba(0,240,255,0.4), rgba(0,240,255,0.15), transparent)',
        zIndex: 2, pointerEvents: 'none',
        boxShadow: '0 0 18px rgba(0,240,255,0.3)',
      }}
    />
  )
}

function CircuitLines() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }} viewBox="0 0 800 600">
      {[
        "M100,150 L200,150 L200,250 L350,250",
        "M700,100 L700,200 L550,200 L550,350",
        "M50,400 L150,400 L150,480 L400,480",
        "M750,450 L650,450 L650,300",
        "M400,50 L400,120 L500,120",
        "M300,550 L300,480 L180,480",
      ].map((d, i) => (
        <motion.path
          key={i} d={d} stroke="#00f0ff" strokeWidth="1.5"
          fill="none" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: i * 0.3, ease: 'easeInOut' }}
        />
      ))}
      {[[200,150],[200,250],[550,200],[550,350],[150,400],[650,450],[400,120],[300,480]].map(([cx,cy], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r="4" fill="#00f0ff"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0,1.5,1], opacity: [0,1,0.6] }}
          transition={{ duration: 0.4, delay: 0.8 + i * 0.2 }}
        />
      ))}
    </svg>
  )
}

function SpeedLines({ isMoving }) {
  return (
    <AnimatePresence>
      {isMoving && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', left: '-120px', top: 0, bottom: 0, width: '120px' }}
        >
          {[40, 55, 70, 85].map((y, i) => (
            <motion.div
              key={y}
              initial={{ x: 50, scaleX: 0 }}
              animate={{ x: -100, scaleX: 1 }}
              transition={{ duration: 0.3 + Math.random() * 0.2, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
              style={{
                position: 'absolute', top: y, right: 0,
                width: 40 + Math.random() * 60, height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.8))',
                transformOrigin: 'right'
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AnimatedCar({ phase }) {
  const isMoving = phase === 'car_enter' || phase === 'car_exit';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* We keep the speed lines because it makes the animation feel much faster! */}
      <SpeedLines isMoving={isMoving} />
      
      <img
        src={cyberCarImg} // Use the new imported variable!
        alt="Neon Cyberpunk Supercar"
        style={{
          width: '100%',
          display: 'block',
          transform: 'scaleX(-1)', // Flip the car to face right
          // THE KEY TRICK: It will make that pure black background vanish completely!
          mixBlendMode: 'screen', 
           filter: 'drop-shadow(0 0 10px rgba(255, 60, 172, 0.4))' // An extra little pink glow
        }}
      />
    </div>
  )
}

const Preloader = forwardRef(({ onComplete }, ref) => {
  const [text, setText] = useState('')
  // Extended Sequence: car_enter -> boot -> car_exit -> type -> delete -> exit
  const [phase, setPhase] = useState('car_enter') 
  const [bootLines, setBootLines] = useState([])
  const [progress, setProgress] = useState(0)
  const [showMain, setShowMain] = useState(false)
  const fullText = "KrishDev"

  const BOOT_SEQUENCE = [
    '> Initializing runtime...',
    '> Loading modules... [OK]',
    '> Mounting filesystem... [OK]',
    '> Warming neural core... [OK]',
    '> Portfolio ready.',
  ]

  // Phase 1: Car slides in
  useEffect(() => {
    if (phase === 'car_enter') {
      const timer = setTimeout(() => setPhase('boot'), 1600)
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Phase 2: Boot sequence types out while car is parked
  useEffect(() => {
    if (phase !== 'boot') return
    let idx = 0
    const run = () => {
      if (idx < BOOT_SEQUENCE.length) {
        const line = BOOT_SEQUENCE[idx]
        idx++
        setBootLines(prev => [...prev, line])
        setProgress(Math.round((idx / BOOT_SEQUENCE.length) * 100))
        setTimeout(run, idx === 1 ? 300 : 260)
      } else {
        setTimeout(() => {
          setBootLines([])
          setPhase('car_exit') // Transition to Phase 3
        }, 600)
      }
    }
    const t = setTimeout(run, 200)
    return () => clearTimeout(t)
  }, [phase])

  // Phase 3: Car zooms off screen
  useEffect(() => {
    if (phase === 'car_exit') {
      const timer = setTimeout(() => {
        setShowMain(true)
        setPhase('type') // Start final typing sequence
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Phase 4 & 5: Typing effect
  useEffect(() => {
    if (phase !== 'type' && phase !== 'delete') return
    let timer

    if (phase === 'type' && text.length < fullText.length) {
      timer = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 80)
    } else if (phase === 'type' && text.length === fullText.length) {
      timer = setTimeout(() => setPhase('delete'), 900)
    } else if (phase === 'delete' && text.length > 0) {
      timer = setTimeout(() => setText(fullText.slice(0, text.length - 1)), 35)
    } else if (phase === 'delete' && text.length === 0) {
      setTimeout(() => onComplete?.(), 300)
    }
    return () => clearTimeout(timer)
  }, [text, phase, onComplete])

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020810; }
    @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.8} 95%{opacity:1} 97%{opacity:0.9} }
    @keyframes noise {
      0%{transform:translate(0,0)} 10%{transform:translate(-1%,-2%)} 20%{transform:translate(2%,1%)}
      30%{transform:translate(-2%,2%)} 40%{transform:translate(1%,-1%)} 50%{transform:translate(-1%,2%)}
      60%{transform:translate(2%,-2%)} 70%{transform:translate(-2%,1%)} 80%{transform:translate(1%,2%)}
      90%{transform:translate(-1%,-1%)} 100%{transform:translate(0,0)}
    }
  `

  // REMOVED OUTER AnimatePresence to fix the exit bug on component unmount
  return (
      <motion.div
        ref={ref}
        key="preloader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.04 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#020810',
          fontFamily: "'Share Tech Mono', monospace",
          overflow: 'hidden',
          animation: 'flicker 8s infinite',
        }}
      >
        <style>{styles}</style>

        {/* Noise overlay */}
        <div style={{
          position: 'absolute', inset: '-10%', opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px', animation: 'noise 0.5s steps(1) infinite',
          pointerEvents: 'none',
        }} />

        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: `linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Deep radial glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,60,100,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <CircuitLines />
        <ScanLine />

        {/* Particles */}
        {PARTICLES.map(p => (
          <motion.div
            key={p.id}
            animate={{ y: [0, -20, 0], opacity: [p.opacity, p.opacity * 1.8, p.opacity] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size, borderRadius: '50%',
              background: p.id % 3 === 0 ? '#00f0ff' : p.id % 3 === 1 ? '#ff3cac' : '#fff',
              boxShadow: `0 0 ${p.size * 3}px currentColor`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* ---- CAR COMPONENT ---- */}
        <motion.div
          initial={{ left: '50%', x: '-150vw', y: 0 }}
          animate={
            phase === 'car_enter' ? { x: '-50%', y: 0 } :
            phase === 'boot' ? { x: '-50%', y: [0, -6, 0] } : // Gentle hovering when parked
            (phase === 'car_exit' || phase === 'type' || phase === 'delete') ? { x: '150vw', y: 0 } :
            { x: '150vw', y: 0 }
          }
          transition={
            phase === 'car_enter' ? { type: 'spring', damping: 14, stiffness: 45, duration: 1.6 } :
            phase === 'boot' ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } :
            phase === 'car_exit' ? { duration: 0.6, ease: [0.8, 0, 0.2, 1] } : 
            { duration: 0 }
          }
          style={{
            position: 'absolute',
            top: '32%',
            width: 'min(300px, 80vw)',
            zIndex: 10,
          }}
        >
          <AnimatedCar phase={phase} />
        </motion.div>

        {/* Boot sequence (Triggered when car is parked) */}
        <AnimatePresence>
          {bootLines.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute', top: '65%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(480px, 90vw)',
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}
            >
              {bootLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{
                    fontSize: 'clamp(11px, 1.6vw, 14px)',
                    color: i === bootLines.length - 1 ? '#00f0ff' : 'rgba(0,240,255,0.55)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {line}
                  {i === bootLines.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    > _</motion.span>
                  )}
                </motion.div>
              ))}

              {/* Progress bar */}
              <div style={{ marginTop: 16 }}>
                <div style={{
                  height: '2px', background: 'rgba(0,240,255,0.12)',
                  borderRadius: 2, overflow: 'hidden',
                }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #00f0ff, #ff3cac)',
                      boxShadow: '0 0 10px rgba(0,240,255,0.6)',
                    }}
                  />
                </div>
                <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(0,240,255,0.35)', letterSpacing: '0.1em' }}>
                  {progress}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main typing display */}
        <AnimatePresence>
          {showMain && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative' }}
            >
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, letterSpacing: '0.8em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontSize: 'clamp(9px, 1.2vw, 11px)',
                  color: 'rgba(0,240,255,0.45)',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                PORTFOLIO_BOOT
              </motion.div>

              {/* Main text row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: '-20px -30px',
                  background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,240,255,0.08) 0%, transparent 70%)',
                  filter: 'blur(10px)', pointerEvents: 'none',
                }} />

                <span style={{
                  fontSize: 'clamp(2rem, 7vw, 4.5rem)',
                  fontWeight: 700,
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: '0.08em',
                  color: '#fff',
                  textShadow: '0 0 40px rgba(0,240,255,0.3), 0 0 80px rgba(0,240,255,0.15)',
                  position: 'relative',
                }}>
                  <GlitchText text={text} />
                </span>

                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
                  style={{
                    display: 'inline-block', width: 'clamp(3px, 0.5vw, 4px)', height: 'clamp(2rem, 6vw, 3.8rem)',
                    background: 'linear-gradient(180deg, #00f0ff, #ff3cac)',
                    borderRadius: '1px', marginLeft: '4px',
                    boxShadow: '0 0 12px rgba(0,240,255,0.8), 0 0 30px rgba(0,240,255,0.3)',
                  }}
                />
              </div>

              {/* Decorative lines */}
              {[-1, 1].map(side => (
                <motion.div
                  key={side}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute', top: '50%',
                    [side === -1 ? 'right' : 'left']: 'calc(100% + 24px)',
                    width: 'clamp(30px, 5vw, 70px)', height: '1px',
                    transformOrigin: side === -1 ? 'right' : 'left',
                    background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent)',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD Elements omitted for brevity - Keep yours from previous file */}
        {/* Corner HUD brackets */}
        {[
          { top: 20, left: 20, rot: 0 },
          { top: 20, right: 20, rot: 90 },
          { bottom: 20, right: 20, rot: 180 },
          { bottom: 20, left: 20, rot: 270 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
            style={{
              position: 'absolute', ...pos,
              width: 24, height: 24,
              transform: `rotate(${pos.rot}deg)`,
              borderTop: '1.5px solid rgba(0,240,255,0.35)',
              borderLeft: '1.5px solid rgba(0,240,255,0.35)',
            }}
          />
        ))}

        {/* Bottom status bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 20, alignItems: 'center',
          }}
        >
          {['SYS', 'NET', 'CPU'].map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 6px #00f0ff' }}
              />
              <span style={{ fontSize: 10, color: 'rgba(0,240,255,0.3)', letterSpacing: '0.12em' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
  )
})

export default Preloader;
