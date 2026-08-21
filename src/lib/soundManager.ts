export type SoundType =
  | 'hover'
  | 'click'
  | 'nav'
  | 'projectHover'
  | 'projectOpen'
  | 'modalOpen'
  | 'modalClose'
  | 'success'
  | 'mobileMenu'
  | 'toggle'

class SoundManager {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private ambientGain: GainNode | null = null
  private ambientOsc: OscillatorNode | null = null
  private ambientNoiseNode: AudioNode | null = null
  private isEnabled: boolean = false
  private isAmbientEnabled: boolean = false
  private volume: number = 0.6
  private lastHoverTime: number = 0
  private hoverThrottleMs: number = 75

  constructor() {
    // AudioContext will be initialized on first explicit user interaction
  }

  private init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
      return
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return

      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)
    } catch {
      // Web Audio not supported or blocked
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled
    if (enabled) {
      this.init()
      if (this.isAmbientEnabled) {
        this.startAmbient()
      }
    } else {
      this.stopAmbient()
    }
  }

  public setAmbientEnabled(enabled: boolean) {
    this.isAmbientEnabled = enabled
    if (this.isEnabled && enabled) {
      this.startAmbient()
    } else {
      this.stopAmbient()
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05)
    }
  }

  public play(type: SoundType) {
    if (!this.isEnabled) return
    this.init()
    if (!this.ctx || !this.masterGain) return

    const now = this.ctx.currentTime

    switch (type) {
      case 'hover':
        this.playHover(now)
        break
      case 'click':
        this.playClick(now)
        break
      case 'nav':
        this.playNav(now)
        break
      case 'projectHover':
        this.playProjectHover(now)
        break
      case 'projectOpen':
        this.playProjectOpen(now)
        break
      case 'modalOpen':
        this.playModalOpen(now)
        break
      case 'modalClose':
        this.playModalClose(now)
        break
      case 'success':
        this.playSuccess(now)
        break
      case 'mobileMenu':
        this.playMobileMenu(now)
        break
      case 'toggle':
        this.playToggle(now)
        break
    }
  }

  // 1. Subtle tactile button hover tick (throttled to prevent spam)
  private playHover(now: number) {
    const performanceNow = performance.now()
    if (performanceNow - this.lastHoverTime < this.hoverThrottleMs) return
    this.lastHoverTime = performanceNow

    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1400, now)
    filter.frequency.exponentialRampToValueAtTime(600, now + 0.035)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(950, now)
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.035)

    gain.gain.setValueAtTime(0.035, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.038)
  }

  // 2. Soft mechanical button click
  private playClick(now: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.045)

    gain.gain.setValueAtTime(0.065, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.048)
  }

  // 3. Navigation interaction tick
  private playNav(now: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, now)
    filter.Q.setValueAtTime(3, now)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(740, now)
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.04)

    gain.gain.setValueAtTime(0.045, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.045)
  }

  // 4. Project card hover texture
  private playProjectHover(now: number) {
    const performanceNow = performance.now()
    if (performanceNow - this.lastHoverTime < this.hoverThrottleMs) return
    this.lastHoverTime = performanceNow

    if (!this.ctx || !this.masterGain) return

    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(500, now)
    filter.frequency.linearRampToValueAtTime(900, now + 0.03)
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.07)

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(185, now)
    osc1.frequency.exponentialRampToValueAtTime(240, now + 0.065)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(277, now)
    osc2.frequency.exponentialRampToValueAtTime(360, now + 0.065)

    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.075)
    osc2.stop(now + 0.075)
  }

  // 5. Cinematic whoosh when opening a project
  private playProjectOpen(now: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(180, now)
    filter.frequency.exponentialRampToValueAtTime(1600, now + 0.12)
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.22)

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(110, now)
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.1)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.22)

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.065, now + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.23)
  }

  // 6. Soft modal open harmonic transition
  private playModalOpen(now: number) {
    if (!this.ctx || !this.masterGain) return

    const freqs = [220, 277.18, 329.63] // A Major chord
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.18)

      gain.gain.setValueAtTime(0.005, now)
      gain.gain.linearRampToValueAtTime(0.035 / (idx + 1), now + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.21)
    })
  }

  // 7. Subtle modal close descending transition
  private playModalClose(now: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, now)
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.16)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(392, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.16)

    gain.gain.setValueAtTime(0.045, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.17)
  }

  // 8. Copy email success confirmation chime
  private playSuccess(now: number) {
    if (!this.ctx || !this.masterGain) return

    const notes = [
      { freq: 523.25, time: now, dur: 0.14 }, // C5
      { freq: 659.25, time: now + 0.07, dur: 0.2 }, // E5
    ]

    notes.forEach((n) => {
      if (!this.ctx || !this.masterGain) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(n.freq, n.time)

      gain.gain.setValueAtTime(0.065, n.time)
      gain.gain.exponentialRampToValueAtTime(0.001, n.time + n.dur)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(n.time)
      osc.stop(n.time + n.dur + 0.01)
    })
  }

  // 9. Mobile menu air sweep
  private playMobileMenu(now: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(300, now)
    filter.frequency.linearRampToValueAtTime(1000, now + 0.07)
    filter.frequency.exponentialRampToValueAtTime(250, now + 0.14)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.07)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.14)

    gain.gain.setValueAtTime(0.045, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.15)
  }

  // 10. Tactile toggle click
  private playToggle(now: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(580, now)
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.045)

    gain.gain.setValueAtTime(0.07, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.048)
  }

  // 11. Subtle atmospheric ambient drone (strictly opt-in, ultra-low volume)
  private startAmbient() {
    if (!this.ctx || this.ambientOsc) return

    try {
      const now = this.ctx.currentTime
      this.ambientGain = this.ctx.createGain()
      this.ambientGain.gain.setValueAtTime(0.001, now)
      this.ambientGain.gain.linearRampToValueAtTime(0.015, now + 1.5)

      // Low frequency root drone
      this.ambientOsc = this.ctx.createOscillator()
      this.ambientOsc.type = 'sine'
      this.ambientOsc.frequency.setValueAtTime(55, now) // A1 warm sub

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(180, now)

      this.ambientOsc.connect(filter)
      filter.connect(this.ambientGain)
      if (this.masterGain) {
        this.ambientGain.connect(this.masterGain)
      }

      this.ambientOsc.start()
    } catch {
      // Audio error fallback
    }
  }

  private stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        const now = this.ctx.currentTime
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.8)
        setTimeout(() => {
          if (this.ambientOsc) {
            try {
              this.ambientOsc.stop()
              this.ambientOsc.disconnect()
            } catch {}
            this.ambientOsc = null
          }
          if (this.ambientGain) {
            this.ambientGain.disconnect()
            this.ambientGain = null
          }
        }, 850)
      } catch {
        this.ambientOsc = null
        this.ambientGain = null
      }
    }
  }
}

export const soundManager = new SoundManager()
