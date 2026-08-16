// File: apps/storefront/src/modules/products/components/product-preview/index.tsx

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getProductPrice } from "@lib/util/get-product-price"
import { DEFAULT_CARD_STYLE } from "@lib/marketing-config"
import { listCollections } from "@lib/data/collections"
import QuickAddButton from "./quick-add-button"


async function getDynamicBadges() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/marketing-badges`, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      next: { revalidate: 0 } 
    } )
    if (!res.ok) return []
    const data = await res.json()
    return data.badges || []
  } catch (error) {
    return []
  }
}

export default async function ProductPreview({
  product,
  region,
  collectionHandle,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  collectionHandle?: string
}) {
  const { cheapestPrice } = getProductPrice({ product, region })

  // 1. Fetch badges and collections
  const [badges, { collections }] = await Promise.all([
    getDynamicBadges(),
    listCollections({ fields: "id, handle", limit: 100 })
  ])
  
  // 2. SMART DETECTION: Find the handle even if it wasn't passed as a prop!
  const actualHandle = collectionHandle || collections?.find(c => c.id === product.collection_id)?.handle
  
  // 3. Find the matching badge
  const badgeConfig = badges.find((b: any) => b.collection_handle === actualHandle)

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block h-full">
      <div 
        className={`relative h-full flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 
        ${badgeConfig ? badgeConfig.card_style : DEFAULT_CARD_STYLE}`}
      >
        <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
          
          {badgeConfig && (
            <div className={`absolute top-0 right-0 z-30 ${badgeConfig.bg_class} text-white text-xs md:text-sm font-bold px-4 py-2 rounded-bl-xl shadow-lg whitespace-nowrap flex items-center justify-center min-w-[80px]`}>
              {badgeConfig.text}
            </div>
          )}

          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={true}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />
          

          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
            {/* Pass the first variant ID so it knows what to add! */}
            {product.variants?.[0]?.id ? (
              <QuickAddButton 
                variantId={product.variants[0].id} 
                title={product.title} 
              />
            ) : (
              <div className="w-full py-3 bg-white/90 backdrop-blur-sm text-black text-center text-sm font-bold rounded-full shadow-lg">
                View Details
              </div>
            )}
          </div>
        </div>

        <div className="p-3 md:p-4 flex flex-col flex-grow">
          <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] mb-3 group-hover:text-blue-600 transition-colors leading-tight">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between mt-auto pt-1 border-t border-gray-100">
            {cheapestPrice && (
              <div className="text-lg font-bold text-black">
                <PreviewPrice price={cheapestPrice} />
              </div>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
