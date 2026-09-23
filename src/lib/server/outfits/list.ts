import { and, desc, eq } from "drizzle-orm";
import { Effect } from "effect";
import type { GameId } from "#lib/games.ts";
import { Database } from "#lib/server/db/effect.ts";
import { user } from "#lib/server/db/schema/auth.ts";
import { outfit, outfitImage } from "#lib/server/db/schema/outfit.ts";
import { ObjectStorage } from "#lib/server/storage/effect.ts";

const galleryPageSize = 18;

/** Read one page of published outfits, newest first, with direct thumbnail URLs. */
export const listOutfits = (gameId: GameId, page: number) =>
  Effect.gen(function* () {
    const db = yield* Database;
    const storage = yield* ObjectStorage;

    const outfitSelections = yield* db
      .select({
        id: outfit.id,
        title: outfit.title,
        createdAt: outfit.createdAt,
        authorName: user.name,
        thumbnailKey: outfitImage.storageKey,
      })
      .from(outfit)
      .innerJoin(user, eq(outfit.authorId, user.id))
      .innerJoin(
        outfitImage,
        and(eq(outfitImage.outfitId, outfit.id), eq(outfitImage.role, "portrait-1")),
      )
      .where(eq(outfit.gameId, gameId))
      .orderBy(desc(outfit.createdAt), desc(outfit.id))
      .limit(galleryPageSize + 1)
      .offset((page - 1) * galleryPageSize);

    const outfits = yield* Effect.all(
      outfitSelections
        .slice(0, galleryPageSize)
        .map(({ thumbnailKey, ...outfitSelection }) =>
          storage
            .getUrl(thumbnailKey)
            .pipe(Effect.map((thumbnailUrl) => ({ ...outfitSelection, thumbnailUrl }))),
        ),
      { concurrency: 8 },
    );

    return { outfits, hasNextPage: outfitSelections.length > galleryPageSize };
  });
