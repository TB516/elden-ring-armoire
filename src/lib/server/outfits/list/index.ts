import { Effect } from "effect";
import { ObjectStorage } from "#lib/server/storage/effect.ts";
import { OutfitListCache } from "./cache.ts";
import type { ListOutfitsInput } from "./db.ts";

/** Read one page of published outfits, newest first, with direct thumbnail URLs. */
export const listOutfits = (input: ListOutfitsInput) =>
  Effect.gen(function* () {
    const cache = yield* OutfitListCache;
    const storage = yield* ObjectStorage;
    const { outfitSelections, hasNextPage } = yield* cache.get(input);

    const outfits = yield* Effect.all(
      outfitSelections.map(({ thumbnailKey, ...outfitSelection }) =>
        storage
          .getUrl(thumbnailKey)
          .pipe(Effect.map((thumbnailUrl) => ({ ...outfitSelection, thumbnailUrl }))),
      ),
      { concurrency: 8 },
    );

    return { outfits, hasNextPage };
  });
