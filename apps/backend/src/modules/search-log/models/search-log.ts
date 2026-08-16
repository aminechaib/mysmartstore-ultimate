import { model } from "@medusajs/framework/utils"

export const SearchLog = model.define("search_log", {
  id: model.id().primaryKey(),
  query: model.text(),
  results_count: model.number().default(0),
  ai_response: model.text().nullable(),
  search_term: model.text().nullable(),
})
