// File: apps/storefront/src/modules/store/components/floating-filters/index.tsx

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import RefinementList from "../refinement-list"

export default function FloatingFilters({ sortBy }: { sortBy: any }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* The Floating Filter Bubble (Bottom Left) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[100] w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 border border-gray-200"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </button>

      {/* The Slide-out Filter Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-[101] backdrop-blur-sm"
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[300px] sm:w-[350px] bg-white z-[102] shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold tracking-tight">Filters</h2>
                <button onClick={() => setIsOpen(false)} className="text-3xl text-gray-400 hover:text-black transition-colors">
                  &times;
                </button>
              </div>
              
              {/* Reusing our beautiful pill filters here! */}
              <RefinementList sortBy={sortBy} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
