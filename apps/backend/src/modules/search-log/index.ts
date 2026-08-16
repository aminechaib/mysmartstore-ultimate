// File: apps/backend/src/modules/search-log/index.ts

import { Module } from "@medusajs/framework/utils"
import SearchLogModuleService from "./service"

export default Module("searchLogModuleService", {
  service: SearchLogModuleService,
})
