import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import type { Certificate } from '../data/certifications'
import { orderedCertifications } from '../data/certifications'
import CertificateViewer from './CertificateViewer'
import { useSFX } from '../hooks/useSFX'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Certifications() {
  const { playSFX } = useSFX()
  const [active, setActive] = useState<Certificate | null>(null)
  const [reduced, setReduced] = useState(false)
  const total = orderedCertifications.length

  useEffect(() => {
    const handleOpenCert = (event: Event) => {
      const targetIdx = (event as CustomEvent<number>).detail ?? 0
      const cert = orderedCertifications[targetIdx]
      if (cert) setActive(cert)
    }

    window.addEventListener('certifications:open', handleOpenCert)
    return () => window.removeEventListener('certifications:open', handleOpenCert)
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return (
    <section id="recognition" className="relative z-10 bg-background text-foreground">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10 pt-[var(--spacing-section)] pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-eyebrow text-accent">[ 06. RECOGNITION ]</span>
          <span className="h-[1px] w-12 bg-border" />
          <span className="text-xs font-mono text-white/50">{total} Verified Credentials</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-white">
              CERTIFICATES &amp; MERIT
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl font-mono">
              A tactile archive of verified merit recognition, industry certifications, and academic achievements.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-white/40">
            <span>ORDER: MERIT ▹ INDUSTRY ▹ ACADEMIC ▹ WORKSHOPS</span>
          </div>
        </div>
      </div>

      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10 pb-[var(--spacing-section)]">
        <CertificateViewer
          certs={orderedCertifications}
          onInspect={(cert) => {
            playSFX('click')
            setActive(cert)
          }}
        />
      </div>

      <AnimatePresence>
        {active && (
          <CertificateModal
            item={active}
            onClose={() => setActive(null)}
            reduced={reduced}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

/* Lightbox Modal — ESC to close, focus management, scroll lock        */
/* ------------------------------------------------------------------ */
function CertificateModal({ item, onClose, reduced }: { item: Certificate; onClose: () => void; reduced: boolean }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', close)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', close)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.01 : 0.25 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-4 sm:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Certificate viewer"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: reduced ? 0.01 : 0.35, ease: EASE }}
          className="relative w-full max-w-4xl bg-[#0e0f14] border border-white/15 p-6 sm:p-8 rounded-2xl shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close certificate viewer"
            className="absolute right-4 top-4 p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="pr-12 mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono text-accent uppercase tracking-wider">
                {item.hierarchyTier}
              </span>
              <span className="text-white/20">/</span>
              <span className="text-xs font-mono text-white/50">
                {item.category} · #{item.number}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl text-white font-medium">{item.title}</h2>
            <p className="text-white/60 text-sm mt-1 font-mono">
              {item.issuer} · {item.type} {item.date ? `(${item.date})` : ''}
            </p>
            {item.description && (
              <p className="text-accent text-sm mt-2 font-mono bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/20 inline-block">
                ★ {item.description}
              </p>
            )}
          </div>

          <div className="rounded-xl overflow-hidden bg-black/60 border border-white/10 p-2 sm:p-4 mb-6">
            <img
              src={item.image}
              alt={`${item.title} certificate`}
              decoding="async"
              className="max-h-[62vh] w-full object-contain mx-auto"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono">
            <div className="text-white/40">
              {item.credentialId && <span>Credential ID: {item.credentialId}</span>}
            </div>

            <div className="flex items-center gap-3">
              {item.verificationUrl && (
                <a
                  href={item.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-black font-semibold hover:bg-accent/90 transition-colors"
                >
                  <span>VERIFY ON CREDLY</span>
                  <ExternalLink size={13} />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
