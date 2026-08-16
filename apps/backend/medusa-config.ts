import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  modules: {
    // 🛠️ All custom modules now point to the correct /src/modules/ folders
    searchLogModuleService: {
      resolve: "./src/modules/search-log",
    },
    heroBannerModuleService: {
      resolve: "./src/modules/hero-banner",
    },
    promoBarModuleService: {
      resolve: "./src/modules/promo-bar",
    },
    storefrontSectionModuleService: {
      resolve: "./src/modules/storefront-section",
    },
    marketingModuleService: {
      resolve: "./src/modules/marketing-badges",
    },
  },
})
