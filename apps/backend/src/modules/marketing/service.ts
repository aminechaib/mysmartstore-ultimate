import { MedusaService } from "@medusajs/framework/utils"
import { MarketingBadge } from "./models/marketing-badge"

class MarketingModuleService extends MedusaService({
  MarketingBadge,
}) {}

export default MarketingModuleService
