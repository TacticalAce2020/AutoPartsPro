'use client'

import { useCart } from '@/context/CartContext'

type Product = {
id: string
name: string
category: string
price: number
year: number
make: string
model: string
image_url: string | null
}

export default function ProductGrid({ products }: { products: Product[] }) {
const { addItem, openDrawer } = useCart()

const handleAddToCart = (product: Product) => {
addItem({
id: product.id,
name: product.name,
price: Number(product.price),
image_url: product.image_url || '/placeholder.jpg',
category: product.category,
})
openDrawer()
}

return (
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{products.map((product) => (
<div
key={product.id}
className="border border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between"
>
<div>
<div className="h-48 bg-slate-800 overflow-hidden relative">
{product.image_url ? (
<img
src={product.image_url}
alt={product.name}
className="w-full h-full object-cover"
/>
) : (
<div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">
No Image Available
</div>
)}
</div>
<div className="p-5">
<span className="text-xs text-red-500 font-bold uppercase tracking-wider">
{product.category}
</span>
<h2 className="text-lg font-bold text-white mt-1">
{product.name}
</h2>
<p className="text-sm text-slate-400 mt-1">
{product.year} {product.make} {product.model}
</p>
</div>
</div>

<div className="p-5 pt-0 flex justify-between items-center mt-auto">
<span className="text-xl font-extrabold text-green-400">
${product.price}
</span>
<button
onClick={() => handleAddToCart(product)}
className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white text-sm px-4 py-2.5 rounded-lg font-semibold"
>
Add to Cart
</button>
</div>
</div>
))}
</div>
)
}
