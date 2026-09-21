# Outfits

An outfit belongs to one game and one Better Auth user. It has a required title
of up to 100 characters and a required description of up to 2,000 characters.
Published outfits are immutable through the application; there is no edit flow or
update timestamp. Deleting the user deletes their outfits and all child records.

## Equipment

Each outfit can select up to one item for the head, chest, arms, legs, left hand,
and right hand. Every position is optional. Armor must match its position, while
either hand accepts one armament. Composite foreign keys ensure that selections
belong to the outfit's game and exist in the equipment catalog.

Hand selections identify equipped items, not the character's grip or pose. The
same catalog item may be selected in both hands; this does not encode wielding one
weapon with both hands. Grip, paired weapons, and other game-specific wielding
rules are outside the current model. If needed later, validate those rules in the
application's Effect services.

## Images

An outfit can have two portrait images and one landscape image. These roles are
unique within the outfit, so the database limits each outfit to three images.
Image records contain only the outfit reference, role, and unique object-storage
key. Images will use fixed dimensions for each role. The upload service will
validate image content, dimensions, and file size before publishing; these are
not stored as per-image metadata. Exact dimensions will be chosen when uploads
are implemented.

Publishing will require at least one image. The submission service must enforce
that minimum because a foreign key cannot require a parent row to have a child.
Object storage and its file limits will be chosen when uploads are implemented.

Drafts, revisions, editing, and soft deletion are not part of the first version.
