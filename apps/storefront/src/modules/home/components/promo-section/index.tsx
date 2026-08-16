// File: apps/storefront/src/modules/home/components/promo-section/index.tsx

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function PromoSection() {
  return (
    <div className="w-full bg-white py-24">
      <div className="content-container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-3xl shadow-2xl group">
          
          {/* Left Side: Image with subtle zoom on hover */}
          <div className="relative h-[400px] md:h-auto overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
              alt="Special Event" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Right Side: Dark Mode Event Text */}
          <div className="bg-black text-white p-12 md:p-20 flex flex-col justify-center">
            <span className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-4">
              Limited Time Event
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              The Midnight   
 Collection
            </h2>
            <p className="text-gray-300 mb-10 text-lg font-light leading-relaxed">
              Discover our most exclusive pieces reserved for this special event. Premium materials, unparalleled craftsmanship, and AI-curated perfection.
            </p>
            <div>
              <LocalizedClientLink href="/store">
                <button className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
                  Explore the Event
                </button>
              </LocalizedClientLink>
            </div>
          </div>

        </div>
      </div>
    </div>
   )
}
