import { error } from "@sveltejs/kit";
import { query } from "$app/server";
import { Schema } from "effect";
import { games, type GameId } from "#lib/games.ts";
import { getOutfit as getOutfitEffect } from "#lib/server/outfits/get/index.ts";
import { listOutfits as listOutfitsEffect } from "#lib/server/outfits/list/index.ts";
import { serverRuntime } from "#lib/server/runtime.ts";

const gameId = Schema.Literals(Object.keys(games) as GameId[]);

const listOutfitsInput = Schema.toStandardSchemaV1(
  Schema.Struct({
    gameId,
    page: Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 10_000 })),
  }),
);

const getOutfitInput = Schema.toStandardSchemaV1(
  Schema.Struct({ gameId, outfitId: Schema.String.check(Schema.isUUID()) }),
);

/** Paginated public outfits with signed thumbnail URLs. */
export const listOutfits = query(listOutfitsInput, (input) =>
  serverRuntime.runPromise(listOutfitsEffect(input)),
);

/** One public outfit with its equipment and signed image URLs. */
export const getOutfit = query(getOutfitInput, async (input) => {
  const entry = await serverRuntime.runPromise(getOutfitEffect(input));

  if (!entry) {
    error(404, "Outfit not found");
  }

  return entry;
});
