import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TextScramble from '../components/TextScramble'
import useScrollReveal from '../hooks/useScrollReveal'

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    handle: '@krishpatel13072006',
    url: 'https://github.com/krishpatel13072006',
    color: '#6e40c9',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    handle: 'krishpatel13072006@gmail.com',
    url: 'mailto:krishpatel13072006@gmail.com',
    color: '#ea4335',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    handle: 'krish-patel',
    url: 'https://linkedin.com/in/krish-patel',
    color: '#0a66c2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'LeetCode',
    handle: 'krishpatel13072006',
    url: 'https://leetcode.com/krishpatel13072006',
    color: '#f89f1b',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
      </svg>
    ),
  },
]

const SUBJECTS = ['General Inquiry', 'Project Collaboration', 'Job Opportunity', 'Freelance Work', 'Bug Report', 'Other']

// Animated particle that bursts from input on focus
function InputParticles({ active, color = 'var(--accent)' }) {
  if (!active) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 10 }}>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 40
        const y = Math.sin(angle) * 20
        return (
          <motion.span
            key={i}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: 5, height: 5, borderRadius: '50%',
              background: color, display: 'block',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.03 }}
          />
        )
      })}
    </div>
  )
}

// Magnetic floating-label input with glow, particles, and scan line
function GlowInput({ id, label, type = 'text', value, onChange, error, required, as: Tag = 'input', rows }) {
  const [focused, setFocused] = useState(false)
  const [justFocused, setJustFocused] = useState(false)
  const isUp = focused || value.length > 0

  const handleFocus = () => {
    setFocused(true)
    setJustFocused(true)
    setTimeout(() => setJustFocused(false), 600)
  }

  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      {/* Particles burst on focus */}
      <InputParticles active={justFocused} />

      {/* Scan line effect */}
      {focused && (
        <motion.div
          style={{
            position: 'absolute', left: 2, right: 2, height: 2, borderRadius: 2,
            background: `linear-gradient(90deg, transparent, var(--accent), transparent)`,
            zIndex: 5, pointerEvents: 'none',
          }}
          initial={{ top: 2, opacity: 0.8 }}
          animate={{ top: Tag === 'textarea' ? (rows || 4) * 24 : 46, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeIn' }}
        />
      )}

      {/* Floating label */}
      <motion.label
        htmlFor={id}
        animate={{
          top: isUp ? -10 : Tag === 'textarea' ? 14 : '50%',
          y: isUp ? 0 : Tag === 'textarea' ? 0 : '-50%',
          fontSize: isUp ? '0.7rem' : '0.88rem',
          color: focused ? 'var(--accent)' : error ? '#f87171' : 'var(--text-muted)',
        }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute', left: 14, pointerEvents: 'none',
          fontFamily: 'var(--font-sans)', fontWeight: 600,
          background: isUp ? 'var(--bg-base)' : 'transparent',
          padding: isUp ? '0 6px' : '0',
          borderRadius: 4, zIndex: 6,
          letterSpacing: isUp ? '0.05em' : 'normal',
        }}
      >
        {label}{required && <span style={{ color: 'var(--accent)' }}>*</span>}
      </motion.label>

      {/* The actual input */}
      <Tag
        id={id}
        type={type}
        value={value}
        rows={rows}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        required={required}
        style={{
          position: 'relative', zIndex: 2,
          width: '100%',
          padding: Tag === 'textarea' ? '1rem 1rem' : '0.9rem 1rem',
          background: focused ? 'var(--bg-card-hover)' : 'var(--bg-card)',
          border: `1.5px solid ${error ? '#f87171' : focused ? 'var(--accent)' : 'var(--border)'}`,
          boxShadow: 'none',
          borderRadius: 12,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          outline: 'none',
          resize: Tag === 'textarea' ? 'vertical' : 'none',
          transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
          minHeight: Tag === 'textarea' ? 130 : 'auto',
        }}
      />

      {/* Typing indicator dots */}
      {focused && value.length > 0 && (
        <motion.div
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 3, zIndex: 7 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', display: 'block' }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.35rem', paddingLeft: '0.3rem', zIndex: 2, position: 'relative' }}
          >
            ⚠ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const cardRef = useRef(null)
  useScrollReveal()

  const set = (field) => (val) => {
    setForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'At least 10 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setErrors({})
    setStatus('sending')

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE",
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      })
      const result = await response.json()
      if (result.success) {
        setStatus('success')
        setTimeout(() => setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' }), 400)
      } else {
        setErrors({ message: 'Failed to send message. Is the Access Key set?' })
        setStatus('idle')
      }
    } catch (error) {
      setErrors({ message: 'Network error. Please try again later.' })
      setStatus('idle')
    }
  }

  return (
    <motion.div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem 5rem' }}
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

      {/* Header */}
      <motion.div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          <span>✉️</span><span>Let's Connect</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
          Get in <span className="gradient-text"><TextScramble text="Touch" /></span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Have a project in mind, want to collaborate, or just say hi? I'd love to hear from you.
        </p>
      </motion.div>

      <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

        {/* ── Contact Form with Glassmorphism ── */}
        <motion.div
          className="reveal"
          ref={cardRef}
          style={{
            background: 'var(--bg-glass)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '2.25rem',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            position: 'relative', overflow: 'visible',
            boxShadow: 'var(--shadow)',
          }}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4, borderColor: 'var(--border-hover)', boxShadow: '0 8px 40px hsl(0 0% 0% / 50%), var(--shadow-glow)' }}
        >
          {/* Shimmer top edge */}
          <motion.div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, borderRadius: 2,
            background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent)',
          }}
            animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.75rem' }}>Send a Message</h2>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <motion.div
                  style={{ width: 80, height: 80, borderRadius: '50%', background: 'hsl(142 70% 45% / 15%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', border: '2px solid hsl(142 70% 45% / 40%)' }}
                  initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}>✓</motion.div>
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i} style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: i % 2 ? 'var(--accent)' : 'var(--accent-2)' }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ x: Math.cos(i / 8 * Math.PI * 2) * 80, y: Math.sin(i / 8 * Math.PI * 2) * 80, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 + i * 0.04 }} />
                ))}
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Message sent! 🎉</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 320 }}>Your message has been delivered straight to my inbox. I'll get back to you soon!</p>
                <motion.button onClick={() => setStatus('idle')}
                  className="action-btn action-btn-secondary" style={{ marginTop: '0.5rem', width: 'auto', padding: '0.65rem 1.5rem' }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Send Another</motion.button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} noValidate>
                <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                  <GlowInput id="name" label="Your Name" value={form.name} onChange={set('name')} error={errors.name} required />
                  <GlowInput id="email" label="Email Address" type="email" value={form.email} onChange={set('email')} error={errors.email} required />
                </div>

                {/* Animated subject selector */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Subject</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {SUBJECTS.map((s, i) => (
                      <motion.button key={s} type="button" onClick={() => set('subject')(s)}
                        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * i }}
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '0.35rem 0.9rem', borderRadius: 999, border: `1.5px solid ${form.subject === s ? 'var(--accent)' : 'var(--border)'}`,
                          background: form.subject === s ? 'var(--accent)' : 'transparent',
                          color: form.subject === s ? '#fff' : 'var(--text-secondary)',
                          fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                          boxShadow: form.subject === s ? '0 0 14px var(--accent-glow)' : 'none',
                          transition: 'all 0.2s',
                        }}>
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <GlowInput id="message" label="Your Message" as="textarea" rows={5} value={form.message} onChange={set('message')} error={errors.message} required />

                {/* Char counter */}
                <div style={{ textAlign: 'right', fontSize: '0.72rem', color: form.message.length > 400 ? 'var(--accent-3)' : 'var(--text-muted)', marginTop: '-1rem', marginBottom: '1.2rem' }}>
                  {form.message.length} chars
                </div>

                <motion.button type="submit" disabled={status === 'sending'}
                  style={{
                    width: '100%', padding: '1rem', border: 'none',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    color: '#fff', borderRadius: 12,
                    fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700,
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    boxShadow: '0 0 24px var(--accent-glow)', position: 'relative', overflow: 'hidden',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px var(--accent-glow)' }}
                  whileTap={{ scale: 0.98 }}>
                  {/* shimmer sweep */}
                  <motion.div style={{
                    position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    pointerEvents: 'none',
                  }}
                    animate={{ left: ['−100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }} />
                  {status === 'sending' ? (
                    <>
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                      Sending message…
                    </>
                  ) : (
                    <>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </motion.button>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>Messages are sent directly and securely ✉️</p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Sidebar ── */}
        <motion.aside className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>

          {/* Availability */}
          <motion.div style={{
            background: 'hsl(142 70% 45% / 8%)', border: '1px solid hsl(142 70% 45% / 30%)',
            borderRadius: 'var(--radius)', padding: '1.4rem',
          }} whileHover={{ borderColor: 'hsl(142 70% 45% / 60%)', boxShadow: '0 0 20px hsl(142 70% 45% / 15%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'hsl(142 70% 55%)', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'hsl(142 70% 55%)' }}>Available for Work</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Open to freelance, collaborations & full-time roles. Let's build something great!
            </p>
          </motion.div>

          {/* Info */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.4rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Quick Info</p>
            {[
              { icon: '⚡', label: 'Response time', val: '< 24 hours' },
              { icon: '🌏', label: 'Location', val: 'India (IST)' },
              { icon: '💼', label: 'Role', val: 'Full Stack Dev' },
              { icon: '🎓', label: 'Status', val: 'Open to work' },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{icon} {label}</span>
                <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-primary)' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.4rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Find Me On</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {SOCIAL_LINKS.map((s, i) => (
                <motion.a key={s.name} href={s.url}
                  target={s.url.startsWith('mailto') ? '_self' : '_blank'} rel="noreferrer"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem 1rem', background: 'hsl(240 5% 7%)', border: '1px solid var(--border)', borderRadius: 10, textDecoration: 'none', color: 'var(--text-primary)' }}
                  whileHover={{ x: 6, borderColor: s.color, boxShadow: `0 0 16px ${s.color}25` }}>
                  <span style={{ color: s.color, flexShrink: 0 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.handle}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>↗</span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  )
}
