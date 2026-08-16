import { Module } from "@medusajs/framework/utils"
import StorefrontSectionModuleService from "./service"

export default Module("storefrontSectionModuleService", {
  service: StorefrontSectionModuleService,
})
