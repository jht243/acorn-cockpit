import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; next?: string }>
}) {
  const { message, next } = await searchParams

  const signIn = async (formData: FormData) => {
    'use server'
    const email = (formData.get('email') as string).trim().toLowerCase()
    const password = formData.get('password') as string

    // Check dashboard password before sending magic link
    const dashboardPassword = process.env.DASHBOARD_PASSWORD
    if (!dashboardPassword || password !== dashboardPassword) {
      return redirect('/login?message=' + encodeURIComponent('Incorrect password'))
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.acorn-care.com'}/auth/callback${next ? `?next=${next}` : ''}`,
      },
    })

    if (error) {
      return redirect('/login?message=' + encodeURIComponent('Something went wrong — please try again'))
    }

    return redirect('/login?message=' + encodeURIComponent('Check your email for a login link'))
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

        {message ? (
          <div className="text-center space-y-4">
            <div
              className="px-4 py-3 rounded-md text-sm font-medium"
              style={{
                background: message.includes('Incorrect') ? '#fff5f5' : 'var(--brand-soft)',
                color: message.includes('Incorrect') ? '#842029' : 'var(--brand-dark)',
              }}
            >
              {message}
            </div>
            <a href="/login" className="text-sm" style={{ color: 'var(--ink-soft)' }}>
              ← Try again
            </a>
          </div>
        ) : (
          <form action={signIn} className="space-y-4">
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
              />
            </div>
            <button type="submit" className="btn w-full justify-center">
              Send login link →
            </button>
            <p className="text-xs text-center" style={{ color: 'var(--ink-soft)' }}>
              We'll email you a secure one-time link to complete sign in.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
