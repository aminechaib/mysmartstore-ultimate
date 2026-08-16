import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260805134841 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "hero_banner" ("id" text not null, "badge_text" text not null default '✨ Exclusive Summer Event', "headline_top" text not null default 'Discover Your', "headline_bottom" text not null default 'Perfect Style', "description" text not null default 'Experience the new standard of modern fashion. Handpicked collections tailored to your unique taste.', "image_url" text not null default 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "hero_banner_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_hero_banner_deleted_at" ON "hero_banner" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "hero_banner" cascade;`);
  }

}
