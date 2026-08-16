import { model } from "@medusajs/framework/utils"

export const MarketingBadge = model.define("marketing_badge", {
  id: model.id().primaryKey(),
  collection_handle: model.text().unique(), // e.g., "hot" or "new"
  text: model.text(),                       // e.g., "✨ JUST DROPPED"
  bg_class: model.text(),                   // e.g., "bg-gradient-to-r from-blue-600 to-cyan-500"
  card_style: model.text(),                 // e.g., "ring-1 ring-blue-500/20 shadow-lg"
})
