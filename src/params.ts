import { defineParams } from "@sveltejs/kit/params";
import { Schema } from "effect";
import { games, type GameId } from "#lib/games.ts";

/** Match game routes against the registry and infer their parameter type. */
export const params = defineParams({
  game: Schema.toStandardSchemaV1(Schema.Literals(Object.keys(games) as GameId[])),
});
