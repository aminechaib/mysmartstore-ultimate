"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function ProductSlider({ images, title }: { images: any[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-400 border border-gray-100">
        No Image Available
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* 1. MASSIVE MAIN IMAGE (Softer borders, Apple-style radius) */}
      <div className="relative w-full bg-gray-50/50 rounded-[2rem] overflow-hidden border border-gray-200/60 aspect-square md:aspect-[4/3] group shadow-sm">
        <AnimatePresence mode="wait">
          <motion.img
          
            key={currentIndex}
            src={images[currentIndex].url}
            alt={`${title} - Image ${currentIndex + 1}`}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
          />
        </AnimatePresence>

        {/* 2. PREMIUM 3D BUTTON (Refined Glassmorphism & Placement) */}
        <button className="absolute bottom-6 right-6 bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-gray-900 font-medium text-sm py-3 px-6 rounded-full flex items-center gap-2 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 z-20 group/3d">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover/3d:animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          View in 3D
        </button>
      </div>

      {/* 3. SLEEK THUMBNAIL ROW (Subtle scaling instead of harsh borders ) */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden snap-center transition-all duration-300 ease-out bg-gray-50 ${
                index === currentIndex 
                  ? "border-2 border-gray-900 scale-100 opacity-100 shadow-md" 
                  : "border border-gray-200 scale-95 opacity-60 hover:opacity-100 hover:scale-100 hover:border-gray-300"
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
      
    </div>
  )
}
