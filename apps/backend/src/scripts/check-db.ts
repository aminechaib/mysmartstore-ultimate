// File: apps/backend/src/scripts/check-db.ts

import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkDb({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  // FIXED: Medusa v2 calls this "product_collection"
  const { data: collections } = await query.graph({
    entity: "product_collection", 
    fields: ["title", "handle"]
  })

  console.log("\n=== 📦 YOUR DATABASE COLLECTIONS ===")
  if (collections.length === 0) {
    console.log("No collections found in the database!")
  } else {
    collections.forEach((c: any) => {
      console.log(`Title: "${c.title}"  --->  Exact Handle: "${c.handle}"`)
    })
  }
  console.log("====================================\n")
}
