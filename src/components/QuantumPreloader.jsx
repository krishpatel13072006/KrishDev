import React, { useEffect, useRef } from 'react';

const QuantumPreloader = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrap = containerRef.current;
    let animationFrameId;

    const resize = () => {
      if (wrap) {
        canvas.width = wrap.clientWidth;
        canvas.height = wrap.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    let percent = 0;
    const DURATION = 6;
    let loadDone = false;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const R = Math.min(W, H) * 0.185;
      const ringR = R * 1.72;

      percent = Math.min(100, (t / DURATION) * 100);
      
      if (percent >= 100 && !loadDone) {
        loadDone = true;
        setTimeout(() => {
           if (onCompleteRef.current) onCompleteRef.current();
        }, 800);
      }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      // --- BACKGROUND GLOWS ---
      let g = ctx.createRadialGradient(cx - W * 0.3, cy, 0, cx - W * 0.3, cy, W * 0.55);
      g.addColorStop(0, 'rgba(0,40,200,0.55)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      g = ctx.createRadialGradient(cx + W * 0.25, cy + H * 0.05, 0, cx + W * 0.25, cy, W * 0.45);
      g.addColorStop(0, 'rgba(180,0,200,0.35)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // --- SPHERE HALO ---
      g = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 2.1);
      g.addColorStop(0, 'rgba(100,0,180,0.0)');
      g.addColorStop(0.55, 'rgba(80,0,160,0.22)');
      g.addColorStop(0.78, 'rgba(200,0,180,0.12)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, R * 2.1, 0, Math.PI * 2); ctx.fill();

      // --- OUTER RING ---
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // --- TRAILING DOTS ---
      const sparkAngle = t * 0.4;
      const arcSpan = Math.PI * 0.42;
      const dotCount = 22;
      for (let i = 0; i < dotCount; i++) {
        const frac = i / dotCount;
        const a = sparkAngle - frac * arcSpan;
        const dx = cx + Math.cos(a) * ringR;
        const dy = cy + Math.sin(a) * ringR;
        ctx.beginPath();
        ctx.arc(dx, dy, (1 - frac * 0.6) * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(1 - frac) * 0.9})`;
        ctx.fill();
      }

      // --- SPARK ---
      const spx = cx + Math.cos(sparkAngle) * ringR;
      const spy = cy + Math.sin(sparkAngle) * ringR;
      const sg = ctx.createRadialGradient(spx, spy, 0, spx, spy, 18);
      sg.addColorStop(0, 'rgba(255,255,255,1)');
      sg.addColorStop(0.3, 'rgba(240,200,255,0.6)');
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(spx, spy, 18, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(spx, spy, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();

      // INNER SPHERE
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

      const sp = ctx.createRadialGradient(cx - R * 0.18, cy - R * 0.12, R * 0.05, cx + R * 0.12, cy + R * 0.1, R * 1.01);
      sp.addColorStop(0, 'rgba(110, 60, 240, 1)');
      sp.addColorStop(0.28, 'rgba(140, 30, 255, 1)');
      sp.addColorStop(0.55, 'rgba(195, 20, 230, 1)');
      sp.addColorStop(0.78, 'rgba(235, 40, 180, 1)');
      sp.addColorStop(1, 'rgba(200, 10, 140, 1)');
      ctx.fillStyle = sp;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      const bl = ctx.createRadialGradient(cx - R * 0.55, cy, 0, cx - R * 0.2, cy, R * 0.95);
      bl.addColorStop(0, 'rgba(60,80,255,0.45)');
      bl.addColorStop(0.5, 'rgba(40,40,200,0.2)');
      bl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bl; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      for (let i = 0; i < 7; i++) {
        const baseY = cy - R * 0.72 + i * (R * 1.44 / 6);
        ctx.beginPath();
        for (let x = cx - R; x <= cx + R; x += 1.5) {
          const xf = (x - (cx - R)) / (R * 2);
          const wave =
            Math.sin(xf * Math.PI * 5 + t * 2.2 + i * 0.7) * R * 0.09 +
            Math.sin(xf * Math.PI * 9 - t * 1.6 + i * 1.1) * R * 0.05 +
            Math.sin(xf * Math.PI * 3 + t * 3.0 + i * 0.4) * R * 0.04;
          const y = baseY + wave;
          x <= cx - R + 1.5 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,200,255,${0.08 + i * 0.025})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      for (let i = 0; i < 4; i++) {
        const angle = t * (0.25 + i * 0.1) + i * 1.1;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,180,255,${0.07 + i * 0.03})`;
        ctx.lineWidth = 1.5;
        ctx.ellipse(cx, cy, R * (0.5 + i * 0.1), R * (0.22 + i * 0.05), angle, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      const hl = ctx.createRadialGradient(cx - R * 0.38, cy - R * 0.38, 0, cx - R * 0.15, cy - R * 0.1, R * 0.72);
      hl.addColorStop(0, 'rgba(255,220,255,0.28)');
      hl.addColorStop(0.4, 'rgba(200,140,255,0.1)');
      hl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = hl; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

      const rim = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R);
      rim.addColorStop(0, 'rgba(0,0,0,0)');
      rim.addColorStop(0.7, 'rgba(200,100,255,0.1)');
      rim.addColorStop(1, 'rgba(255,180,255,0.35)');
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = rim; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

      const pct = Math.floor(percent);
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(220,180,255,0.95)';
      ctx.shadowBlur = 20;

      ctx.font = `bold ${R * 0.6}px monospace`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(pct, cx - R * 0.05, cy - R * 0.06);

      ctx.font = `bold ${R * 0.2}px monospace`;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.shadowBlur = 8;
      ctx.fillText('%', cx + R * 0.38, cy - R * 0.2);

      ctx.font = `${R * 0.13}px monospace`;
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.shadowBlur = 4;
      ctx.fillText('LOADING', cx, cy + R * 0.32);

      ctx.restore();

      t += 0.016;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      <canvas id="quantum-c" ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></canvas>
      <div style={{
        position: 'absolute',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
        letterSpacing: '.4em',
        fontSize: '10px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        pointerEvents: 'none'
      }}>
        Initializing Quantum Neural Core
      </div>
    </div>
  );
};

export default QuantumPreloader;
