'use client'

import { useState, useRef } from 'react'
import { submitContactForm } from '@/app/actions/contact'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const data = new FormData(e.currentTarget)
    try {
      await submitContactForm({
        name: data.get('name') as string,
        email: data.get('email') as string,
        message: data.get('message') as string,
      })
      setStatus('sent')
      formRef.current?.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-sm border border-ivory/20 bg-white/5 px-8 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-serif text-xl text-ivory">Message received.</p>
        <p className="text-sm text-ivory/60">We'll be in touch within one business day.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-xs text-ivory/50 underline underline-offset-2 hover:text-ivory/80 transition"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-ivory/50">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="w-full border border-ivory/20 bg-white/8 px-4 py-3 text-sm text-ivory placeholder-ivory/35 outline-none transition focus:border-gold focus:bg-white/12"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-ivory/50">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full border border-ivory/20 bg-white/8 px-4 py-3 text-sm text-ivory placeholder-ivory/35 outline-none transition focus:border-gold focus:bg-white/12"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-ivory/50">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          placeholder="Tell us a bit about your situation…"
          className="w-full resize-none border border-ivory/20 bg-white/8 px-4 py-3 text-sm text-ivory placeholder-ivory/35 outline-none transition focus:border-gold focus:bg-white/12"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />
      </div>
      {status === 'error' && (
        <p className="text-xs text-red-300">Something went wrong. Please try again or email us directly.</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-1 inline-flex items-center justify-center rounded-full border border-ivory/30 bg-transparent px-8 py-3.5 text-sm font-medium tracking-wide text-ivory transition hover:border-gold hover:text-gold disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
