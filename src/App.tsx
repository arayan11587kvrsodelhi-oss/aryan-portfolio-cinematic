import PortalLoader from "./components/PortalLoader";
import { useEffect, useState } from 'react'
import { useLenis } from './lib/useLenis'
import { SoundProvider } from './context/SoundContext'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Intro from './components/Intro'
import GitHubWorkbench from './components/GitHubWorkbench'
import Skills from './components/Skills'
import Achievements from './components/Achievements'
import Certifications from './components/Certifications'
import About from './components/About'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from '@/components/ui/animated-footer'
import ResumeModal from './components/ResumeModal'
import RecruiterView from './components/RecruiterView'

function PortfolioContent() {
  useLenis()
  const [progress, setProgress] = useState(0)
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(totalScrollable > 0 ? window.scrollY / totalScrollable : 0)
    }

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      {/* Entry Portal Loader — original canvas orb, self-unmounts (~1.2s) */}
      <PortalLoader />

      {/* Accessibility Skip Link */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {/* Top Scroll Progress Indicator */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      {/* Atmospheric Background Layers */}
      <div className="grain" aria-hidden="true" />
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />

      {/* Custom Desktop Trailing Cursor */}
      <Cursor />

      {/* Navigation Bar with SoundToggle & Recruiter Mode */}
      <Nav
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenRecruiterView={() => setIsRecruiterOpen(true)}
      />

      {/* Main Content Landmark */}
      <main id="main-content">
        {/* 01. Hero Landmark */}
        <Hero
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenRecruiterView={() => setIsRecruiterOpen(true)}
        />

        {/* 02. Manifesto / Creative Intro */}
        <Intro />

        {/* 03. The Workbench (Definitive Projects & 15-Repo GitHub Ecosystem) */}
        <GitHubWorkbench />

        {/* 04. Capabilities & Architecture (Connected to Projects & Certs) */}
        <Skills />

        {/* 07. Verified Merit Achievement Spotlight */}
        <Achievements />

        {/* 08. Verified Certifications & Recognition Archive */}
        <Certifications />

        {/* 09. Educational Background & Philosophy */}
        <About onOpenResume={() => setIsResumeOpen(true)} />

        {/* 10. Technical Milestones & Timeline */}
        <Experience />

        {/* 11. Direct Channels & GitHub CTA */}
        <Contact onOpenResume={() => setIsResumeOpen(true)} />
      </main>

      {/* 12. Cinematic Animated Wave Footer (site footer) */}
      <Footer leftLinks={[]} rightLinks={[]} barCount={23} />

      {/* Interactive In-Browser Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* 30-Second Recruiter View Executive Summary Modal */}
      <RecruiterView
        isOpen={isRecruiterOpen}
        onClose={() => setIsRecruiterOpen(false)}
        onOpenResume={() => {
          setIsRecruiterOpen(false)
          setIsResumeOpen(true)
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <SoundProvider>
      <PortfolioContent />
    </SoundProvider>
  )
}
