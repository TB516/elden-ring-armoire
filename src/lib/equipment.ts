import type { GameId } from "./games.ts";

/** Armor positions shared by the equipment catalog and outfit selections. */
export const armorSlots = ["head", "chest", "arms", "legs"] as const;

/** Resolves an equipment ID to its static icon URL. */
export const equipmentIconPath = (gameId: GameId, equipmentId: string): string =>
  `/${encodeURIComponent(gameId)}/equipment/${encodeURIComponent(equipmentId)}.webp`;
