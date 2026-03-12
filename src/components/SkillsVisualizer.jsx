import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const skillCategories = [
  {
    name: 'Frontend',
    color: '#7c3aed',
    icon: '🎨',
    skills: [
      { name: 'HTML / CSS', level: 95, icon: '🌐' },
      { name: 'JavaScript', level: 90, icon: '🟨' },
      { name: 'React.js', level: 88, icon: '⚛️' },
      { name: 'Tailwind CSS', level: 85, icon: '🎨' },
      { name: 'Responsive Design', level: 92, icon: '📱' },
    ],
  },
  {
    name: 'Backend',
    color: '#06b6d4',
    icon: '⚙️',
    skills: [
      { name: 'Java', level: 92, icon: '☕' },
      { name: 'JDBC', level: 88, icon: '🔌' },
      { name: 'JSP & Servlets', level: 85, icon: '🌍' },
      { name: 'RESTful APIs', level: 87, icon: '🔗' },
      { name: 'JavaMail API', level: 78, icon: '📧' },
    ],
  },
  {
    name: 'Database',
    color: '#10b981',
    icon: '🗄️',
    skills: [
      { name: 'MySQL', level: 90, icon: '🐬' },
      { name: 'SQL', level: 88, icon: '📊' },
      { name: 'Git & GitHub', level: 92, icon: '🐙' },
      { name: 'VS Code', level: 95, icon: '💻' },
    ],
  },
  {
    name: 'Core Prog.',
    color: '#f59e0b',
    icon: '🧮',
    skills: [
      { name: 'C / C++', level: 85, icon: '⚡' },
      { name: 'Python', level: 80, icon: '🐍' },
      { name: 'DSA', level: 88, icon: '🌲' },
      { name: 'Problem Solving', level: 90, icon: '🧩' },
    ],
  },
]

function SkillBar({ skill, color, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="skill-bar-item"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="skill-bar-header">
        <span className="skill-bar-name">
          {skill.icon} {skill.name}
        </span>
        <motion.span
          className="skill-bar-level"
          animate={{ color: hovered ? color : 'var(--text-muted)' }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
        />
        <motion.div
          className="skill-bar-glow"
          animate={{ opacity: hovered ? 1 : 0 }}
          style={{
            width: `${skill.level}%`,
            boxShadow: `0 0 12px ${color}80`,
          }}
        />
      </div>
    </motion.div>
  )
}

export default function SkillsVisualizer() {
  const [activeCategory, setActiveCategory] = useState(0)
  const active = skillCategories[activeCategory]

  return (
    <section className="skills-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-header"
      >
        <div className="hero-eyebrow" style={{ display: 'inline-flex' }}>
          <span>🛠️</span>
          <span>Tech Stack</span>
        </div>
        <h2 className="section-title">Skills &amp; Expertise</h2>
        <p className="section-subtitle">A visual look at my technical proficiency across the stack.</p>
      </motion.div>

      {/* Category Tabs */}
      <div className="skills-tabs">
        {skillCategories.map((cat, i) => (
          <motion.button
            key={cat.name}
            className={`skills-tab ${activeCategory === i ? 'active' : ''}`}
            onClick={() => setActiveCategory(i)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            style={{
              '--cat-color': cat.color,
              borderColor: activeCategory === i ? cat.color : 'var(--border)',
              background: activeCategory === i ? `${cat.color}15` : 'transparent',
              color: activeCategory === i ? cat.color : 'var(--text-secondary)',
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Skills Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          className="skills-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {active.skills.map((skill, i) => (
            <SkillBar
              key={skill.name}
              skill={skill}
              color={active.color}
              delay={i * 0.07}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Overall proficiency radar summary */}
      <motion.div
        className="skills-summary"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        {skillCategories.map((cat) => (
          <div key={cat.name} className="skill-summary-item">
            <div
              className="skill-summary-circle"
              style={{ '--sc-color': cat.color }}
            >
              <span>{cat.icon}</span>
            </div>
            <span className="skill-summary-label">{cat.name}</span>
            <div
              className="skill-summary-bar"
              style={{
                background: `linear-gradient(90deg, ${cat.color}, ${cat.color}50)`,
                width: `${Math.round(cat.skills.reduce((a, b) => a + b.level, 0) / cat.skills.length)}%`,
              }}
            />
          </div>
        ))}
      </motion.div>
    </section>
  )
}
