// File: apps/backend/src/modules/search-log/index.ts
// --- PART 3 (Code) ---

import { Module } from "@medusajs/framework/utils"
import SearchLogService from "./service"

// This packages our model and service together into a complete Medusa Module
export default Module("searchLogModuleService", {
  service: SearchLogService,
})

// --- END OF CODE ---
