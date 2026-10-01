import { error } from "@sveltejs/kit";
import { query } from "$app/server";
import { Schema } from "effect";
import { games, type GameId } from "#lib/games.ts";
import { getOutfit as getOutfitEffect } from "#lib/server/outfits/get/index.ts";
import { serverRuntime } from "#lib/server/runtime.ts";

const gameId = Schema.Literals(Object.keys(games) as GameId[]);
const getOutfitInput = Schema.toStandardSchemaV1(
  Schema.Struct({ gameId, outfitId: Schema.String.check(Schema.isUUID()) }),
);

/** One public outfit with its equipment and signed image URLs. */
export const getOutfit = query(getOutfitInput, async (input) => {
  const entry = await serverRuntime.runPromise(getOutfitEffect(input));

  if (!entry) {
    error(404, "Outfit not found");
  }

  return entry;
});
