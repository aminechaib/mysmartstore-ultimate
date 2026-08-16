import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260806140538 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "storefront_section" add column if not exists "show_button" boolean not null default true, add column if not exists "button_link" text not null default '/store';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "storefront_section" drop column if exists "show_button", drop column if exists "button_link";`);
  }

}
