import { Module } from "@medusajs/framework/utils"
import StorefrontSectionService from "./service"

export default Module("storefrontSectionModuleService", {
  service: StorefrontSectionService,
})
