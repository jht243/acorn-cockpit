'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'acorn_cookie_consent'

type ConsentValue = 'granted' | 'denied'

function updateGtag(value: ConsentValue) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag('consent', 'update', {
    analytics_storage: value,
    ad_storage: value,
  })
}

export default function CookieBanner() {
  // null = undecided, 'granted' | 'denied' = already chose
  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setConsent(stored)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'granted')
    setConsent('granted')
    updateGtag('granted')
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'denied')
    setConsent('denied')
    updateGtag('denied')
  }

  // Hide once a choice has been recorded
  if (consent !== null) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-ivory/10 bg-espresso-deep px-6 py-4 shadow-2xl shadow-charcoal/40 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm sm:rounded-sm sm:border"
    >
      <p className="text-[13px] leading-relaxed text-ivory/75">
        We use cookies to understand how visitors use this site. No advertising cookies are used.{' '}
        <a
          href="#"
          className="underline underline-offset-2 transition hover:text-ivory"
        >
          Privacy Policy
        </a>
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={accept}
          className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2 text-xs font-medium tracking-wide text-espresso-deep transition hover:brightness-95"
        >
          Accept
        </button>
        <button
          onClick={decline}
          className="text-xs text-ivory/45 underline underline-offset-2 transition hover:text-ivory/70"
        >
          Decline
        </button>
      </div>
    </div>
  )
}
