import { createServer } from "vite";

if (process.env.NODE_ENV === "production") {
  throw new Error("Development seeding is disabled in production.");
}

// Load SvelteKit's private environment module without starting an HTTP server.
const server = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null },
});
try {
  await server.ssrLoadModule("/scripts/seed-dev.ts");
} finally {
  await server.close();
}
