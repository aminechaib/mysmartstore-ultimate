// File: apps/backend/src/api/admin/search-logs/route.ts
// --- PART 1 ---

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse ) {
  // 1. Get our custom database service
  const searchLogService = req.scope.resolve("searchLogModuleService")
  
  // 2. Fetch all the saved searches from the database
  // We sort them by "created_at: DESC" so the newest searches show up at the top!
  const logs = await searchLogService.listSearchLogs({}, {
    order: { created_at: "DESC" }
  })

  // 3. Send the data securely to the admin dashboard
  res.json({ logs })
}

// End of Part 1
