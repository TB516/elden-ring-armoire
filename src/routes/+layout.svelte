<script lang="ts">
  import "../app.css";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col">
  <header class="mx-gutter flex min-h-15 items-center py-3">
    <a class="inline-flex items-center gap-3 font-bold tracking-widest uppercase" href="/">
      <span class="size-3 rotate-45 bg-accent" aria-hidden="true"></span>
      Armoire
    </a>
  </header>

  {@render children()}
</div>
