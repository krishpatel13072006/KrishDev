import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import GitHubPage from './pages/GitHubPage'
import ContactPage from './pages/ContactPage'
import LeetCodePage from './pages/LeetCodePage'
import DashboardPage from './pages/DashboardPage'
import GuestbookPage from './pages/GuestbookPage'
import ResumePage from './pages/ResumePage'
import Preloader from './components/Preloader'
import { useState } from 'react'

export default function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="app-container"
      >
        {/* Aurora background fixed behind everything */}
      <div className="aurora-bg">
        <div className="aurora-blob" />
        <div className="aurora-blob" />
        <div className="aurora-blob" />
      </div>

      <Navbar />

      <div className="page-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/github" element={<GitHubPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/leetcode" element={<LeetCodePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            <Route path="/resume" element={<ResumePage />} />
          </Routes>
        </AnimatePresence>
      </div>
      </motion.div>
    </ThemeProvider>
  )
}
