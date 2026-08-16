// File: apps/storefront/src/modules/home/components/bento-grid/index.tsx

"use client"

import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// You can easily change these images and texts later!
const bentoItems = [
  {
    title: "Summer Collection",
    subtitle: "Up to 50% Off",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop",
    href: "/store",
    className: "md:col-span-2 md:row-span-2 min-h-[400px]", // Massive block
  },
  {
    title: "Tech & Gadgets",
    subtitle: "New Arrivals",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop",
    href: "/store",
    className: "md:col-span-2 md:row-span-1 min-h-[200px]", // Wide block
  },
  {
    title: "Accessories",
    subtitle: "Must Haves",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop",
    href: "/store",
    className: "md:col-span-1 md:row-span-1 min-h-[200px]", // Small square
  },
  {
    title: "Flash Deals",
    subtitle: "Ending Soon",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=1000&auto=format&fit=crop",
    href: "/store",
    className: "md:col-span-1 md:row-span-1 min-h-[200px]", // Small square
  }
]

export default function BentoGrid( ) {
  return (
    <div className="w-full bg-white py-12">
      <div className="content-container mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
          <LocalizedClientLink href="/store" className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">
            View All →
          </LocalizedClientLink>
        </div>

        {/* The Bento Grid Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]"
        >
          {bentoItems.map((item, index) => (
            <LocalizedClientLink
              key={index}
              href={item.href}
              className={`group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 ${item.className}`}
            >
              {/* Background Image with Hover Zoom */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              
              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                <p className="text-white/80 text-xs md:text-sm font-bold tracking-widest uppercase mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {item.subtitle}
                </p>
                <h3 className="text-white text-xl md:text-3xl font-bold transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {item.title}
                </h3>
              </div>
            </LocalizedClientLink>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
