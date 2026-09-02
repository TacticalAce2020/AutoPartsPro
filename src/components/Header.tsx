'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function Header() {
const [user, setUser] = useState<any>(null)

const supabase = createBrowserClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

useEffect(() => {
const getUser = async () => {
const { data: { user } } = await supabase.auth.getUser()
setUser(user)
}
getUser()

const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
setUser(session?.user ?? null)
})

return () => subscription.unsubscribe()
}, [])

const handleSignOut = async () => {
await supabase.auth.signOut()
setUser(null)
}

return (
<header className="bg-slate-900 text-white p-4 flex justify-between items-center">
<Link href="/" className="text-xl font-bold">AutoPartsPro</Link>
<div>
{user ? (
<div className="flex items-center gap-4">
<span className="text-sm">{user.email}</span>
<button
onClick={handleSignOut}
className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
>
Sign Out
</button>
</div>
) : (
<Link
href="/login"
className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium"
>
Sign In
</Link>
)}
</div>
</header>
)
}
