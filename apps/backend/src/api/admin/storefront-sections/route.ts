// File: apps/backend/src/api/admin/storefront-sections/route.ts

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET: Fetch all sections, ordered by sequence!
export async function GET(req: MedusaRequest, res: MedusaResponse ) {
  const sectionService = req.scope.resolve("storefrontSectionModuleService")
  const sections = await sectionService.listStorefrontSections({}, { order: { sequence: "ASC" } })
  res.json({ sections })
}

// POST: Create OR Update a section
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const sectionService = req.scope.resolve("storefrontSectionModuleService")
  const body = req.body as any
  
  try {
    if (body.id) {
      // FIXED: This is the correct Medusa v2 syntax for updating!
      const updated = await sectionService.updateStorefrontSections(body)
      res.json({ section: updated })
    } else {
      // If no ID, we are CREATING a new one
      const existing = await sectionService.listStorefrontSections()
      const maxSeq = existing.length > 0 ? Math.max(...existing.map((s: any) => s.sequence || 0)) : -1
      body.sequence = maxSeq + 1

      const section = await sectionService.createStorefrontSections(body)
      res.json({ section })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save section" })
  }
}

// DELETE: Remove a section
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const sectionService = req.scope.resolve("storefrontSectionModuleService")
  const { id } = req.body as { id: string }
  
  try {
    await sectionService.deleteStorefrontSections(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete section" })
  }
}
