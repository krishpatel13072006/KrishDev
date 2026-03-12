import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'Projects', to: '/' },
    { label: 'GitHub', to: '/github' },
    { label: 'LeetCode', to: '/leetcode' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Guestbook', to: '/guestbook' },
    { label: 'Resume', to: '/resume' },
    { label: 'Contact', to: '/contact' },
  ]

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link to="/" className="nav-logo">
        &lt;KrishDev /&gt;
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="nav-links">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? 'nav-link-active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Theme toggle (visible on all screens) */}
        <motion.button
          onClick={toggle}
          className="theme-toggle"
          aria-label="Toggle theme"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92, rotate: 20 }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </motion.div>
        </motion.button>
        
        {/* Mobile menu hint (could be expanded later) */}
        <div className="mobile-menu-btn" style={{ display: 'none', color: 'var(--text-secondary)' }} onClick={() => setIsOpen(!isOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
              padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)', zIndex: 99
            }}
          >
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                style={{
                  color: location.pathname === to ? 'var(--accent)' : 'var(--text-primary)',
                  textDecoration: 'none', fontSize: '1rem', fontWeight: 500, padding: '0.5rem'
                }}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
