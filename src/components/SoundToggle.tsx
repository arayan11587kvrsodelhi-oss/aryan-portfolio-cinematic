import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useSFX } from '../hooks/useSFX'

interface SoundToggleProps {
  showLabel?: boolean
  className?: string
}

export default function SoundToggle({ showLabel = true, className = '' }: SoundToggleProps) {
  const { sfxEnabled, toggleSFX, playSFX } = useSFX()

  return (
    <button
      onClick={() => {
        toggleSFX()
      }}
      onMouseEnter={() => {
        if (sfxEnabled) playSFX('hover')
      }}
      aria-pressed={sfxEnabled}
      aria-label={sfxEnabled ? 'Mute sound effects' : 'Enable sound effects'}
      data-cursor="open"
      className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 min-h-[38px] ${
        sfxEnabled
          ? 'border-accent/60 bg-accent/10 text-accent shadow-[0_0_15px_rgba(53,224,224,0.2)] hover:bg-accent/20'
          : 'border-border/80 bg-surface/60 text-muted hover:border-accent/40 hover:text-foreground'
      } ${className}`}
    >
      {sfxEnabled ? (
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {/* Animated Equalizer Wave Bars */}
          <div className="flex items-end gap-[2px] h-3 w-3.5">
            <motion.span
              animate={{ height: ['30%', '90%', '40%', '80%', '30%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="w-[2px] bg-accent rounded-full"
            />
            <motion.span
              animate={{ height: ['80%', '30%', '100%', '40%', '80%'] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut', delay: 0.2 }}
              className="w-[2px] bg-accent rounded-full"
            />
            <motion.span
              animate={{ height: ['40%', '100%', '50%', '90%', '40%'] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut', delay: 0.4 }}
              className="w-[2px] bg-accent rounded-full"
            />
          </div>
          {showLabel && (
            <span className="text-[0.65rem] font-mono tracking-wider font-semibold text-accent">
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
