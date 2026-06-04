import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    'use server'
    const password = formData.get('password')
    
    if (password === 'Karli2026') {
      const cookieStore = await cookies()
      cookieStore.set('admin_auth', 'true', { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
      redirect('/dashboard')
    } else {
      redirect('/admin-login?error=Invalid password')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] px-4">
      <div className="card card-pad w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Advisor Login</h1>
          <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>Enter your password to access the Cockpit</p>
        </div>
        
        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="input w-full" 
              placeholder="••••••••"
              required 
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}
          
          <button type="submit" className="btn w-full justify-center">
            Login to Cockpit
          </button>
        </form>
      </div>
    </div>
  )
}
