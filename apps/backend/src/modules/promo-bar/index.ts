import { Module } from "@medusajs/framework/utils"
import PromoBarService from "./service"

export default Module("promoBarModuleService", {
  service: PromoBarService,
})
