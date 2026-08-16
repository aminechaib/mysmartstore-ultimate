// File: apps/backend/src/api/admin/marketing-badges/[id]/route.ts

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MARKETING_MODULE } from "../../../../modules/marketing"

export async function DELETE(req: MedusaRequest, res: MedusaResponse ) {
  const marketingModuleService = req.scope.resolve(MARKETING_MODULE)
  const { id } = req.params

  // Delete the badge from the database
  await marketingModuleService.deleteMarketingBadges(id)

  res.json({ success: true })
}