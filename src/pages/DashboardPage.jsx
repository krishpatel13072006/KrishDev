import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const GITHUB_USERNAME = 'krishpatel13072006'

const LEETCODE_FALLBACK = {
  totalSolved: 15,
  easySolved: 10,
  mediumSolved: 4,
  hardSolved: 1,
  ranking: 0,
  contestRating: 0,
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

// Map languages to colors for consistency
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
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    Promise.all([
      // Fetch LeetCode Real Stats (using a faster vercel proxy)
      fetch(`https://leetcode-api-faisalshohag.vercel.app/${GITHUB_USERNAME}`, { signal: controller.signal })
        .then(res => res.json())
        .catch(() => null),
      // Fetch GitHub Repos for Language Distribution
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, { signal: controller.signal })
        .then(res => res.json())
        .catch(() => [])
    ]).then(([lcStats, repos]) => {
      clearTimeout(timeoutId)
      
      if (lcStats && !lcStats.errors && lcStats.totalSolved !== undefined) {
        setLcData({
          totalSolved: lcStats.totalSolved || 0,
          easySolved: lcStats.easySolved || 0,
          mediumSolved: lcStats.mediumSolved || 0,
          hardSolved: lcStats.hardSolved || 0,
          ranking: lcStats.ranking || 0,
          contestRating: lcStats.reputation || 0,
        })
      }

      if (Array.isArray(repos) && repos.length > 0 && !repos.message) {
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
        
        setLanguages(sortedLangs.length > 0 ? sortedLangs : [
          { lang: 'JavaScript', pct: 40, color: '#f0db4f' },
          { lang: 'Java', pct: 30, color: '#b07219' },
          { lang: 'HTML/CSS', pct: 30, color: '#e34c26' }
        ])
      } else {
        // Fallback if GitHub API fails/rate limited
        setLanguages([
          { lang: 'Java', pct: 45, color: '#b07219' },
          { lang: 'JavaScript', pct: 35, color: '#f0db4f' },
          { lang: 'Python', pct: 20, color: '#3572A5' }
        ])
      }
      setLoading(false)
    }).catch(() => {
      setLanguages([{ lang: 'Java', pct: 45, color: '#b07219' }, { lang: 'JavaScript', pct: 35, color: '#f0db4f' }, { lang: 'Python', pct: 20, color: '#3572A5' }])
      setLoading(false)
    })
    
    return () => { clearTimeout(timeoutId); controller.abort() }
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

  return (
    <motion.div
      className="dashboard-page"
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Hero */}
      <section className="dashboard-hero">
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
            My Coding <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Live stats aggregated from GitHub, LeetCode &amp; more — all in one place.
          </p>
        </motion.div>
      </section>

      {/* Top Stats */}
      <section className="dashboard-stats">
        <StatCard value={lcData.totalSolved} label="Problems Solved" icon="🧩" color="#7c3aed" delay={0.1} />
        <StatCard value={lcData.easySolved} label="Easy" icon="🟢" color="#10b981" delay={0.15} />
        <StatCard value={lcData.mediumSolved} label="Medium" icon="🟡" color="#f59e0b" delay={0.2} />
        <StatCard value={lcData.hardSolved} label="Hard" icon="🔴" color="#ef4444" delay={0.25} />
        <StatCard value={lcData.ranking ? '#' + lcData.ranking.toLocaleString() : 'N/A'} label="Global Rank" icon="🏆" color="#06b6d4" delay={0.3} />
        <StatCard value={lcData.contestRating} label="Reputation" icon="✨" color="#ec4899" delay={0.35} />
      </section>

      <div className="dashboard-grid">
        {/* LeetCode Progress */}
        <motion.div
          className="dash-panel"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="dash-panel-header">
            <h3>🧠 LeetCode Progress</h3>
            <a
              href={`https://leetcode.com/${GITHUB_USERNAME}`}
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
          className="dash-panel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <div className="dash-panel-header">
            <h3>💻 GitHub Language Distribution</h3>
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
        className="dash-panel"
        style={{ margin: '0 2rem 3rem', maxWidth: 1360, marginLeft: 'auto', marginRight: 'auto' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        <div className="dash-panel-header">
          <h3>🟩 Contribution Activity</h3>
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

