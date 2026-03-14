import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TextScramble from '../components/TextScramble'
import useScrollReveal from '../hooks/useScrollReveal'
import ThreePreloader from '../components/ThreePreloader'

const GITHUB_USERNAME = 'krishpatel13072006'
const LEETCODE_USERNAME = 'krish_patel13072006'

const LEETCODE_FALLBACK = {
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  ranking: 0,
  reputation: 0,
}

async function fetchLeetCodeStats() {
  const apis = [
    `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USERNAME}`,
    `https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USERNAME}`,
    `https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`,
  ];
  for (const url of apis) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (r.ok) {
        const d = await r.json();
        if (d && (d.totalSolved !== undefined || d.total_solved !== undefined)) return d;
      }
    } catch {}
  }
  return null;
}

function StatCard({ value, label, icon, color, delay = 0 }) {
  return (
    <motion.div
      className="dash-stat-card"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      style={{ '--ds-color': color }}
    >
      <div className="dash-stat-icon">{icon}</div>
      <div className="dash-stat-value" style={{ color }}>{value}</div>
      <div className="dash-stat-label">{label}</div>
      <div className="dash-stat-glow" style={{ background: `${color}15` }} />
    </motion.div>
  )
}

function LanguageBar({ lang, pct, color }) {
  return (
    <div className="lang-bar-item">
      <div className="lang-bar-header">
        <span className="lang-name">
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 6 }} />
          {lang}
        </span>
        <span className="lang-pct">{pct}%</span>
      </div>
      <div className="lang-track">
        <motion.div
          className="lang-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ background: color }}
        />
      </div>
    </div>
  )
}

const LANG_COLORS = {
  JavaScript: '#f0db4f',
  Java: '#b07219',
  Python: '#3572A5',
  TypeScript: '#3178c6',
  'C++': '#f34b7d',
  CSS: '#563d7c',
  HTML: '#e34c26',
}

