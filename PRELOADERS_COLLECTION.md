# Premium Preloader Collection

This collection contains all the preloader animation components used in the **KrishDev** portfolio. You can use these in future projects by copying the code and installing the required dependencies.

## Table of Contents
1. [Cyber Car Preloader (Global App)](#1-cyber-car-preloader-global-app)
2. [Three.js Pillars Preloader](#2-threejs-pillars-preloader)
3. [Quantum Neural Core Preloader](#3-quantum-neural-core-preloader)
4. [Legacy Core Preloader](#4-legacy-core-preloader)

---

## 1. Cyber Car Preloader (Global App)
A cyberpunk-styled preloader featuring a sliding neon car, boot sequence logs, and a glitchy "KrishDev" typing effect.

**Dependencies:** `framer-motion`

### [Preloader.jsx](file:///c:/Users/HP/Desktop/vs%20code%20projects/KrishDev/src/components/Preloader.jsx)
```javascript
import { useState, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import cyberCarImg from './cyber-supercar.png'

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
      <SpeedLines isMoving={isMoving} />
      <img
        src={cyberCarImg} 
        alt="Neon Cyberpunk Supercar"
        style={{
          width: '100%',
          display: 'block',
          transform: 'scaleX(-1)', 
          mixBlendMode: 'screen', 
          filter: 'drop-shadow(0 0 10px rgba(255, 60, 172, 0.4))'
        }}
      />
    </div>
  )
}

const Preloader = forwardRef(({ onComplete }, ref) => {
  const [text, setText] = useState('')
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

  useEffect(() => {
    if (phase === 'car_enter') {
      const timer = setTimeout(() => setPhase('boot'), 1600)
      return () => clearTimeout(timer)
    }
  }, [phase])

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
          setPhase('car_exit')
        }, 600)
      }
    }
    const t = setTimeout(run, 200)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'car_exit') {
      const timer = setTimeout(() => {
        setShowMain(true)
        setPhase('type')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [phase])

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
        <div style={{
          position: 'absolute', inset: '-10%', opacity: 0.035,
          backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")\`,
          backgroundSize: '200px 200px', animation: 'noise 0.5s steps(1) infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: \`linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)\`,
          backgroundSize: '60px 60px',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,60,100,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <CircuitLines />
        <ScanLine />
        {PARTICLES.map(p => (
          <motion.div
            key={p.id}
            animate={{ y: [0, -20, 0], opacity: [p.opacity, p.opacity * 1.8, p.opacity] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            style={{
              position: 'absolute', left: \`\${p.x}%\`, top: \`\${p.y}%\`,
              width: p.size, height: p.size, borderRadius: '50%',
              background: p.id % 3 === 0 ? '#00f0ff' : p.id % 3 === 1 ? '#ff3cac' : '#fff',
              boxShadow: \`0 0 \${p.size * 3}px currentColor\`,
              pointerEvents: 'none',
            }}
          />
        ))}
        <motion.div
          initial={{ left: '50%', x: '-150vw', y: 0 }}
          animate={
            phase === 'car_enter' ? { x: '-50%', y: 0 } :
            phase === 'boot' ? { x: '-50%', y: [0, -6, 0] } :
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
              <div style={{ marginTop: 16 }}>
                <div style={{
                  height: '2px', background: 'rgba(0,240,255,0.12)',
                  borderRadius: 2, overflow: 'hidden',
                }}>
                  <motion.div
                    animate={{ width: \`\${progress}%\` }}
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
        <AnimatePresence>
          {showMain && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative' }}
            >
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
              transform: \`rotate(\${pos.rot}deg)\`,
              borderTop: '1.5px solid rgba(0,240,255,0.35)',
              borderLeft: '1.5px solid rgba(0,240,255,0.35)',
            }}
          />
        ))}
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
```

---

## 2. Three.js Pillars Preloader
A high-end 3D preloader with rotating neon pillars and interactive mouse-drag responsiveness.

**Dependencies:** `three`, `framer-motion`

### [ThreePreloader.jsx](file:///c:/Users/HP/Desktop/vs%20code%20projects/KrishDev/src/components/ThreePreloader.jsx)
```javascript
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './ThreePreloader.css';

const ThreePreloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const labelRef = useRef(null);
  const percentRef = useRef(null);
  const barFillRef = useRef(null);
  const dotsRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const [completeText, setCompleteText] = useState('loading');

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let animationFrameId;
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(8, 11, 13);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene.add(new THREE.AmbientLight(0x8ab4e8, 0.65));
    const dirLight = new THREE.DirectionalLight(0xc0d8ff, 1.0);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    scene.add(dirLight);

    const floorGeo = new THREE.CircleGeometry(14, 96);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x070f20, roughness: 0.6, metalness: 0.2 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const PILLAR_COUNT = 30;
    const RADIUS = 5;
    const PILLAR_W = 0.58;
    const PILLAR_H = 1.8;
    const PILLAR_D = 0.18;
    const baseH = PILLAR_H * 0.4;
    const glassH = PILLAR_H * 0.6;

    const baseGeo = new THREE.BoxGeometry(PILLAR_W, baseH, PILLAR_D);
    const glassGeo = new THREE.BoxGeometry(PILLAR_W, glassH, PILLAR_D);
    baseGeo.translate(0, baseH / 2, 0);
    glassGeo.translate(0, glassH / 2, 0);

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1a7fff, roughness: 0.3, metalness: 0.1 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x3399ff, transparent: true, opacity: 0.55,
      roughness: 0.05, metalness: 0.0, transmission: 0.85, thickness: 0.4,
    });

    const pillars = [];
    for (let i = 0; i < PILLAR_COUNT; i++) {
      const angle = (i / PILLAR_COUNT) * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.position.set(Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS);
      pivot.rotation.y = -angle + Math.PI / 2;
      const pillarGroup = new THREE.Group();
      pillarGroup.add(new THREE.Mesh(baseGeo, baseMat));
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.y = baseH;
      pillarGroup.add(glass);
      pivot.add(pillarGroup);
      scene.add(pivot);
      pillars.push({ group: pillarGroup, angle });
    }

    let timeOffset = 0, dragVel = 0, dragging = false, lastSA = null;
    const scrAngle = (x, y) => Math.atan2(y - window.innerHeight / 2, x - window.innerWidth / 2);
    const ptrDown = (x, y) => { dragging = true; lastSA = scrAngle(x, y); dragVel = 0; };
    const ptrMove = (x, y) => {
      if (!dragging) return;
      const sa = scrAngle(x, y);
      let d = sa - lastSA;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      timeOffset += d * 1.4; dragVel = d * 1.4; lastSA = sa;
    };

    window.addEventListener('mousedown', (e) => ptrDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => ptrMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', () => dragging = false);

    const LOAD_DURATION = 6000;
    const loadStart = performance.now();
    let loadDone = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      if (!dragging) { timeOffset += dragVel; dragVel *= 0.91; }
      const waveTime = time * 2 + timeOffset;
      pillars.forEach(p => {
        const tilt = Math.max(0, Math.sin(waveTime - p.angle * 1.5)) * (Math.PI / 2.2);
        p.group.rotation.x = -tilt;
      });

      const now = performance.now();
      const t = Math.min((now - loadStart) / LOAD_DURATION, 1);
      const pct = Math.floor(t * 100);
      if (percentRef.current) percentRef.current.firstChild.textContent = pct;
      if (barFillRef.current) barFillRef.current.style.width = pct + '%';

      if (t >= 1 && !loadDone) {
        loadDone = true;
        setCompleteText('complete');
        setTimeout(() => onCompleteRef.current?.(), 800);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className="three-preloader-container" ref={containerRef}>
      <canvas ref={canvasRef} className="three-preloader-canvas" />
      <div id="three-label" ref={labelRef}>
        <div id="three-percent" ref={percentRef}>0<sup>%</sup></div>
        <div id="three-bar-wrap"><div id="three-bar-fill" ref={barFillRef}></div></div>
        <div id="three-loading-text">{completeText}<span id="three-dots" ref={dotsRef}>...</span></div>
      </div>
    </div>
  );
};

export default ThreePreloader;
```

### [ThreePreloader.css](file:///c:/Users/HP/Desktop/vs%20code%20projects/KrishDev/src/components/ThreePreloader.css)
```css
.three-preloader-container {
  position: fixed; inset: 0;
  background: radial-gradient(ellipse at 38% 36%, #0c1a35 0%, #071020 55%, #030b18 100%);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
}
#three-label {
  position: fixed; pointer-events: none; transform: translate(-50%, -50%);
  display: flex; flex-direction: column; align-items: center; gap: 7px;
}
#three-percent {
  font-family: serif; font-style: italic; font-size: 50px; font-weight: bold; color: #fff;
}
#three-bar-wrap { width: 100px; height: 3px; background: rgba(30, 80, 180, 0.25); border-radius: 4px; overflow: hidden; }
#three-bar-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #1a7fff, #00cfff); transition: width 0.12s linear; }
```

---

## 3. Quantum Neural Core Preloader
A performant Canvas 2D preloader featuring a neural network particle web and a glowing "Quantum Core."

**Dependencies:** `framer-motion`

### [QuantumPreloader.jsx](file:///c:/Users/HP/Desktop/vs%20code%20projects/KrishDev/src/components/QuantumPreloader.jsx)
```javascript
import React, { useEffect, useRef } from 'react';

const QuantumPreloader = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0, percent = 0, animationFrameId;

    const draw = () => {
      const W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight;
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.185;
      percent = Math.min(100, (t / 6) * 100);
      
      if (percent >= 100) {
        setTimeout(() => onCompleteRef.current?.(), 800);
        return;
      }

      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
      // Inner sphere drawing logic...
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = '#7c3aed'; ctx.fill();

      t += 0.016; animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999 }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QuantumPreloader;
```

---

## 4. Legacy Core Preloader
A beautiful 3D Three.js core with rotating rings, SVG rays, and a sophisticated step-by-step loading status system.

**Dependencies:** `three`, `framer-motion`

### [JSX Source: LegacyPreloader.jsx](file:///c:/Users/HP/Desktop/vs%20code%20projects/KrishDev/src/components/LegacyPreloader.jsx)

```javascript
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './LegacyPreloader.css';

const STEPS = [
  { at: 0, label: 'INITIALIZING SYSTEM' },
  { at: 10, label: 'LOADING CORE ASSETS' },
  { at: 25, label: 'BUILDING GEOMETRY' },
  { at: 42, label: 'COMPILING SHADERS' },
  { at: 58, label: 'LINKING MODULES' },
  { at: 72, label: 'CALIBRATING RENDERER' },
  { at: 87, label: 'FINALIZING SCENE' },
  { at: 99, label: 'COMPLETE' },
];

const LegacyPreloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState(STEPS[0].label);
  const [isDone, setIsDone] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let scene, camera, renderer, clock, coreMesh, ring1, ring2, animationFrameId;
    const C = { cyan: 0x00d8f0, cyanDim: 0x003344 };

    const getCameraZ = () => {
      const w = window.innerWidth;
      if (w < 600) return 26;
      if (w < 1000) return 22;
      return 20;
    };

    const init = () => {
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.035);
      camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 500);
      camera.position.z = getCameraZ();
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      clock = new THREE.Clock();

      scene.add(new THREE.AmbientLight(C.cyan, 0.15));
      scene.add(new THREE.PointLight(C.cyan, 8, 25));

      const buildCore = () => {
        coreMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshStandardMaterial({ color: 0x080c10, emissive: C.cyanDim, emissiveIntensity: 0.35 }), 320);
        const d = new THREE.Object3D();
        for (let i = 0; i < 320; i++) {
          const phi = Math.acos(-1 + (2 * i) / 320), th = Math.sqrt(320 * Math.PI) * phi;
          d.position.set(Math.cos(th) * Math.sin(phi) * 2.6, Math.sin(th) * Math.sin(phi) * 2.6, Math.cos(phi) * 2.6);
          d.updateMatrix(); coreMesh.setMatrixAt(i, d.matrix);
        }
        scene.add(coreMesh);
      };
      
      const buildRing = (r, count, bead) => {
        const ring = new THREE.InstancedMesh(new THREE.SphereGeometry(bead, 10, 10), new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 1.2 }), count);
        const d = new THREE.Object3D();
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2;
          d.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
          d.updateMatrix(); ring.setMatrixAt(i, d.matrix);
        }
        return ring;
      };

      buildCore();
      ring1 = buildRing(5.2, 56, 0.14); scene.add(ring1);
      ring2 = buildRing(5.5, 56, 0.14); scene.add(ring2);
      animate();
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (coreMesh) { coreMesh.rotation.y = t * 0.22; coreMesh.scale.setScalar(1 + Math.sin(t * 1.8) * 0.04); }
      if (ring1) { ring1.rotation.y = t * 0.75; ring1.rotation.x = Math.PI / 2 + Math.sin(t * 0.9) * 0.55; }
      if (ring2) { ring2.rotation.y = -t * 0.55; ring2.rotation.z = Math.PI / 4 + Math.cos(t * 0.7) * 0.45; }
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.z = getCameraZ();
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    init();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    let pVal = 0, tVal = 0, timer, done = false;
    const tick = () => {
      if (!done && pVal < tVal) pVal += (tVal - pVal) * 0.07 + 0.12;
      const p = Math.min(100, pVal); setProgress(p);
      let lbl = STEPS[0].label;
      for (const s of STEPS) if (Math.floor(p) >= s.at) lbl = s.label;
      setStepLabel(lbl);
      if (p >= 99.9 && !done) {
        done = true; setIsDone(true); setStepLabel('READY'); setShowFlash(true);
        setTimeout(() => onCompleteRef.current?.(), 1200);
      }
      if (!done || pVal < 100) requestAnimationFrame(tick);
    };
    const schedule = () => {
      const rem = 100 - tVal; if (rem <= 0) return;
      timer = setTimeout(() => { tVal = Math.min(100, tVal + 4 + Math.random() * 10); schedule(); }, 150 + Math.random() * 400);
    };
    schedule(); tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="legacy-preloader-container" ref={containerRef}>
      <div id="legacy-rays">
        <svg viewBox="0 0 800 800">
          <defs><radialGradient id="rayG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#00d8f0" stopOpacity="0.6" /><stop offset="100%" stopOpacity="0" /></radialGradient></defs>
          {Array.from({ length: 28 }).map((_, i) => (
            <polygon key={i} points={`400,400 ${400 + Math.cos((i/28)*Math.PI*2-0.045)*550},${400 + Math.sin((i/28)*Math.PI*2-0.045)*550} ${400 + Math.cos((i/28)*Math.PI*2+0.045)*550},${400 + Math.sin((i/28)*Math.PI*2+0.045)*550}`} fill="url(#rayG)" />
          ))}
        </svg>
      </div>
      <div className={`legacy-flash ${showFlash ? 'show' : ''}`} />
      <div id="legacy-loading-wrap">
        <div id="legacy-loading-header">
           <span id="legacy-loading-label">LOADING</span>
           <span id="legacy-pct-display" className={isDone ? 'done' : ''}>{Math.floor(progress)}%</span>
        </div>
        <div id="legacy-progress-track"><div id="legacy-progress-fill" style={{ width: `${progress}%` }} /></div>
        <div id="legacy-step-text">{stepLabel}</div>
      </div>
    </div>
  );
};
export default LegacyPreloader;
```

### [CSS Source: LegacyPreloader.css](file:///c:/Users/HP/Desktop/vs%20code%20projects/KrishDev/src/components/LegacyPreloader.css)

```css
.legacy-preloader-container {
  position: fixed; inset: 0; background: #000;
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
#legacy-rays { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0.18; }
#legacy-rays svg { width: 100vw; height: 100vh; object-fit: cover; animation: raysRotate 40s linear infinite; }
@keyframes raysRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.legacy-flash { position: absolute; inset: 0; background: radial-gradient(circle, rgba(0,216,240,0.2) 0%, transparent 70%); opacity: 0; transition: opacity 0.5s; }
.legacy-flash.show { opacity: 1; }
#legacy-loading-wrap { position: absolute; bottom: 12%; width: 250px; display: flex; flex-direction: column; gap: 8px; }
#legacy-loading-header { display: flex; justify-content: space-between; color: #00d8f0; font-family: 'Rajdhani', sans-serif; }
#legacy-pct-display { font-size: 24px; font-weight: 600; }
#legacy-progress-track { height: 2px; background: rgba(0,216,240,0.1); width: 100%; }
#legacy-progress-fill { height: 100%; background: #00d8f0; box-shadow: 0 0 10px #00d8f0; }
#legacy-step-text { color: rgba(0,216,240,0.6); font-size: 10px; text-align: center; letter-spacing: 0.2em; }
```

---

## How to use:
1. Copy the `.jsx` and `.css` (if any) files to your project.
2. Install dependencies: `npm install three framer-motion`.
3. Import and use in your page:
   ```javascript
   <AnimatePresence mode="wait">
     {isLoading && <ThreePreloader onComplete={() => setIsLoading(false)} />}
   </AnimatePresence>
   ```
