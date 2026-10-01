<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";
  import type { Effect } from "effect";
  import OutfitImage from "./OutfitImage.svelte";
  import type { GameId } from "#lib/games.ts";
  import type { listOutfits } from "#lib/server/outfits/list/index.ts";

  let {
    outfit,
    gameId,
    collectionQuery = "",
    loading = "lazy",
  }: {
    outfit: Effect.Success<ReturnType<typeof listOutfits>>["outfits"][number];
    gameId: GameId;
    collectionQuery?: string;
    loading?: HTMLImgAttributes["loading"];
  } = $props();
</script>

<a
  class="group block min-w-0 overflow-hidden rounded-sm bg-panel"
  href={`/${gameId}/${outfit.id}${collectionQuery ? `?${collectionQuery}` : ""}`}
>
  <div class="aspect-2/3 [content-visibility:auto]">
    <OutfitImage src={outfit.thumbnailUrl} alt={`Outfit: ${outfit.title}`} {loading} />
  </div>
  <div class="px-4 pt-3 pb-4">
    <h2
      class="text-base leading-snug font-semibold wrap-anywhere group-hover:text-accent-light group-focus-visible:text-accent-light"
    >
      {outfit.title}
    </h2>
    <p class="mt-1 text-xs wrap-anywhere text-muted sm:text-sm">
      {outfit.authorName}
    </p>
  </div>
</a>
