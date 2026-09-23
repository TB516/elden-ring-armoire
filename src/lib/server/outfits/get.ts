import { and, eq } from "drizzle-orm";
import { Effect } from "effect";
import type { GameId } from "#lib/games.ts";
import { Database } from "#lib/server/db/effect.ts";
import { user } from "#lib/server/db/schema/auth.ts";
import { equipment } from "#lib/server/db/schema/equipment.ts";
import { outfit, outfitEquipment, outfitImage } from "#lib/server/db/schema/outfit.ts";
import { ObjectStorage } from "#lib/server/storage/effect.ts";

/** Read an outfit and its catalog-backed equipment and screenshots. */
export const getOutfit = (gameId: GameId, outfitId: string) =>
  Effect.gen(function* () {
    const db = yield* Database;
    const storage = yield* ObjectStorage;

    const [outfitSelection] = yield* db
      .select({
        id: outfit.id,
        title: outfit.title,
        description: outfit.description,
        createdAt: outfit.createdAt,
        authorName: user.name,
      })
      .from(outfit)
      .innerJoin(user, eq(outfit.authorId, user.id))
      .where(and(eq(outfit.gameId, gameId), eq(outfit.id, outfitId)))
      .limit(1);

    if (!outfitSelection) return null;

    const [equipmentPieces, imageSelections] = yield* Effect.all([
      db
        .select({
          position: outfitEquipment.position,
          id: equipment.id,
          name: equipment.name,
          slot: equipment.slot,
          category: equipment.category,
          source: equipment.source,
        })
        .from(outfitEquipment)
        .innerJoin(
          equipment,
          and(
            eq(outfitEquipment.gameId, equipment.gameId),
            eq(outfitEquipment.equipmentId, equipment.id),
          ),
        )
        .where(eq(outfitEquipment.outfitId, outfitId)),
      db
        .select({ role: outfitImage.role, storageKey: outfitImage.storageKey })
        .from(outfitImage)
        .where(eq(outfitImage.outfitId, outfitId)),
    ]);

    const images = yield* Effect.all(
      imageSelections.map(({ role, storageKey }) =>
        storage.getUrl(storageKey).pipe(Effect.map((url) => ({ role, url }))),
      ),
      { concurrency: 3 },
    );

    return { ...outfitSelection, equipmentPieces, images };
  });
