import React, { useEffect, useRef } from 'react';
import './MagneticText.css';

export default function MagneticText({ text, force = 90, radius = 120, className = '', activeColor = false }) {
  const containerRef = useRef(null);
  const charRefs = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      charRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          const power = (1 - dist / radius) * force;
          const angle = Math.atan2(dy, dx);
          const tx = -Math.cos(angle) * power;
          const ty = -Math.sin(angle) * power;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
          
          if (activeColor) {
            const hue = Math.round((dist / radius) * 60);
            el.style.color = `hsl(${160 + hue}, 100%, ${60 + hue}%)`;
          }
        } else {
          el.style.transform = 'translate(0, 0)';
          if (activeColor) el.style.color = '';
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [force, radius, activeColor]);

  const chars = text.split('');

  return (
    <span className={`mag-wrap ${className}`} ref={containerRef}>
      {chars.map((char, i) => (
        <span
          key={i}
          className="mag-char"
          ref={(el) => (charRefs.current[i] = el)}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
