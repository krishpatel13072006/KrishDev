import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  motion,
  AnimatePresence,
} from 'framer-motion'
import { projects } from '../data/projects'

// ── Markdown-like README renderer (no library needed) ─────────
function ReadmeRenderer({ content }) {
  const lines = content.split('\n')
  const elements = []
  let codeBlock = false
  let codeLines = []

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!codeBlock) {
        codeBlock = true
        codeLines = []
      } else {
        elements.push(
          <pre key={`code-${i}`}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        )
        codeBlock = false
        codeLines = []
      }
      return
    }
    if (codeBlock) { codeLines.push(line); return }

    if (line.startsWith('# '))
      elements.push(<h1 key={i}>{line.slice(2)}</h1>)
    else if (line.startsWith('## '))
      elements.push(<h2 key={i}>{line.slice(3)}</h2>)
    else if (line.startsWith('### '))
      elements.push(<h3 key={i}>{line.slice(4)}</h3>)
    else if (line.startsWith('- '))
      elements.push(<li key={i} style={{ listStyle:'disc', marginLeft:'1.5rem', color:'var(--text-secondary)', lineHeight:1.8 }}>{line.slice(2).replace(/\*\*(.*?)\*\*/g, (_, t) => t)}</li>)
    else if (line.trim() !== '')
      elements.push(<p key={i}>{line}</p>)
  })

  return <div className="readme-container">{elements}</div>
}

// ── Tab content ───────────────────────────────────────────────
const tabVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

// ── Icons ─────────────────────────────────────────────────────
const ExternalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
  </svg>
)

