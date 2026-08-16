import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260813082136 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "storefront_section" add column if not exists "collection_ids" jsonb null, add column if not exists "limit" integer not null default 8;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "storefront_section" drop column if exists "collection_ids", drop column if exists "limit";`);
  }

}
