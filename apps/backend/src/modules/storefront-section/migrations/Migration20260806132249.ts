import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260806132249 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "storefront_section" add column if not exists "sequence" integer not null default 0, add column if not exists "animation" text not null default 'fade-up';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "storefront_section" drop column if exists "sequence", drop column if exists "animation";`);
  }

}
