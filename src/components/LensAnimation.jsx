import React, { useEffect, useRef } from 'react';
import './LensAnimation.css';

export default function LensAnimation() {
  const containerRef = useRef(null);
  const maskedRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const masked = maskedRef.current;
    const ring = ringRef.current;

    if (!container || !masked || !ring) return;

    const LENS = 270;
    // The RING needs to be just slightly larger than the LENS to sit on the outer edge.
    const RING = 300;

    // Center initially within the container bounds
    let tx = container.clientWidth / 2;
    let ty = container.clientHeight / 2;
    let sx = tx, sy = ty;
    let vx = 0, vy = 0;
    const K = 0.11, D = 0.80; // stiffness, damping

    let animationFrameId;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
    };

    const handleTouchMove = (e) => {
      // Don't prevent default here to allow page scrolling
      const rect = container.getBoundingClientRect();
      tx = e.touches[0].clientX - rect.left;
      ty = e.touches[0].clientY - rect.top;
    };

    const handleTouchStart = (e) => {
      const rect = container.getBoundingClientRect();
      tx = e.touches[0].clientX - rect.left;
      ty = e.touches[0].clientY - rect.top;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });

    const tick = () => {
      // Integrate spring
      vx = (vx + (tx - sx) * K) * D;
      vy = (vy + (ty - sy) * K) * D;
      sx += vx;
      sy += vy;

      // Circular mask that follows cursor
      const mask = `radial-gradient(circle ${LENS / 2}px at ${sx}px ${sy}px, black 100%, transparent 100%)`;
      masked.style.webkitMaskImage = mask;
      masked.style.maskImage = mask;

      // Center ring on cursor
      ring.style.transform = `translate(${sx - RING / 2}px, ${sy - RING / 2}px)`;

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchstart', handleTouchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="lens-container-wrapper">
      <div className="lens-container" ref={containerRef}>
        
        {/* Base: white text on dark */}
        <div className="lens-layer">
          <h1 style={{ color: '#ffffff' }}>Krish Developer</h1>
        </div>

        {/* Masked: photo + black text */}
        <div className="lens-layer-mask" ref={maskedRef}>
          <div className="lens-bg-image"></div>
          <div className="lens-layer">
            <h1 style={{ color: '#000000' }}>Krish Developer</h1>
          </div>
        </div>

        {/* Cursor ring */}
        <div className="lens-ring" ref={ringRef} style={{ width: '300px', height: '300px' }}>
          <svg className="lens-ring-inner" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            <defs>
              {/* 
                 The viewBox is 100x100. Center is 50,50. 
                 Radius of 47 puts it very close to the edge of the 100x100 box.
                 This ensures it perfectly hugs the mask since both scale relative to their containers.
              */}
              <path id="cp" d="M50,50 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
            </defs>
            <text fontSize="8" fill="white" fontWeight="700" letterSpacing="4.5">
              <textPath href="#cp" startOffset="0%">SEE MORE  SEE MORE  SEE MORE  SEE MORE  SEE MORE </textPath>
            </text>
          </svg>
          <div className="lens-dot"></div>
        </div>
      </div>
    </div>
  );
}
