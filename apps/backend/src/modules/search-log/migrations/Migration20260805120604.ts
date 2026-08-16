import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260805120604 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "search_log" add column if not exists "search_term" text null, add column if not exists "results_count" integer not null default 0;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "search_log" drop column if exists "search_term", drop column if exists "results_count";`);
  }

}
