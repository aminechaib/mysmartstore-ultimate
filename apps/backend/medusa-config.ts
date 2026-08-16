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
    searchLogModuleService: {
      resolve: "./modules/search-log", // <-- ADDED /src/ HERE
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
// Inside apps/backend/medusa-config.ts, add this to your modules object:
    marketingModuleService: {
      resolve: "./src/modules/marketing",
    },

  },
} )