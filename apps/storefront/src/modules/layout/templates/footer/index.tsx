// File: apps/storefront/src/modules/layout/templates/footer/index.tsx

import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  // Fetch your actual collections from the Medusa backend
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  return (
    <footer className="bg-black text-white pt-16 pb-8 w-full mt-20">
      <div className="content-container flex flex-col gap-y-12 px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand & Newsletter */}
          <div className="flex flex-col gap-y-4 md:col-span-2">
            <LocalizedClientLink href="/" className="text-2xl font-bold uppercase tracking-widest text-white hover:text-gray-300 transition-colors">
              SmartStore
            </LocalizedClientLink>
            <p className="text-gray-400 max-w-sm font-light leading-relaxed">
              Experience the new standard of modern fashion. Join our newsletter for exclusive drops, events, and AI-curated styles.
            </p>
            <div className="flex mt-4">
              <input 
                type="email" 
                placeholder="Email address" 
                className="px-4 py-3 bg-gray-900 text-white rounded-l-md border border-gray-800 focus:outline-none focus:border-gray-500 w-full max-w-xs transition-colors" 
              />
              <button className="bg-white text-black px-6 py-3 rounded-r-md font-semibold hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Shop Links (Dynamic) */}
          <div className="flex flex-col gap-y-4">
            <h3 className="font-semibold tracking-wider uppercase text-sm text-gray-200">Shop</h3>
            <ul className="flex flex-col gap-y-3 text-gray-400 font-light">
              {collections?.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink href={`/collections/${c.handle}`} className="hover:text-white transition-colors">
                    {c.title}
                  </LocalizedClientLink>
                </li>
              ))}
              <li>
                <LocalizedClientLink href="/store" className="hover:text-white transition-colors">
                  All Products
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-y-4">
            <h3 className="font-semibold tracking-wider uppercase text-sm text-gray-200">Support</h3>
            <ul className="flex flex-col gap-y-3 text-gray-400 font-light">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800 text-gray-500 text-sm font-light">
          <p>© {new Date().getFullYear()} SmartStore. All rights reserved.</p>
          <div className="flex gap-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
