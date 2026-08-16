// File: apps/storefront/src/modules/home/components/featured-products/product-rail/index.tsx

import { HttpTypes } from "@medusajs/types"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import { listProducts } from "@lib/data/products"

export default async function ProductRail({
  collection,
  region,
  limit = 10,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  limit?: number
}) {
  // 🛠️ FIX: Correctly extract products from the response object!
  const data = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      limit: limit,
    },
  })

  const products = data?.response?.products || []

  if (products.length === 0) {
    return (
      <div className="content-container py-12 text-center text-gray-500">
        <h2 className="text-2xl font-bold text-black mb-2">{collection.title}</h2>
        <p>No products found in this collection.</p>
      </div>
    )
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
          {collection.title}
        </h2>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      
      <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview
              product={product}
              region={region}
              isFeatured
              collectionHandle={collection.handle}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
