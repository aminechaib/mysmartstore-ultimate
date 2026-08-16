// File: apps/backend/src/api/admin/hero-banner/route.ts
// --- PART 1 ---

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET: Fetch the current banner data
export async function GET(req: MedusaRequest, res: MedusaResponse ) {
  const heroBannerService = req.scope.resolve("heroBannerModuleService")
  let banners = await heroBannerService.listHeroBanners()

  // If no banner exists yet, create the default one
  if (banners.length === 0) {
    const defaultBanner = await heroBannerService.createHeroBanners({
      badge_text: "✨ Exclusive Summer Event",
      headline_top: "Discover Your",
      headline_bottom: "Perfect Style",
      description: "Experience the new standard of modern fashion. Handpicked collections tailored to your unique taste.",
      image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
    } )
    banners = [defaultBanner]
  }

  res.json({ banner: banners[0] })
}

// POST: Save the updated banner data
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const heroBannerService = req.scope.resolve("heroBannerModuleService")
  const { id, badge_text, headline_top, headline_bottom, description, image_url } = req.body as any

  const updated = await heroBannerService.updateHeroBanners({
    id,
    badge_text,
    headline_top,
    headline_bottom,
    description,
    image_url
  })

  res.json({ banner: updated })
}

// End of Part 1
