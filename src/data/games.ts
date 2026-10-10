/* ==========================================================================
   ARCADE — single source of truth for the Play Game action

   The typing car racer is the only game featured in the portfolio. CyberTag
   Arena has been removed from the portfolio's playable-game experience
   because it is incomplete; it is no longer listed anywhere on the site.

   The facts below were read from the real repository
   (`src/game/levels.ts`, `worlds.ts`, `components/CampaignMap.tsx`,
   `components/GameScreen.tsx`, `game/car3D.ts`, `package.json`):

   - 2D campaign map for world/stage selection
   - a planned 12-stage campaign across Neon City, Sunset Mesa, Alpine Dawn
   - Neon City is the first world and opens unlocked; stage 1 is built and
     tested, later stages are still in progress
   - 3D race scenes rendered with React Three Fiber + Three.js

   `status` stays "In Development": the live build is playable, but the
   campaign is not finished. It is never described as complete.
   ========================================================================== */

export interface Game {
  id: string
  /** Curated display title. */
  title: string
  category: string
  tagline: string
  description: string
  /** Honest development state. Never "Complete" while work is ongoing. */
  status: 'Playable' | 'In Development'
  /** Verified, real feature list. No invented modes or mechanics. */
  keyFeatures: string[]
  /** Real dependency list from the game's own package.json / source. */
  tech: string[]
  /** Always the real deployed game. Never a source-code URL. */
  playUrl: string
  /** Always the real GitHub repository. */
  sourceUrl: string
  accent: string
}

export const TYPING_RACER = {
  /** Opens the live game. This is the URL the navigation PLAY GAME targets. */
  playUrl: 'https://3d-typing-racer-game.vercel.app/',
  sourceUrl: 'https://github.com/arayan11587kvrsodelhi-oss/Typing-car-race',
} as const

/** The single game the portfolio now features. */
export const games: Game[] = [
  {
    id: 'typing-car-racer',
    title: '3D TYPING CAR RACER',
    category: 'INTERACTIVE GAME',
    tagline: 'TYPE TO ACCELERATE.',
    description:
      'A browser-based typing racing game. 3D race scenes are rendered with React Three Fiber and Three.js, and every correctly typed character feeds straight into the car — typing speed and accuracy become throttle, while a combo multiplier and nitro reward clean input.',
    status: 'In Development',
    keyFeatures: [
      '2D campaign map for world and stage selection, with per-level unlock rules covered by automated unit tests',
      'Planned 12-stage campaign across three worlds: Neon City (stages 1–4), Sunset Mesa (5–8) and Alpine Dawn (9–12)',
      'Neon City is the first world and opens unlocked — stage 1 "Neon Streets" is built, tested and playable; later stages are still in progress',
      'Live race HUD with position, speed, instant and average WPM, accuracy, score, combo multiplier and nitro',
      'Garage with 3D car previews for customising and upgrading the build',
      'Local high-score table and campaign progress persistence',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Three Fiber', 'Three.js'],
    playUrl: TYPING_RACER.playUrl,
    sourceUrl: TYPING_RACER.sourceUrl,
    accent: '#22d3ee',
  },
]

/** The featured game, for the navigation and the featured project card. */
export const typingRacer = games[0]
