import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
let response = NextResponse.next({
request: {
headers: request.headers,
},
})

const supabase = createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies: {
getAll() {
return request.cookies.getAll()
},
setAll(cookiesToSet) {
cookiesToSet.forEach(({ name, value, options }) =>
request.cookies.set(name, value)
)
response = NextResponse.next({
request,
})
cookiesToSet.forEach(({ name, value, options }) =>
response.cookies.set(name, value, options)
)
},
},
}
)

const {
data: { user },
} = await supabase.auth.getUser()

// Redirect unauthenticated users trying to hit protected routes back to login
const protectedRoutes = ['/checkout', '/account']
const isProtectedRoute = protectedRoutes.some((route) =>
request.nextUrl.pathname.startsWith(route)
)

if (isProtectedRoute && !user) {
return NextResponse.redirect(new URL('/login', request.url))
}

return response
}

export const config = {
matcher: ['/checkout/:path*', '/account/:path*'],
}
