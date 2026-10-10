/* ==========================================================================
   ARCADE / PLAY GAME — single source of truth

   Every field below is taken from the real projects:
   - CyberTag Arena  -> existing portfolio entry (unchanged, live link kept).
   - Typing Car Racer-> the `Typing-car-race` repository and its deployed build
     at 3d-typing-racer-game.vercel.app.

   NOTHING IS INVENTED. The racer's facts were read from the repository source:
   `src/game/levels.ts` (campaign worlds + 12 level definitions),
   `src/game/worlds.ts` (environments), `src/components/CampaignMap.tsx`
   (2D world-selection map), `src/components/GameScreen.tsx` /
   `src/game/car3D.ts` (React Three Fiber race scenes) and `package.json`
   (the actual dependency list).

   `status` is deliberately "In Development": the live build is playable, but
   only the first campaign world is finished. It is NOT described as complete.
   ========================================================================== */

export interface Game {
  id: string
  /** Curated display title. */
  title: string
  /** Exact GitHub repository name (used to resolve the real screenshot). */
  repoName: string
  category: string
  tagline: string
  description: string
  /** Honest development state. Never "Complete" while work is ongoing. */
  status: 'Playable' | 'In Development'
  /** Verified, real feature list. No invented modes or mechanics. */
  keyFeatures: string[]
  /** Real dependency list from the game's own package.json / source. */
  tech: string[]
  /** Authentic screenshot from the game repository. */
  image: string
  /** Always the real deployed game. Never a source-code URL. */
  playUrl: string
  /** Always the real GitHub repository. */
  sourceUrl: string
  accent: string
}

export const GAME_LINKS = {
  typingRacerPlay: 'https://3d-typing-racer-game.vercel.app/',
  typingRacerSource: 'https://github.com/arayan11587kvrsodelhi-oss/Typing-car-race',
  cybertagPlay: 'https://cybertag-arena-game.vercel.app/',
  cybertagSource: 'https://github.com/arayan11587kvrsodelhi-oss/cyber-tag-game',
} as const

export const games: Game[] = [
  {
    id: 'typing-car-racer',
    title: 'TYPING CAR RACER',
    repoName: 'Typing-car-race',
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
      'Local high-score table and campaign progress persistence'
    ],
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Three Fiber', 'Three.js'],
    image: 'typing-racer-race',
    playUrl: GAME_LINKS.typingRacerPlay,
    sourceUrl: GAME_LINKS.typingRacerSource,
    accent: '#22d3ee',
  },
  {
    id: 'cybertag-arena',
    title: 'CYBERTAG ARENA',
    repoName: 'cyber-tag-game',
    category: 'INTERACTIVE GAME',
    tagline: 'A NEON ARENA FOR CYBERTAG.',
    description:
      'A browser-based CyberTag Arena game presented through a neon cyber interface.',
    status: 'Playable',
    keyFeatures: ['Combatant profile configuration', 'Selectable laser blaster loadout'],
    tech: ['React', 'Vite', 'Three.js', 'WebSocket'],
    image: 'cybertag-arena',
    playUrl: GAME_LINKS.cybertagPlay,
    sourceUrl: GAME_LINKS.cybertagSource,
    accent: '#19b89a',
  },
]

/** Case-insensitive lookup so callers never depend on exact repo casing. */
export function gameById(id: string): Game | undefined {
  const key = id.toLowerCase()
  return games.find((g) => g.id === key)
}
