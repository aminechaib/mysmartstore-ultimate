// File: apps/storefront/src/modules/products/templates/index.tsx
// --- PART 1 OF 3 (WITH NEW SLIDER) ---

import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import ProductSlider from "@modules/products/components/product-slider" // 🛠️ IMPORTED SLIDER

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default function ProductTemplate({
  product,
  region,
  countryCode,
}: ProductTemplateProps) {
  if (!product || !product.id) {
    return notFound()
  }

  const warranty = product.metadata?.warranty as string || "Standard 1-Year Warranty"

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-24">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        
        {/* LEFT COLUMN: The Beautiful New Slider */}
        <div className="w-full lg:w-2/3">
          <ProductSlider images={product.images || []} title={product.title} />
        </div>


        {/* --- PART 2 OF 3 --- */}
        {/* RIGHT COLUMN: Sticky Product Info */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-32 flex flex-col gap-8">
            
            {/* Product Header */}
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900">
                {product.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* 🛠️ Custom Warranty Box (From our Quick Add API!) */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">Included Protection</span>
                <span className="text-gray-600 text-sm mt-1">{warranty}</span>
              </div>
            </div>
            {/* --- PART 3 OF 3 --- */}
            {/* Price & Add to Cart (Medusa's Interactive Component) */}
            <div className="mt-4">
              <Suspense fallback={<div className="h-24 bg-gray-100 animate-pulse rounded-2xl" />}>
                <ProductActions product={product} region={region} />
              </Suspense>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  )
}
