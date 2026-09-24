import { Cache, Context, Effect, Exit, Layer } from "effect";
import { getOutfitDetails, type GetOutfitInput } from "./db.ts";

/** Cached database-backed outfit details, without signed image URLs. */
export class OutfitCache extends Context.Service<
  OutfitCache,
  { get: (input: GetOutfitInput) => ReturnType<typeof getOutfitDetails> }
>()("OutfitCache") {}

/** Retain existing outfits for five minutes; retry misses and failures immediately. */
export const outfitCacheLayer = Layer.effect(
  OutfitCache,
  Effect.gen(function* () {
    const cache = yield* Cache.makeWith(getOutfitDetails, {
      capacity: 500,
      requireServicesAt: "lookup",
      timeToLive: (exit) => (Exit.isSuccess(exit) && exit.value ? "5 minutes" : 0),
    });

    return OutfitCache.of({
      get: (input) => Cache.get(cache, input),
    });
  }),
);
