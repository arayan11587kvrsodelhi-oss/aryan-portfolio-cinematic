/* ==========================================================================
   RESUME DOCUMENT — single source of truth for the downloadable PDF

   The file lives in `public/files/aryan-sharma-resume.pdf`, so Vite copies it
   verbatim into the production build and it is served from the public root.
   BASE_URL is prefixed for the same reason certifications.ts does it: the URL
   must stay correct whether the site is deployed at the domain root or under
   a sub-path.

   Every Resume action on the site points at these two constants, so the
   "View" and "Download" buttons can never drift apart or go stale.
   ========================================================================== */

/** Public URL of the current resume PDF. Opens in a browser tab. */
export const RESUME_PDF_URL = `${import.meta.env.BASE_URL}files/aryan-sharma-resume.pdf`

/** Filename offered to the browser when the PDF is downloaded. */
export const RESUME_PDF_FILENAME = 'Aryan-Sharma-Resume.pdf'
