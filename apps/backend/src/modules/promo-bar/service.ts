import { MedusaService } from "@medusajs/framework/utils"
import { PromoBar } from "./models/promo-bar"

class PromoBarService extends MedusaService({
  PromoBar,
}) {}

export default PromoBarService
