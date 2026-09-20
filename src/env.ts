import { defineEnvVars } from "@sveltejs/kit/env";
import { Schema } from "effect";

const authValue = Schema.toStandardSchemaV1(Schema.NonEmptyString);

/** Private runtime configuration, read from .env locally and environment variables in production. */
export const variables = defineEnvVars({
  DATABASE_URL: { schema: authValue },
  BETTER_AUTH_URL: { schema: authValue },
  BETTER_AUTH_SECRET: { schema: authValue },
  DISCORD_CLIENT_ID: { schema: authValue },
  DISCORD_CLIENT_SECRET: { schema: authValue },
});