export default function DashboardPage() {
  const [lcData, setLcData] = useState(LEETCODE_FALLBACK)
  const [githubStats, setGithubStats] = useState({ followers: 0, public_repos: 0, stars: 0 })
  const [languages, setLanguages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  useScrollReveal()

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [lcStats, gitUser, repos] = await Promise.all([
          fetchLeetCodeStats(),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`).then(res => res.json()),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`).then(res => res.json())
        ]);

        if (!isMounted) return;

        // Sync LeetCode
        if (lcStats) {
          setLcData({
            totalSolved: lcStats.totalSolved || lcStats.total_solved || 0,
            easySolved: lcStats.easySolved || lcStats.easy_solved || 0,
            mediumSolved: lcStats.mediumSolved || lcStats.medium_solved || 0,
            hardSolved: lcStats.hardSolved || lcStats.hard_solved || 0,
            ranking: lcStats.ranking || 0,
            reputation: lcStats.reputation || lcStats.contributionPoints || 0,
          });
        }

        // Sync GitHub Profile
        if (gitUser && !gitUser.message) {
          const totalStars = Array.isArray(repos) ? repos.reduce((s, r) => s + (r.stargazers_count || 0), 0) : 0;
          setGithubStats({
            followers: gitUser.followers || 0,
            public_repos: gitUser.public_repos || 0,
            stars: totalStars
          });
        }

        // Language Distribution
        if (Array.isArray(repos) && repos.length > 0) {
          const langCounts = {}
          let totalLangs = 0
          repos.forEach(repo => {
            if (repo.language) {
              langCounts[repo.language] = (langCounts[repo.language] || 0) + 1
              totalLangs++
            }
          })
          
          const sortedLangs = Object.entries(langCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([lang, count]) => ({
              lang,
              pct: Math.round((count / totalLangs) * 100),
              color: LANG_COLORS[lang] || '#8b5cf6'
            }))
          
          setLanguages(sortedLangs);
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [])


  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  // Calculate percentages safely (avoid NaN if 0 solved)
  const total = lcData.totalSolved || 1;
  const easyDash = (lcData.easySolved / total) * 301.6;
  const medDash = (lcData.mediumSolved / total) * 301.6;
  const hardDash = (lcData.hardSolved / total) * 301.6;

  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div key="preloader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <ThreePreloader onComplete={() => setIsLoading(false)} />
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <motion.div
      className="dashboard-page"
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{ overflow: 'hidden' }}
    >
      {/* Hero */}
      <section className="dashboard-hero reveal">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <span>📊</span>
            <span>Developer Pulse</span>
          </div>
          <h1 className="section-title" style={{ marginBottom: '0.75rem' }}>
            My Coding <span className="gradient-text"><TextScramble text="Dashboard" /></span>
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Live stats aggregated from GitHub, LeetCode &amp; more — all in one place.
          </p>
        </motion.div>
      </section>

      {/* Top Stats */}
      <section className="dashboard-stats reveal">
        <StatCard value={lcData.totalSolved} label="Solved" icon="🧩" color="#7c3aed" delay={0.1} />
        <StatCard value={githubStats.stars} label="GitHub Stars" icon="⭐" color="#f59e0b" delay={0.15} />
        <StatCard value={githubStats.followers} label="Followers" icon="👥" color="#10b981" delay={0.2} />
        <StatCard value={githubStats.public_repos} label="Repositories" icon="📁" color="#3b82f6" delay={0.25} />
        <StatCard value={lcData.ranking ? '#' + lcData.ranking.toLocaleString() : 'N/A'} label="Global Rank" icon="🏆" color="#06b6d4" delay={0.3} />
        <StatCard value={lcData.reputation} label="Reputation" icon="✨" color="#ec4899" delay={0.35} />
      </section>

      <div className="dashboard-grid">
        {/* LeetCode Progress */}
        <motion.div
          className="dash-panel glassmorphic reveal"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="dash-panel-header">
            <h3>🧠 <TextScramble text="LeetCode Progress" /></h3>
            <a
              href={`https://leetcode.com/${LEETCODE_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="dash-link"
            >
              View Profile ↗
            </a>
          </div>
          <div className="lc-donut-wrap">
            <svg viewBox="0 0 120 120" className="lc-donut">
              <circle cx="60" cy="60" r="48" fill="none" stroke="hsl(240 5% 18%)" strokeWidth="12" />
              {/* Easy */}
              <circle cx="60" cy="60" r="48" fill="none" stroke="#10b981" strokeWidth="12"
                strokeDasharray={`${easyDash} 301.6`}
                strokeDashoffset="0" strokeLinecap="round"
                style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
              />
              {/* Medium */}
              <circle cx="60" cy="60" r="48" fill="none" stroke="#f59e0b" strokeWidth="12"
                strokeDasharray={`${medDash} 301.6`}
                strokeDashoffset={-easyDash}
                strokeLinecap="round"
                style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
              />
              {/* Hard */}
              <circle cx="60" cy="60" r="48" fill="none" stroke="#ef4444" strokeWidth="12"
                strokeDasharray={`${hardDash} 301.6`}
                strokeDashoffset={-(easyDash + medDash)}
                strokeLinecap="round"
                style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
              />
              <text x="60" y="54" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="800">{lcData.totalSolved}</text>
              <text x="60" y="70" textAnchor="middle" fill="hsl(240 5% 55%)" fontSize="8">Solved</text>
            </svg>
            <div className="lc-legend">
              {[
                { label: 'Easy', val: lcData.easySolved, color: '#10b981' },
                { label: 'Medium', val: lcData.mediumSolved, color: '#f59e0b' },
                { label: 'Hard', val: lcData.hardSolved, color: '#ef4444' },
              ].map(item => (
                <div key={item.label} className="lc-legend-item">
                  <span style={{ background: item.color }} className="lc-legend-dot" />
                  <span className="lc-legend-label">{item.label}</span>
                  <span className="lc-legend-val" style={{ color: item.color }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Language Distribution */}
        <motion.div
          className="dash-panel glassmorphic"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <div className="dash-panel-header">
            <h3>💻 <TextScramble text="GitHub Language Distribution" /></h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analyzing repositories…</div>
            ) : (
              languages.map((l) => (
                <LanguageBar key={l.lang} {...l} />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Real GitHub Activity Chart */}
      <motion.div
        className="dash-panel glassmorphic"
        style={{ margin: '0 2rem 3rem', maxWidth: 1360, marginLeft: 'auto', marginRight: 'auto' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        <div className="dash-panel-header">
          <h3>🟩 <TextScramble text="Contribution Activity" /></h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time data from GitHub</span>
        </div>
        
        <div style={{ padding: '0.5rem 0', overflowX: 'auto' }}>
          <img
            src={`https://ghchart.rshah.org/8b5cf6/${GITHUB_USERNAME}`}
            alt="GitHub contribution chart"
            style={{ width: '100%', minWidth: 600, display: 'block', margin: '0 auto', filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.15))' }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

