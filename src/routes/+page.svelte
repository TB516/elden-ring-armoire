<script lang="ts">
  import eldenRingCollection from "#lib/assets/elden-ring/collection.png";
  import { games } from "#lib/games.ts";

  const collections = Object.entries(games);
</script>

<svelte:head>
  <title>Armoire | Browse outfits by game</title>
  <meta name="description" content="Browse player-made outfits and the equipment behind them." />
</svelte:head>

<main class="mx-gutter py-10 sm:py-16">
  <h1 class="text-page-title font-semibold text-accent-light">Browse outfits by game</h1>
  <p class="mt-3 text-muted sm:text-lg">Find player-made looks and the equipment behind them.</p>

  <section id="games" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Games">
    {#each collections as [id, game] (id)}
      <a
        class="group relative flex min-h-48 items-end overflow-hidden bg-panel p-6 lg:min-h-60"
        href={`/${id}`}
        aria-label={`Browse ${game.name} outfits`}
      >
        {#if id === "elden-ring"}
          <img class="absolute inset-0 size-full object-cover" src={eldenRingCollection} alt="" />
        {/if}
        <div class="relative">
          {#if id !== "elden-ring"}<h2 class="mb-2 text-3xl font-bold">{game.name}</h2>{/if}
          <span
            class="text-sm text-accent-light group-hover:underline group-focus-visible:underline"
            >Browse outfits <span aria-hidden="true">↗</span></span
          >
        </div>
      </a>
    {/each}
  </section>
</main>
