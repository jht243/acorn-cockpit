'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

type Step = 'credentials' | 'mfa-verify' | 'mfa-enroll'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'

  const [step, setStep] = useState<Step>('credentials')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Credentials
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // MFA
  const [totpCode, setTotpCode] = useState('')
  const [factorId, setFactorId] = useState('')
  const [qrCode, setQrCode] = useState('')

  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Sign in with email + password via Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      // TODO: Re-enable MFA/Authy after login testing is confirmed
      router.push(next)
    } finally {
      setLoading(false)
    }
  }

  async function startEnrollment() {
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Authy',
    })
    if (enrollError) {
      setError(enrollError.message)
      return
    }
    setFactorId(data.id)
    setQrCode(data.totp.qr_code)
    setStep('mfa-enroll')
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      })
      if (challengeError) {
        setError(challengeError.message)
        return
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: totpCode,
      })
      if (verifyError) {
        setError('Invalid code — please try again')
        return
      }

      router.push(next)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="card card-pad w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" className="mx-auto">
            <path d="M16 6c-2 0-3 1-3 2v2h6V8c0-1-1-2-3-2z" fill="#c08a3e"/>
            <path d="M9 12h14c0 6-3 12-7 12s-7-6-7-12z" fill="#2f7d4f"/>
          </svg>
          <h1 className="text-xl font-semibold tracking-tight">Acorn Care</h1>
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Sign in to your Life Command Center</p>
        </div>

        {error && (
          <div
            className="px-4 py-3 rounded-md text-sm font-medium"
            style={{ background: '#fff5f5', color: '#842029' }}
          >
            {error}
          </div>
        )}

        {step === 'credentials' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                placeholder="your@email.com"
                className="input mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="input mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn w-full justify-center" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        {step === 'mfa-enroll' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Set up two-factor authentication</p>
              <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                Scan this QR code with Authy (or any authenticator app), then enter the 6-digit code below.
              </p>
            </div>
            <div className="flex justify-center">
              <img src={qrCode} alt="Scan with Authy" width={200} height={200} />
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="label" htmlFor="totp">6-digit code</label>
                <input
                  id="totp"
                  name="totp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="000000"
                  className="input mt-1 text-center tracking-widest text-lg"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <button type="submit" className="btn w-full justify-center" disabled={loading}>
                {loading ? 'Verifying…' : 'Verify & finish setup'}
              </button>
            </form>
          </div>
        )}

        {step === 'mfa-verify' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                Enter the 6-digit code from your Authy app.
              </p>
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="label" htmlFor="totp">6-digit code</label>
                <input
                  id="totp"
                  name="totp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="000000"
                  className="input mt-1 text-center tracking-widest text-lg"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <button type="submit" className="btn w-full justify-center" disabled={loading}>
                {loading ? 'Verifying…' : 'Verify'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
