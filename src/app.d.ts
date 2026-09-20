import type { Auth } from "#lib/server/auth.ts";

declare global {
  namespace App {
    interface Locals {
      user: Auth["$Infer"]["Session"]["user"] | null;
      session: Auth["$Infer"]["Session"]["session"] | null;
    }
  }
}

export {};
