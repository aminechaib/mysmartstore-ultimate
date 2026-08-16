import { MedusaService } from "@medusajs/framework/utils"
import { StorefrontSection } from "./models/storefront-section"

class StorefrontSectionService extends MedusaService({
  StorefrontSection,
}) {}

export default StorefrontSectionService
