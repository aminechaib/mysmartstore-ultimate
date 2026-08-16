import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260805100317 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "search_log" ("id" text not null, "query" text not null, "ai_response" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "search_log_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_search_log_deleted_at" ON "search_log" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "search_log" cascade;`);
  }

}
