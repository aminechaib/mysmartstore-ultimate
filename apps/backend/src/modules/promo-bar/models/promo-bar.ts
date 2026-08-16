import { model } from "@medusajs/framework/utils"

export const PromoBar = model.define("promo_bar", {
  id: model.id().primaryKey(),
  title: model.text(),
  subtitle: model.text().nullable(),
  image_url: model.text(),
  button_text: model.text().default("Shop Now"),
  button_link: model.text().default("/store"),
})
