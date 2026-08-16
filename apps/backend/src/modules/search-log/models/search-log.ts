// File: apps/backend/src/modules/search-log/models/search-log.ts
// --- PART 1 ---
import { model } from "@medusajs/framework/utils"

export const SearchLog = model.define("search_log", {
  id: model.id().primaryKey(),
  query: model.text(),
  ai_response: model.text().nullable(),
  search_term: model.text().nullable(),       // NEW: Stores the clean English term
  results_count: model.number().default(0),   // NEW: Stores how many products we found
})

// End of Part 1
