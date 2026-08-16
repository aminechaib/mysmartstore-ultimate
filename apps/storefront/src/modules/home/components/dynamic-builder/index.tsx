// File: apps/storefront/src/modules/home/components/dynamic-builder/index.tsx

import { HttpTypes } from "@medusajs/types"
import ProductRail from "../featured-products/product-rail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export default async function DynamicBuilder({
  region,
  collections
}: {
  region: HttpTypes.StoreRegion
  collections: HttpTypes.StoreCollection[]
} ) {
  let sections: any[] = []
  
  try {
    const res = await fetch(`${BACKEND_URL}/store/storefront-sections`, {
      headers: { "x-publishable-api-key": API_KEY },
      cache: "no-store" 
    })
    
    if (res.ok) {
      const data = await res.json()
      sections = data.sections || []
    }
  } catch (error) {
    console.error("Failed to fetch dynamic sections", error)
  }

  // --- DEBUG TRACKER START ---
  console.log("\n=== DYNAMIC BUILDER DEBUG ===")
  console.log(`Total Collections available in Storefront: ${collections.length}`)
  console.log(`Total Sections fetched from Database: ${sections.length}`)
  // --- DEBUG TRACKER END ---

  if (!sections.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Your Storefront is Empty!</h2>
        <p className="text-gray-500">Go to your Admin Dashboard -&gt; Page Builder to add your first section.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      {sections.map((section) => {
        const linkedCollection = collections.find(c => c.id === section.collection_id)
        
        // --- DEBUG TRACKER START ---
        console.log(`\nChecking Section: "${section.title}"`)
        console.log(`- Type: ${section.type}`)
        console.log(`- Saved Collection ID: ${section.collection_id}`)
        console.log(`- Did we find a match?: ${linkedCollection ? "YES (" + linkedCollection.title + ")" : "NO"}`)
        // --- DEBUG TRACKER END ---

        const showButton = section.show_button !== false 
        const buttonLink = section.button_link || "/store"

        if (section.type === "hero") {
          return (
            <div key={section.id} className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden mb-2">
              <div className="absolute inset-0 z-0">
                <img src={section.image_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"} alt={section.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
              </div>
              <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in-up">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">{section.title}</h2>
                {showButton && (
                  <LocalizedClientLink href={buttonLink}>
                    <button className="px-10 py-4 bg-white text-black text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3 )]">
                      {section.button_text}
                    </button>
                  </LocalizedClientLink>
                )}
              </div>
            </div>
          )
        }

        if (section.type === "banner" || section.type === "campaign") {
          return (
            <div key={section.id} className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden my-8">
              <div className="absolute inset-0 z-0">
                <img src={section.image_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"} alt={section.title} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-black/40" />
              </div>
              <div className="relative z-10 text-center px-4 animate-fade-in-up">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">{section.title}</h2>
                {showButton && (
                  <LocalizedClientLink href={buttonLink}>
                    <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
                      {section.button_text}
                    </button>
                  </LocalizedClientLink>
                 )}
              </div>
            </div>
          )
        }

        if (section.type === "split_promo" || section.type === "promotion") {
          return (
            <div key={section.id} className="w-full max-w-7xl mx-auto px-4 py-12">
              <div className="flex flex-col md:flex-row items-center gap-0 bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="w-full md:w-1/2 h-[300px] md:h-[500px]">
                  <img src={section.image_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"} alt={section.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-16 text-center md:text-left animate-fade-in-up">
                  <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 tracking-tight">{section.title}</h2>
                  {showButton && (
                    <LocalizedClientLink href={buttonLink}>
                      <button className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
                        {section.button_text}
                      </button>
                    </LocalizedClientLink>
                   )}
                </div>
              </div>
            </div>
          )
        }

        if ((section.type === "product_grid" || section.type === "new_arrivals") && linkedCollection) {
          return (
            <div key={section.id} className="w-full py-4">
              <ProductRail collection={linkedCollection} region={region} />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
