// File: apps/backend/src/api/admin/quick-products/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createProductsWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      title,
      description,
      price,
      collection_id,
      image_url,
      warranty,
      sku
    } = req.body as any

    if (!title || !price) {
      return res.status(400).json({ error: "Title and Price are required." })
    }

    // Resolve services with 'as any' to bypass strict production type checks
    const salesChannelService = req.scope.resolve("sales_channel" as any)
    const channels = await (salesChannelService as any).listSalesChannels()
    const defaultChannel = channels[0]

    const stockLocationService = req.scope.resolve("stock_location" as any)
    const locations = await (stockLocationService as any).listStockLocations({})
    const defaultLocation = locations[0]

    // Build the product payload
    const productPayload = {
      title,
      description,
      collection_id: collection_id !== "none" ? collection_id : undefined,
      sales_channels: defaultChannel ? [{ id: defaultChannel.id }] : [],
      images: image_url ? [{ url: image_url }] : [],
      metadata: { warranty: warranty || "No warranty specified" },
      options: [{ title: "Model", values: ["Standard"] }],
      variants: [
        {
          title: "Standard",
          sku: sku || `REF-${Date.now()}`,
          manage_inventory: true,
          prices: [
            { currency_code: "qar", amount: Number(price) },
            { currency_code: "usd", amount: Number(price) / 3.64 },
          ],
          options: { "Model": "Standard" },
        },
      ],
    }

    // Create the product using the official Medusa workflow
    const { result } = await (createProductsWorkflow(req.scope) as any).run({
      input: { products: [productPayload] },
    })

    const createdProduct = result[0]
    const variantId = createdProduct.variants[0].id

    // Auto-link to warehouse location
    if (defaultLocation) {
      const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
      const { data: variantInventory } = await query.graph({
        entity: "variant",
        fields: ["inventory_items.inventory_item_id"],
        filters: { id: variantId }
      })

      const inventoryItemId = variantInventory[0]?.inventory_items?.[0]?.inventory_item_id

      if (inventoryItemId) {
        const inventoryService = req.scope.resolve("inventory" as any)
        await (inventoryService as any).createInventoryLevels([
          {
            inventory_item_id: inventoryItemId,
            location_id: defaultLocation.id,
            stocked_quantity: 0,
          }
        ])
      }
    }

    res.json({ success: true, product: createdProduct })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
