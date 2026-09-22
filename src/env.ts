import { defineEnvVars } from "@sveltejs/kit/env";
import { Schema } from "effect";

const requiredValue = Schema.toStandardSchemaV1(Schema.NonEmptyString);

/** Required private runtime configuration, supplied by the environment or local .env. */
export const variables = defineEnvVars({
  DATABASE_URL: { schema: requiredValue },
  S3_ENDPOINT: { schema: requiredValue },
  S3_REGION: { schema: requiredValue },
  S3_BUCKET: { schema: requiredValue },
  S3_ACCESS_KEY_ID: { schema: requiredValue },
  S3_SECRET_ACCESS_KEY: { schema: requiredValue },
  S3_FORCE_PATH_STYLE: { schema: Schema.toStandardSchemaV1(Schema.Literals(["true", "false"])) },
  BETTER_AUTH_URL: { schema: requiredValue },
  BETTER_AUTH_SECRET: { schema: requiredValue },
  DISCORD_CLIENT_ID: { schema: requiredValue },
  DISCORD_CLIENT_SECRET: { schema: requiredValue },
});
