import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse ) {
  // We add 'as any' to resolve to avoid strict type errors during the production build
  const searchLogService = req.scope.resolve("searchLogModuleService" as any)

  const { query, ai_response, search_term, results_count } = req.body as any

  try {
    // We use the service directly to save the log
    const log = await (searchLogService as any).createSearchLogs({
      query: query,
      ai_response: ai_response,
      search_term: search_term,
      results_count: results_count,
    })

    res.status(200).json({ success: true, log: log })
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to save search log" })
  }
}
