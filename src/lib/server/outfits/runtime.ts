import {
  DATABASE_URL,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_FORCE_PATH_STYLE,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "$app/env/private";
import { Layer, ManagedRuntime } from "effect";
import { databaseLayer } from "#lib/server/db/effect.ts";
import { storageLayer } from "#lib/server/storage/effect.ts";

/** Reuse the database pool and storage client across server requests. */
export const outfitRuntime = ManagedRuntime.make(
  Layer.merge(
    databaseLayer(DATABASE_URL),
    storageLayer({
      endpoint: S3_ENDPOINT,
      region: S3_REGION,
      bucket: S3_BUCKET,
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
      forcePathStyle: S3_FORCE_PATH_STYLE === "true",
    }),
  ),
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    void outfitRuntime.dispose();
  });
}
