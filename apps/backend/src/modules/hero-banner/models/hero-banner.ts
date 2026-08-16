// File: apps/backend/src/modules/hero-banner/models/hero-banner.ts
// --- PART 1 ---

import { model } from "@medusajs/framework/utils"

// This defines a new table to store your dynamic Hero Banner content
export const HeroBanner = model.define("hero_banner", {
  id: model.id().primaryKey(),
  badge_text: model.text().default("✨ Exclusive Summer Event"),
  headline_top: model.text().default("Discover Your"),
  headline_bottom: model.text().default("Perfect Style"),
  description: model.text().default("Experience the new standard of modern fashion. Handpicked collections tailored to your unique taste."),
  image_url: model.text().default("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" ),
})

// End of Part 1

