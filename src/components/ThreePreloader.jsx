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

    /* ── Lights ─────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x8ab4e8, 0.65));

    const dirLight = new THREE.DirectionalLight(0xc0d8ff, 1.0);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x4466ff, 0.45);
    fillLight.position.set(-8, 4, -5);
    scene.add(fillLight);

    const spotLight = new THREE.PointLight(0x1a88ff, 1.8, 18);
    spotLight.position.set(0, 5, 0);
    scene.add(spotLight);

    /* ── Floor / Base plate ─────────────────────────────────────── */
    const floorGeo = new THREE.CircleGeometry(14, 96);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070f20,
      roughness: 0.6,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    /* ── Pillars ────────────────────────────────────────────────── */
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

    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1a7fff,
      roughness: 0.3,
      metalness: 0.1,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x3399ff,
      transparent: true,
      opacity: 0.55,
      roughness: 0.05,
      metalness: 0.0,
      transmission: 0.85,
      thickness: 0.4,
    });

    const pillars = [];

    for (let i = 0; i < PILLAR_COUNT; i++) {
      const angle = (i / PILLAR_COUNT) * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.position.set(Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS);
      pivot.rotation.y = -angle + Math.PI / 2;

      const pillarGroup = new THREE.Group();

      const base = new THREE.Mesh(baseGeo, baseMat);
      base.castShadow = true;
      base.receiveShadow = true;
      pillarGroup.add(base);

      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.y = baseH;
      glass.castShadow = true;
      pillarGroup.add(glass);

      pivot.add(pillarGroup);
      scene.add(pivot);

      pillars.push({ group: pillarGroup, angle });
    }

    /* ── Interaction ─────────────────────────────────────────── */
    let timeOffset = 0;
    let dragVel = 0;
    let dragging = false;
    let lastSA = null;

    const scrAngle = (x, y) => Math.atan2(y - window.innerHeight / 2, x - window.innerWidth / 2);

    function ptrDown(x, y) { dragging = true; lastSA = scrAngle(x, y); dragVel = 0; }
    function ptrMove(x, y) {
      if (!dragging) return;
      const sa = scrAngle(x, y);
      let d = sa - lastSA;
      const TAU = Math.PI * 2;
      if (d > Math.PI) d -= TAU;
      if (d < -Math.PI) d += TAU;
      timeOffset += d * 1.4;
      dragVel = d * 1.4;
      lastSA = sa;
    }
    function ptrUp() { dragging = false; }

    const onMouseDown = (e) => ptrDown(e.clientX, e.clientY);
    const onMouseMove = (e) => ptrMove(e.clientX, e.clientY);
    const onMouseUp = () => ptrUp();
    const onTouchStart = (e) => ptrDown(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e) => ptrMove(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = () => ptrUp();

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    /* ── Progress Label and Dots ────────────────────────────── */
    let dotIdx = 0;
    const dotsInterval = setInterval(() => {
      if (dotsRef.current) {
        dotsRef.current.textContent = ['.', '..', '...', '..'][dotIdx++ % 4];
      }
    }, 420);

    const LOAD_DURATION = 6000;
    const loadStart = performance.now();
    let loadDone = false;

    function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    const updateProgress = (now) => {
      if (loadDone) return;
      const t = Math.min((now - loadStart) / LOAD_DURATION, 1);
      const pct = Math.floor(easeInOut(t) * 100);
      
      if (percentRef.current) {
        percentRef.current.firstChild.textContent = pct;
      }
      if (barFillRef.current) {
        barFillRef.current.style.width = pct + '%';
      }

      if (t >= 1) {
        loadDone = true;
        if (dotsRef.current) dotsRef.current.textContent = '';
        setCompleteText('complete');
        setTimeout(() => {
          if (onCompleteRef.current) onCompleteRef.current();
        }, 800);
      }
    };

    const worldOrigin = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const time = clock.getElapsedTime();

      if (!dragging) {
        timeOffset += dragVel;
        dragVel *= 0.91;
      }

      const waveTime = time * 2 + timeOffset;

      pillars.forEach(p => {
        const phase = waveTime - p.angle * 1.5;
        const tilt = Math.max(0, Math.sin(phase)) * (Math.PI / 2.2);
        p.group.rotation.x = -tilt;
      });

      updateProgress(now);

      const v = worldOrigin.clone().project(camera);
      if (labelRef.current) {
        labelRef.current.style.left = ((v.x * 0.5 + 0.5) * window.innerWidth) + 'px';
        labelRef.current.style.top = ((-v.y * 0.5 + 0.5) * window.innerHeight) + 'px';
      }

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(dotsInterval);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []); // Remove onComplete from dependency array

  return (
    <div className="three-preloader-container" ref={containerRef}>
      <canvas ref={canvasRef} className="three-preloader-canvas" />
      <div id="three-label" ref={labelRef}>
        <div id="three-percent" ref={percentRef}>0<sup>%</sup></div>
        <div id="three-bar-wrap">
          <div id="three-bar-fill" ref={barFillRef}></div>
        </div>
        <div id="three-loading-text">
          {completeText}
          <span id="three-dots" ref={dotsRef}>...</span>
        </div>
      </div>
    </div>
  );
};

export default ThreePreloader;
