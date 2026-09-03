import { useEffect, useState } from 'react'
import { useLenis } from './lib/useLenis'
import { SoundProvider } from './context/SoundContext'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Work from './components/Work'
import Achievements from './components/Achievements'
import Certifications from './components/Certifications'
import About from './components/About'
import Skills from './components/Skills'
import Services from './components/Services'
import Experience from './components/Experience'
import Contact from './components/Contact'
import ResumeModal from './components/ResumeModal'

function PortfolioContent() {
  useLenis()
  const [progress, setProgress] = useState(0)
  const [isResumeOpen, setIsResumeOpen] = useState(false)

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

      {/* Navigation Bar with SoundToggle */}
      <Nav onOpenResume={() => setIsResumeOpen(true)} />

      {/* Main Content Landmark */}
      <main id="main-content">
        <Hero onOpenResume={() => setIsResumeOpen(true)} />
        <Intro />
        <Work />
        <Achievements />
        <Certifications />
        <About onOpenResume={() => setIsResumeOpen(true)} />
        <Skills />
        <Services />
        <Experience />
        <Contact onOpenResume={() => setIsResumeOpen(true)} />
      </main>

      {/* Interactive In-Browser Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
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
