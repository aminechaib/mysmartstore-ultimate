// File: apps/storefront/src/modules/store/templates/index.tsx

import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function StoreTemplate({
  sortBy,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const region = await getRegion(countryCode)
  
  // Fetch all collections
  const { collections } = await listCollections({
    fields: "id, handle, title",
    limit: 100,
  })

  if (!region) return null

  return (
    <div className="flex flex-col sm:flex-row max-w-[1400px] mx-auto py-12 px-4 md:px-8 gap-12">
      
      {/* 1. STICKY FILTER SIDEBAR */}
      <div className="w-full sm:w-[250px] shrink-0">
        <div className="sticky top-28 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-black mb-4 tracking-tight">Filters</h2>
          
          {/* Default Medusa Sort Filter */}
          <RefinementList sortBy={sortBy || "created_at"} data-testid="sort-by-container" />
          
          {/* Quick Jump Category Links */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Jump to Category</h3>
            <ul className="flex flex-col gap-3">
              {collections?.map(c => (
                <li key={c.id}>
                  <a href={`#${c.handle}`} className="text-gray-500 hover:text-black hover:font-medium transition-all text-sm">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT: PRODUCTS GROUPED BY COLLECTION */}
      <div className="flex-1 w-full">
        <div className="mb-4 border-b border-gray-200 pb-4">
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase">
            All Products
          </h1>
        </div>
        
        <div className="flex flex-col gap-y-4">
          {collections?.map((collection) => (
            // The id matches the href in the sidebar so clicking it scrolls right to this section!
            <div key={collection.id} id={collection.handle} className="scroll-mt-28">
              <ProductRail collection={collection} region={region} />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}
