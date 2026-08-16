// File: apps/backend/src/modules/hero-banner/index.ts
// --- PART 3 (Code) ---

import { Module } from "@medusajs/framework/utils"
import HeroBannerService from "./service"

// This packages our model and service together into a complete Medusa Module
export default Module("heroBannerModuleService", {
  service: HeroBannerService,
})

// --- END OF CODE ---
