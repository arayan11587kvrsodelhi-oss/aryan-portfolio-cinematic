import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { soundManager, SoundType } from '../lib/soundManager'

interface SoundContextType {
  sfxEnabled: boolean
  ambientEnabled: boolean
  masterVolume: number
  toggleSFX: () => void
  toggleAmbient: () => void
  setVolume: (vol: number) => void
  playSFX: (type: SoundType) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

const SFX_STORAGE_KEY = 'portfolio_sfx_enabled'
const AMBIENT_STORAGE_KEY = 'portfolio_ambient_enabled'
const VOLUME_STORAGE_KEY = 'portfolio_sfx_volume'

export function SoundProvider({ children }: { children: ReactNode }) {
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SFX_STORAGE_KEY)
      // Strictly OFF by default
      return saved === 'true'
    } catch {
      return false
    }
  })

  const [ambientEnabled, setAmbientEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AMBIENT_STORAGE_KEY)
      return saved === 'true'
    } catch {
      return false
    }
  })

  const [masterVolume, setMasterVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(VOLUME_STORAGE_KEY)
      return saved ? parseFloat(saved) : 0.6
    } catch {
      return 0.6
    }
  })

  // Synchronize state with soundManager on mount / update
  useEffect(() => {
    soundManager.setEnabled(sfxEnabled)
    try {
      localStorage.setItem(SFX_STORAGE_KEY, String(sfxEnabled))
    } catch {}
  }, [sfxEnabled])

  useEffect(() => {
    soundManager.setAmbientEnabled(ambientEnabled)
    try {
      localStorage.setItem(AMBIENT_STORAGE_KEY, String(ambientEnabled))
    } catch {}
  }, [ambientEnabled])

  useEffect(() => {
    soundManager.setVolume(masterVolume)
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, String(masterVolume))
    } catch {}
  }, [masterVolume])

  // Handle visibility change to prevent runaway audio when tab is backgrounded
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        soundManager.setEnabled(false)
      } else {
        soundManager.setEnabled(sfxEnabled)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [sfxEnabled])

  const toggleSFX = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev
      if (next) {
        soundManager.setEnabled(true)
        soundManager.play('toggle')
      } else {
        soundManager.play('toggle')
        soundManager.setEnabled(false)
      }
      return next
    })
  }, [])

  const toggleAmbient = useCallback(() => {
    setAmbientEnabled((prev) => !prev)
  }, [])

  const setVolume = useCallback((vol: number) => {
    setMasterVolume(vol)
  }, [])

  const playSFX = useCallback((type: SoundType) => {
    soundManager.play(type)
  }, [])

  return (
    <SoundContext.Provider
      value={{
        sfxEnabled,
        ambientEnabled,
        masterVolume,
        toggleSFX,
        toggleAmbient,
        setVolume,
        playSFX,
      }}
    >
      {children}
    </SoundContext.Provider>
  )
}

export function useSFX() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSFX must be used within a SoundProvider')
  }
  return context
}
