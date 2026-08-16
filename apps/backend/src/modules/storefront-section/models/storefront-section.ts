// File: apps/backend/src/modules/storefront-section/models/storefront-section.ts

import { model } from "@medusajs/framework/utils"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"


export async function POST(req: MedusaRequest, res: MedusaResponse ) {
  const service = req.scope.resolve("storefrontSectionModuleService")
  
  // 🛠️ Make sure collection_ids and limit are extracted from req.body!
  const { 
    title, type, image_url, show_button, button_text, button_link, 
    collection_id, collection_ids, limit 
  } = req.body as any

  const created = await service.createStorefrontSections({
    title,
    type,
    image_url,
    show_button,
    button_text,
    button_link,
    collection_id,
    collection_ids, // NEW
    limit           // NEW
  })

  res.json({ storefront_section: created })
}
export const StorefrontSection = model.define("storefront_section", {
  id: model.id().primaryKey(),
  title: model.text(),
  type: model.text(), 
  
  // Keep the old one just so we don't break existing data
  collection_id: model.text().nullable(), 
  
  // 🛠️ NEW: Array of collections and a limit!
  collection_ids: model.json().nullable(), // Stores ["id_1", "id_2"]
  limit: model.number().default(8),        // Default to 8 products

  image_url: model.text().nullable(),
  show_button: model.boolean().default(true),
  button_text: model.text().default("Shop Now"),
  button_link: model.text().default("/store"),
  is_active: model.boolean().default(true),
  sequence: model.number().default(0), 
  animation: model.text().default("fade-up"), 
})
