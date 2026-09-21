# Next steps

The Node/PostgreSQL setup, Better Auth integration, game routes, equipment catalog,
and outfit schema are in place. The migrations have been applied and checked against
local PostgreSQL. Continue in small changes, stopping for review between them.

1. Build read-only outfit browsing with server rendering and Effect services. Add
   gallery cards, an empty state, and an outfit detail route. Use the database
   catalog for equipment names and metadata and the existing static icons.
2. Build the authenticated submission UI and remote functions for the title,
   description, four armor positions, two hand positions, and image selection.
3. Implement uploads and publishing. The image layout allows two portrait
   images and one landscape image. Process images in the browser, accept WebP
   through the upload API, and validate file size, dimensions, and content on the
   server. Finalize the exact limits when implementing this. Choose object storage
   and its local setup for the Node app. Keep storage behind a service so it can
   change later. Use compensating actions and scheduled cleanup for failed uploads;
   database transactions cannot roll back object storage writes.
4. Add submission limits, reports, an admin review queue, account suspension, and
   account deletion. Start with eight submissions per account per day. Automated
   image classification is deferred.

Do not add drafts, revisions, editing, or soft deletion initially. Equipment stats
can be added in a later change. The remaining catalog checks are tracked in the
[catalog validation plan](catalog-validation.md).
