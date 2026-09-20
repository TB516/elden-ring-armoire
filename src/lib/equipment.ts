import type { GameId } from "./games.ts";

/** Resolves an equipment ID to its static icon URL. */
export const equipmentIconPath = (gameId: GameId, equipmentId: string): string =>
  `/${encodeURIComponent(gameId)}/equipment/${encodeURIComponent(equipmentId)}.webp`;
