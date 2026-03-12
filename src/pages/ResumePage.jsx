import { useState } from 'react'
import { motion } from 'framer-motion'
import MagneticText from '../components/MagneticText'
import useScrollReveal from '../hooks/useScrollReveal'

const resumeData = {
  name: 'Krish Patel',
  title: 'Full Stack Developer & Computer Engineer',
  location: 'Ahmedabad, India',
  github: 'krishpatel13072006',
  leetcode: 'krish_patel13072006',
  summary: 'Passionate Computer Engineering student and full-stack developer with a strong foundation in Java, modern web technologies, and algorithm design. Shipped 10+ production-grade projects including full-stack web apps, Java desktop apps, and UI/UX focused clones.',
  experience: [
    {
      role: 'Full Stack Developer',
      org: 'Self-Directed & Freelance',
      duration: '2024 – Present',
      points: [
        'Shipped 10+ production-grade projects including full-stack web apps, Java desktop apps, and UI/UX clones.',
        'Collaborated with clients to deliver custom digital solutions using React and Node.js.',
        'Optimized web performance and implemented responsive designs for diverse devices.',
        'Integrated multi-API fail-safe mechanisms for robust data syncing in dashboards.'
      ]
    },
    {
      role: 'Open Source Contributor & Builder',
      org: 'GitHub · krishpatel13072006',
      duration: '2023',
      points: [
        'Built a secure Java CLI file encryption system with advanced encryption standards.',
        'Developed real-time LeetCode stat trackers using multiple API proxies.',
        'Created high-fidelity music streaming UI clones with complex animations.',
        'Actively contributed to open-source projects, improving documentation and code quality.'
      ]
    }
  ],
  education: [
    {
      degree: 'B.E. in Computer Engineering',
      org: 'Apollo Institute of Engineering and Technology',
      duration: '2025 – Present',
      gpa: 'Pursuing'
    },
    {
      degree: 'Diploma in Computer Engineering',
      org: 'Apollo Institute of Engineering and Technology',
      duration: '2022 – 2025',
      gpa: '9.6 / 10'
    }
  ],
  skills: {
    Frontend: ['HTML / CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'Responsive Design'],
    Backend: ['Java', 'JDBC', 'JSP & Servlets', 'RESTful APIs', 'JavaMail API'],
    Database: ['MySQL', 'SQL', 'Git & GitHub', 'VS Code'],
    'Core Programming': ['C / C++', 'Python', 'DSA', 'Problem Solving']
  },
  achievements: [
    'Shipped 10+ Production-Grade Projects',
    'Outstanding CGPA of 9.6 in Diploma Engineering',
    'Active Open Source Contributor on GitHub',
    'Built Secure Java CLI Encryption Tools'
  ]
}

export default function ResumePage() {
  const [activeSection, setActiveSection] = useState('full')
  useScrollReveal()


  return (
    <motion.div
      className="resume-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: 'clamp(40px, 8vw, 80px) 2rem', maxWidth: 1000, margin: '0 auto' }}
    >
      <section className="dashboard-hero reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: '1.5rem', background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', padding: '6px 16px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600 }}>
            <span>📄</span>
            <span style={{ marginLeft: 8 }}>Resume</span>
          </div>
          <h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            <MagneticText text="My Resume" className="mag-gradient" />
          </h1>
          <p className="section-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            An interactive view of my technical experience, education, and proficiency.
          </p>
        </motion.div>
      </section>

      {/* Resume Card */}
      <motion.div
        className="resume-card reveal"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: 'clamp(24px, 5vw, 48px)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--shadow)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div className="resume-header" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem' }}>
          <div className="resume-avatar" style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, color: '#fff', boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)' }}>
            KP
          </div>
          <div className="resume-header-info" style={{ flex: 1 }}>
            <h2 className="resume-name" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '0.25rem', letterSpacing: '-0.04em' }}>
              {resumeData.name}
            </h2>
            <p className="resume-title" style={{ fontSize: '1.2rem', color: '#7c3aed', fontWeight: 700, marginBottom: '1rem' }}>{resumeData.title}</p>
            <div className="resume-contact" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>📍 {resumeData.location}</span>
              <a href={`https://github.com/${resumeData.github}`} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>🐙 @{resumeData.github}</a>
              <a href={`https://leetcode.com/${resumeData.leetcode}`} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>🧩 {resumeData.leetcode}</a>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="resume-section reveal" style={{ marginBottom: '2.5rem' }}>
          <h3 className="resume-section-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#7c3aed' }}>//</span> About
          </h3>
          <p className="resume-summary" style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>{resumeData.summary}</p>
        </div>

        {/* Experience */}
        <div className="resume-section reveal" style={{ marginBottom: '2.5rem' }}>
          <h3 className="resume-section-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#7c3aed' }}>//</span> Experience
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="resume-entry">
                <div className="resume-entry-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div className="resume-entry-role" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{exp.role}</div>
                    <div className="resume-entry-org" style={{ fontSize: '1rem', color: '#7c3aed', fontWeight: 600 }}>{exp.org}</div>
                  </div>
                  <span className="resume-entry-duration" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: 999, border: '1px solid var(--border)', height: 'fit-content' }}>{exp.duration}</span>
                </div>
                <ul className="resume-entry-points" style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {exp.points.map((point, j) => (
                    <li key={j} style={{ marginBottom: '0.4rem' }}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="resume-section reveal" style={{ marginBottom: '2.5rem' }}>
          <h3 className="resume-section-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#7c3aed' }}>//</span> Technical Skills
          </h3>
          <div className="resume-skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {Object.entries(resumeData.skills).map(([category, skills]) => (
              <div key={category} className="resume-skill-group">
                <div className="resume-skill-category" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{category}</div>
                <div className="resume-skill-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skills.map((skill) => (
                    <span key={skill} className="tech-badge" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="resume-section reveal" style={{ marginBottom: '2.5rem' }}>
          <h3 className="resume-section-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#7c3aed' }}>//</span> Education
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {resumeData.education.map((edu, i) => (
              <div key={i} className="resume-entry">
                <div className="resume-entry-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div className="resume-entry-role" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{edu.degree}</div>
                    <div className="resume-entry-org" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{edu.org}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="resume-entry-duration" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{edu.duration}</span>
                    <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700, marginTop: '0.25rem' }}>GPA: {edu.gpa}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="resume-section reveal">
          <h3 className="resume-section-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#7c3aed' }}>//</span> Achievements
          </h3>
          <div className="resume-achievements" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {resumeData.achievements.map((ach, i) => (
              <div key={i} className="resume-achievement" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: '#7c3aed', fontSize: '1.2rem' }}>★</span>
                {ach}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

