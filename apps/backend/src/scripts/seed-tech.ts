// File: apps/backend/src/scripts/seed-tech.ts

import { ExecArgs } from "@medusajs/framework/types"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"

export default async function seedTechProducts({ container }: ExecArgs) {
  const logger = container.resolve("logger") as any
  logger.info("🚀 Starting massive tech products seed...")

  const salesChannelService = container.resolve(Modules.SALES_CHANNEL) as any
  const salesChannels = await salesChannelService.listSalesChannels()
  const defaultChannel = salesChannels[0]

  if (!defaultChannel) {
    logger.error("No sales channel found. Please create one in the admin first.")
    return
  }

  const brands = ["Apple", "Samsung", "Sony", "Dell", "Logitech", "Asus", "Razer", "Bose", "HP", "Lenovo"]
  const categories = ["Laptop", "Smartphone", "Headphones", "Monitor", "Keyboard", "Mouse", "Tablet", "Smartwatch", "Camera", "Speaker"]
  const adjectives = ["Pro", "Max", "Ultra", "Lite", "Plus", "Mini", "Air", "Elite", "Advanced", "Essential"]
  
  const techImages = [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527814050087-379381547969?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop",
  ]

  const productsToCreate: any[] = []

  for (let i = 1; i <= 300; i++ ) {
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const image = techImages[Math.floor(Math.random() * techImages.length)]
    
    const title = `${brand} ${category} ${adjective} Gen-${Math.floor(Math.random() * 10) + 1}`
    const price = Math.floor(Math.random() * 1500) + 50
    
    // NEW: Guarantee 100% unique URLs and SKUs
    const uniqueId = `${Date.now()}-${i}-${Math.floor(Math.random() * 10000)}`

    productsToCreate.push({
      title,
      handle: `tech-${uniqueId}`, // Forces a unique URL
      description: `Premium ${category.toLowerCase()} engineered by ${brand}. Features the latest technology, sleek design, and unparalleled performance. Perfect for professionals and enthusiasts alike.`,
      status: "published",
      thumbnail: image,
      images: [{ url: image }],
      options: [{ title: "Color", values: ["Matte Black", "Silver"] }],
      variants: [
        {
          title: "Matte Black",
          sku: `SKU-${uniqueId}`, // Forces a unique SKU
          manage_inventory: false,
          prices: [
            {
              amount: price,
              currency_code: "usd",
            },
          ],
        },
      ],
      sales_channels: [{ id: defaultChannel.id }],
    })
  }

  const chunkSize = 50
  for (let i = 0; i < productsToCreate.length; i += chunkSize) {
    const chunk = productsToCreate.slice(i, i + chunkSize)
    await createProductsWorkflow(container).run({
      input: { products: chunk }
    })
    logger.info(`✅ Seeded ${i + chunk.length} / 300 products...`)
  }

  logger.info("🎉 Successfully seeded 300 tech products! Your store is now massive.")
}
