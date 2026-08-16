// File: apps/storefront/src/modules/home/components/hero/index.tsx

"use client" 

import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  return (
    <div className="relative min-h-[85vh] w-full bg-black flex items-center justify-center overflow-hidden">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Latest Collection"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
      </div>

      {/* Animated Content Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-5xl mt-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Promo / Event Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs md:text-sm font-medium tracking-widest uppercase backdrop-blur-md">
            ✨ Exclusive Summer Event
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight"
        >
          Discover Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
            Perfect Style
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-light leading-relaxed"
        >
          Experience the new standard of modern fashion. Handpicked collections tailored to your unique taste, powered by intelligent search.
        </motion.p>

        {/* Call to Action Button */}
        <motion.div variants={itemVariants}>
          <LocalizedClientLink href="/store">
            <button
              className="px-10 py-4 text-lg font-bold rounded-full hover:scale-105 transition-transform duration-300 bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.3 )]"
            >
              Explore All Products
            </button>
          </LocalizedClientLink>
        </motion.div>
      </motion.div>
    </div>
  )
}
