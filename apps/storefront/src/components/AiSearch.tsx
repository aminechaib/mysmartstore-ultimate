// File: apps/storefront/src/components/AiSearch.tsx

"use client";

import { useState } from "react";
import Link from "next/link";

export default function AiSearch() {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [products, setProducts] = useState<any[]>([]); // <-- New state for products
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAiResponse("");
    setProducts([]); // Clear old products

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.success) {
        setAiResponse(data.aiResponse);
        setProducts(data.products || []); // Save the products!
      } else {
        setAiResponse("Sorry, I had trouble understanding that. Please try again.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setAiResponse("An error occurred while searching.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="E.g., I need a dark, minimalist outfit under $150..."
          className="w-full px-6 py-4 text-gray-800 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 px-6 py-2 text-white bg-black rounded-full hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? "Thinking..." : "Search"}
        </button>
      </form>

      {/* Display the AI Response */}
      {aiResponse && (
        <div className="mt-6 p-6 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            AI Assistant
          </h3>
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {aiResponse}
          </p>
        </div>
      )}

      {/* Display the Products Grid */}
      {products.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Recommended for you:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link href={`/products/${product.handle}`} key={product.id} className="group">
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {product.thumbnail ? (
                    <img src={product.thumbnail} alt={product.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="p-4 bg-white">
                    <h4 className="font-semibold text-gray-900 truncate">{product.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
