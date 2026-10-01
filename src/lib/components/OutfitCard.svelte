<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";
  import OutfitImage from "./OutfitImage.svelte";
  import type { GameId } from "#lib/games.ts";
  import type { listOutfits } from "#lib/remote/outfits.remote.ts";

  let {
    outfit,
    gameId,
    collectionSearch = "",
    loading = "lazy",
  }: {
    outfit: Awaited<ReturnType<typeof listOutfits>>["outfits"][number];
    gameId: GameId;
    collectionSearch?: string;
    loading?: HTMLImgAttributes["loading"];
  } = $props();
</script>

<a
  class="group block min-w-0 overflow-hidden rounded-sm bg-panel"
  href={`/${gameId}/${outfit.id}${collectionSearch ? `?${collectionSearch}` : ""}`}
>
  <div class="aspect-[2/3]">
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
