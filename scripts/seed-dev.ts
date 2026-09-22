import { readFile } from "node:fs/promises";
import { sql } from "drizzle-orm";
import { Effect, Layer } from "effect";
import { DATABASE_URL } from "$app/env/private";
import { ObjectStorage, objectStorageLayer } from "#lib/server/storage/effect.ts";
import { Database, databaseLayer } from "#lib/server/db/effect.ts";
import { user } from "#lib/server/db/schema/auth.ts";
import { outfit, outfitEquipment, outfitImage } from "#lib/server/db/schema/outfit.ts";

import { authors, outfits } from "../fixtures/outfits.ts";

const seed = Effect.gen(function* () {
  const db = yield* Database;
  const storage = yield* ObjectStorage;

  // Upload first so committed rows have images. Reruns repair partial seed runs;
  // only these reserved fixture keys are overwritten, never user-uploaded objects.
  for (const sample of outfits) {
    for (const role of sample.images) {
      const body = yield* Effect.tryPromise(() =>
        readFile(`fixtures/outfits/${sample.imageDirectory}/${role}.webp`),
      );
      yield* storage.put(`dev/outfits/${sample.imageDirectory}/${role}.webp`, {
        body,
        contentType: "image/webp",
      });
    }
  }

  yield* db.transaction((tx) =>
    Effect.gen(function* () {
      yield* tx.insert(user).values(authors).onConflictDoNothing({ target: user.id });

      for (const { equipment, images, imageDirectory, ...sample } of outfits) {
        yield* tx.insert(outfit).values(sample).onConflictDoNothing({ target: outfit.id });
        yield* tx
          .insert(outfitEquipment)
          .values(
            equipment.map((selection) => ({
              ...selection,
              outfitId: sample.id,
              gameId: sample.gameId,
            })),
          )
          .onConflictDoNothing({ target: [outfitEquipment.outfitId, outfitEquipment.position] });
        yield* tx
          .insert(outfitImage)
          .values(
            images.map((role) => ({
              outfitId: sample.id,
              role,
              storageKey: `dev/outfits/${imageDirectory}/${role}.webp`,
            })),
          )
          .onConflictDoUpdate({
            target: [outfitImage.outfitId, outfitImage.role],
            set: { storageKey: sql`excluded.storage_key` },
          });
      }
    }),
  );

  const imageCount = outfits.reduce((count, outfit) => count + outfit.images.length, 0);
  yield* Effect.log(
    `Development seed ready: ${authors.length} authors, ${outfits.length} outfits, ${imageCount} placeholder images.`,
  );
});

const main = Effect.gen(function* () {
  if (process.env.NODE_ENV === "production") {
    return yield* Effect.fail(new Error("Development seeding is disabled in production."));
  }

  yield* seed.pipe(Effect.provide(Layer.merge(databaseLayer(DATABASE_URL), objectStorageLayer)));
});

try {
  await Effect.runPromise(main);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
