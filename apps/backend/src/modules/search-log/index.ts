// File: apps/backend/src/modules/search-log/index.ts
// --- PART 3 (Code) ---

// File: apps/backend/src/modules/search-log/index.ts
import { Module } from "@medusajs/framework/utils"
import SearchLogService from "./service"

export default Module("searchLogModuleService", {
  service: SearchLogService,
})

// --- END OF CODE ---
