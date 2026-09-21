CREATE TYPE "outfit_equipment_position" AS ENUM('head', 'chest', 'arms', 'legs', 'left-hand', 'right-hand');--> statement-breakpoint
CREATE TYPE "outfit_image_role" AS ENUM('portrait-1', 'portrait-2', 'landscape');--> statement-breakpoint
CREATE TABLE "outfit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"game_id" text NOT NULL,
	"author_id" text NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(2000) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outfit_id_game_id_unique" UNIQUE("id","game_id"),
	CONSTRAINT "outfit_title_nonempty" CHECK (btrim("title") <> ''),
	CONSTRAINT "outfit_description_nonempty" CHECK (btrim("description") <> '')
);
--> statement-breakpoint
CREATE TABLE "outfit_equipment" (
	"outfit_id" uuid,
	"game_id" text NOT NULL,
	"position" "outfit_equipment_position",
	"equipment_id" text NOT NULL,
	"equipment_slot" "equipment_slot" NOT NULL,
	CONSTRAINT "outfit_equipment_pkey" PRIMARY KEY("outfit_id","position"),
	CONSTRAINT "outfit_equipment_position_slot_valid" CHECK ((((("position" = 'head') and ("equipment_slot" = 'head'))) or ((("position" = 'chest') and ("equipment_slot" = 'chest'))) or ((("position" = 'arms') and ("equipment_slot" = 'arms'))) or ((("position" = 'legs') and ("equipment_slot" = 'legs'))) or ((("position" = 'left-hand') and ("equipment_slot" = 'armament'))) or ((("position" = 'right-hand') and ("equipment_slot" = 'armament')))))
);
--> statement-breakpoint
CREATE TABLE "outfit_image" (
	"outfit_id" uuid,
	"role" "outfit_image_role",
	"storage_key" text NOT NULL CONSTRAINT "outfit_image_storage_key_unique" UNIQUE,
	CONSTRAINT "outfit_image_pkey" PRIMARY KEY("outfit_id","role"),
	CONSTRAINT "outfit_image_storage_key_nonempty" CHECK (btrim("storage_key") <> '')
);
--> statement-breakpoint
CREATE INDEX "outfit_game_created_at_idx" ON "outfit" ("game_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "outfit_author_id_idx" ON "outfit" ("author_id");--> statement-breakpoint
CREATE INDEX "outfit_equipment_catalog_idx" ON "outfit_equipment" ("game_id","equipment_id","equipment_slot");--> statement-breakpoint
ALTER TABLE "outfit" ADD CONSTRAINT "outfit_game_id_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "outfit" ADD CONSTRAINT "outfit_author_id_user_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "outfit_equipment" ADD CONSTRAINT "outfit_equipment_outfit_game_fkey" FOREIGN KEY ("outfit_id","game_id") REFERENCES "outfit"("id","game_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "outfit_equipment" ADD CONSTRAINT "outfit_equipment_catalog_fkey" FOREIGN KEY ("game_id","equipment_id","equipment_slot") REFERENCES "equipment"("game_id","id","slot") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "outfit_image" ADD CONSTRAINT "outfit_image_outfit_id_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfit"("id") ON DELETE CASCADE;
