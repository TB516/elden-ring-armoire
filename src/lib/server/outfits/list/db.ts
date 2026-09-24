import { and, desc, eq } from "drizzle-orm";
import { Effect } from "effect";
import type { GameId } from "#lib/games.ts";
import { Database } from "#lib/server/db/effect.ts";
import { user } from "#lib/server/db/schema/auth.ts";
import { outfit, outfitImage } from "#lib/server/db/schema/outfit.ts";

const galleryPageSize = 18;

/** Selects one numbered gallery page for a game. */
export type ListOutfitsInput = { readonly gameId: GameId; readonly page: number };

/** Read one page of outfit previews and its next-page flag from the database. */
export const getOutfitPage = ({ gameId, page }: ListOutfitsInput) =>
  Effect.gen(function* () {
    const db = yield* Database;

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

    return {
      outfitSelections: outfitSelections.slice(0, galleryPageSize),
      hasNextPage: outfitSelections.length > galleryPageSize,
    };
  });
