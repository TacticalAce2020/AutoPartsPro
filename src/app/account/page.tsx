import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
const cookieStore = await cookies()

const supabase = createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies: {
getAll() {
return cookieStore.getAll()
},
},
}
)

const {
data: { user },
} = await supabase.auth.getUser()

if (!user) {
redirect('/login')
}

return (
<main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
<div className="max-w-4xl mx-auto space-y-8">
<div>
<h1 className="text-3xl font-extrabold tracking-tight">Account Dashboard</h1>
<p className="text-slate-400 mt-1">Manage your profile, garage, and order history.</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/* User Info Card */}
<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:col-span-1">
<h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">
Profile Info
</h2>
<div className="space-y-3 text-sm">
<div>
<p className="text-slate-500 text-xs">Email</p>
<p className="font-semibold text-slate-200">{user.email}</p>
</div>
<div>
<p className="text-slate-500 text-xs">Account ID</p>
<p className="font-mono text-xs text-slate-400 truncate">{user.id}</p>
</div>
</div>
</div>

{/* Saved Garage / Vehicle Card */}
<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:col-span-2">
<h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">
My Garage
</h2>
<div className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 text-center">
<p className="text-slate-400 text-sm">No saved vehicles yet.</p>
<p className="text-xs text-slate-500 mt-1">
Save your Year/Make/Model on the homepage to fitment-check dropshipped parts.
</p>
</div>
</div>
</div>

{/* Recent Orders */}
<div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
<h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">
Recent Orders
</h2>
<div className="border border-dashed border-slate-800 rounded-lg p-8 text-center">
<p className="text-slate-400 text-sm font-medium">No order history found.</p>
<p className="text-xs text-slate-500 mt-1">
When buyers order parts, order tracking status will pop up right here.
</p>
</div>
</div>
</div>
</main>
)
}
