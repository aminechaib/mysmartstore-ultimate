// File: apps/storefront/src/lib/marketing-config.ts

// 1. 🛠️ TYPE THE HANDLES OF THE COLLECTIONS YOU WANT IN THE NAVBAR HERE:
export const NAVBAR_COLLECTIONS = ["hot", "new", "electronics"]

// 2. MARKETING BADGES CONFIG
export const MARKETING_BADGES: Record<string, {
  text: string;
  bgClass: string;
  cardStyle: string;
}> = {
  "hot": {
    text: "-20% OFF",
    bgClass: "bg-gradient-to-r from-red-500 to-orange-500",
    cardStyle: "ring-1 ring-red-500/20 shadow-[0_8px_30px_rgba(239,68,68,0.15)] hover:shadow-[0_8px_40px_rgba(239,68,68,0.3)] hover:-translate-y-2"
  },
  "new": {
    text: "✨ JUST DROPPED",
    bgClass: "bg-gradient-to-r from-blue-600 to-cyan-500",
    cardStyle: "ring-1 ring-blue-500/20 shadow-[0_8px_30px_rgba(59,130,246,0.15)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.3)] hover:-translate-y-2"
  },
}

export const DEFAULT_CARD_STYLE = "hover:shadow-xl hover:-translate-y-1"
