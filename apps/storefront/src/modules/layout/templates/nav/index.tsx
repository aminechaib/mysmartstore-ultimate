// File: apps/storefront/src/modules/layout/templates/nav/index.tsx

import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

// IMPORT YOUR NAVBAR CONFIG
import { NAVBAR_COLLECTIONS } from "@lib/marketing-config"

export default async function Nav() {
  const regions = await listRegions().then((regions) => regions)
  
  // Fetch all collections
  const { collections } = await listCollections({
    fields: "id, handle, title",
    limit: 100,
  })

  // FILTER COLLECTIONS: Only keep the ones you typed in the config file!
  const navCollections = collections?.filter(c => NAVBAR_COLLECTIONS.includes(c.handle)) || []

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      
      {/* 1. PREMIUM ANNOUNCEMENT BAR */}
      <div className="bg-black text-white text-xs md:text-sm font-medium text-center py-2 tracking-widest uppercase">
        ✨ Free Express Shipping on Orders Over $150 ✨
      </div>

      {/* 2. GLASSMORPHISM NAVBAR */}
      <header className="relative h-20 mx-auto border-b border-gray-100 bg-white/80 backdrop-blur-lg transition-colors duration-300">
        <nav className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between w-full h-full">
          
          {/* Left Side: Mobile Menu & Desktop Links */}
          <div className="flex-1 flex items-center gap-x-6">
            <div className="block md:hidden">
              <SideMenu regions={regions} />
            </div>
            
            <div className="hidden md:flex items-center gap-x-8 text-sm font-bold text-gray-600 uppercase tracking-wider">
              <LocalizedClientLink href="/store" className="hover:text-black transition-colors">
                Store
              </LocalizedClientLink>
              
              {/* DYNAMIC COLLECTIONS LOOP (Controlled by Config) */}
              {navCollections.map((c) => (
                <LocalizedClientLink 
                  key={c.id} 
                  href={`/collections/${c.handle}`} 
                  className={`transition-colors flex items-center gap-2 ${c.handle === 'hot' ? 'hover:text-red-600' : 'hover:text-black'}`}
                >
                  {c.title}
                  {/* Automatically add the red dot if the collection is "hot" */}
                  {c.handle === 'hot' && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          {/* Center: Premium Two-Tone Logo */}
          <div className="flex-1 flex items-center justify-center">
            <LocalizedClientLink
              href="/"
              className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-black hover:opacity-80 transition-opacity"
            >
              Smart<span className="text-gray-400">Store</span>
            </LocalizedClientLink>
          </div>

          {/* Right Side: Account & Cart */}
          <div className="flex-1 flex items-center justify-end gap-x-6 text-sm font-bold text-gray-600 uppercase tracking-wider">
            <div className="hidden md:block">
              <LocalizedClientLink href="/account" className="hover:text-black transition-colors">
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink href="/cart" className="hover:text-black transition-colors">
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
