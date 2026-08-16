import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260806124956 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "storefront_section" ("id" text not null, "title" text not null, "type" text not null, "collection_id" text null, "image_url" text null, "button_text" text not null default 'Shop Now', "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "storefront_section_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_storefront_section_deleted_at" ON "storefront_section" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "storefront_section" cascade;`);
  }

}
