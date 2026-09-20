import { defineEnvVars } from "@sveltejs/kit/env";
import { Schema } from "effect";

/** Private PostgreSQL connection configuration. */
export const variables = defineEnvVars({
  DATABASE_URL: { schema: Schema.toStandardSchemaV1(Schema.NonEmptyString) },
});
