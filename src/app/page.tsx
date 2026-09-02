import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import ProductGrid from '@/components/ProductGrid'

export default async function Home() {
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

const { data: products } = await supabase.from('products').select('*')

return (
<main className="min-h-screen bg-slate-950 text-white p-8">
<div className="max-w-6xl mx-auto">
<h1 className="text-3xl font-extrabold mb-8 tracking-tight">
Featured Performance Parts
</h1>
<ProductGrid products={products || []} />
</div>
</main>
)
}
