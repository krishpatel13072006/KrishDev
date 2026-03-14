import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextScramble from "../components/TextScramble";
import useScrollReveal from "../hooks/useScrollReveal";
import QuantumPreloader from "../components/QuantumPreloader";

const USERNAME = "krish_patel13072006";

const MOCK = {
  totalSolved: 312, easySolved: 143, mediumSolved: 131, hardSolved: 38,
  ranking: 284621, totalEasy: 876, totalMedium: 1839, totalHard: 822,
  acceptanceRate: "62.4%",
  recentSubmissions: [
    { title: "Two Sum", titleSlug: "two-sum", statusDisplay: "Accepted", lang: "python3", timestamp: Date.now()/1000 - 3600 },
    { title: "Longest Substring Without Repeating Characters", titleSlug: "longest-substring-without-repeating-characters", statusDisplay: "Accepted", lang: "cpp", timestamp: Date.now()/1000 - 86400 },
    { title: "Median of Two Sorted Arrays", titleSlug: "median-of-two-sorted-arrays", statusDisplay: "Wrong Answer", lang: "python3", timestamp: Date.now()/1000 - 172800 },
    { title: "Container With Most Water", titleSlug: "container-with-most-water", statusDisplay: "Accepted", lang: "java", timestamp: Date.now()/1000 - 259200 },
    { title: "3Sum", titleSlug: "3sum", statusDisplay: "Accepted", lang: "cpp", timestamp: Date.now()/1000 - 345600 },
    { title: "Binary Tree Level Order Traversal", titleSlug: "binary-tree-level-order-traversal", statusDisplay: "Accepted", lang: "python3", timestamp: Date.now()/1000 - 432000 },
    { title: "Valid Parentheses", titleSlug: "valid-parentheses", statusDisplay: "Accepted", lang: "cpp", timestamp: Date.now()/1000 - 518400 },
    { title: "Climbing Stairs", titleSlug: "climbing-stairs", statusDisplay: "Time Limit Exceeded", lang: "java", timestamp: Date.now()/1000 - 604800 },
  ],
};

async function fetchStats() {
  const apis = [
    `https://leetcode-api-faisalshohag.vercel.app/${USERNAME}`,
    `https://alfa-leetcode-api.onrender.com/userProfile/${USERNAME}`,
    `https://leetcode-stats-api.herokuapp.com/${USERNAME}`,
  ];
  for (const url of apis) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(7000) });
      if (r.ok) {
        const d = await r.json();
        if (d && (d.totalSolved !== undefined || d.total_solved !== undefined)) return d;
      }
    } catch {}
  }
  return null;
}

// ── Animated counter ──
function AnimatedNumber({ value, duration = 1800, style = {} }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const end = Number(value);
    if (isNaN(end)) return;
    const start = performance.now();
    const from = prev.current;
    prev.current = end;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 5); // Quintic ease-out
      setDisplay(Math.round(from + (end - from) * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span style={style}>{display}</span>;
}

// ── Premium Glassmorphism Card ──
function GlassCard({ children, className = "", style = {}, delay = 0, noPadding = false }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20, delay } }
      }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`glass-card ${className}`}
      style={style}
    >
      <div className={`glass-content ${noPadding ? "" : "p-resp"}`}>
        {children}
      </div>
    </motion.div>
  );
}

// ── Glowing Status Dot ──
const StatusDot = ({ color }) => (
  <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: color, opacity: 0.6, animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
    <span style={{ position: "relative", width: 10, height: 10, borderRadius: "50%", backgroundColor: color }} />
  </span>
);

