// File: apps/storefront/src/modules/layout/components/cart-dropdown/index.tsx
// --- PART 1 OF 3 ---
"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom" // 🛠️ NEW: Import React Portal
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { AnimatePresence, motion } from "framer-motion"
import { convertToLocale } from "@lib/util/money"

// Premium SVG Icons
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
 )
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
 )

const CartDropdown = ({
  cart,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [cartOpen, setCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false) // 🛠️ NEW: Track if component is mounted
  const pathname = usePathname()

  // Ensure portal only renders on the client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Automatically close the cart drawer when the user navigates to a new page
  useEffect(() => {
    setCartOpen(false)
  }, [pathname])

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <>
      {/* 1. CART TRIGGER BUTTON (In the Navbar) */}
      <button 
        onClick={() => setCartOpen(true)}
        className="hover:text-black transition-colors flex items-center gap-2 font-bold"
      >
        <CartIcon />
        <span>Cart ({totalItems})</span>
      </button>

      {/* 2. SLIDE-OUT DRAWER (Teleported to the body!) */}
      {mounted && createPortal(
        <AnimatePresence>
          {cartOpen && (
            <>
              {/* Blurred Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCartOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
              />

              {/* The Drawer Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-white z-[10000] shadow-2xl flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Your Cart</h2>
                  <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <CloseIcon />
                  </button>
                </div>
                {/* --- PART 2 OF 3 --- */}
                {/* Cart Items Area */}
                <div className="flex-1 overflow-y-auto p-6">
                  {cart && cart.items?.length ? (
                    <div className="flex flex-col gap-y-8">
                      {cart.items
                        .sort((a, b) => {
                          return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                        })
                        .map((item) => (
                          <div key={item.id} className="flex gap-x-4">
                            {/* Product Image */}
                            <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                              <Thumbnail thumbnail={item.thumbnail} size="full" />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex flex-col justify-between flex-1 py-1">
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    className="font-bold text-base line-clamp-2 hover:text-blue-600 transition-colors leading-tight"
                                    onClick={() => setCartOpen(false)}
                                  >
                                    {item.product_title}
                                  </LocalizedClientLink>
                                  {/* Delete Button */}
                                  <div className="shrink-0">
                                    <DeleteButton id={item.id} data-testid="cart-item-remove-button" />
                                  </div>
                                </div>
                                
                                <div className="mt-1">
                                  <LineItemOptions variant={item.variant} data-testid="cart-item-variant" />
                                </div>
                                <div className="text-sm font-medium text-gray-500 mt-2">
                                  Qty: {item.quantity}
                                </div>
                              </div>
                              
                              {/* Price */}
                              <div className="flex justify-end items-end mt-2 font-bold text-lg">
                                <LineItemPrice item={item} style="tight" />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    /* Empty Cart State */
                    <div className="flex flex-col items-center justify-center h-full text-center gap-y-4">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-2">
                        <CartIcon />
                      </div>
                      <h3 className="text-2xl font-bold text-black tracking-tight">Your cart is empty</h3>
                      <p className="text-gray-500">Looks like you haven't added anything yet.</p>
                      <LocalizedClientLink href="/store" onClick={() => setCartOpen(false)}>
                        <button className="mt-4 px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
                          Explore Products
                        </button>
                      </LocalizedClientLink>
                    </div>
                  )}
                </div>
                {/* --- PART 3 OF 3 --- */}
                {/* Footer / Checkout Area */}
                {cart && cart.items?.length ? (
                  <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="text-2xl font-black text-black">
                        {convertToLocale({
                          amount: cart.subtotal ?? 0,
                          currency_code: cart.currency_code,
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 text-center">
                      Taxes and shipping calculated at checkout.
                    </p>
                    <LocalizedClientLink href="/checkout" onClick={() => setCartOpen(false)}>
                      <button className="w-full py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 uppercase tracking-widest">
                        Go to Checkout
                      </button>
                    </LocalizedClientLink>
                  </div>
                ) : null}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body // 🛠️ This tells the Portal to attach directly to the full page body!
      )}
    </>
  )
}

export default CartDropdown
