# Equipment catalog

Equipment metadata lives in PostgreSQL, while icons are static assets. The seed
migration under `migrations/` populates the catalog, including base-game, Shadow
of the Erdtree, and Tarnished Pack equipment.

The catalog includes 722 armor entries and 487 armaments. It excludes cut and
unobtainable items, ammunition, spells, talismans, and Torrent appearances.

## Data and IDs

Each database entry has a `gameId`, `id`, `name`, `slot`, and `source`. Armor
slots are `head`, `chest`, `arms`, and `legs`. Armaments use `slot: "armament"`
and a nonempty `category`; armor has no category. Content sources are `base-game`,
`shadow-of-the-erdtree`, and `tarnished-pack`. Altered equipment is an independent
record because it is independently selectable in the game.

IDs retain the game's eight-digit uppercase hexadecimal inventory format,
including the armor type flag. These are not decimal parameter IDs or model IDs.
Keep them as strings, including leading zeroes. For example, Dagger is `000F4240`.
Future outfit records should reference both the game and item ID, since IDs from
different games can overlap. Correcting a display name must not change its ID.

`src/lib/games.ts` configures the games supported by the app's routes and their
display labels. The database's `game` table registers the IDs that equipment can
reference. Adding a game requires its route configuration, database entry, and
equipment. Equipment metadata is read from PostgreSQL through Drizzle. Future
localization can use a translation table keyed by game, equipment ID, and locale.

Icons are served from `/elden-ring/equipment/<id>.webp` and stored under `static/`.
`equipmentIconPath` in `src/lib/equipment.ts` builds these URLs from game and
equipment IDs. URLs are not stored in the database. User-upload storage is not
implemented yet.

The database enforces unique game/item identities, known and nonempty game IDs,
nonempty equipment IDs and names, allowed slots and sources, and category presence
for armaments only. Sources, slots, and armament categories use native PostgreSQL
enums with inferred TypeScript types. Adding an allowed value requires updating
the schema and generating a migration. Changing a name is an ordinary data update.

The unique `(game_id, id, slot)` key supports slot-aware foreign keys from future
outfit selections. Outfit tables are not implemented yet. Their constraints must
also enforce the outfit's game and one selection per position. Hand positions
will be modeled separately from the equipment's `armament` kind.

## Sources and attribution

The starting data and existing icons were copied from
[Elden Ring Automatic Checklist](https://github.com/CyberGiant7/Elden-Ring-Automatic-Checklist/tree/be4060d21f4d88bb437bedf76c2a1b06a62590ac),
commit `be4060d21f4d88bb437bedf76c2a1b06a62590ac`:

- `assets/json/all_items.json`
- `assets/json/dlc_items.json`
- `assets/json/altered_armor.json`
- `assets/img/armor/` and `assets/img/armament/`

Copyright 2022 Leonardo Dessì. The original MIT license is preserved in
[`LICENSES/elden-ring-automatic-checklist.txt`](../LICENSES/elden-ring-automatic-checklist.txt).
The checklist credits [ERDB](https://github.com/EldenRingDatabase/erdb) for its
database and [u/Erigondo's extracted game images](https://www.reddit.com/r/fromsoftware/comments/tqoav1/all_game_item_images_sfx_spell_textures_elden_ring/)
for artwork. Item artwork belongs to its original game rights holders,
FromSoftware/Bandai Namco; the repository's MIT license does not relicense it.

Additional item facts were checked on 2026-09-20 against:

- [Paramdex](https://github.com/soulsmods/Paramdex/tree/ff7245e524329bc3eab00036723d2bd53384cedf/ER/Names),
  for base-game and SOTE parameter ID/name mappings.
- [EldenRingTool's item list](https://github.com/kh0nsu/EldenRingTool/blob/68b07e6d96c7f29f4a46faa4a6bea7e693e35904/items.csv)
  and [The Grand Archives](https://github.com/The-Grand-Archives/Elden-Ring-CT-TGA/tree/7926205c5a2ed236dd31278c4f5579c964ceec35),
  for Tarnished Pack inventory IDs. Only factual item mappings were used; no
  scripts from these projects are included.
- [Eldenpedia](https://eldenring.wiki.gg/wiki/ELDEN_RING_Tarnished_Edition), for
  Tarnished Pack names, equipment categories, slots, and additional icons.
- [Fextralife's weapons](https://eldenring.wiki.fextralife.com/Weapons),
  [armor](https://eldenring.wiki.fextralife.com/Armor), and
  [Tarnished Edition](https://eldenring.wiki.fextralife.com/Elden_Ring_Tarnished_Edition)
  pages, for a second check of names, categories, slots, and Tarnished Pack
  coverage.

## Changes from the checklist

- Combined the three input lists into the equipment seed, retaining inventory IDs.
- Added content sources. Altered armor is retained as independent equipment,
  including Finger Robe, whose name differs from High Priest Robe.
- Added the Tarnished Pack's eight armaments and eighteen armor entries, including
  Silver Grooved Armor (Altered) and Leontiel's Hat (Altered).
- Corrected Fire Knight's Shortsword to Dagger and Freyja's Greatsword to Curved
  Greatsword.
- Corrected the names of Chain Gauntlets and Rellana's Twin Blades against the
  game's parameter names. Corrected Ascetic's Loincloth from legs to chest armor.
- Removed the wiki disambiguation suffix from Beast Claw's display name.
- Renamed icons by inventory ID. Existing WebP files are retained; PNG files that
  upstream named `.webp` are encoded as actual WebP at quality 90.
- Supplied missing altered SOTE icons and Tarnished Pack icons from Eldenpedia.
  Those are resized to at most 512 pixels per side, preserving aspect ratio and
  transparency, then encoded as WebP at quality 90.

## Maintaining the catalog

For equipment metadata changes, create a data migration with
`pnpm exec drizzle-kit generate --custom --name <change_name>` and write the
required `INSERT`, `UPDATE`, or `DELETE` statements. The planned consistency
checks are documented in
[`plans/catalog-validation.md`](plans/catalog-validation.md).

Do not rewrite migrations already applied to shared environments. For schema
changes, edit the Drizzle schema and run `pnpm db:generate`. `pnpm db:migrate`
applies both kinds locally, and `pnpm dev` already runs it before starting Vite.
Production must apply pending migrations as part of deployment.

Add matching static icons when adding equipment, and deploy those assets before
making the new items selectable. Database foreign keys cannot verify static files.
Retain IDs referenced by outfits and use restrictive foreign keys in that schema.
Record provenance for new data and artwork here.

Run `pnpm check` after edits. Until the planned catalog validation is implemented,
manually verify that new IDs are present in the migration and static icon directory.
Also inspect new icons because automated checks cannot prove that an icon depicts
the right item.
