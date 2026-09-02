import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
<h1 className="text-3xl font-bold mb-6">Featured Performance Parts</h1>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{products?.map((product) => (
<div key={product.id} className="border border-slate-800 bg-slate-900 rounded-lg overflow-hidden shadow-lg">
{product.image_url && (
<img
src={product.image_url}
alt={product.name}
className="w-full h-48 object-cover"
/>
)}
<div className="p-4">
<span className="text-xs text-red-500 font-semibold uppercase tracking-wider">{product.category}</span>
<h2 className="text-xl font-bold mt-1">{product.name}</h2>
<p className="text-sm text-slate-400 mt-1">{product.year} {product.make} {product.model}</p>
<div className="mt-4 flex justify-between items-center">
<span className="text-lg font-bold text-green-400">${product.price}</span>
<button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded font-medium">
Add to Cart
</button>
</div>
</div>
</div>
))}
</div>
</div>
</main>
)
}
