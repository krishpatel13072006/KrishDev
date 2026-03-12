// Pure CSS/SVG animated hero scene — no external dependencies
export default function ThreeScene() {
  return (
    <div className="css-scene-wrap" aria-hidden="true">
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className="css-scene-svg"
      >
        <defs>
          <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="hsl(258 89% 80%)" stopOpacity="1" />
            <stop offset="60%" stopColor="hsl(258 89% 55%)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(258 89% 30%)" stopOpacity="0.4" />
          </radialGradient>
          <radialGradient id="glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="hsl(258 89% 66%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(258 89% 66%)" stopOpacity="0" />
          </radialGradient>
          <filter id="blur-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="soft-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Outer glow halo */}
        <circle cx="200" cy="200" r="150" fill="url(#glow-grad)" className="scene-pulse" />

        {/* Orbit rings */}
        <ellipse cx="200" cy="200" rx="140" ry="45" fill="none"
          stroke="hsl(190 90% 55% / 25%)" strokeWidth="1.5"
          className="orbit-ring orbit-ring-1" />
        <ellipse cx="200" cy="200" rx="105" ry="105" fill="none"
          stroke="hsl(258 89% 66% / 20%)" strokeWidth="1"
          className="orbit-ring orbit-ring-2" />
        <ellipse cx="200" cy="200" rx="165" ry="55" fill="none"
          stroke="hsl(330 80% 60% / 15%)" strokeWidth="1"
          className="orbit-ring orbit-ring-3" />

        {/* Grid lines - perspective feel */}
        {[0, 30, 60, 90, 120, 150].map((angle, i) => (
          <line key={i}
            x1={200 + 130 * Math.cos(angle * Math.PI / 180)}
            y1={200 + 130 * Math.sin(angle * Math.PI / 180)}
            x2={200 - 130 * Math.cos(angle * Math.PI / 180)}
            y2={200 - 130 * Math.sin(angle * Math.PI / 180)}
            stroke="hsl(258 89% 66% / 8%)" strokeWidth="1"
          />
        ))}

        {/* Core sphere */}
        <circle cx="200" cy="200" r="72" fill="url(#core-grad)"
          filter="url(#blur-glow)" className="core-sphere" />

        {/* Inner highlight */}
        <circle cx="180" cy="178" r="22" fill="hsl(258 89% 90%)" opacity="0.18" />

        {/* Orbiting dot — cyan */}
        <circle r="8" fill="hsl(190 90% 55%)" filter="url(#soft-glow)" opacity="0.9">
          <animateMotion dur="4s" repeatCount="indefinite">
            <mpath href="#orbit-path-1" />
          </animateMotion>
        </circle>
        <path id="orbit-path-1" d="M 60,200 a 140,45 0 1,1 280,0 a 140,45 0 1,1 -280,0" fill="none" />

        {/* Orbiting dot — pink */}
        <circle r="6" fill="hsl(330 80% 65%)" filter="url(#soft-glow)" opacity="0.85">
          <animateMotion dur="6s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
            <mpath href="#orbit-path-2" />
          </animateMotion>
        </circle>
        <path id="orbit-path-2" d="M 95,200 a 105,105 0 1,1 210,0 a 105,105 0 1,1 -210,0" fill="none" />

        {/* Orbiting dot — yellow */}
        <circle r="5" fill="hsl(45 90% 60%)" filter="url(#soft-glow)" opacity="0.8">
          <animateMotion dur="8s" repeatCount="indefinite">
            <mpath href="#orbit-path-3" />
          </animateMotion>
        </circle>
        <path id="orbit-path-3" d="M 35,200 a 165,55 0 1,1 330,0 a 165,55 0 1,1 -330,0" fill="none" />

        {/* Floating particles */}
        {[
          [80, 80], [320, 70], [340, 300], [65, 310],
          [150, 40], [280, 340], [50, 190], [355, 180],
          [200, 45], [210, 355],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.5 : 1.8}
            fill="hsl(258 89% 80%)" opacity="0.5"
            className={`particle particle-${(i % 3) + 1}`}
          />
        ))}

        {/* Corner decorations */}
        <g opacity="0.4" stroke="hsl(258 89% 66%)" strokeWidth="1.5" fill="none">
          <polyline points="20,20 20,35 35,35" />
          <polyline points="380,20 365,20 365,35" />
          <polyline points="20,380 20,365 35,365" />
          <polyline points="380,380 365,380 365,365" />
        </g>
      </svg>

      {/* CSS text overlay */}
      <div className="scene-label scene-label-tl">krish.dev</div>
      <div className="scene-label scene-label-br">drag · explore</div>
    </div>
  )
}
