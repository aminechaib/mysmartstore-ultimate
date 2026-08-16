// File: apps/backend/src/modules/hero-banner/service.ts
// --- PART 2 ---

import { MedusaService } from "@medusajs/framework/utils"
import { HeroBanner } from "./models/hero-banner"

// This automatically generates the database functions (create, update, list) for our Hero Banner
class HeroBannerService extends MedusaService({
  HeroBanner,
}) {}

export default HeroBannerService

// End of Part 2