// ── Overall Arc Ring ──
function OverallArc({ pct, total, solved }) {
  const size = 180, stroke = 12, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [p, setP] = useState(0);
  useEffect(() => { const t = setTimeout(() => setP(pct), 500); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", display: "inline-flex", filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.3))" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
          {/* Progress */}
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="url(#arcGrad)" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ - (p / 100) * circ}
            style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <span style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", fontWeight: 900, lineHeight: 1, background: "linear-gradient(to right, #ffffff, #a1a1aa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            <AnimatedNumber value={solved} />
          </span>
          <span style={{ fontSize: 11, color: "#a1a1aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>solved</span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 600, letterSpacing: "0.02em" }}>
        Top <span style={{ color: "#fff" }}>{pct}%</span> of {total.toLocaleString()} problems
      </div>
    </div>
  );
}

// ── Difficulty Ring ──
function DiffRing({ label, solved, total, color, delay }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  const r = 38, circ = 2 * Math.PI * r;
  const [p, setP] = useState(0);
  useEffect(() => { const t = setTimeout(() => setP(pct), delay * 1000 + 400); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6, ease: "easeOut" }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
      whileHover={{ y: -4, scale: 1.05 }}
    >
      <div style={{ position: "relative", width: 92, height: 92, filter: `drop-shadow(0 0 15px ${color}30)` }}>
        <svg width="100%" height="100%" viewBox="0 0 92 92" style={{ transform: "rotate(-90deg)", display: "block" }}>
          <circle cx="46" cy="46" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="46" cy="46" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ - (p / 100) * circ}
            style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
            <AnimatedNumber value={solved} />
          </span>
          <span style={{ fontSize: 10, color: "#71717a", marginTop: 2, fontWeight: 600 }}>/{total}</span>
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", color, textTransform: "uppercase" }}>{label}</span>
    </motion.div>
  );
}

// ── BENTO STAT CARD ──
function BentoStat({ title, value, icon, gradient, delay }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { delay, type: "spring", stiffness: 200 } } }}
      whileHover={{ scale: 1.03, y: -4 }}
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: 24, padding: "clamp(20px, 3vw, 28px)",
        position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: 8,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}
    >
      {/* Background glow injected on hover via CSS class `.bento-glow` */}
      <div className="bento-glow" style={{ background: gradient }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
          {icon}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#a1a1aa", letterSpacing: "0.05em", textTransform: "uppercase" }}>{title}</span>
      </div>
      <div style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1, marginTop: 10, position: "relative", zIndex: 1 }}>
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </div>
    </motion.div>
  );
}

