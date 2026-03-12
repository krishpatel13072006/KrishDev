import { useState, useMemo, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion'
import { projects, categories } from '../data/projects'
import ThreeScene from '../components/ThreeScene'

// ── Framer Motion Variants ──────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
  exit:   { opacity: 0, y: -20, scale: 0.95,
    transition: { duration: 0.3 } },
}
const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
}

// ── Ticker items ─────────────────────────────────────────────
const tickerItems = [
  'React', 'Node.js', 'MongoDB', 'Framer Motion', 'TypeScript',
  'Next.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL',
  'Tailwind', 'Socket.IO', 'Redis', 'Vite', 'Python',
]

// ── Star icon ────────────────────────────────────────────────
const StarIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
  </svg>
)
const ForkIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
  </svg>
)

// ── Project Card ─────────────────────────────────────────────
const ProjectCard = forwardRef(({ project, index }, ref) => {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      layout
      layoutId={`card-${project.id}`}
      className="project-card"
      onClick={() => navigate(`/project/${project.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        '--card-accent': project.color,
        boxShadow: hovered
          ? `0 8px 40px hsl(0 0% 0% / 50%), 0 0 40px ${project.color}25`
          : undefined,
        borderColor: hovered ? `${project.color}50` : undefined,
      }}
    >
      {/* Image */}
      <div className="card-img-wrap">
        <img src={project.image} alt={project.title} loading="lazy" />
        <div className="card-overlay">
          <span className="card-live-badge">
            <span className="live-dot" />
            Live
          </span>
          {project.featured && (
            <span className="card-featured-badge">⭐ Featured</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-title">{project.title}</h3>
          <span className="card-category">{project.category}</span>
        </div>
        <p className="card-desc">{project.description}</p>
        <div className="card-tech">
          {project.tech.slice(0, 4).map(t => (
            <span key={t} className="tech-badge">{t}</span>
          ))}
          {project.tech.length > 4 && (
            <span className="tech-badge">+{project.tech.length - 4}</span>
          )}
        </div>
        <div className="card-footer">
          <div className="card-stats">
            <span className="card-stat"><StarIcon /> {project.stars}</span>
            <span className="card-stat"><ForkIcon /> {project.forks}</span>
          </div>
          <motion.div
            className="card-arrow"
            animate={{ rotate: hovered ? 45 : 0, backgroundColor: hovered ? project.color : 'hsl(258 89% 66% / 10%)' }}
            transition={{ duration: 0.3 }}
          >
            ↗
          </motion.div>
        </div>
      </div>

      {/* Color accent bottom line */}
      <motion.div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${project.color}, transparent)`,
          borderRadius: '0 0 0 var(--radius-lg)',
        }}
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  )
})

// ── HomePage ─────────────────────────────────────────────────
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  const totalStars = projects.reduce((s, p) => s + p.stars, 0)

  // Duplicate ticker for seamless loop
  const tickerFull = [...tickerItems, ...tickerItems]

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero hero-split">
        <div className="hero-left">
          <motion.div variants={heroVariants} initial="hidden" animate="show">
            <div className="hero-eyebrow">
              <span>⚡</span>
              <span>Live Portfolio · {new Date().getFullYear()}</span>
            </div>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            Things I've{' '}
            <span className="gradient-text">Shipped</span>
            <br />to the World
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ margin: '0 0 2rem' }}
          >
            A curated collection of my deployed projects — click any card for a
            live preview, source code, and full documentation.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ justifyContent: 'flex-start' }}
          >
            {[
              { val: projects.length, label: 'Projects' },
              { val: totalStars, label: 'GitHub Stars' },
              { val: projects.filter(p => p.featured).length, label: 'Featured' },
            ].map(({ val, label }) => (
              <div className="stat" key={label}>
                <motion.span
                  className="stat-number"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {val}+
                </motion.span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D Scene */}
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <ThreeScene />
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <motion.div
        className="ticker-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="ticker-inner">
          {tickerFull.map((item, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot">✦</span> {item}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── FILTER BAR ── */}
      <motion.div
        className="filter-bar"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        {categories.map(cat => (
          <motion.button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            whileTap={{ scale: 0.95 }}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* ── PROJECTS GRID ── */}
      <motion.div
        className="projects-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          className="not-found"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>No projects in this category yet.</h2>
          <p>Check back soon!</p>
        </motion.div>
      )}
    </>
  )
}
