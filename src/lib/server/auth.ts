import {
  BETTER_AUTH_URL,
  BETTER_AUTH_SECRET,
  DATABASE_URL,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
} from "$app/env/private";
import { getRequestEvent } from "$app/server";
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "#lib/server/db/schema/auth.ts";

// Better Auth requires a Promise-based database client. Application services use the
// Effect-native Database service instead.
const authDatabase = drizzle(DATABASE_URL);

/** Better Auth configured for Discord and SvelteKit. */
export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  database: drizzleAdapter(authDatabase, {
    provider: "pg",
    schema,
    transaction: true,
  }),
  socialProviders: {
    discord: {
      clientId: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
    },
  },
  plugins: [sveltekitCookies(getRequestEvent)],
});

/** Inferred auth API and session types, shared with SvelteKit's server locals. */
export type Auth = typeof auth;
