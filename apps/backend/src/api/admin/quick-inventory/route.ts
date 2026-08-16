// File: apps/backend/src/api/admin/quick-inventory/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productModuleService = req.scope.resolve(Modules.PRODUCT) as any
  const inventoryModuleService = req.scope.resolve(Modules.INVENTORY) as any
  const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION) as any

  try {
    const [products] = await productModuleService.listAndCountProducts(
      {},
      { relations: ["variants"] }
    )

    const locations = await stockLocationService.listStockLocations({})
    const defaultLocation = locations[0]

    const productData = await Promise.all(
      products.map(async (p: any) => {
        const variants = await Promise.all(
          p.variants.map(async (v: any) => {
            let inventory = 0
            if (defaultLocation && v.inventory_item_id) {
              const [levels] = await inventoryModuleService.listInventoryLevels({
                inventory_item_id: [v.inventory_item_id],
                location_id: [defaultLocation.id],
              } as any)
              inventory = levels?.stocked_quantity || 0
            }
            return {
              id: v.id,
              title: v.title,
              sku: v.sku,
              inventory_item_id: v.inventory_item_id,
              inventory,
            }
          })
        )
        return {
          id: p.id,
          title: p.title,
          thumbnail: p.thumbnail,
          variants,
        }
      })
    )

    res.json({ products: productData, location_id: defaultLocation?.id })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const inventoryModuleService = req.scope.resolve(Modules.INVENTORY) as any
  const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION) as any
  const { inventory_item_id, location_id, add_amount } = req.body as any

  try {
    const locations = await stockLocationService.listStockLocations({})
    const targetLocationId = location_id || locations[0]?.id

    if (!targetLocationId) {
      throw new Error("No stock location found")
    }

    const [levels] = await inventoryModuleService.listInventoryLevels({
      inventory_item_id: [inventory_item_id],
      location_id: [targetLocationId],
    } as any)

    if (levels) {
      await inventoryModuleService.updateInventoryLevels([
        {
          id: levels.id,
          stocked_quantity: Number(levels.stocked_quantity) + Number(add_amount),
        },
      ])
    } else {
      await inventoryModuleService.createInventoryLevels([
        {
          inventory_item_id,
          location_id: targetLocationId,
          stocked_quantity: Number(add_amount),
        },
      ])
    }

    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
