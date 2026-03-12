import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const timelineData = [
  {
    year: '2025 – Present',
    type: 'education',
    title: 'B.E. in Computer Engineering',
    org: 'Apollo Institute of Engineering and Technology',
    desc: 'Currently pursuing a Bachelor of Engineering in Computer Engineering at Apollo Institute, Ahmedabad. Specializing in Java technologies, modern web development, and creating impactful digital solutions.',
    skills: ['Java', 'Web Development', 'DSA', 'DBMS'],
    color: '#7c3aed',
    icon: '🎓',
  },
  {
    year: '2024',
    type: 'achievement',
    title: '10+ Production Projects',
    org: 'Self-Directed & Freelance',
    desc: 'Shipped 10+ production-grade projects including full-stack web apps, Java desktop apps, and UI/UX focused clones — deployed publicly on platforms like Netlify and GitHub.',
    skills: ['React', 'JavaScript', 'Java', 'REST APIs'],
    color: '#f59e0b',
    icon: '🚀',
  },
  {
    year: '2022 – 2025',
    type: 'education',
    title: 'Diploma in Computer Engineering',
    org: 'Apollo Institute of Engineering and Technology',
    desc: 'Completed a 3-year Diploma in Computer Engineering at Apollo Institute, Ahmedabad with an outstanding CGPA of 9.6. Built a strong foundation in programming, databases, and software engineering.',
    skills: ['C/C++', 'Python', 'MySQL', 'Networking'],
    color: '#06b6d4',
    icon: '🏫',
  },
  {
    year: '2023',
    type: 'work',
    title: 'Open Source Contributor & Builder',
    org: 'GitHub · krishpatel13072006',
    desc: 'Started actively building and shipping open source projects — from a secure Java CLI file encryption system to real-time LeetCode stat trackers and music streaming UI clones.',
    skills: ['Java', 'JDBC', 'JavaMail', 'HTML/CSS/JS'],
    color: '#ec4899',
    icon: '💻',
  },
  {
    year: '2022',
    type: 'achievement',
    title: 'Started Coding Journey',
    org: 'Self-Directed',
    desc: 'Began programming with C/C++ and Python. Solved algorithmic challenges and built first web projects — igniting a passion for creating interactive experiences that led to 3+ years of consistent learning.',
    skills: ['C/C++', 'Python', 'Problem Solving', 'HTML'],
    color: '#10b981',
    icon: '⚡',
  },
]

function TimelineCard({ item, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        position: 'relative',
        marginBottom: '3rem',
      }}
    >
      {/* Center dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '1.5rem',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: item.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          zIndex: 2,
          boxShadow: `0 0 24px ${item.color}50`,
          border: `3px solid hsl(240 5% 10%)`,
        }}
      >
        {item.icon}
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -60 : 60 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        className="timeline-card"
        style={{
          width: 'calc(50% - 3.5rem)',
          '--tl-color': item.color,
        }}
      >
        <div className="timeline-year">{item.year}</div>
        <h3 className="timeline-title">{item.title}</h3>
        <div className="timeline-org">{item.org}</div>
        <p className="timeline-desc">{item.desc}</p>
        <div className="timeline-skills">
          {item.skills.map((skill) => (
            <span key={skill} className="timeline-skill-badge" style={{ borderColor: `${item.color}40`, color: item.color }}>
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function Timeline() {
  return (
    <section className="timeline-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-header"
      >
        <div className="hero-eyebrow" style={{ display: 'inline-flex' }}>
          <span>📅</span>
          <span>My Journey</span>
        </div>
        <h2 className="section-title">Experience &amp; Education</h2>
        <p className="section-subtitle">A chronological look at my growth as a developer.</p>
      </motion.div>

      <div className="timeline-container">
        {/* Vertical line */}
        <div className="timeline-line" />
        {timelineData.map((item, i) => (
          <TimelineCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
