<script lang="ts">
  import type { getOutfit } from "#lib/remote/outfits.remote.ts";
  import OutfitImage from "./OutfitImage.svelte";

  type OutfitImages = Awaited<ReturnType<typeof getOutfit>>["images"];

  let { title, images }: { title: string; images: OutfitImages } = $props();

  const imageDisplay = {
    "portrait-1": { label: "main portrait", order: 0 },
    "portrait-2": { label: "second portrait", order: 1 },
    landscape: { label: "landscape view", order: 2 },
  } satisfies Record<OutfitImages[number]["role"], { label: string; order: number }>;

  const orderedImages = $derived(
    images.toSorted((a, b) => imageDisplay[a.role].order - imageDisplay[b.role].order),
  );
  let viewer = $state<HTMLDialogElement>();
  let selectedIndex = $state(0);
  const selectedImage = $derived(orderedImages[selectedIndex]);
</script>

{#snippet thumbnails()}
  <div
    class="flex shrink-0 flex-wrap justify-center gap-3"
    role="group"
    aria-label="Choose outfit image"
  >
    {#each orderedImages as image, index (image.role)}
      <button
        class={[
          "h-20 shrink-0 cursor-pointer rounded-sm border-2 p-1",
          image.role === "landscape" ? "aspect-[3/2]" : "aspect-[2/3]",
          index === selectedIndex ? "border-accent" : "border-transparent hover:border-accent",
        ]}
        type="button"
        aria-label={`Show ${imageDisplay[image.role].label}`}
        aria-pressed={index === selectedIndex}
        onclick={() => (selectedIndex = index)}
      >
        <OutfitImage src={image.url} alt="" framed={false} />
      </button>
    {/each}
  </div>
{/snippet}

<section class="grid min-w-0 gap-4" aria-label="Outfit images">
  {#if selectedImage}
    <!-- On desktop, reserve height for the page header, thumbnails, and page padding. -->
    <button
      class="block h-[clamp(20rem,60svh,35rem)] w-full min-w-0 cursor-zoom-in sm:h-[clamp(24rem,60svh,40rem)] lg:h-[clamp(20rem,calc(100svh-26.5rem),56rem)]"
      type="button"
      aria-label={`Enlarge ${title}, ${imageDisplay[selectedImage.role].label}`}
      onclick={() => viewer?.showModal()}
    >
      <OutfitImage
        src={selectedImage.url}
        alt={`${title}, ${imageDisplay[selectedImage.role].label}`}
        loading="eager"
        framed={false}
      />
    </button>
  {/if}
  {#if orderedImages.length > 1}
    {@render thumbnails()}
  {/if}
</section>

<dialog
  bind:this={viewer}
  class="fixed inset-0 m-auto h-[calc(100dvh-2rem)] max-h-none w-[calc(100vw-2rem)] max-w-none bg-transparent p-4 text-foreground backdrop:bg-black/80"
  aria-label={`${title}, enlarged images`}
  onclick={(event) => {
    if (event.target instanceof Element && !event.target.closest("button, img")) {
      viewer?.close();
    }
  }}
>
  <div class="flex h-full flex-col gap-4">
    <div class="flex shrink-0 items-center justify-between gap-4">
      <p class="min-w-0 text-sm wrap-anywhere text-muted">{title}</p>
      <button
        class="form-field w-auto shrink-0 hover:bg-panel-raised"
        type="button"
        onclick={() => viewer?.close()}
      >
        Close
      </button>
    </div>
    {#if selectedImage}
      <div class="min-h-0 flex-1">
        <OutfitImage
          src={selectedImage.url}
          alt={`${title}, ${imageDisplay[selectedImage.role].label}`}
          loading="eager"
          framed={false}
        />
      </div>
    {/if}
    {#if orderedImages.length > 1}
      {@render thumbnails()}
    {/if}
  </div>
</dialog>
