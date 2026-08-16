// apps/storefront/src/modules/products/components/product-preview/quick-add-button.tsx
"use client"

import { useTransition, useState, useEffect } from "react"
import { addToCart } from "@lib/data/cart"
import { useParams } from "next/navigation"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"

export default function QuickAddButton({ 
  variantId, 
  title 
}: { 
  variantId: string, 
  title: string 
}) {
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [mounted, setMounted] = useState(false)
  const countryCode = useParams().countryCode as string

  // Ensure portal only renders on the client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Automatically hide the toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    startTransition(async () => {
      try {
        await addToCart({
          variantId,
          quantity: 1,
          countryCode,
        })
        setToast({ message: `${title} added to cart!`, type: "success" })
      } catch (error: any) {
        console.error(error)
        setToast({ message: "Failed to add to cart. Out of stock?", type: "error" })
      }
    })
  }

  return (
    <>
      <button 
        onClick={handleAddToCart}
        disabled={isPending}
        className="w-full py-3 bg-black/90 backdrop-blur-sm text-white text-center text-sm font-bold rounded-full shadow-lg hover:bg-black transition-colors disabled:opacity-70"
      >
        {isPending ? "Adding..." : "+ Quick Add"}
      </button>

      {/* 🛠️ BEAUTIFUL ANIMATED TOAST */}
      {mounted && createPortal(
        <AnimatePresence>
          {toast && (
                       <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl bg-white border border-gray-100"
            >

              {toast.type === "success" ? (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <span className="font-bold text-black text-sm whitespace-nowrap">
                {toast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
