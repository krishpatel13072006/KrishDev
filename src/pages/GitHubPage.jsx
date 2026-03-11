import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const GITHUB_USER = 'krishpatel13072006'

export default function GitHubPage() {
  const [profile, setProfile] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`).then(r => r.json()),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=20`).then(r => r.json()),
    ]).then(([user, repoList]) => {
      setProfile(user)
      setRepos(Array.isArray(repoList) ? repoList : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', color: 'var(--text-secondary)' }}>
        <motion.div
          style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <p>Fetching GitHub profile…</p>
      </div>
    )
  }

  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0)
  const topLangs = [...new Set(repos.map(r => r.language).filter(Boolean))].slice(0, 6)

  return (
    <motion.div
      style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem 5rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Profile Header ── */}
      {profile && (
        <motion.div
          className="github-profile-header"
          style={{
            display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap',
            background: 'var(--bg-glass)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '2rem',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow)',
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={profile.avatar_url}
            alt={profile.login}
            style={{ width: 110, height: 110, borderRadius: '50%', border: '3px solid var(--accent)', flexShrink: 0 }}
            whileHover={{ scale: 1.07, rotate: 3 }}
          />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                {profile.name || profile.login}
              </h1>
              <span style={{
                background: 'var(--accent-glow)', border: '1px solid var(--border-hover)',
                color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 700,
                padding: '0.2rem 0.7rem', borderRadius: 999,
              }}>@{profile.login}</span>
            </div>
            {profile.bio && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>{profile.bio}</p>
            )}
            <div className="github-profile-stats" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Repos', val: profile.public_repos },
                { label: 'Followers', val: profile.followers },
                { label: 'Following', val: profile.following },
                { label: 'Stars', val: totalStars },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{val}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <motion.a
              href={profile.html_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', background: 'var(--accent)',
                color: '#fff', borderRadius: 10, textDecoration: 'none',
                fontWeight: 700, fontSize: '0.9rem',
                boxShadow: '0 0 20px var(--accent-glow)'
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/></svg>
              View on GitHub
            </motion.a>
            {topLangs.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                {topLangs.map(lang => (
                  <span key={lang} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                    padding: '0.2rem 0.6rem', borderRadius: 6,
                    background: 'hsl(240 5% 15%)', color: 'var(--accent-2)',
                    border: '1px solid hsl(190 90% 55% / 25%)'
                  }}>{lang}</span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── GitHub Contribution Graph ── */}
      <motion.div
        style={{
          background: 'var(--bg-glass)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          boxShadow: 'var(--shadow)'
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Contribution Activity
        </div>
        <div style={{ padding: '1.25rem', overflowX: 'auto' }}>
          <img
            src={`https://ghchart.rshah.org/6366f1/${GITHUB_USER}`}
            alt="GitHub contribution chart"
            style={{ width: '100%', minWidth: 600, borderRadius: 8, display: 'block' }}
          />
        </div>
      </motion.div>

      {/* ── Repos Grid ── */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Public Repositories <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>({repos.length})</span>
        </h2>
      </div>

      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {repos.map(repo => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            variants={itemVariants}
            style={{ textDecoration: 'none', display: 'block' }}
            whileHover={{ y: -4 }}
          >
            <div style={{
              background: 'var(--bg-glass)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '1.25rem',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              height: '100%', transition: 'border-color 0.25s, box-shadow 0.25s',
              boxShadow: 'var(--shadow)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = '0 8px 40px hsl(0 0% 0% / 50%), var(--shadow-glow)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.95rem', wordBreak: 'break-word' }}>{repo.name}</span>
                {repo.fork && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 999, padding: '0.15rem 0.5rem' }}>fork</span>}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem', minHeight: 36 }}>
                {repo.description || 'No description provided.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {repo.language && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-2)', display: 'inline-block' }} />
                    {repo.language}
                  </span>
                )}
                <span>⭐ {repo.stargazers_count}</span>
                <span>🍴 {repo.forks_count}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  )
}
