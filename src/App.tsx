import { Suspense, lazy, useEffect, useState } from 'react'
import PortalLoader from './components/PortalLoader'
import { useLenis } from './lib/useLenis'
import { SoundProvider } from './context/SoundContext'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'

/* ==========================================================================

   CODE SPLITTING
   Only the above-the-fold shell (PortalLoader, Cursor, Nav, Hero) stays in
   the entry chunk. Every section below the fold - plus the two click-to-open
   modals - becomes a separate chunk that streams in after the shell has painted.

   Why: the Hero is the LCP element, but it previously sat behind ~10 further
   components and their data tables (projects.ts, githubRepos.ts, certifications.ts,
   skills.ts) all parsing in the same critical chunk. The Hero intro no longer
   waits for any of that to execute.

   Each loader is a named factory so the idle prefetch effect below can warm these
   chunks without rendering them early.
   ========================================================================== */

const loadIntro = () => import('./components/Intro')
const loadProjectsSlider = () => import('./components/ProjectsSlider')
const loadPlayGame = () => import('./components/PlayGame')
const loadSkills = () => import('./components/Skills')
const loadAchievements = () => import('./components/Achievements')
const loadCertifications = () => import('./components/Certifications')
const loadAbout = () => import('./components/About')
const loadExperience = () => import('./components/Experience')
const loadContact = () => import('./components/Contact')
const loadFooter = () => import('@/components/ui/animated-footer')
const loadResumeModal = () => import('./components/ResumeModal')
const loadRecruiterView = () => import('./components/RecruiterView')

const Intro = lazy(loadIntro)
const ProjectsSlider = lazy(loadProjectsSlider)
const PlayGame = lazy(loadPlayGame)
const Skills = lazy(loadSkills)
const Achievements = lazy(loadAchievements)
const Certifications = lazy(loadCertifications)
const About = lazy(loadAbout)
const Experience = lazy(loadExperience)
const Contact = lazy(loadContact)
const Footer = lazy(loadFooter)
const ResumeModal = lazy(loadResumeModal)
const RecruiterView = lazy(loadRecruiterView)

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

  // Warm the lazy chunks once the browser is idle. Rendering them is already
  // triggered on first paint, but this guarantees the modals (which are only
  // ever reached via a user click, potentially much later) are resident by the
  // time they are opened, so opening one never shows a spinner or a stutter.
  useEffect(() => {
    const prefetchAll = () => {
      loadIntro()
      loadProjectsSlider()
      loadPlayGame()
      loadSkills()
      loadAchievements()
      loadCertifications()
      loadAbout()
      loadExperience()
      loadContact()
      loadFooter()
      loadResumeModal()
      loadRecruiterView()
    }

    const idleCallback = window.requestIdleCallback
      ? window.requestIdleCallback(prefetchAll, { timeout: 3000 })
      : window.setTimeout(prefetchAll, 1200)

    return () => {
      if (window.cancelIdleCallback && typeof idleCallback === 'number') {
        window.cancelIdleCallback(idleCallback)
      } else {
        window.clearTimeout(idleCallback as number)
      }
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

        {/* Everything below the Hero is code-split. The boundaries use
            fallback={null} because all of it sits below the fold: there is
            nothing meaningful to render while a chunk is in flight, and a
            placeholder box would only introduce layout shift. */}
        <Suspense fallback={null}>
          {/* 02. Manifesto / Creative Intro */}
          <Intro />

          {/* 03. Project slider - every public repository, one slide each.
              Keeps the #workbench anchor so existing navigation and the
              active-section logic in Nav keep working unchanged. */}
          <section id="workbench">
            <ProjectsSlider />
          </section>

          {/* 04. Play Game - the arcade. CyberTag Arena plus the Typing Car
              Racer, each opening its own real live deployment. The existing
              navigation PLAY GAME button keeps working and now also lands
              here, so both games are reachable from one place. */}
          <PlayGame />

          {/* 05. Capabilities & Architecture (Connected to Projects & Certs) */}
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
        </Suspense>
      </main>

      {/* 12. Cinematic Animated Wave Footer (site footer) */}
      <Suspense fallback={null}>
        <Footer leftLinks={[]} rightLinks={[]} barCount={23} />
      </Suspense>

      {/* Interactive In-Browser Resume Modal */}
      <Suspense fallback={null}>
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
        />
      </Suspense>

      {/* 30-Second Recruiter View Executive Summary Modal */}
      <Suspense fallback={null}>
        <RecruiterView
          isOpen={isRecruiterOpen}
          onClose={() => setIsRecruiterOpen(false)}
          onOpenResume={() => {
            setIsRecruiterOpen(false)
            setIsResumeOpen(true)
          }}
        />
      </Suspense>
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
