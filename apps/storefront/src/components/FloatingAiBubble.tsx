// File: apps/storefront/src/components/FloatingAiBubble.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

export default function FloatingAiBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAiResponse("");
    setProducts([]);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.aiResponse);
        setProducts(data.products || []);
      } else {
        setAiResponse("Sorry, I had trouble understanding that.");
      }
    } catch (error) {
      setAiResponse("An error occurred while searching.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold tracking-wide">✨ AI Shopping Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-xl">
                &times;
              </button>
            </div>

            {/* Chat & Results Area */}
            <div className="p-6 max-h-[400px] overflow-y-auto bg-gray-50 flex flex-col gap-4">
              {!aiResponse && !isLoading && (
                <p className="text-gray-500 text-sm text-center mt-4">
                  Hi! What are you looking for today? I can find it for you instantly.
                </p>
              )}
              
              {isLoading && <p className="text-gray-500 text-sm animate-pulse">Thinking...</p>}
              
              {aiResponse && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-sm text-gray-800">
                  {aiResponse}
                </div>
              )}

              {products.length > 0 && (
                <div className="flex flex-col gap-3 mt-2">
                  <p className="text-xs font-bold text-gray-400 uppercase">I found these:</p>
                  {products.map((p) => (
                    <LocalizedClientLink href={`/products/${p.handle}`} key={p.id} onClick={() => setIsOpen(false)}>
                      <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-100 hover:border-black transition-colors">
                        <img src={p.thumbnail} alt={p.title} className="w-12 h-12 object-cover rounded-md" />
                        <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
                      </div>
                    </LocalizedClientLink>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSearch} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., Black watch..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 disabled:bg-gray-400"
              >
                Ask
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 border-2 border-white/20"
      >
        {isOpen ? <span className="text-2xl">&times;</span> : <span className="text-2xl">✨</span>}
      </button>
    </div>
  );
}
