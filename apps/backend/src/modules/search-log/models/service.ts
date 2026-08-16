import { MedusaService } from "@medusajs/framework/utils"
import { SearchLog } from "./models/search-log"

class SearchLogModuleService extends MedusaService({
  SearchLog,
}) { }

export default SearchLogModuleService
