import type { user } from "#lib/server/db/schema/auth.ts";
import type { Outfit, OutfitEquipment, OutfitImage } from "#lib/server/db/schema/outfit.ts";

/** Fictional authors with stable IDs for development and test setup. */
export const authors = [
  { id: "dev-seed-rowan", name: "Rowan", email: "rowan@dev-seed.invalid" },
  { id: "dev-seed-sable", name: "Sable", email: "sable@dev-seed.invalid" },
] satisfies (typeof user.$inferInsert)[];

type SampleOutfit = Outfit & {
  equipment: Omit<OutfitEquipment, "outfitId" | "gameId">[];
  images: OutfitImage["role"][];
  imageDirectory: string;
};

/** Sample outfits with catalog selections and matching image fixture directories. */
export const outfits = [
  {
    id: "de000000-0000-4000-8000-000000000001",
    gameId: "elden-ring",
    authorId: "dev-seed-rowan",
    title: "A knight on the road",
    description: "Plain steel, a longsword, and a shield. A full set for wandering Limgrave.",
    createdAt: new Date("2026-09-01T12:00:00Z"),
    equipment: [
      { position: "head", equipmentId: "1016E360", equipmentSlot: "head" },
      { position: "chest", equipmentId: "1016E3C4", equipmentSlot: "chest" },
      { position: "arms", equipmentId: "1016E428", equipmentSlot: "arms" },
      { position: "legs", equipmentId: "1016E48C", equipmentSlot: "legs" },
      { position: "left-hand", equipmentId: "01DE0ED0", equipmentSlot: "armament" },
      { position: "right-hand", equipmentId: "001E8480", equipmentSlot: "armament" },
    ],
    images: ["portrait-1", "portrait-2", "landscape"],
    imageDirectory: "knight",
  },
  {
    id: "de000000-0000-4000-8000-000000000002",
    gameId: "elden-ring",
    authorId: "dev-seed-sable",
    title: "Watching the stars",
    description: "An astrologer's robes and staff, with an empty off hand.",
    createdAt: new Date("2026-09-02T12:00:00Z"),
    equipment: [
      { position: "head", equipmentId: "10099CF0", equipmentSlot: "head" },
      { position: "chest", equipmentId: "10099D54", equipmentSlot: "chest" },
      { position: "arms", equipmentId: "10099DB8", equipmentSlot: "arms" },
      { position: "legs", equipmentId: "10099E1C", equipmentSlot: "legs" },
      { position: "right-hand", equipmentId: "01F98610", equipmentSlot: "armament" },
    ],
    images: ["portrait-1", "portrait-2"],
    imageDirectory: "astrologer",
  },
  {
    id: "de000000-0000-4000-8000-000000000003",
    gameId: "elden-ring",
    authorId: "dev-seed-rowan",
    title: "Traveling light",
    description: "No helmet or gloves. Just robes, boots, and a katana for the road ahead.",
    createdAt: new Date("2026-09-03T12:00:00Z"),
    equipment: [
      { position: "chest", equipmentId: "10099D54", equipmentSlot: "chest" },
      { position: "legs", equipmentId: "10099E1C", equipmentSlot: "legs" },
      { position: "right-hand", equipmentId: "00895440", equipmentSlot: "armament" },
    ],
    images: ["portrait-1", "landscape"],
    imageDirectory: "wanderer",
  },
] satisfies SampleOutfit[];
