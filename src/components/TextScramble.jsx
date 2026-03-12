import React, { useState, useEffect, useRef } from 'react';
import './TextScramble.css';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|';

export default function TextScramble({ text, autostart = false }) {
  const [displayText, setDisplayText] = useState(text);
  const [isActive, setIsActive] = useState(false);
  const animId = useRef(null);
  const frame = useRef(0);
  const FRAMES = 28;

  const scramble = (targetText) => {
    if (animId.current) cancelAnimationFrame(animId.current);
    setIsActive(true);
    frame.current = 0;

    const tick = () => {
      let out = '';
      for (let i = 0; i < targetText.length; i++) {
        if (frame.current / FRAMES > i / targetText.length) {
          out += targetText[i];
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayText(out);
      frame.current++;

      if (frame.current <= FRAMES) {
        animId.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(targetText);
        setIsActive(false);
      }
    };
    tick();
  };

  useEffect(() => {
    if (autostart) {
      scramble(text);
    }
    return () => {
      if (animId.current) cancelAnimationFrame(animId.current);
    };
  }, [text, autostart]);

  return (
    <span 
      className={`scramble-text ${isActive ? 'active' : ''}`}
      onMouseEnter={() => scramble(text)}
    >
      {displayText}
    </span>
  );
}
