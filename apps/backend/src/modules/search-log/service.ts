// File: apps/backend/src/modules/search-log/service.ts
// --- PART 2 ---

import { MedusaService } from "@medusajs/framework/utils"
import { SearchLog } from "./models/search-log"

class SearchLogService extends MedusaService({
  SearchLog,
}) {}

export default SearchLogService

// End of Part 2