export default function LeetCodePage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  useScrollReveal();

  useEffect(() => {
    fetchStats().then(d => {
      setStats(d || MOCK);
      setLoading(false);
    });
  }, []);

  const s = stats || MOCK;
  const totalSolved  = s.totalSolved  ?? s.total_solved  ?? 0;
  const easySolved   = s.easySolved   ?? s.easy_solved   ?? 0;
  const mediumSolved = s.mediumSolved ?? s.medium_solved ?? 0;
  const hardSolved   = s.hardSolved   ?? s.hard_solved   ?? 0;
  const tEasy   = s.totalEasy   ?? s.total_easy   ?? 876;
  const tMedium = s.totalMedium ?? s.total_medium ?? 1839;
  const tHard   = s.totalHard   ?? s.total_hard   ?? 822;
  const tAll = tEasy + tMedium + tHard;
  const pctAll = tAll > 0 ? Math.round((totalSolved / tAll) * 100) : 0;
  const ranking = s.ranking ?? "—";
  let acceptRate = s.acceptanceRate ?? s.acceptance_rate ?? "—";
  if (typeof acceptRate === "number") acceptRate = `${acceptRate.toFixed(1)}%`;
  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div key="preloader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <QuantumPreloader onComplete={() => setIsLoading(false)} />
        </motion.div>
      </AnimatePresence>
    )
  }

  const recentSubs = s.recentSubmissions ?? MOCK.recentSubmissions;
  const containerVars = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", paddingBottom: 100, position: "relative", overflow: "hidden" }}>
      
      {/* ── STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        
        /* Ambient Animated Orbs */
        .orb-1 { position: absolute; top: -10vw; left: -10vw; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%); border-radius: 50%; filter: blur(80px); animation: float 20s ease-in-out infinite alternate; pointer-events: none; }
        .orb-2 { position: absolute; bottom: 0; right: -10vw; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%); border-radius: 50%; filter: blur(90px); animation: float 25s ease-in-out infinite alternate-reverse; pointer-events: none; }
        .orb-3 { position: absolute; top: 40%; left: 30%; width: 30vw; height: 30vw; background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%); border-radius: 50%; filter: blur(70px); animation: float 18s ease-in-out infinite alternate; pointer-events: none; }
        
        @keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(50px, 50px) scale(1.1); } }
        @keyframes ping { 75%, 100% { transform: scale(2.5); opacity: 0; } }
        
        .glass-card {
          background: rgba(20, 20, 22, 0.4);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 32px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-card::before {
          content: ""; position: absolute; inset: 0; border-radius: 32px; padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 50%, rgba(255,255,255,0.05));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
        }
        .glass-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 40px rgba(139,92,246,0.15);
        }
        .glass-content { position: relative; z-index: 10; width: 100%; height: 100%; }
        .p-resp { padding: clamp(24px, 5vw, 40px); }
        
        .bento-glow { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s ease; filter: blur(40px); z-index: 0; }
        div:hover > .bento-glow { opacity: 0.15; }

        .sub-row { position: relative; transition: all 0.2s; border-radius: 16px; margin: 0 10px; }
        .sub-row:hover { background: rgba(255,255,255,0.04); transform: scale(1.01) translateX(4px); }
        .sub-row::before { content: ""; position: absolute; left: -10px; top: 15%; height: 70%; width: 3px; background: currentColor; border-radius: 4px; opacity: 0; transition: 0.2s; }
        .sub-row:hover::before { opacity: 1; left: 0; }
        
        .btn-premium { background: linear-gradient(135deg, #fff, #d4d4d8); color: #000; box-shadow: 0 10px 30px rgba(255,255,255,0.15); transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); }
        .btn-premium:hover { box-shadow: 0 15px 40px rgba(255,255,255,0.25); transform: translateY(-3px) scale(1.02); }
      `}</style>
      
      {/* Background Orbs */}
      <div className="orb-1" />
      <div className="orb-2" />
      <div className="orb-3" />

      {/* Main Content Container */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "clamp(40px, 8vw, 80px) clamp(20px, 4vw, 32px)", position: "relative", zIndex: 1 }}>

        {/* ── HEADER ── */}
        <motion.div className="reveal" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ textAlign: "center", marginBottom: "clamp(40px, 8vw, 60px)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 20px", borderRadius: 999, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            <StatusDot color="#10b981" />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "#a1a1aa", textTransform: "uppercase" }}>Live Stats Sync</span>
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1.1, marginBottom: 16 }}>
            Code is <span style={{ background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}><TextScramble text="Art" /></span>.
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
            Tracking algorithm mastery and competitive programming progress on LeetCode for <strong style={{ color: "#fff" }}>@{USERNAME}</strong>.
          </p>
        </motion.div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: 24 }}>
            <div style={{ width: 60, height: 60, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, border: "3px solid rgba(255,255,255,0.1)", borderRadius: "50%" }} />
              <motion.div style={{ position: "absolute", inset: 0, borderTop: "3px solid #ec4899", borderRight: "3px solid transparent", borderRadius: "50%" }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
            </div>
            <p style={{ color: "#a1a1aa", fontSize: 15, fontWeight: 500, letterSpacing: "0.05em" }}>INITIALIZING METRICS...</p>
          </div>
        ) : (
          <motion.div variants={containerVars} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 3vw, 24px)" }}>
            
            {/* ── TOP SECTION: Bento Grid ── */}
            <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(16px, 3vw, 24px)" }}>
              
              {/* Profile & Main Arc */}
              <GlassCard delay={0.1} style={{ gridColumn: "1 / -1", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(24px, 5vw, 40px)" }}>
                
                {/* User Identity */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, flex: "1 1 auto", minWidth: 250 }}>
                  <motion.div whileHover={{ scale: 1.05, rotate: -5 }} style={{ width: "clamp(70px, 8vw, 90px)", height: "clamp(70px, 8vw, 90px)", borderRadius: 24, background: "linear-gradient(135deg, #8b5cf6, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 10px 30px rgba(236, 72, 153, 0.4)", position: "relative" }}>
                    <span style={{ position: "absolute", inset: 0, borderRadius: 24, border: "2px solid rgba(255,255,255,0.2)" }} />
                    <span style={{ color: "#fff" }}>🧑‍💻</span>
                  </motion.div>
                  <div>
                    <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-0.02em" }}>{USERNAME}</h2>
                    <div style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      <span>🚀 Top 10% Contributor</span>
                      <span style={{ width: 4, height: 4, background: "#71717a", borderRadius: "50%" }} />
                      <span>2026</span>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div style={{ width: 1, height: 80, background: "rgba(255,255,255,0.08)", display: "block" }} className="hidden md:block" />

                {/* Circular Overall Progress */}
                <div style={{ flex: "1 1 auto", display: "flex", justifyContent: "center" }}>
                  <OverallArc pct={pctAll} total={tAll} solved={totalSolved} />
                </div>
                
                {/* Separator */}
                <div style={{ width: 1, height: 80, background: "rgba(255,255,255,0.08)", display: "block" }} className="hidden lg:block" />

                {/* Difficulty Rings */}
                <div style={{ display: "flex", gap: "clamp(16px, 3vw, 32px)", flex: "1 1 auto", justifyContent: "center" }}>
                  <DiffRing label="Easy" solved={easySolved} total={tEasy} color="#10b981" delay={0.2} />
                  <DiffRing label="Medium" solved={mediumSolved} total={tMedium} color="#f59e0b" delay={0.3} />
                  <DiffRing label="Hard" solved={hardSolved} total={tHard} color="#ef4444" delay={0.4} />
                </div>
              </GlassCard>

              {/* Smaller Stat Cards */}
              <BentoStat title="Global Ranking" value={ranking} icon="🌍" gradient="linear-gradient(135deg, rgba(59,130,246,1), rgba(147,51,234,1))" delay={0.2} />
              <BentoStat title="Acceptance Rate" value={acceptRate} icon="🎯" gradient="linear-gradient(135deg, rgba(16,185,129,1), rgba(5,150,105,1))" delay={0.3} />
            </div>

            {/* ── MIDDLE SECTION: Heatmap & Recent ── */}
            <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "clamp(16px, 3vw, 24px)" }}>
              
              {/* Heatmap Card */}
              <GlassCard delay={0.4} noPadding className="flex flex-col">
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "#a1a1aa", textTransform: "uppercase" }}>Activity Heatmap</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <StatusDot color="#ec4899" />
                    <span style={{ fontSize: 11, color: "#ec4899", fontWeight: 700, letterSpacing: "0.05em" }}>LIVE</span>
                  </div>
                </div>
                <div style={{ padding: "clamp(16px, 4vw, 32px)", display: "flex", justifyContent: "center", overflowX: "auto", background: "rgba(0,0,0,0.1)" }}>
                  <img src={`https://leetcard.jacoblin.cool/${USERNAME}?theme=dark&font=Nunito&ext=heatmap`} alt="Heatmap" style={{ borderRadius: 16, width: "100%", height: "auto", maxWidth: 800, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))" }} onError={e => e.target.style.display="none"} />
                </div>
              </GlassCard>

              {/* Recent Submissions */}
              {recentSubs.length > 0 && (
                <GlassCard delay={0.5} noPadding style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "#a1a1aa", textTransform: "uppercase" }}>Recent Submissions</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", padding: "12px 12px 16px" }}>
                    {recentSubs.slice(0, 6).map((sub, i) => {
                      const acc = sub.statusDisplay === "Accepted";
                      const color = acc ? "#10b981" : "#ef4444";
                      const bg = acc ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)";
                      return (
                        <a key={i} href={`https://leetcode.com/problems/${sub.titleSlug}`} target="_blank" rel="noreferrer" className="sub-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", textDecoration: "none", color: color }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, overflow: "hidden", paddingRight: 16 }}>
                            <span className="sub-title" style={{ fontSize: 15, fontWeight: 600, color: "#f4f4f5", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{sub.title}</span>
                            <span style={{ fontSize: 11, color: "#71717a", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{sub.lang}</span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 999, background: bg, color: color, boxShadow: `0 0 10px ${bg}` }}>
                            {acc ? "Accepted" : "Failed"}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </GlassCard>
              )}
            </div>

            {/* ── BIG PROFILE CARD ── */}
            <GlassCard delay={0.6} noPadding className="w-full">
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "#a1a1aa", textTransform: "uppercase" }}>LeetCode Profile Summary</span>
              </div>
              <div style={{ padding: "clamp(24px, 5vw, 40px)", display: "flex", justifyContent: "center", background: "rgba(0,0,0,0.15)" }}>
                <img src={`https://leetcard.jacoblin.cool/${USERNAME}?theme=dark&font=Nunito`} alt="LeetCode Card" style={{ borderRadius: 24, width: "100%", maxWidth: 640, height: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.8)" }} onError={e => e.target.style.display="none"} />
              </div>
            </GlassCard>

            {/* ── CALL TO ACTION ── */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
              <a href={`https://leetcode.com/${USERNAME}`} target="_blank" rel="noreferrer" className="btn-premium" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 40px", borderRadius: 999, fontWeight: 800, fontSize: 15, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <span>View Full Profile</span>
                <span style={{ background: "#000", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>↗</span>
              </a>
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
