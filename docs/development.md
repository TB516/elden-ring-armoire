# Development

Development runs in the included VS Code devcontainer. Docker is the only host requirement.

Open the repository in VS Code and choose **Dev Containers: Reopen in Container**. The devcontainer builds the Node environment, starts PostgreSQL, installs the pnpm dependencies, and forwards port 5173. It also installs the recommended Svelte and Oxc extensions.

Once the container is ready, run:

```sh
pnpm dev
```

Open `http://localhost:5173`. PostgreSQL data persists between container restarts in a named Docker volume. The devcontainer supplies `DATABASE_URL`; `.env.example` is copied to the ignored `.env` file when the container is first created.

## Commands

| Command             | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| `pnpm dev`          | Start the SvelteKit development server with HMR.      |
| `pnpm build`        | Build the standalone Node server.                     |
| `pnpm start`        | Run a previously built server.                        |
| `pnpm check`        | Check TypeScript and Svelte code.                     |
| `pnpm lint`         | Lint JavaScript and TypeScript with Oxlint.           |
| `pnpm format`       | Format the project with Oxfmt.                        |
| `pnpm format:check` | Check formatting without changing files.              |
| `pnpm db:generate`  | Generate migrations from the Drizzle schema.          |
| `pnpm db:migrate`   | Apply pending migrations to the development database. |

The database schema lives under `src/lib/server/db`. Application database services use the Effect-native Drizzle driver. The Effect runtime that provides the database layer owns its PostgreSQL connection pool and closes it when the runtime is disposed.
