'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  ["Who We Help", "/#who"],
  ["What We Organize", "/#organize"],
  ["How It Works", "/#process"],
  ["Our Story", "/our-story"],
  ["Packages", "/#packages"],
] as const

const CONSULTATION_HREF = "https://calendly.com/karli-acorn-care/30min"

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger button — visible below lg */}
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-ivory/70 transition hover:text-ivory lg:hidden"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Drawer */}
      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-t border-ivory/10 bg-espresso-deep px-6 py-6 shadow-2xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-ivory/70 transition hover:text-ivory border-b border-ivory/8 last:border-0"
              >
                {label}
              </a>
            ))}
            <a
              href={CONSULTATION_HREF}
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium tracking-wide text-espresso-deep transition hover:brightness-95"
            >
              Schedule a Consultation
            </a>
          </nav>
        </div>
      )}
    </>
  )
}
