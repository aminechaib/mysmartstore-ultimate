// File: apps/backend/src/modules/search-log/service.ts
// --- PART 2 ---

import { MedusaService } from "@medusajs/framework/utils"
import { SearchLog } from "./search-log"

// This automatically generates all the standard database functions 
// (like create, update, delete, and list) for our new SearchLog table!
class SearchLogService extends MedusaService({
  SearchLog,
}) {}

export default SearchLogService

// End of Part 2
