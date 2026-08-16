import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260806123806 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "promo_bar" ("id" text not null, "title" text not null, "subtitle" text null, "image_url" text not null, "button_text" text not null default 'Shop Now', "button_link" text not null default '/store', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "promo_bar_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_promo_bar_deleted_at" ON "promo_bar" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "promo_bar" cascade;`);
  }

}
