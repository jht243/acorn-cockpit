'use client'

import { useEffect, useState } from 'react'

const QUOTES = [
  "Where are my parents' documents?",
  "My advisors don't talk to each other.",
  "Who actually has the latest will?",
  "I'm paying for overlapping insurance.",
  "I have no idea what's missing.",
  "If something happens, my family is lost.",
  "I'm managing this estate completely blind.",
  "My financial life is scattered everywhere.",
  "Are these beneficiary forms even current?",
  "I don't have time to chase down my CPA.",
]

export default function PainPointsSlider() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % QUOTES.length)
        // Fade in
        setVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="border-t border-charcoal/10 bg-[#f5f0e8]">
      <div className="mx-auto max-w-[78rem] px-6 py-16 text-center lg:px-10 lg:py-20">

        <p className="text-[11px] uppercase tracking-[0.24em] text-charcoal/50">
          We step in when you find yourself thinking&hellip;
        </p>

        {/* Fixed-height container prevents layout shift */}
        <div className="mx-auto mt-6 flex min-h-[4rem] max-w-3xl items-center justify-center sm:min-h-[3.5rem]">
          <p
            className="font-serif text-2xl leading-snug text-espresso-deep sm:text-3xl lg:text-[2.1rem]"
            style={{
              fontStyle: 'italic',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            &ldquo;{QUOTES[index]}&rdquo;
          </p>
        </div>

        {/* Dot indicators */}
        <div className="mt-8 flex items-center justify-center gap-1.5">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to quote ${i + 1}`}
              onClick={() => { setVisible(false); setTimeout(() => { setIndex(i); setVisible(true) }, 400) }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? '1.5rem' : '0.375rem',
                height: '0.375rem',
                background: i === index ? 'var(--color-gold, #c9a46a)' : 'rgba(40,30,20,0.2)',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
