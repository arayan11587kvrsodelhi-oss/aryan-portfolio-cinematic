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
  private limiter: DynamicsCompressorNode | null = null
  private analyser: AnalyserNode | null = null
  private ambientGain: GainNode | null = null
  private ambientOsc: OscillatorNode | null = null

  private isEnabled = false
  private isAmbientEnabled = false
  private volume = 0.6

  private lastHoverTime = 0
  private hoverThrottleMs = 75

  private userInteracted = false
  private interactionListenersAttached = false

  private readonly levelByType: Record<SoundType, number> = {
    hover: 0.62,
    click: 0.72,
    nav: 0.66,
    projectHover: 0.64,
    projectOpen: 0.78,
    modalOpen: 0.7,
    modalClose: 0.64,
    success: 0.68,
    mobileMenu: 0.7,
    toggle: 0.7,
  }

  constructor() {
    // Intentionally do not create AudioContext here.
    // Browsers require a user gesture before Web Audio can start.
    this.attachInteractionListeners()
  }

  /**
   * Listen for the first real user interaction.
   * AudioContext creation is allowed after these gestures.
   */
  private attachInteractionListeners() {
    if (this.interactionListenersAttached || typeof window === 'undefined') {
      return
    }

    this.interactionListenersAttached = true

    const handleInteraction = () => {
      this.userInteracted = true

      this.removeInteractionListeners()

      if (this.isEnabled) {
        this.init()
      }
    }

    window.addEventListener('pointerdown', handleInteraction, {
      passive: true,
      once: true,
    })

    window.addEventListener('keydown', handleInteraction, {
      passive: true,
      once: true,
    })

    window.addEventListener('touchstart', handleInteraction, {
      passive: true,
      once: true,
    })
  }

  private removeInteractionListeners() {
    if (typeof window === 'undefined') return

    window.removeEventListener('pointerdown', this.handleInteraction)
    window.removeEventListener('keydown', this.handleInteraction)
    window.removeEventListener('touchstart', this.handleInteraction)

    this.interactionListenersAttached = false
  }

  private handleInteraction = () => {
    this.userInteracted = true
    this.removeInteractionListeners()

    if (this.isEnabled) {
      this.init()
    }
  }

  /**
   * Create the Web Audio graph only after a user gesture.
   */
  private init() {
    if (!this.userInteracted) {
      return false
    }

    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => {})
      }

      return this.ctx.state !== 'closed'
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (
          window as unknown as {
            webkitAudioContext: typeof AudioContext
          }
        ).webkitAudioContext

      if (!AudioCtx) {
        return false
      }

      this.ctx = new AudioCtx()

      this.masterGain = this.ctx.createGain()

      this.limiter = this.ctx.createDynamicsCompressor()
      this.limiter.threshold.setValueAtTime(-16, this.ctx.currentTime)
      this.limiter.knee.setValueAtTime(18, this.ctx.currentTime)
      this.limiter.ratio.setValueAtTime(4, this.ctx.currentTime)
      this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime)
      this.limiter.release.setValueAtTime(0.18, this.ctx.currentTime)

      this.masterGain.gain.setValueAtTime(
        this.volume * 0.9,
        this.ctx.currentTime
      )

      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = 256

      this.masterGain.connect(this.analyser)
      this.analyser.connect(this.limiter)
      this.limiter.connect(this.ctx.destination)

      // AudioContext may still start suspended in some browsers.
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => {})
      }

      return true
    } catch {
      this.ctx = null
      this.masterGain = null
      this.limiter = null
      this.analyser = null

      return false
    }
  }

  /**
   * Explicitly mark the current interaction as a user gesture
   * and initialize audio if SFX is enabled.
   *
   * Components can call this from a click/tap handler if desired.
   */
  public userGesture() {
    this.userInteracted = true
    this.removeInteractionListeners()

    return this.init()
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled

    if (!enabled) {
      this.stopAmbient()
      return
    }

    // IMPORTANT:
    // Do not initialize AudioContext during React startup.
    // Wait for a real user gesture.
    if (!this.userInteracted) {
      return
    }

    this.init()

    if (this.isAmbientEnabled) {
      this.startAmbient()
    }
  }

  public setAmbientEnabled(enabled: boolean) {
    this.isAmbientEnabled = enabled

    if (!enabled) {
      this.stopAmbient()
      return
    }

    if (this.isEnabled && this.userInteracted) {
      this.init()
      this.startAmbient()
    }
  }

  public getAmplitude() {
    if (!this.analyser || !this.isEnabled) {
      return 0
    }

    const data = new Uint8Array(
      this.analyser.frequencyBinCount
    )

    this.analyser.getByteTimeDomainData(data)

    let sum = 0

    for (const sample of data) {
      const centered = (sample - 128) / 128
      sum += centered * centered
    }

    return Math.min(
      1,
      Math.sqrt(sum / data.length) * 3
    )
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.volume * 0.9,
        this.ctx.currentTime,
        0.05
      )
    }
  }

  public play(type: SoundType) {
    if (!this.isEnabled) return

    // Never attempt to create AudioContext before a gesture.
    if (!this.userInteracted) return

    if (!this.init()) return

    if (!this.ctx || !this.masterGain) return

    // If the browser has not resumed audio yet, skip this event.
    if (this.ctx.state !== 'running') {
      return
    }

    const now = this.ctx.currentTime
    const level = this.levelByType[type] ?? 1

    switch (type) {
      case 'hover':
        this.playHover(now, level)
        break

      case 'click':
        this.playClick(now, level)
        break

      case 'nav':
        this.playNav(now, level)
        break

      case 'projectHover':
        this.playProjectHover(now, level)
        break

      case 'projectOpen':
        this.playProjectOpen(now, level)
        break

      case 'modalOpen':
        this.playModalOpen(now, level)
        break

      case 'modalClose':
        this.playModalClose(now, level)
        break

      case 'success':
        this.playSuccess(now, level)
        break

      case 'mobileMenu':
        this.playMobileMenu(now, level)
        break

      case 'toggle':
        this.playToggle(now, level)
        break
    }
  }

  // 1. Subtle tactile button hover tick
  private playHover(now: number, level: number) {
    const performanceNow = performance.now()

    if (
      performanceNow - this.lastHoverTime <
      this.hoverThrottleMs
    ) {
      return
    }

    this.lastHoverTime = performanceNow

    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1400, now)
    filter.frequency.exponentialRampToValueAtTime(
      600,
      now + 0.035
    )

    osc.type = 'sine'
    osc.frequency.setValueAtTime(950, now)
    osc.frequency.exponentialRampToValueAtTime(
      550,
      now + 0.035
    )

    gain.gain.setValueAtTime(
      0.035 * level,
      now
    )

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.035
    )

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.038)
  }

  // 2. Soft mechanical button click
  private playClick(now: number, level: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, now)

    osc.frequency.exponentialRampToValueAtTime(
      120,
      now + 0.045
    )

    gain.gain.setValueAtTime(
      0.065 * level,
      now
    )

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.045
    )

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.048)
  }

  // 3. Navigation interaction tick
  private playNav(now: number, level: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, now)
    filter.Q.setValueAtTime(3, now)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(740, now)

    osc.frequency.exponentialRampToValueAtTime(
      480,
      now + 0.04
    )

    gain.gain.setValueAtTime(
      0.045 * level,
      now
    )

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.04
    )

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.045)
  }

  // 4. Project card hover texture
  private playProjectHover(now: number, level: number) {
    const performanceNow = performance.now()

    if (
      performanceNow - this.lastHoverTime <
      this.hoverThrottleMs
    ) {
      return
    }

    this.lastHoverTime = performanceNow

    if (!this.ctx || !this.masterGain) return

    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'

    filter.frequency.setValueAtTime(
      500,
      now
    )

    filter.frequency.linearRampToValueAtTime(
      900,
      now + 0.03
    )

    filter.frequency.exponentialRampToValueAtTime(
      300,
      now + 0.07
    )

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(185, now)

    osc1.frequency.exponentialRampToValueAtTime(
      240,
      now + 0.065
    )

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(277, now)

    osc2.frequency.exponentialRampToValueAtTime(
      360,
      now + 0.065
    )

    gain.gain.setValueAtTime(
      0.04 * level,
      now
    )

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.07
    )

    osc1.connect(filter)
    osc2.connect(filter)

    filter.connect(gain)
    gain.connect(this.masterGain)

    osc1.start(now)
    osc2.start(now)

    osc1.stop(now + 0.075)
    osc2.stop(now + 0.075)
  }

  // 5. Project opening whoosh
  private playProjectOpen(now: number, level: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'

    filter.frequency.setValueAtTime(
      180,
      now
    )

    filter.frequency.exponentialRampToValueAtTime(
      1600,
      now + 0.12
    )

    filter.frequency.exponentialRampToValueAtTime(
      200,
      now + 0.22
    )

    osc.type = 'sawtooth'

    osc.frequency.setValueAtTime(
      110,
      now
    )

    osc.frequency.exponentialRampToValueAtTime(
      320,
      now + 0.1
    )

    osc.frequency.exponentialRampToValueAtTime(
      80,
      now + 0.22
    )

    gain.gain.setValueAtTime(
      0.01,
      now
    )

    gain.gain.linearRampToValueAtTime(
      0.065 * level,
      now + 0.08
    )

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.22
    )

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.23)
  }

  // 6. Soft modal open harmonic transition
  private playModalOpen(now: number, level: number) {
    if (!this.ctx || !this.masterGain) return

    const freqs = [
      220,
      277.18,
      329.63,
    ]

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'

      osc.frequency.setValueAtTime(
        freq,
        now
      )

      osc.frequency.exponentialRampToValueAtTime(
        freq * 1.05,
        now + 0.18
      )

      gain.gain.setValueAtTime(
        0.005,
        now
      )

      gain.gain.linearRampToValueAtTime(
        (0.035 * level) / (idx + 1),
        now + 0.04
      )

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.2
      )

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + 0.21)
    })
  }

  // 7. Modal close descending transition
  private playModalClose(now: number, level: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'

    filter.frequency.setValueAtTime(
      800,
      now
    )

    filter.frequency.exponentialRampToValueAtTime(
      150,
      now + 0.16
    )

    osc.type = 'sine'

    osc.frequency.setValueAtTime(
      392,
      now
    )

    osc.frequency.exponentialRampToValueAtTime(
      180,
      now + 0.16
    )

    gain.gain.setValueAtTime(
      0.045 * level,
      now
    )

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.16
    )

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.17)
  }

  // 8. Copy email success confirmation
  private playSuccess(now: number, level: number) {
    if (!this.ctx || !this.masterGain) return

    const notes = [
      {
        freq: 523.25,
        time: now,
        dur: 0.14,
      },
      {
        freq: 659.25,
        time: now + 0.07,
        dur: 0.2,
      },
    ]

    notes.forEach((note) => {
      if (!this.ctx || !this.masterGain) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'

      osc.frequency.setValueAtTime(
        note.freq,
        note.time
      )

      gain.gain.setValueAtTime(
        0.065 * level,
        note.time
      )

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        note.time + note.dur
      )

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(note.time)
      osc.stop(
        note.time + note.dur + 0.01
      )
    })
  }

  // 9. Mobile menu air sweep
  private playMobileMenu(now: number, level: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'

    filter.frequency.setValueAtTime(
      300,
      now
    )

    filter.frequency.linearRampToValueAtTime(
      1000,
      now + 0.07
    )

    filter.frequency.exponentialRampToValueAtTime(
      250,
      now + 0.14
    )

    osc.type = 'triangle'

    osc.frequency.setValueAtTime(
      220,
      now
    )

    osc.frequency.exponentialRampToValueAtTime(
      440,
      now + 0.07
    )

    osc.frequency.exponentialRampToValueAtTime(
      180,
      now + 0.14
    )

    gain.gain.setValueAtTime(
      0.045 * level,
      now
    )

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.14
    )

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.15)
  }

  // 10. Tactile toggle click
  private playToggle(now: number, level: number) {
    if (!this.ctx || !this.masterGain) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'

    osc.frequency.setValueAtTime(
      580,
      now
    )

    osc.frequency.exponentialRampToValueAtTime(
      280,
      now + 0.045
    )

    gain.gain.setValueAtTime(
      0.07 * level,
      now
    )

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.045
    )

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.048)
  }

  // 11. Ultra-low ambient drone
  private startAmbient() {
    if (
      !this.ctx ||
      this.ambientOsc ||
      this.ctx.state !== 'running'
    ) {
      return
    }

    try {
      const now = this.ctx.currentTime

      this.ambientGain = this.ctx.createGain()

      this.ambientGain.gain.setValueAtTime(
        0.001,
        now
      )

      this.ambientGain.gain.linearRampToValueAtTime(
        0.015,
        now + 1.5
      )

      this.ambientOsc =
        this.ctx.createOscillator()

      this.ambientOsc.type = 'sine'

      this.ambientOsc.frequency.setValueAtTime(
        55,
        now
      )

      const filter =
        this.ctx.createBiquadFilter()

      filter.type = 'lowpass'

      filter.frequency.setValueAtTime(
        180,
        now
      )

      this.ambientOsc.connect(filter)
      filter.connect(this.ambientGain)

      if (this.masterGain) {
        this.ambientGain.connect(
          this.masterGain
        )
      }

      this.ambientOsc.start()
    } catch {
      this.ambientOsc = null
      this.ambientGain = null
    }
  }

  private stopAmbient() {
    if (
      !this.ambientGain ||
      !this.ctx
    ) {
      return
    }

    try {
      const now = this.ctx.currentTime

      this.ambientGain.gain.linearRampToValueAtTime(
        0.0001,
        now + 0.8
      )

      setTimeout(() => {
        if (this.ambientOsc) {
          try {
            this.ambientOsc.stop()
            this.ambientOsc.disconnect()
          } catch {
            // Already stopped
          }

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

export const soundManager = new SoundManager()