import * as PgClient from "@effect/sql-pg/PgClient";
import * as PgDrizzle from "drizzle-orm/effect-postgres";
import { Context, Layer, Redacted } from "effect";

/** Effect-native Drizzle client for application services. */
export class Database extends Context.Service<Database, PgDrizzle.EffectPgDatabase>()("Database") {}

/** Owns the PostgreSQL pool; disposing the consuming runtime closes its connections. */
export const databaseLayer = (url: string) =>
  Layer.effect(Database, PgDrizzle.makeWithDefaults()).pipe(
    Layer.provide(PgClient.layer({ url: Redacted.make(url) })),
  );
