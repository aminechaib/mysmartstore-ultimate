// File: apps/storefront/src/app/[countryCode]/(main)/page.tsx

import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "SmartStore | Modern E-Commerce",
  description: "A premium shopping experience powered by AI.",
}

export const dynamic = 'force-dynamic'

async function getStorefrontSections() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/storefront-sections`, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      next: { revalidate: 0 },
    } )
    if (!res.ok) return []
    const data = await res.json()
    if (Array.isArray(data)) return data
    return data.storefront_sections || data.sections || data.data || []
  } catch (error) {
    return []
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
    limit: 100,
  })

  const sections = await getStorefrontSections()

  if (!region) return null

  return (
    <>
      {/* Default Top Hero */}
      <Hero />

      {sections.length > 0 ? (
        sections.map((section: any) => {
          
          // 1. Render Promo / Hero Banner
          if (section.type === "promo" || section.type === "banner" || section.type === "hero") {
            return (
              <div key={section.id} className="w-full max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center gap-0 bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="w-full md:w-1/2 h-[300px] md:h-[500px]">
                    <img 
                      src={section.image_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"} 
                      alt={section.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-16 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 tracking-tight">
                      {section.title || "Exclusive Sale"}
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                      {section.description || "Upgrade your lifestyle with our premium selection."}
                    </p>
                    {section.show_button !== false && (
                      <LocalizedClientLink href={section.button_link || "/store"}>
                        <button className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
                          {section.button_text || "Shop Now"}
                        </button>
                      </LocalizedClientLink>
                     )}
                  </div>
                </div>
              </div>
            )
          }

          // 2. Render Product Grid (Now supports MULTIPLE collections and LIMIT!)
          if (section.type === "product_grid" || section.type === "featured_products") {
            
            // Fallback to singular collection_id if collection_ids array is empty (for backwards compatibility)
            const colIds = section.collection_ids?.length > 0 
              ? section.collection_ids 
              : (section.collection_id ? [section.collection_id] : [])

            if (colIds.length > 0) {
              return (
                <div key={section.id} className="py-4 flex flex-col gap-4">
                  {colIds.map((cId: string) => {
                    const matchedCollection = collections?.find(c => c.id === cId)
                    if (matchedCollection) {
                      return (
                        <ProductRail 
                          key={cId} 
                          collection={matchedCollection} 
                          region={region} 
                          limit={section.limit || 8} // 🛠️ Pass the dynamic limit!
                        />
                      )
                    }
                    return null
                  })}
                </div>
              )
            }
          }

          return null
        })
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p>No dynamic sections found. Please add them in the Admin Dashboard.</p>
        </div>
      )}
    </>
  )
}
