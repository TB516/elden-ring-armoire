import { error } from "@sveltejs/kit";
import { query } from "$app/server";
import { Schema } from "effect";
import { games, type GameId } from "#lib/games.ts";
import { getOutfit } from "#lib/server/outfits/get.ts";
import { listOutfits } from "#lib/server/outfits/list.ts";
import { outfitRuntime } from "#lib/server/outfits/runtime.ts";

const gameId = Schema.Literals(Object.keys(games) as GameId[]);

const galleryInput = Schema.toStandardSchemaV1(
  Schema.Struct({
    gameId,
    page: Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 10_000 })),
  }),
);

const detailInput = Schema.toStandardSchemaV1(
  Schema.Struct({ gameId, outfitId: Schema.String.check(Schema.isUUID()) }),
);

/** Paginated public outfits with signed thumbnail URLs. */
export const browseOutfits = query(galleryInput, ({ gameId, page }) =>
  outfitRuntime.runPromise(listOutfits(gameId, page)),
);

/** One public outfit with its equipment and signed image URLs. */
export const readOutfit = query(detailInput, async ({ gameId, outfitId }) => {
  const entry = await outfitRuntime.runPromise(getOutfit(gameId, outfitId));

  if (!entry) {
    error(404, "Outfit not found");
  }

  return entry;
});
