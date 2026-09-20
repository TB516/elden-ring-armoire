CREATE TYPE "armament_category" AS ENUM('Dagger', 'Straight Sword', 'Greatsword', 'Colossal Sword', 'Thrusting Sword', 'Heavy Thrusting Sword', 'Curved Sword', 'Curved Greatsword', 'Katana', 'Twinblade', 'Axe', 'Greataxe', 'Hammer', 'Flail', 'Great Hammer', 'Colossal Weapon', 'Spear', 'Great Spear', 'Halberd', 'Reaper', 'Whip', 'Fist', 'Claw', 'Light Bow', 'Bow', 'Greatbow', 'Crossbow', 'Ballista', 'Glintstone Staff', 'Sacred Seal', 'Torch', 'Small Shield', 'Medium Shield', 'Greatshield', 'Hand-To-Hand', 'Perfume Bottle', 'Thrusting Shield', 'Throwing Blade', 'Backhand Blade', 'Great Katana', 'Light Greatsword', 'Beast Claw');--> statement-breakpoint
CREATE TYPE "equipment_slot" AS ENUM('head', 'chest', 'arms', 'legs', 'armament');--> statement-breakpoint
CREATE TYPE "equipment_source" AS ENUM('base-game', 'shadow-of-the-erdtree', 'tarnished-pack');--> statement-breakpoint
CREATE TABLE "equipment" (
	"game_id" text,
	"id" text,
	"name" text NOT NULL,
	"slot" "equipment_slot" NOT NULL,
	"category" "armament_category",
	"source" "equipment_source" NOT NULL,
	CONSTRAINT "equipment_pkey" PRIMARY KEY("game_id","id"),
	CONSTRAINT "equipment_game_id_slot_unique" UNIQUE("game_id","id","slot"),
	CONSTRAINT "equipment_id_nonempty" CHECK (btrim("id") <> ''),
	CONSTRAINT "equipment_name_nonempty" CHECK (btrim("name") <> ''),
	CONSTRAINT "equipment_category_valid" CHECK ((((("slot" = 'armament') and (("category" is not null)))) or ((("slot" <> 'armament') and (("category" is null))))))
);
--> statement-breakpoint
CREATE TABLE "game" (
	"id" text PRIMARY KEY,
	CONSTRAINT "game_id_nonempty" CHECK (btrim("id") <> '')
);
--> statement-breakpoint
CREATE INDEX "equipment_game_slot_idx" ON "equipment" ("game_id","slot");--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_game_id_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT;