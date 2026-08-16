// File: apps/backend/src/api/store/storefront-sections/route.ts

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse ) {
  const sectionService = req.scope.resolve("storefrontSectionModuleService")
  
  // Fetch only active sections, ordered by sequence (1, 2, 3...)
  const sections = await sectionService.listStorefrontSections(
    { is_active: true },
    { order: { sequence: "ASC" } }
  )
  
  res.json({ sections })
}
