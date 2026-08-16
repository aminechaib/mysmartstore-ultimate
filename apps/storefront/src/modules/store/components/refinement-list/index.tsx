// File: apps/storefront/src/modules/store/components/refinement-list/index.tsx

"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

type SortOptions = "price_asc" | "price_desc" | "created_at"

export default function RefinementList({ sortBy }: { sortBy: SortOptions }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const sortOptions = [
    { value: "created_at", label: "✨ New Arrivals" },
    { value: "price_asc", label: "💸 Price: Low to High" },
    { value: "price_desc", label: "💎 Price: High to Low" },
  ]

  return (
    <div className="flex flex-col gap-y-10">
      {/* Modern Sort Buttons */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
          Sort Collection
        </h3>
        <div className="flex flex-col gap-y-3">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setQueryParams("sortBy", option.value)}
              className={`text-left px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                sortBy === option.value
                  ? "bg-black text-white shadow-lg scale-[1.02]"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-[1.02]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marketing / Trending Tags */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
          Trending Searches
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Summer Edit", "Minimalist", "Luxury", "Everyday"].map((tag) => (
            <span 
              key={tag} 
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-full cursor-pointer hover:border-black hover:text-black hover:shadow-sm transition-all duration-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
