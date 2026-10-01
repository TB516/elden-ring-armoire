<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";

  let {
    src,
    alt,
    loading = "lazy",
    framed = true,
  }: {
    src: string;
    alt: string;
    loading?: HTMLImgAttributes["loading"];
    framed?: boolean;
  } = $props();

  let failed = $state(false);
  let image = $state<HTMLImageElement>();

  // Catch failures that occur before hydration, and reset when the URL changes.
  $effect(() => {
    if (image?.getAttribute("src") === src) {
      failed = image.complete && image.naturalWidth === 0;
    }
  });
</script>

<div
  class={[
    "relative size-full overflow-hidden",
    framed ? "bg-panel" : "flex items-center justify-center",
  ]}
>
  {#if failed}
    <div
      class="absolute inset-0 grid place-items-center p-4 text-center text-sm text-muted"
      role="img"
      aria-label={`${alt}. Image unavailable.`}
    >
      Image unavailable
    </div>
  {/if}
  <img
    bind:this={image}
    {src}
    {alt}
    {loading}
    class={[
      "relative block object-contain",
      framed ? "size-full" : "max-h-full max-w-full",
      failed && "opacity-0",
    ]}
    aria-hidden={failed}
    onerror={() => (failed = true)}
    onload={() => (failed = false)}
  />
</div>
