import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // TODO: Re-enable MFA enforcement after login testing is confirmed
  // if (user) {
  //   const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  //   if (aalData && aalData.nextLevel === 'aal2' && aalData.currentLevel !== 'aal2') {
  //     return { user: null, response: supabaseResponse }
  //   }
  // }

  return { user, response: supabaseResponse }
}
