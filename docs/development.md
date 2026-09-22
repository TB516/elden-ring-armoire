# Development

Development runs in the included VS Code devcontainer. Docker is the only host requirement.

Open the repository in VS Code and choose **Dev Containers: Reopen in Container**. The devcontainer builds the Node environment, starts PostgreSQL and RustFS, installs the pnpm dependencies, and forwards ports 5173, 9000, and 9001. It also installs the recommended Svelte and Oxc extensions.

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
| `pnpm db:seed`      | Seed the image bucket and sample database records.    |
| `pnpm db:setup`     | Apply migrations, then seed development data.         |

The database schema lives under `src/lib/server/db`. Application database services use the Effect-native Drizzle driver. The Effect runtime that provides the database layer owns its PostgreSQL connection pool and closes it when the runtime is disposed.

## Local object storage

RustFS provides an S3 API and a browser console for developing outfit image storage.
Equipment icons stay vendored under `static/`. The image is pinned to `1.0.0` and
stores objects in the `rustfs-data` Docker volume, which survives container rebuilds.

After changing the devcontainer configuration, use **Dev Containers: Rebuild
Container** in VS Code. Let VS Code manage the Compose stack; do not start a second
stack with a separate Compose project name.

Open the console at <http://localhost:9001> and sign in with:

- Access key: `armoire-dev`
- Secret key: `armoire-local-development-only`

Devcontainer startup runs migrations. Compose's one-shot `storage-init` service
waits for RustFS's health check, then uses the RustFS CLI to create the private
`outfit-images` bucket. `--ignore-existing` leaves an existing bucket intact.
The service exits after initialization; an exit code of zero means setup succeeded.
Check its logs if the bucket is missing before seeding.
`pnpm db:setup` applies migrations and populates sample images and outfits in the
prepared bucket. No sample data is seeded on container startup.

RustFS shares the app container's network namespace, so the S3 API is at
`http://localhost:9000` both inside the app container and through VS Code port
forwarding. Signed URLs therefore use the same endpoint as server requests.
VS Code starts the app, database, RustFS, and bucket initializer, and forwards the console on port 9001 too.
Port 9000 must be available locally so browser URLs match the signed hostname and
port. Docker does not publish either port to the host. PostgreSQL retains its
separate network namespace and remains available to the app at `db:5432`.
These credentials are for local development only.

Compose supplies `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`,
`S3_SECRET_ACCESS_KEY`, and `S3_FORCE_PATH_STYLE` to the app container for the
storage client. The region is `us-east-1` and local clients should use path-style
URLs. Infrastructure defaults live in Compose; `.env.example` contains only the
app's auth settings. Existing `.env` files can drop any `DATABASE_URL` and `S3_*`
entries when using the devcontainer.

Once VS Code starts the containers, check <http://localhost:9000/health>, then
upload and download a small file through the console. Restart the devcontainer and
confirm the file remains. RustFS starts after the app container, so wait for its
health check to pass before using storage. Rebuild through VS Code when changing
this setup so RustFS rejoins the app container's network namespace.

Configuration follows the [RustFS Docker documentation](https://docs.rustfs.com/en/installation/container/docker).

## Required runtime environment

`src/lib/server/storage/effect.ts` provides the `ObjectStorage` Effect service using
the AWS S3 SDK. `put(key, { body, contentType })` uploads an object, `getUrl(key)`
creates a signed download URL valid for one hour, and `delete(key)` removes it.
Browsers download directly from the bucket; the app does not proxy image bytes.
Signing does not check whether an object exists. Failures use `StorageError` from
`storage/errors.ts`. Uploads overwrite existing keys, and deleting an absent key succeeds.

SvelteKit consumers can provide `objectStorageLayer` from
`src/lib/server/storage/effect.ts`. This module imports SvelteKit's private environment
module and must run through SvelteKit/Vite rather than plain Node. The layer closes the client when its
scope ends and forwards Effect cancellation to upload/delete requests. Image
validation and integration with gallery pages remain for later work.

URL signing is local work with no abort API; Effect interruption stops waiting for
the result but cannot stop the underlying signer. URLs are signed on each call,
not cached, and can change with the signing timestamp. The browser handles the
actual download independently of the server's Effect.

`S3_ENDPOINT` must be reachable by both the server and browser, not a CDN URL.
One S3 client handles uploads, deletes, and signing in every environment.
Locally the shared network namespace and VS Code forwarding provide `http://localhost:9000`.
Do not rewrite signed URLs after signing, since the hostname is part of the signature.

`src/env.ts` declares required private variables through SvelteKit's `defineEnvVars`
and Effect Schema. Supply these through your hosting provider when deploying:

| Variable                | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection URL.                                     |
| `S3_ENDPOINT`           | Object storage API endpoint.                                   |
| `S3_REGION`             | Region expected by the storage provider.                       |
| `S3_BUCKET`             | Bucket containing outfit images.                               |
| `S3_ACCESS_KEY_ID`      | Storage access key.                                            |
| `S3_SECRET_ACCESS_KEY`  | Storage secret key.                                            |
| `S3_FORCE_PATH_STYLE`   | `true` for path-style URLs or `false` for virtual-hosted URLs. |
| `BETTER_AUTH_URL`       | Public application URL.                                        |
| `BETTER_AUTH_SECRET`    | Authentication signing secret.                                 |
| `DISCORD_CLIENT_ID`     | Discord OAuth application ID.                                  |
| `DISCORD_CLIENT_SECRET` | Discord OAuth application secret.                              |

## Development data

Inside the devcontainer, run `pnpm db:setup` when you want sample outfits. Migrations
create the schema and populate the equipment catalog before the seed runs. Seeding
is explicit; restarting the container or running `pnpm dev` does not add sample data.

`scripts/run-seed.ts` uses Vite to load the seed with SvelteKit's validated private
environment variables, without starting an HTTP server. `scripts/seed-dev.ts`
uploads seven fixtures to the prepared bucket through the application's Effect
storage service, then uses the Effect database layer to insert two
fictional authors and three outfits in one transaction. The outfits reference real
catalog equipment and cover missing equipment selections and different image
combinations. Every outfit has `portrait-1` for its thumbnail. The authors have no login
accounts or sessions.

Stable IDs make the command repeatable. Existing authors, outfits, and equipment
are left unchanged; image references are updated to match the fixture keys. Missing
fixture rows are inserted, and unrelated records are untouched. Each run overwrites
only the seven reserved `dev/outfits/` object keys. If any insert fails, the database
transaction rolls back; uploaded objects remain and a rerun completes the setup.
Database and bucket operations are not one transaction. Keep the seed script in sync with schema changes; it is
development tooling, not a migration or a publishing service.

Sample authors and outfits live in `fixtures/outfits.ts`, which can be imported
without running the seed or connecting to services. Development and future tests
can share this data. The seed script handles uploads and inserts separately.

The seven images are labeled WebP placeholders under `fixtures/outfits/`, with
800 by 1200 portraits and 1200 by 800 landscapes. These dimensions are only for the
fixtures, not final upload limits. Database storage keys refer to bucket objects,
not static routes. Use `ObjectStorage.getUrl` to obtain signed image URLs.
Equipment icons remain vendored under `static/`.

The seed uses the database and S3 settings from the environment and refuses to run
with `NODE_ENV=production`. Run it only against a development database.
