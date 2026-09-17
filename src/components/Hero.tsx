import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
  Code2,
  ShieldCheck,
  Terminal,
  FileText,
  Zap,
} from 'lucide-react'
import { useSFX } from '../hooks/useSFX'
import portrait from '../assets/photos/portrait.jpg'
import EvilEye from './ui/EvilEye'

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
  onOpenResume?: () => void
  onOpenRecruiterView?: () => void
}

export default function Hero({
  onOpenResume,
  onOpenRecruiterView,
}: HeroProps) {
  const { playSFX } = useSFX()

  const rootRef = useRef<HTMLElement>(null)
  const portraitCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        /* ================================================================
           HERO TITLE REVEAL
           ================================================================= */
        gsap.fromTo(
          '.hero-char',
          {
            yPercent: 110,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.025,
            ease: 'power4.out',
            delay: 0.15,
          }
        )

        /* ================================================================
           HERO SECONDARY CONTENT
           ================================================================= */
        gsap.fromTo(
          '.hero-fade',
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.55,
            stagger: 0.08,
            ease: 'power3.out',
          }
        )

        /* ================================================================
           GRID PARALLAX
           ================================================================= */
        gsap.to('.hero-grid', {
          yPercent: 16,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        /* ================================================================
           CONTENT PARALLAX
           ================================================================= */
        gsap.to('.hero-content-wrap', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      /* ================================================================
         PORTRAIT 3D DEPTH PARALLAX
         Desktop / mouse devices only
         ================================================================= */
      const card = portraitCardRef.current

      const onMouseMove = (e: MouseEvent) => {
        if (
          !card ||
          prefersReducedMotion ||
          window.matchMedia('(pointer: coarse)').matches
        ) {
          return
        }

        const x =
          (e.clientX / window.innerWidth - 0.5) * 18

        const y =
          (e.clientY / window.innerHeight - 0.5) * 18

        gsap.to(card, {
          x,
          y,
          rotateY: x * 0.4,
          rotateX: -y * 0.4,
          duration: 0.65,
          ease: 'power2.out',
          transformPerspective: 1000,
          overwrite: 'auto',
        })
      }

      window.addEventListener('mousemove', onMouseMove)

      return () => {
        window.removeEventListener('mousemove', onMouseMove)
      }
    }, rootRef)

    return () => {
      ctx.revert()
    }
  }, [])

  /* ================================================================
     LETTER-BY-LETTER HERO TITLE
     ================================================================= */
  const renderChars = (text: string) =>
    text.split('').map((char, i) => (
      <span
        key={`${text}-${i}`}
        className="hero-char inline-block will-change-transform"
      >
        {char}
      </span>
    ))

  return (
    <section
      id="top"
      ref={rootRef}
      className="
        hero
        hero-animated-surface
        relative
        min-h-[100svh]
        flex
        flex-col
        justify-between
        px-4
        sm:px-6
        md:px-10
        pt-24
        sm:pt-28
        pb-8
        sm:pb-10
        max-md:pt-20
        max-md:pb-5
        overflow-hidden
      "
    >
      {/* ================================================================
          HERO EVIL EYE ANIMATED BACKGROUND
          Full-bleed, premium dark green/cyan/black treatment.
          Sits behind all content, pauses when Hero leaves viewport.
          ================================================================= */}
      <div
        className="
          hero-evileye-layer
          absolute
          inset-0
          z-0
          overflow-hidden
          pointer-events-none
        "
        aria-hidden="true"
      >
        <EvilEye
          eyeColor="#19b89a"
          backgroundColor="#030706"
          intensity={1.2}
          pupilSize={0.58}
          irisWidth={0.24}
          glowIntensity={0.26}
          scale={0.88}
          noiseScale={0.95}
          pupilFollow={0.75}
          flameSpeed={0.75}
          className="opacity-75"
        />
        {/* Subtle radial vignette to guarantee crisp legibility for typography (desktop base) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_50%_45%,transparent_20%,rgba(3,7,6,0.55)_85%,rgba(3,7,6,0.92)_100%)]" />
      </div>

      {/* ================================================================
          SUBTLE ENGINEERING GRID
          Kept intentionally faint behind text.
          ================================================================= */}
      <div
        className="
          hero-grid
          absolute
          inset-0
          opacity-20
          pointer-events-none
          z-[1]
        "
        aria-hidden="true"
      />

      {/* ================================================================
          MOBILE-ONLY CONTRAST / VIGNETTE LAYER (widths < 768px)
          Sits ABOVE Evil Eye background & grid, and BELOW Hero content.
          Layer hierarchy:
          Hero
           ├── existing grid/background (z-[1])
           ├── Evil Eye WebGL (z-0)
           ├── mobile-only contrast/vignette layer (z-[2])
           └── Hero content (z-10)
          Darkens the center directly behind "ARYAN SHARMA" typography with
          near-black / deep-green radial gradient (center ~0.65, edges ~0.35)
          avoiding a flat rectangle while ensuring high contrast.
          Hidden completely on desktop (md:hidden).
          ================================================================= */}
      <div
        className="
          hero-mobile-vignette
          md:hidden
          absolute
          inset-0
          z-[2]
          pointer-events-none
          bg-[radial-gradient(circle_at_50%_44%,rgba(3,7,6,0.74)_0%,rgba(3,7,6,0.62)_32%,rgba(3,7,6,0.40)_62%,rgba(3,7,6,0.26)_82%,rgba(3,7,6,0.62)_100%)]
        "
        aria-hidden="true"
      />

      {/* ================================================================
          TOP STATUS BAR
          ================================================================= */}
      <div
        className="
          hero-fade
          flex
          flex-wrap
          items-center
          justify-between
          text-eyebrow
          relative
          z-10
          gap-3
        "
      >
        {/* Location */}
        <div className="flex items-center gap-2.5">
          <span
            className="
              w-2
              h-2
              rounded-full
              bg-accent
              animate-pulse
              shadow-[0_0_10px_var(--accent)]
            "
            aria-hidden="true"
          />

          <span className="text-foreground/90 tracking-widest text-xs">
            NEW DELHI, INDIA
          </span>
        </div>

        {/* Availability / Education */}
        <div className="flex items-center gap-4">
          <span
            className="
              hidden
              sm:inline-flex
              items-center
              gap-1.5
              border
              border-accent/40
              text-accent
              bg-accent/5
              px-3
              py-1
              text-[0.65rem]
              tracking-widest
              rounded-full
            "
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />

            <span>AVAILABLE FOR OPPORTUNITIES</span>
          </span>

          <span
            className="
              text-muted
              text-xs
              hidden
              md:inline
              font-mono
            "
          >
            BCA · TIPS (GGSIPU)
          </span>
        </div>
      </div>

      {/* ================================================================
          MAIN HERO STAGING
          ================================================================= */}
      <div
        className="
          hero-content-wrap
          relative
          flex-1
          flex
          flex-col
          justify-center
          my-6
          max-md:my-3
          z-10
        "
      >
        <div className="w-full max-w-5xl">
          {/* ============================================================
              EYEBROW
              ============================================================ */}
          <div
            className="
              hero-fade
              inline-flex
              items-center
              gap-2
              mb-4
              text-eyebrow
              text-accent
              border
              border-accent/30
              bg-accent/5
              px-3.5
              py-1.5
              rounded-full
              backdrop-blur-sm
            "
          >
            <Sparkles
              size={13}
              className="text-accent"
              aria-hidden="true"
            />

            <span>CREATIVE FRONTEND DEVELOPER</span>
          </div>

          {/* ============================================================
              HERO NAME
              ============================================================ */}
          <h1
            className="
              font-display
              font-medium
              text-hero
              leading-[0.84]
              -ml-1
              tracking-[-0.055em]
              my-3
              select-none
            "
          >
            <span
              className="
                block
                overflow-hidden
                text-white
                [text-shadow:0_3px_20px_rgba(0,0,0,0.52),0_1px_6px_rgba(0,0,0,0.36)]
                md:[text-shadow:0_3px_18px_rgba(0,0,0,0.45),0_1px_5px_rgba(0,0,0,0.30)]
              "
            >
              {renderChars('ARYAN')}
            </span>

            <span
              className="
                block
                overflow-hidden
                text-[#030706]
                md:text-accent
                [text-shadow:0_4px_24px_rgba(0,0,0,0.78),0_2px_8px_rgba(0,0,0,0.52)]
                md:[text-shadow:0_4px_22px_rgba(0,0,0,0.70),0_2px_7px_rgba(0,0,0,0.45)]
              "
            >
              {renderChars('SHARMA')}
            </span>
          </h1>

          {/* ============================================================
              VALUE PROPOSITION
              ============================================================ */}
          <div className="hero-fade max-w-2xl mt-5">
            <p
              className="
                text-muted
                text-base
                md:text-xl
                font-normal
                leading-relaxed
              "
            >
              BCA student building React applications, TypeScript
              interfaces, interactive web experiences, and
              security-focused applications.
            </p>
          </div>

          {/* ============================================================
              CTA GROUP
              ============================================================ */}
          <div
            className="
              hero-fade
              flex
              flex-wrap
              items-center
              gap-4
              mt-8
            "
          >
            {/* ==========================================================
                EXPLORE WORKBENCH / PROJECTS
                ========================================================== */}
            <a
              href="#workbench"
              onClick={() => playSFX('click')}
              onMouseEnter={() => playSFX('hover')}
              data-magnetic
              data-cursor="open"
              data-cursor-text="EXPLORE"
              className="
                inline-flex
                items-center
                gap-3
                px-8
                py-4
                bg-accent
                text-background
                font-display
                font-semibold
                text-sm
                md:text-base
                rounded-full
                hover:bg-white
                transition-all
                shadow-[0_0_35px_rgba(25,184,154,0.28)]
                hover:shadow-[0_0_45px_rgba(255,255,255,0.35)]
                min-h-[48px]
              "
            >
              <span>Explore Projects</span>

              <ArrowDown
                size={16}
                aria-hidden="true"
              />
            </a>

            {/* ==========================================================
                RECRUITER VIEW
                ========================================================== */}
            {onOpenRecruiterView && (
              <button
                type="button"
                onClick={() => {
                  playSFX('modalOpen')
                  onOpenRecruiterView()
                }}
                onMouseEnter={() => playSFX('hover')}
                data-magnetic
                data-cursor="open"
                data-cursor-text="RECRUITER"
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-6
                  py-4
                  border
                  border-emerald-500/40
                  bg-emerald-500/10
                  text-emerald-400
                  font-display
                  text-sm
                  md:text-base
                  rounded-full
                  hover:bg-emerald-500/20
                  transition-all
                  backdrop-blur-md
                  min-h-[48px]
                  shadow-[0_0_20px_rgba(16,185,129,0.15)]
                "
              >
                <Zap
                  size={16}
                  className="text-emerald-400 animate-pulse"
                  aria-hidden="true"
                />

                <span>Recruiter View</span>
              </button>
            )}

            {/* ==========================================================
                RESUME
                ========================================================== */}
            {onOpenResume ? (
              <button
                type="button"
                onClick={() => {
                  playSFX('modalOpen')
                  onOpenResume()
                }}
                onMouseEnter={() => playSFX('hover')}
                data-magnetic
                data-cursor="open"
                data-cursor-text="RESUME"
                className="
                  inline-flex
                  items-center
                  gap-2.5
                  px-7
                  py-4
                  border
                  border-border
                  bg-surface/70
                  text-foreground
                  font-display
                  text-sm
                  md:text-base
                  rounded-full
                  hover:border-accent
                  hover:text-accent
                  transition-all
                  backdrop-blur-md
                  min-h-[48px]
                "
              >
                <FileText
                  size={16}
                  className="text-accent"
                  aria-hidden="true"
                />

                <span>View Resume</span>

                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                />
              </button>
            ) : (
              <a
                href="mailto:arayan11587kvrsodelhi@gmail.com?subject=Resume%20Request%20-%20Aryan%20Sharma"
                onClick={() => playSFX('click')}
                onMouseEnter={() => playSFX('hover')}
                data-magnetic
                data-cursor="open"
                data-cursor-text="RESUME"
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-7
                  py-4
                  border
                  border-border
                  bg-surface/70
                  text-foreground
                  font-display
                  text-sm
                  md:text-base
                  rounded-full
                  hover:border-accent
                  hover:text-accent
                  transition-all
                  backdrop-blur-md
                  min-h-[48px]
                "
              >
                <span>View Resume</span>

                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                />
              </a>
            )}
          </div>
        </div>

        {/* ================================================================
            PORTRAIT SPECIMEN CARD
            Desktop only
            ================================================================= */}
        <div
          ref={portraitCardRef}
          id="hero-portrait"
          onMouseEnter={() => playSFX('projectHover')}
          className="
            hidden
            lg:block
            absolute
            right-[2%]
            top-1/2
            -translate-y-1/2
            w-[250px]
            h-[330px]
            xl:w-[290px]
            xl:h-[380px]
            rounded-md
            overflow-hidden
            border
            border-border
            bg-surface
            shadow-2xl
            shadow-emerald-950/25
            group
            transition-shadow
            duration-500
            hover:border-accent/40
          "
          data-cursor="view"
        >
          <img
            src={portrait}
            alt="Aryan Sharma portrait"
            width={290}
            height={380}
            decoding="async"
            className="
              w-full
              h-full
              object-cover
              grayscale
              contrast-105
              group-hover:grayscale-0
              group-hover:scale-105
              transition-all
              duration-700
              ease-out
            "
          />

          {/* Portrait gradient */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-background/95
              via-background/20
              to-transparent
            "
            aria-hidden="true"
          />

          {/* Portrait metadata */}
          <div
            className="
              absolute
              left-3
              bottom-3
              right-3
              flex
              items-center
              justify-between
              text-eyebrow
              text-accent
              bg-background/85
              backdrop-blur-md
              px-3
              py-2
              border
              border-accent/30
              rounded
            "
          >
            <div className="flex items-center gap-1.5">
              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-accent
                "
                aria-hidden="true"
              />

              <span className="text-white font-medium">
                ARYAN SHARMA
              </span>
            </div>

            <span className="text-[0.62rem] text-muted font-mono">
              DEV / 01
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================
          BOTTOM ROLE STRIP
          ================================================================= */}
      <div
        className="
          hero-fade
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
          text-eyebrow
          relative
          z-10
          pt-4
          border-t
          border-border/40
        "
      >
        {/* Roles */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-6
            gap-y-2
            text-muted
            text-xs
          "
        >
          <span
            className="
              flex
              items-center
              gap-1.5
              text-foreground/80
            "
          >
            <Code2
              size={14}
              className="text-accent"
              aria-hidden="true"
            />

            FRONTEND &amp; UI
          </span>

          <span
            className="
              flex
              items-center
              gap-1.5
              text-foreground/80
            "
          >
            <Terminal
              size={14}
              className="text-accent"
              aria-hidden="true"
            />

            REACT &amp; TS
          </span>

          <span
            className="
              flex
              items-center
              gap-1.5
              text-foreground/80
            "
          >
            <ShieldCheck
              size={14}
              className="text-accent"
              aria-hidden="true"
            />

            WEB SECURITY
          </span>
        </div>

        {/* Scroll directive */}
        <a
          href="#workbench"
          onClick={() => playSFX('click')}
          onMouseEnter={() => playSFX('hover')}
          className="
            flex
            items-center
            gap-3
            text-muted
            hover:text-accent
            transition-colors
            py-2
            min-h-[44px]
          "
          data-magnetic
          data-cursor="open"
          data-cursor-text="SCROLL"
        >
          <span className="tracking-widest text-xs">
            SCROLL TO EXPLORE
          </span>

          <span
            className="scroll-line"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  )
}