import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260812104718 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "marketing_badge" drop constraint if exists "marketing_badge_collection_handle_unique";`);
    this.addSql(`create table if not exists "marketing_badge" ("id" text not null, "collection_handle" text not null, "text" text not null, "bg_class" text not null, "card_style" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "marketing_badge_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_marketing_badge_collection_handle_unique" ON "marketing_badge" ("collection_handle") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_marketing_badge_deleted_at" ON "marketing_badge" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "marketing_badge" cascade;`);
  }

}
