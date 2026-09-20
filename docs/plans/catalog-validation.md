# Catalog validation plan

Catalog tests are deferred until the equipment and outfit schemas have settled.
Add checks for unique and correctly formatted IDs, nonempty names, expected catalog
counts, and one valid WebP icon per item. Use an isolated temporary PostgreSQL
database to apply the real migrations and exercise enum, foreign-key, identity,
and slot/category constraints. The test database must use its own required URL and
must never fall back to the development database.
