# Next steps

The schema, equipment catalog, local object storage, development seed, and cached
read-only outfit queries are in place. The catalog supports title search, per-position
equipment filters, sorting, and outfit pages with screenshots and equipment links.

1. Build authenticated outfit submission. Set image dimensions and file-size limits,
   process images to WebP in the browser, and validate them on the server. Require
   `portrait-1`, allow up to two portraits and one landscape, and store images
   through `ObjectStorage`. Handle failed uploads and database writes without
   assuming they form one transaction. Invalidate or refresh affected caches.
2. Implement account deletion, including stored image objects as well as database
   rows. Add submission limits and moderation when the publishing flow exists.

Before deployment, configure CDN caching for equipment catalogs and static icons,
including how catalog updates invalidate cached responses.

Drafts, revisions, editing, and soft deletion are outside the first version.
