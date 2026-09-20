<script lang="ts">
  import { games } from "#lib/games.ts";
  import type { PageProps } from "./$types";

  let { params }: PageProps = $props();

  const game = $derived(games[params.gameId]);
</script>

<svelte:head>
  <title>{game.name} Armoire</title>
  <meta name="description" content={`An outfit collection for ${game.name}.`} />
</svelte:head>

<main>
  <h1>{game.name} Armoire</h1>
  <p>An outfit collection for {game.name}.</p>
  <a href="/">All games</a>
</main>
