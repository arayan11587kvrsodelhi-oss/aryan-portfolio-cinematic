import { useEffect, useRef, useState } from 'react'
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
import TechText from './TechText'

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
  const wordmarkRef = useRef<HTMLDivElement>(null)

  /* ==========================================================================
     WORDMARK SIZE BRIDGE

     The wordmark's size ladder lives in CSS (one `--hero-name-size` clamp
     ladder, so the responsive rules stay with the rest of the stylesheet), but
     TechText takes its size as a JS prop. This reads the computed value back
     and hands it to both TechText instances.

     Why both lines share one number: TechText scales its glyphs to fit
     `min(width * 0.9, height * 0.66)`. "ARYAN" and "SHARMA" are both
     all-caps, so their ink HEIGHT is identical and only their ink WIDTH
     differs. Sizing off a single shared value (with enough container width and
     height that `fit` stays 1) means both lines render at exactly the same
     pixel size instead of the longer word being silently shrunk to match.

     The listener only commits when the computed value actually changes, so
     dragging a window edge coalesces to at most one render per frame.
     ========================================================================== */
  const [wordmarkSize, setWordmarkSize] = useState(84)

  /* ==========================================================================
     WORDMARK COLOUR BRIDGE

     TechText draws with `parseInt(hex, 16)`, so it cannot take a CSS `var()`.
     Reading the two tokens off `:root` at mount keeps the canvas in lockstep
     with `src/index.css`: if `--foreground` or `--accent` is retuned, the
     wordmark follows automatically instead of drifting on a stale literal.

     The literals below are only ever a same-tick fallback for the window
     between first paint and this effect; the token wins immediately after.
     ========================================================================== */
  const [wordmarkColors, setWordmarkColors] = useState({
    base: '#f2f2ed',
    accent: '#19b89a',
  })

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement)
    const read = (token: string, fallback: string) => {
      const value = styles.getPropertyValue(token).trim()
      return value || fallback
    }
    setWordmarkColors({
      base: read('--foreground', '#f2f2ed'),
      accent: read('--accent', '#19b89a'),
    })
  }, [])

  useEffect(() => {
    const el = wordmarkRef.current
    if (!el) return

    let frame = 0
    const sync = () => {
      frame = 0
      const raw = parseFloat(getComputedStyle(el).getPropertyValue('--hero-name-size'))
      if (Number.isNaN(raw)) return
      setWordmarkSize((prev) => (Math.abs(prev - raw) > 0.5 ? raw : prev))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync)
    }

    sync()
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        /* ================================================================
           HERO NAME REVEAL

           The wordmark is a single <canvas>, so the old per-character
           stagger no longer has elements to target. The entrance is
           preserved as a single soft rise + fade on the wrapper: the
           same moment in the hero choreography, the same delay, and
           animating only opacity/transform means no layout shift.
           ================================================================= */
        gsap.fromTo(
          '.hero-wordmark',
          {
            yPercent: 18,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
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
              HERO NAME - TechText wordmark, two lines

              The name reads ARYAN / SHARMA on two stacked lines. It is TWO
              official React Bits <TechText> instances rather than a newline
              inside one canvas: TechText measures a single line of text, so an
              embedded newline would measure as a zero-width glyph and break the
              layout. Two instances each get a correctly measured box.

              COLOUR: both lines are the portfolio's own tokens, read from
              `src/index.css` rather than hardcoded:

                color        var(--foreground) = #f2f2ed
                accentColor  var(--accent)     = #19b89a

              The intro/section-opening already speaks exactly this language —
              `.text-statement` renders in `text-foreground` and every
              `text-eyebrow` on it is `text-accent` — so the wordmark now uses
              the same light-cream base with the teal accent reserved for the
              interaction. That also retires the old #F2EDE2 / #35E0E0 pair,
              which were left over from the projects-slider palette: #35E0E0
              never became a token and is not part of the design system (the
              `:root` block documents "Deep Green / Blue / Black"), so keeping
              it would have made the Hero the only cyan element on the page.
              Cyan survives in the slider as the slide-tone accent, untouched.

              The accent is NEVER a permanent fill. Idle is plain cream; only
              the lens/specks/selection frame pick up teal as the pointer moves,
              so the name stays bright and readable at all times.

              HOVER is driven by the engine itself, not by CSS. With
              reveal="letter" the glyph under the lens cross-fades from a solid
              fill to a DASHED STROKE (the official outlined state), so the letter
              becomes hollow and the hero background genuinely shows through it,
              while the cyan selection frame, specks and measurement label appear
              around it. A spring-damped lens follows the pointer, so it lags and
              settles like a physical overlay instead of snapping like an opacity
              transition.

              Both instances receive an IDENTICAL configuration so the two lines
              always match; only the text differs.
              ============================================================ */}
          <h1 className="hero-name my-3 select-none">
            {/* The wordmark is decorative pixels of the name below, so it is
                exposed once as real text: the name is announced exactly once and
                this <h1> still owns the heading outline. */}
            <span className="sr-only">Aryan Sharma</span>

            <div className="hero-wordmark" ref={wordmarkRef} aria-hidden="true">
              <TechText
                className="hero-wordmark__line--aryan"
                text="ARYAN"
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight={700}
                fontSize={wordmarkSize}
                letterSpacing={-0.04}
                color={wordmarkColors.base}
                accentColor={wordmarkColors.accent}
                reveal="letter"
                reach={190}
                softness={0.72}
                dashLength={4}
                dashGap={2}
                strokeWidth={1.5}
                specks={12}
                selection={true}
                labels={true}
                draggable={true}
                sweep={true}
                speed={0.8}
              />
              <TechText
                className="hero-wordmark__line--sharma"
                text="SHARMA"
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight={700}
                fontSize={wordmarkSize}
                letterSpacing={-0.04}
                color={wordmarkColors.base}
                accentColor={wordmarkColors.accent}
                reveal="letter"
                reach={190}
                softness={0.72}
                dashLength={4}
                dashGap={2}
                strokeWidth={1.5}
                specks={12}
                selection={true}
                labels={true}
                draggable={true}
                sweep={true}
                speed={0.8}
              />
            </div>
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