// ── ProjectDetailPage ─────────────────────────────────────────
export default function ProjectDetailPage() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)
  const [activeTab, setActiveTab] = useState('preview')
  const [iframeError, setIframeError] = useState(false)
  const [isPreloading, setIsPreloading] = useState(true)

  // Trigger quick preload animation
  useEffect(() => {
    setIsPreloading(true)
    const timer = setTimeout(() => setIsPreloading(false), 1500)
    return () => clearTimeout(timer)
  }, [id])

  if (!project) {
    return (
      <div className="not-found">
        <h2>Project not found</h2>
        <Link to="/" style={{ color: 'var(--accent)' }}>← Back to all projects</Link>
      </div>
    )
  }

  const tabs = [
    { id: 'preview', label: '🖥 Live Preview' },
    { id: 'readme',  label: '📖 README' },
    { id: 'tech',    label: '🛠 Tech Stack' },
  ]

  return (
    <AnimatePresence mode="wait">
      {isPreloading ? (
        <motion.div
          key="project-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', inset: 0, zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-default)', minHeight: '80vh', gap: '1.5rem',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <motion.div
            style={{
              width: 60, height: 60, border: `3px solid ${project.color}`,
              borderTopColor: 'transparent', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: project.color, boxShadow: `0 0 15px ${project.color}` }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
          >
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>DECRYPTING DATA</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 700, color: project.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{project.title}</span>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="project-content"
          className="detail-page"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── Back Button ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ position: 'absolute', top: '80px', left: '2rem', zIndex: 20 }}
          >
            <Link to="/" className="back-btn" style={{ position: 'relative', top: 'auto', left: 'auto', margin: 0 }}>
              ← Back
            </Link>
          </motion.div>

          {/* ── Hero Banner ── */}
          <motion.div
            className="detail-hero"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src={project.image} alt={project.title} className="detail-hero-img" />
            <div className="detail-hero-overlay">
              <motion.div
                className="detail-hero-content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
              >
                <p className="detail-category">{project.category}</p>
                <h1 className="detail-title">{project.title}</h1>
                <div className="detail-meta">
                  <span className="badge">
                    <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:'#28c840' }} />
                    Live Deployed
                  </span>
                  <span className="badge">⭐ {project.stars} stars</span>
                  <span className="badge">🍴 {project.forks} forks</span>
                  <span className="badge" style={{ background: `${project.color}18`, borderColor: `${project.color}40`, color: project.color }}>
                    {project.tech[0]}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Body ── */}
          <div className="detail-body">
            {/* Main column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Description card */}
              <motion.p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  marginBottom: '1.75rem',
                  padding: '1.25rem 1.5rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  borderLeft: `4px solid ${project.color}`,
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {project.description}
              </motion.p>

              {/* Tabs */}
              <div className="tabs">
                {tabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    whileTap={{ scale: 0.96 }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'preview' && (
                  <motion.div key="preview" variants={tabVariants} initial="initial" animate="animate" exit="exit">
                    <div className="preview-container">
                      <div className="preview-bar">
                        <span className="preview-dot" />
                        <span className="preview-dot" />
                        <span className="preview-dot" />
                        <span className="preview-url">{project.liveUrl}</span>
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            color: 'var(--accent)', fontSize: '0.78rem', textDecoration: 'none',
                            padding: '0.3rem 0.75rem', borderRadius: '8px',
                            background: 'hsl(258 89% 66% / 10%)',
                            border: '1px solid hsl(258 89% 66% / 25%)',
                            whiteSpace: 'nowrap'
                          }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <ExternalIcon /> Open
                        </motion.a>
                      </div>
                      {iframeError ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            height: 520, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: '1rem',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <div style={{ fontSize: '3rem' }}>🔒</div>
                          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Preview blocked by the site
                          </p>
                          <p style={{ fontSize: '0.875rem', maxWidth: 320, textAlign: 'center' }}>
                            This site doesn't allow embedding in iframes. Open it in a new tab instead.
                          </p>
                          <motion.a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="action-btn action-btn-primary"
                            style={{ width: 'auto', padding: '0.75rem 1.75rem', textDecoration: 'none' }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <ExternalIcon /> Open Live Site
                          </motion.a>
                        </motion.div>
                      ) : (
                        <iframe
                          key={project.liveUrl}
                          className="preview-iframe"
                          src={project.liveUrl}
                          title={`${project.title} live preview`}
                          onError={() => setIframeError(true)}
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        />
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'readme' && (
                  <motion.div key="readme" variants={tabVariants} initial="initial" animate="animate" exit="exit">
                    <ReadmeRenderer content={project.readme} />
                  </motion.div>
                )}

                {activeTab === 'tech' && (
                  <motion.div key="tech" variants={tabVariants} initial="initial" animate="animate" exit="exit">
                    <div className="readme-container">
                      <h1>Tech Stack</h1>
                      <p>Technologies used in this project:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
                        {project.tech.map((t, i) => (
                          <motion.span
                            key={t}
                            className="tech-badge-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.06 }}
                            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                          >
                            {t}
                          </motion.span>
                        ))}
                      </div>

                      {/* Color accent bar */}
                      <div style={{ marginTop: '2rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Project Color Identity
                      </div>
                      <div style={{ height: 8, borderRadius: 8, background: `linear-gradient(90deg, ${project.color}, transparent)` }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Sidebar ── */}
            <motion.aside
              className="detail-sidebar"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {/* CTA */}
              <div className="sidebar-card">
                <p className="sidebar-card-title">Quick Actions</p>
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="action-btn action-btn-primary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ExternalIcon /> View Live Site →
                </motion.a>
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="action-btn action-btn-secondary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <GithubIcon /> Source Code
                </motion.a>
              </div>

              {/* Stats */}
              <div className="sidebar-card">
                <p className="sidebar-card-title">GitHub Stats</p>
                <div className="sidebar-stats">
                  {[
                    { val: project.stars, key: 'Stars' },
                    { val: project.forks, key: 'Forks' },
                    { val: project.tech.length, key: 'Technologies' },
                    { val: project.featured ? 'Yes' : 'No', key: 'Featured' },
                  ].map(({ val, key }) => (
                    <motion.div
                      key={key}
                      className="sidebar-stat"
                      whileHover={{ borderColor: project.color, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="sidebar-stat-val">{val}</span>
                      <span className="sidebar-stat-key">{key}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="sidebar-card">
                <p className="sidebar-card-title">Tech Stack</p>
                <div className="tech-stack-grid">
                  {project.tech.map((t, i) => (
                    <motion.span
                      key={t}
                      className="tech-badge-lg"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Related projects */}
              <div className="sidebar-card">
                <p className="sidebar-card-title">Other Projects</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {projects.filter(p => p.id !== project.id).slice(0, 3).map(p => (
                    <motion.a
                      key={p.id}
                      href={`/project/${p.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        textDecoration: 'none', padding: '0.6rem 0.75rem',
                        borderRadius: 10, border: '1px solid var(--border)',
                        color: 'var(--text-secondary)', fontSize: '0.85rem',
                        transition: 'all 0.2s',
                      }}
                      whileHover={{ borderColor: p.color, color: 'var(--text-primary)', x: 4 }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                      {p.title}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
