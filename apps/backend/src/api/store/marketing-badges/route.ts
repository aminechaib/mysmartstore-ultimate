// File: apps/backend/src/api/store/marketing-badges/route.ts

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse ) {
  try {
    // 🛠️ FIX: Use the exact string name instead of the broken import!
    const marketingModuleService = req.scope.resolve("marketingModuleService")
    const badges = await marketingModuleService.listMarketingBadges()
    
    res.json({ badges })
  } catch (error: any) {
    console.error("Storefront Badge Error:", error.message)
    res.status(500).json({ badges: [] })
  }
}
