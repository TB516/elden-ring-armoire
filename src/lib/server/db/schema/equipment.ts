import { and, eq, isNotNull, isNull, ne, or, sql } from "drizzle-orm";
import { check, index, primaryKey, pgEnum, pgTable, text, unique } from "drizzle-orm/pg-core";
import { armorSlots } from "#lib/equipment.ts";

const equipmentSources = ["base-game", "shadow-of-the-erdtree", "tarnished-pack"] as const;

const equipmentSlots = [...armorSlots, "armament"] as const;

const armamentCategories = [
  "Dagger",
  "Straight Sword",
  "Greatsword",
  "Colossal Sword",
  "Thrusting Sword",
  "Heavy Thrusting Sword",
  "Curved Sword",
  "Curved Greatsword",
  "Katana",
  "Twinblade",
  "Axe",
  "Greataxe",
  "Hammer",
  "Flail",
  "Great Hammer",
  "Colossal Weapon",
  "Spear",
  "Great Spear",
  "Halberd",
  "Reaper",
  "Whip",
  "Fist",
  "Claw",
  "Light Bow",
  "Bow",
  "Greatbow",
  "Crossbow",
  "Ballista",
  "Glintstone Staff",
  "Sacred Seal",
  "Torch",
  "Small Shield",
  "Medium Shield",
  "Greatshield",
  "Hand-To-Hand",
  "Perfume Bottle",
  "Thrusting Shield",
  "Throwing Blade",
  "Backhand Blade",
  "Great Katana",
  "Light Greatsword",
  "Beast Claw",
] as const;

export const equipmentSource = pgEnum("equipment_source", equipmentSources);
export const equipmentSlot = pgEnum("equipment_slot", equipmentSlots);
export const armamentCategory = pgEnum("armament_category", armamentCategories);

/** Games whose equipment can be referenced by database records. */
export const game = pgTable(
  "game",
  {
    id: text("id").primaryKey().notNull(),
  },
  (table) => [check("game_id_nonempty", ne(sql<string>`btrim(${table.id})`, ""))],
);

/** Authoritative equipment catalog. Icons are static assets addressed by game and item ID. */
export const equipment = pgTable(
  "equipment",
  {
    gameId: text("game_id")
      .notNull()
      .references(() => game.id, { onDelete: "restrict" }),
    id: text("id").notNull(),
    name: text("name").notNull(),
    // Armaments can occupy multiple hand positions; this is their kind, not a hand assignment.
    slot: equipmentSlot("slot").notNull(),
    // Weapon/shield subtype; armor is classified by slot and has no category.
    category: armamentCategory("category"),
    source: equipmentSource("source").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.gameId, table.id] }),
    // Outfit selections reference this key to enforce catalog slot compatibility.
    unique("equipment_game_id_slot_unique").on(table.gameId, table.id, table.slot),
    index("equipment_game_slot_idx").on(table.gameId, table.slot),
    check("equipment_id_nonempty", ne(sql<string>`btrim(${table.id})`, "")),
    check("equipment_name_nonempty", ne(sql<string>`btrim(${table.name})`, "")),
    check(
      "equipment_category_valid",
      or(
        and(eq(table.slot, "armament"), isNotNull(table.category)),
        and(ne(table.slot, "armament"), isNull(table.category)),
      )!,
    ),
  ],
);

/** An equipment record read from PostgreSQL. */
export type Equipment = typeof equipment.$inferSelect;
