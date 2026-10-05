import { useEffect, useState } from 'react'
import { VolumeX } from 'lucide-react'
import { useSFX } from '../hooks/useSFX'
import { soundManager } from '../lib/soundManager'

interface SoundToggleProps {
  showLabel?: boolean
  className?: string
}

export default function SoundToggle({ showLabel = true, className = '' }: SoundToggleProps) {
  const { sfxEnabled, toggleSFX, playSFX } = useSFX()
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [amplitude, setAmplitude] = useState(0)

  useEffect(() => {
    if (!sfxEnabled || prefersReducedMotion) { setAmplitude(0); return }
    let frame = 0
    let last = -1
    const sample = () => {
      // Quantize to ~4% steps: avoids a re-render every frame when the
      // waveform is visually static, while keeping the pulse smooth.
      const amp = soundManager.getAmplitude()
      const quantized = Math.round(amp * 25)
      if (quantized !== last) { last = quantized; setAmplitude(amp) }
      frame = requestAnimationFrame(sample)
    }
    frame = requestAnimationFrame(sample)
    return () => cancelAnimationFrame(frame)
  }, [sfxEnabled, prefersReducedMotion])

  return (
    <button
      type="button"
      onClick={() => {
        toggleSFX()
      }}
      onMouseEnter={() => {
        if (sfxEnabled) playSFX('hover')
      }}
      aria-pressed={sfxEnabled}
      aria-label={sfxEnabled ? 'Mute sound effects' : 'Enable sound effects'}
      data-magnetic
      data-cursor="sound"
      style={sfxEnabled && !prefersReducedMotion ? { transform: `scale(${1 + amplitude * 0.04})`, boxShadow: `0 0 ${15 + amplitude * 18}px rgba(53,224,224,${0.2 + amplitude * 0.18})` } : undefined}
      className={`group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-300 min-h-[44px] ${sfxEnabled
          ? 'border-accent/60 bg-accent/10 text-accent shadow-[0_0_15px_rgba(53,224,224,0.2)] hover:bg-accent/20'
          : 'border-border/80 bg-surface/60 text-muted hover:border-accent/40 hover:text-foreground'
        } ${className}`}
    >
      {sfxEnabled ? (
        <div className="flex items-center gap-1.5 whitespace-nowrap" aria-hidden="true">
          {/* The beat is an inline SVG so it stays crisp at every size. */}
          <svg className="sfx-beat" viewBox="0 0 18 14" width="18" height="14" role="img" aria-label="Sound is playing">
            <rect className="sfx-beat-bar sfx-beat-bar--" x="1" y="5" width="2" height="5" rx="1" />
            <rect className="sfx-beat-bar sfx-beat-bar--two" x="5" y="2" width="2" height="10" rx="1" />
            <rect className="sfx-beat-bar sfx-beat-bar--three" x="9" y="4" width="2" height="7" rx="1" />
            <rect className="sfx-beat-bar sfx-beat-bar--four" x="13" y="1" width="2" height="12" rx="1" />
          </svg>
          {showLabel && (
            <span className="text-[0.65rem] font-mono tracking-wider font-semibold text-accent whitespace-nowrap">
              SFX ON
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <VolumeX size={13} className="text-muted group-hover:text-foreground transition-colors" />
          {showLabel && (
            <span className="text-[0.65rem] font-mono tracking-wider text-muted group-hover:text-foreground transition-colors">
              SFX OFF
            </span>
          )}
        </div>
      )}
    </button>
  )
}
