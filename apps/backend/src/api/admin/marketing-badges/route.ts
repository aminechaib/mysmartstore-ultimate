// File: apps/backend/src/api/admin/marketing-badges/route.ts

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MARKETING_MODULE } from "../../../modules/marketing"

export async function GET(req: MedusaRequest, res: MedusaResponse ) {
  try {
    const marketingModuleService = req.scope.resolve(MARKETING_MODULE)
    const badges = await marketingModuleService.listMarketingBadges()
    res.json({ badges })
  } catch (error) {
    res.status(500).json({ badges: [] })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const marketingModuleService = req.scope.resolve(MARKETING_MODULE)
    const { collection_handle, text, bg_class, card_style } = req.body as any

    // Check if a badge for this collection already exists
    const existing = await marketingModuleService.listMarketingBadges({ 
      collection_handle 
    })
    
    if (existing.length > 0) {
      // Update existing badge
      const updated = await marketingModuleService.updateMarketingBadges({
        id: existing[0].id,
        text,
        bg_class,
        card_style
      })
      res.json({ badge: updated[0] })
    } else {
      // Create new badge
      const created = await marketingModuleService.createMarketingBadges({
        collection_handle,
        text,
        bg_class,
        card_style
      })
      res.json({ badge: created })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save badge" })
  }
}
