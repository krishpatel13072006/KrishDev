import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Static guestbook entries to seed
const SEED_MESSAGES = [
  {
    id: 1,
    name: 'Rahul Sharma',
    message: 'Really impressive portfolio! The 3D animations are mind-blowing. Keep up the great work! 🔥',
    country: '🇮🇳',
    timestamp: '2026-03-10',
    color: '#7c3aed',
    initials: 'RS',
  },
  {
    id: 2,
    name: 'Alex Chen',
    message: 'Loved the LeetCode stats integration. The cyberpunk aesthetic is super cool! Following your journey.',
    country: '🇺🇸',
    timestamp: '2026-03-09',
    color: '#06b6d4',
    initials: 'AC',
  },
  {
    id: 3,
    name: 'Priya Nair',
    message: 'The preloader animation is absolutely stunning. You have a great eye for design + code combo! 🚀',
    country: '🇮🇳',
    timestamp: '2026-03-08',
    color: '#ec4899',
    initials: 'PN',
  },
  {
    id: 4,
    name: 'Dmitri Volkov',
    message: 'Solid engineering skills shown here. The GitHub API integration and project detail page are well done.',
    country: '🇷🇺',
    timestamp: '2026-03-07',
    color: '#10b981',
    initials: 'DV',
  },
]

const COLORS = ['#7c3aed', '#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#ef4444']
const EMOJIS = ['✨', '🚀', '🔥', '💎', '⚡', '🌊', '🎯', '🏆']

function GuestCard({ entry, index }) {
  return (
    <motion.div
      className="guest-card"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      layout
      style={{ '--gc-color': entry.color }}
    >
      <div className="guest-card-header">
        <div className="guest-avatar" style={{ background: `${entry.color}25`, border: `2px solid ${entry.color}60`, color: entry.color }}>
          {entry.initials}
        </div>
        <div className="guest-meta">
          <div className="guest-name">
            {entry.country} {entry.name}
          </div>
          <div className="guest-date">{entry.timestamp}</div>
        </div>
      </div>
      <p className="guest-message">"{entry.message}"</p>
      <div className="guest-accent" style={{ background: `linear-gradient(90deg, ${entry.color}, transparent)` }} />
    </motion.div>
  )
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState(SEED_MESSAGES)
  const [form, setForm] = useState({ name: '', country: '🌏', message: '', emoji: '✨' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const initials = form.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase()

    const newEntry = {
      id: Date.now(),
      name: form.name,
      country: form.country,
      message: form.emoji + ' ' + form.message,
      timestamp: new Date().toISOString().split('T')[0],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      initials,
    }
    setEntries(prev => [newEntry, ...prev])
    setForm({ name: '', country: '🌏', message: '', emoji: '✨' })
    setErrors({})
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <motion.div
      className="guestbook-page"
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Hero */}
      <section className="dashboard-hero">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <span>💬</span>
            <span>Community</span>
          </div>
          <h1 className="section-title" style={{ marginBottom: '0.75rem' }}>
            <span className="gradient-text">Guestbook</span>
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Leave a message, share your thoughts, or just say hi! 👋
          </p>
        </motion.div>
      </section>

      <div className="guestbook-layout">
        {/* Form */}
        <motion.div
          className="guest-form-panel"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="guest-form-title">✍️ Sign the Guestbook</h3>

          <AnimatePresence>
            {submitted && (
              <motion.div
                className="guest-success"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                🎉 Message posted! Thanks for signing!
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="guest-form">
            <div className="guest-field">
              <label>Your Name *</label>
              <input
                type="text"
                placeholder="Krish Patel"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className={`guest-input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="guest-field-row">
              <div className="guest-field" style={{ flex: 1 }}>
                <label>Country Flag</label>
                <select
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  className="guest-input"
                >
                  {['🌏', '🇮🇳', '🇺🇸', '🇬🇧', '🇩🇪', '🇯🇵', '🇧🇷', '🇨🇦', '🇦🇺', '🇫🇷', '🇷🇺', '🇰🇷', '🇨🇳', '🇸🇬', '🌍', '🌎'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="guest-field" style={{ flex: 1 }}>
                <label>Mood Emoji</label>
                <select
                  value={form.emoji}
                  onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                  className="guest-input"
                >
                  {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>

            <div className="guest-field">
              <label>Message * ({form.message.length}/280)</label>
              <textarea
                placeholder="Share your thoughts, feedback, or just say hello!"
                value={form.message}
                onChange={e => {
                  if (e.target.value.length <= 280) setForm(f => ({ ...f, message: e.target.value }))
                }}
                className={`guest-input guest-textarea ${errors.message ? 'input-error' : ''}`}
                rows={4}
              />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>

            <motion.button
              type="submit"
              className="action-btn action-btn-primary"
              style={{ marginBottom: 0 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              ✉️ Post Message
            </motion.button>
          </form>
        </motion.div>

        {/* Messages */}
        <div className="guest-messages">
          <h3 className="guest-form-title">
            💬 Messages <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>({entries.length})</span>
          </h3>
          <AnimatePresence mode="popLayout">
            {entries.map((entry, i) => (
              <GuestCard key={entry.id} entry={entry} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
