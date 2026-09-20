# Next steps

The Node/PostgreSQL setup, Better Auth integration, game routes, and equipment
catalog are in place. Continue in small changes, stopping for review between them.

1. Apply the existing migrations to local PostgreSQL once Docker access works.
   Static checks have passed, but this session could not run the database checks.
2. Add outfits, equipment selections, and image metadata to the database schema.
   Reference Better Auth users and enforce game membership, equipment existence,
   compatible slots, and selection uniqueness with database constraints. An outfit
   belongs to one game; hand placement belongs to the selection, not the item.
3. Build the outfit browsing and submission UI with server rendering, remote
   functions, and Effect services. Use the database catalog for names and metadata
   and the existing static icons for equipment images.
4. Implement uploads and publishing. The current image layout is two portrait
   images and one landscape image. Process images in the browser, accept WebP
   through the upload API, and validate file size, dimensions, and content on the
   server. Finalize the exact limits when implementing this. Choose object storage
   and its local setup for the Node app. Keep storage behind a service so it can
   change later. Use compensating actions and scheduled cleanup for failed uploads;
   database transactions cannot roll back object storage writes.
5. Add submission limits, reports, an admin review queue, account suspension, and
   account deletion. Start with eight submissions per account per day. Automated
   image classification is deferred.

Do not add user-facing drafts initially. Design future edits so the current
published outfit remains visible until its replacement is ready. Equipment stats
can be added in a later change. Add the deferred
[catalog and database tests](catalog-validation.md) once the schemas have settled.
