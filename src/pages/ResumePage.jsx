import { useState } from 'react'
import { motion } from 'framer-motion'

const resumeData = {
  name: 'Krish Patel',
  title: 'Passionate Web Developer | Java & Web Technologies Enthusiast',
  email: 'krishpatelhacker.13579@gmail.com',
  github: 'github.com/krishpatel13072006',
  leetcode: 'leetcode.com/krishpatel13072006',
  portfolio: 'krishpatel-portfolio1307.netlify.app',
  location: 'Ahmedabad, Gujarat, India',
  summary:
    'Passionate web developer with a deep love for creating interactive and user-friendly digital experiences. Currently pursuing B.E. in Computer Engineering at Apollo Institute, Ahmedabad. Specializing in Java technologies and modern web development. Driven by curiosity, clean code principles, and building impactful digital solutions.',
  experience: [
    {
      role: 'Web Developer & Open Source Builder',
      org: 'Self-Directed / Freelance · GitHub',
      duration: '2023 – Present',
      points: [
        'Shipped 10+ production-grade projects across web and desktop application domains.',
        'Built a secure Java CLI file encryption system with OTP-based authentication via JavaMail.',
        'Developed a real-time LeetCode stats tracker with animated progress UI and API integration.',
        'Created a full Spotify clone with music player, playlist management, and Web Audio API.',
      ],
    },
    {
      role: 'Open Source Contributor',
      org: 'GitHub · krishpatel13072006',
      duration: '2022 – Present',
      points: [
        'Maintained public repos with clean code, README documentation, and live demos.',
        'Contributed to HTML/CSS/JS projects focused on responsive design and performance.',
        'Built RESTful APIs and integrated third-party APIs (LeetCode API, Exchange Rate API).',
      ],
    },
  ],
  education: [
    {
      degree: 'B.E. in Computer Engineering',
      org: 'Apollo Institute of Engineering and Technology',
      duration: '2025 – Present',
      gpa: 'In Progress',
      location: 'Ahmedabad',
    },
    {
      degree: 'Diploma in Computer Engineering',
      org: 'Apollo Institute of Engineering and Technology',
      duration: '2022 – 2025',
      gpa: '9.6 / 10',
      location: 'Ahmedabad',
    },
  ],
  skills: {
    Frontend: ['HTML / CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'Responsive Design'],
    Backend: ['Java', 'JDBC', 'JSP & Servlets', 'RESTful APIs', 'JavaMail API'],
    Database: ['MySQL', 'SQL', 'Git & GitHub', 'VS Code'],
    'Core Prog.': ['C / C++', 'Python', 'DSA', 'Problem Solving'],
  },
  achievements: [
    '⭐ CGPA 9.6 in Diploma in Computer Engineering',
    '🚀 10+ Production Projects Deployed',
    '💻 3+ Years of Consistent Coding',
    '♾️ Curiosity-Driven Self-Learner',
  ],
}

export default function ResumePage() {
  const [activeSection, setActiveSection] = useState('full')

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  const handleDownload = () => {
    // In production, link to actual PDF
    alert('📄 Resume PDF download will be available soon!')
  }

  return (
    <motion.div
      className="resume-page"
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <section className="dashboard-hero">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <span>📄</span>
            <span>Resume</span>
          </div>
          <h1 className="section-title" style={{ marginBottom: '0.75rem' }}>
            My <span className="gradient-text">Resume</span>
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            An interactive view of my experience, skills, and achievements.
          </p>
          <motion.button
            className="action-btn action-btn-primary"
            style={{ width: 'auto', margin: '0 auto', padding: '0.75rem 2rem' }}
            onClick={handleDownload}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            ⬇️ Download PDF
          </motion.button>
        </motion.div>
      </section>

      {/* Resume Card */}
      <motion.div
        className="resume-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* Header */}
        <div className="resume-header">
          <div className="resume-avatar">KP</div>
          <div className="resume-header-info">
            <h2 className="resume-name">{resumeData.name}</h2>
            <p className="resume-title">{resumeData.title}</p>
            <div className="resume-contact">
              <span>📍 {resumeData.location}</span>
              <span>🐙 {resumeData.github}</span>
              <span>🧩 {resumeData.leetcode}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="resume-section">
          <h3 className="resume-section-title">About</h3>
          <p className="resume-summary">{resumeData.summary}</p>
        </div>

        {/* Experience */}
        <div className="resume-section">
          <h3 className="resume-section-title">Experience</h3>
          {resumeData.experience.map((exp, i) => (
            <motion.div
              key={i}
              className="resume-entry"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="resume-entry-header">
                <div>
                  <div className="resume-entry-role">{exp.role}</div>
                  <div className="resume-entry-org">{exp.org}</div>
                </div>
                <span className="resume-entry-duration">{exp.duration}</span>
              </div>
              <ul className="resume-entry-points">
                {exp.points.map((point, j) => (
                  <li key={j}>{point}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Education */}
        <div className="resume-section">
          <h3 className="resume-section-title">Education</h3>
          {resumeData.education.map((edu, i) => (
            <div key={i} className="resume-entry">
              <div className="resume-entry-header">
                <div>
                  <div className="resume-entry-role">{edu.degree}</div>
                  <div className="resume-entry-org">{edu.org}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="resume-entry-duration">{edu.duration}</span>
                  <div style={{ fontSize: '0.8rem', color: '#7c3aed', marginTop: '0.25rem' }}>GPA: {edu.gpa}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="resume-section">
          <h3 className="resume-section-title">Technical Skills</h3>
          <div className="resume-skills-grid">
            {Object.entries(resumeData.skills).map(([category, skills]) => (
              <div key={category} className="resume-skill-group">
                <div className="resume-skill-category">{category}</div>
                <div className="resume-skill-list">
                  {skills.map((skill) => (
                    <span key={skill} className="tech-badge">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="resume-section">
          <h3 className="resume-section-title">Achievements</h3>
          <div className="resume-achievements">
            {resumeData.achievements.map((ach, i) => (
              <motion.div
                key={i}
                className="resume-achievement"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                {ach}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
