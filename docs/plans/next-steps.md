# Next steps

The schema, equipment catalog, local object storage, development seed, and cached
read-only outfit queries are in place. The browsing UI shows outfit pages with
screenshots and equipment. Search, sorting, and equipment filter controls are disabled.

1. Review and connect the collection search, sorting, and equipment filter backend.
2. Build authenticated outfit submission. Set image dimensions and file-size limits,
   process images to WebP in the browser, and validate them on the server. Require
   `portrait-1`, allow up to two portraits and one landscape, and store images
   through `ObjectStorage`. Handle failed uploads and database writes without
   assuming they form one transaction. Invalidate or refresh affected caches.
3. Implement account deletion, including stored image objects as well as database
   rows. Add submission limits and moderation when the publishing flow exists.

Drafts, revisions, editing, and soft deletion are outside the first version.
