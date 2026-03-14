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
  const canvasRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState(STEPS[0].label);
  const [isDone, setIsDone] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // --- Three.js Logic ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene, camera, renderer, clock, coreMesh, ring1, ring2;
    let animationFrameId;

    const C = { cyan: 0x00d8f0, cyanDim: 0x003344 };

    const getCameraZ = () => {
      const width = window.innerWidth;
      if (width < 600) return 26; // Mobile - push camera further back (was 22)
      if (width < 1000) return 22; // Tablet (was 18)
      return 20; // Desktop (was 16)
    };

    const init = () => {
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.035);

      camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 500);
      camera.position.z = getCameraZ();

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      clock = new THREE.Clock();

      scene.add(new THREE.AmbientLight(C.cyan, 0.15));
      scene.add(new THREE.PointLight(C.cyan, 8, 25));
      const fl = new THREE.PointLight(0x0044ff, 2, 30);
      fl.position.set(-8, 4, 6);
      scene.add(fl);

      const makeGlowTex = () => {
        const c = document.createElement('canvas');
        c.width = c.height = 256;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.15, 'rgba(0,216,240,0.7)');
        g.addColorStop(0.5, 'rgba(0,100,160,0.2)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 256, 256);
        return new THREE.CanvasTexture(c);
      };

      const buildCore = () => {
        const N = 320, R = 2.6;
        coreMesh = new THREE.InstancedMesh(
          new THREE.SphereGeometry(0.09, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x080c10, emissive: new THREE.Color(C.cyanDim), emissiveIntensity: 0.35, roughness: 0.85, metalness: 0.4 }),
          N
        );
        const d = new THREE.Object3D();
        for (let i = 0; i < N; i++) {
          const phi = Math.acos(-1 + (2 * i) / N), theta = Math.sqrt(N * Math.PI) * phi;
          d.position.set(Math.cos(theta) * Math.sin(phi) * R, Math.sin(theta) * Math.sin(phi) * R, Math.cos(phi) * R);
          d.updateMatrix();
          coreMesh.setMatrixAt(i, d.matrix);
        }
        scene.add(coreMesh);
      };

      const buildRing = (radius, count, beadR) => {
        const ring = new THREE.InstancedMesh(
          new THREE.SphereGeometry(beadR, 10, 10),
          new THREE.MeshStandardMaterial({ color: C.cyan, emissive: new THREE.Color(C.cyan), emissiveIntensity: 1.2, roughness: 0.2, metalness: 0.1 }),
          count
        );
        const d = new THREE.Object3D();
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2;
          d.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
          d.updateMatrix();
          ring.setMatrixAt(i, d.matrix);
        }
        return ring;
      };

      const gTex = makeGlowTex();
      [[18, .20], [10, .25], [5, .35]].forEach(([sz, op]) => {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTex, color: C.cyan, transparent: true, blending: THREE.AdditiveBlending, opacity: op, depthWrite: false }));
        s.scale.set(sz, sz, 1);
        scene.add(s);
      });

      buildCore();
      ring1 = buildRing(5.2, 56, 0.14);
      scene.add(ring1);
      ring2 = buildRing(5.5, 56, 0.14);
      scene.add(ring2);

      scene.add(new THREE.Mesh(
        new THREE.TorusGeometry(5.4, 0.04, 8, 160),
        new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.18 })
      ));

      animate();
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (coreMesh) {
        coreMesh.rotation.y = t * 0.22;
        coreMesh.rotation.x = Math.sin(t * 0.42) * 0.3;
        coreMesh.scale.setScalar(1 + Math.sin(t * 1.8) * 0.04);
      }
      if (ring1) {
        ring1.rotation.y = t * 0.75;
        ring1.rotation.x = Math.PI / 2 + Math.sin(t * 0.9) * 0.55;
      }
      if (ring2) {
        ring2.rotation.y = -t * 0.55;
        ring2.rotation.z = Math.PI / 4 + Math.cos(t * 0.7) * 0.45;
      }
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.position.z = getCameraZ();
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    init();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      if (scene) scene.clear();
    };
  }, []);

  // --- Progress System ---
  useEffect(() => {
    let progressVal = 0;
    let targetVal = 0;
    let timer;
    let done = false;

    const scheduleChunk = () => {
      const rem = 100 - targetVal;
      if (rem <= 0) return;
      const chunk = Math.min(rem, 4 + Math.random() * 10);
      const delay = 120 + Math.random() * 380;
      timer = setTimeout(() => {
        targetVal = Math.min(100, targetVal + chunk);
        if (targetVal < 100) scheduleChunk();
      }, delay);
    };

    const tick = () => {
      if (!done && progressVal < targetVal) {
        progressVal += (targetVal - progressVal) * 0.07 + 0.12;
        if (progressVal > targetVal) progressVal = targetVal;
      }

      const p = Math.min(100, progressVal);
      const pInt = Math.floor(p);

      setProgress(p);

      let lbl = STEPS[0].label;
      for (const s of STEPS) {
        if (pInt >= s.at) lbl = s.label;
      }
      setStepLabel(lbl);

      if (p >= 99.9 && !done) {
        done = true;
        setIsDone(true);
        setStepLabel('— READY —');
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 900);
        setTimeout(() => {
          if (onCompleteRef.current) onCompleteRef.current();
        }, 1200);
      }

      if (!done || progressVal < 100) {
        requestAnimationFrame(tick);
      }
    };

    scheduleChunk();
    tick();

    return () => {
      clearTimeout(timer);
      done = true;
    };
  }, []);

  return (
    <div className="legacy-preloader-container" ref={containerRef}>
      {/* Rays */}
      <div id="legacy-rays">
        <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="rayGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d8f0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
          {Array.from({ length: 28 }).map((_, i) => {
            const n = 28, cx = 400, cy = 400, spread = 0.045, r = 550;
            const a = (i / n) * Math.PI * 2, a1 = a - spread, a2 = a + spread;
            const points = `${cx},${cy} ${cx + Math.cos(a1) * r},${cy + Math.sin(a1) * r} ${cx + Math.cos(a2) * r},${cy + Math.sin(a2) * r}`;
            return <polygon key={i} points={points} fill="url(#rayGrad)" />;
          })}
        </svg>
      </div>

      {/* Completion flash */}
      <div className={`legacy-flash ${showFlash ? 'show' : ''}`} />

      {/* Loading UI */}
      <div id="legacy-loading-wrap">
        <div id="legacy-loading-header">
          <span id="legacy-loading-label">LOADING</span>
          <span id="legacy-pct-display" className={isDone ? 'done' : ''}>
            {Math.floor(progress)}%
          </span>
        </div>
        <div id="legacy-progress-track">
          <div 
            id="legacy-progress-fill" 
            className={isDone ? 'done' : ''} 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div id="legacy-tick-row">
          <span className="legacy-tick-lbl">0</span>
          <span className="legacy-tick-lbl">25</span>
          <span className="legacy-tick-lbl">50</span>
          <span className="legacy-tick-lbl">75</span>
          <span className="legacy-tick-lbl">100</span>
        </div>
        <div id="legacy-step-text">{stepLabel}</div>
      </div>
    </div>
  );
};

export default LegacyPreloader;
