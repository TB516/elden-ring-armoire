import type { OutfitEquipment } from "#lib/server/db/schema/outfit.ts";

/** Display labels and order; valid positions come from the database schema. */
export const equipmentFields = [
  { position: "head", label: "Head" },
  { position: "chest", label: "Chest" },
  { position: "arms", label: "Arms" },
  { position: "legs", label: "Legs" },
  { position: "left-hand", label: "Left hand" },
  { position: "right-hand", label: "Right hand" },
] satisfies { position: OutfitEquipment["position"]; label: string }[];
