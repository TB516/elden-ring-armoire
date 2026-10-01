<script lang="ts">
  import { page as pageState } from "$app/state";
  import EquipmentFilters from "#lib/components/EquipmentFilters.svelte";
  import OutfitCard from "#lib/components/OutfitCard.svelte";
  import { games } from "#lib/games.ts";
  import { listOutfits } from "#lib/remote/outfits.remote.ts";
  import type { PageProps } from "./$types";

  let { params }: PageProps = $props();

  const game = $derived(games[params.gameId]);
  let filtersOpen = $state(false);
  const pageNumber = $derived(Number(pageState.url.searchParams.get("page") ?? "1"));
  const gallery = $derived(await listOutfits({ gameId: params.gameId, page: pageNumber }));
  const collectionSearch = $derived(pageNumber > 1 ? `page=${pageNumber}` : "");

  const pageHref = ({ page }: { page: number }) =>
    `/${params.gameId}${page > 1 ? `?page=${page}` : ""}`;
</script>

<svelte:head>
  <title>{game.name} outfits | Armoire</title>
  <meta name="description" content={`Browse outfits made by ${game.name} players.`} />
</svelte:head>

<main class="mx-gutter py-8 sm:py-10">
  <div class="mb-8 flex flex-wrap items-center justify-between gap-5">
    <h1 class="text-page-title font-semibold text-accent-light">{game.name} outfits</h1>
    <button
      class="flex form-field w-auto items-center justify-between gap-3 lg:hidden"
      type="button"
      aria-expanded={filtersOpen}
      aria-controls="collection-filters"
      onclick={() => (filtersOpen = !filtersOpen)}
    >
      Filters
      <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
    </button>
  </div>

  <div class="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8">
    <div class={["min-w-0", !filtersOpen && "hidden lg:block"]}>
      <aside class="content-card" id="collection-filters" aria-label="Collection filters">
        <div class="mb-6 grid gap-4">
          <label class="grid gap-2 text-sm text-muted" for="outfit-search">
            Search
            <input
              class="form-field"
              id="outfit-search"
              type="search"
              name="q"
              placeholder="Search outfit titles"
              maxlength="100"
              disabled
            />
          </label>
          <label class="grid gap-2 text-sm text-muted" for="outfit-sort">
            Sort
            <select class="form-field" id="outfit-sort" name="sort" disabled>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
        <EquipmentFilters gameId={params.gameId} equipment={[]} selected={{}} disabled />
        <button class="mt-6 action-button w-full" type="button" disabled>Apply filters</button>
      </aside>
    </div>

    <div class="min-w-0">
      {#if gallery.outfits.length === 0}
        <section class="max-w-md py-12" aria-label="No outfits">
          <p class="text-lg">
            {#if pageNumber > 1}Nothing on this page.
            {:else}No outfits have been shared yet.{/if}
          </p>
          {#if pageNumber > 1}
            <a
              class="mt-4 inline-block text-accent-light hover:underline"
              href={pageHref({ page: 1 })}
            >
              Back to the first page
            </a>
          {/if}
        </section>
      {:else}
        <section
          class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4 min-[100rem]:grid-cols-5 min-[120rem]:grid-cols-6"
          aria-label="Outfits"
        >
          {#each gallery.outfits as outfit, index (outfit.id)}
            <OutfitCard
              {outfit}
              gameId={params.gameId}
              {collectionSearch}
              loading={index < 4 ? "eager" : "lazy"}
            />
          {/each}
        </section>
      {/if}

      {#if pageNumber > 1 || gallery.hasNextPage}
        <nav
          class="mt-10 flex items-center justify-between gap-4 text-sm text-muted"
          aria-label="Gallery pages"
        >
          {#if pageNumber > 1}
            <a
              class="text-accent-light hover:underline"
              href={pageHref({ page: pageNumber - 1 })}
              rel="prev"
            >
              ← Previous
            </a>
          {:else}<span></span>{/if}
          <span>Page {pageNumber}</span>
          {#if gallery.hasNextPage}
            <a
              class="text-accent-light hover:underline"
              href={pageHref({ page: pageNumber + 1 })}
              rel="next"
            >
              Next →
            </a>
          {:else}<span></span>{/if}
        </nav>
      {/if}
    </div>
  </div>
</main>
