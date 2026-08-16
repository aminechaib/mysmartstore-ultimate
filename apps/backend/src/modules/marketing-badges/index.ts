import { Module } from "@medusajs/framework/utils"
import MarketingModuleService from "./service"

export default Module("marketingModuleService", {
  service: MarketingModuleService,
})
