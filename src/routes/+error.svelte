<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>{page.status} | Armoire</title>
</svelte:head>

<main class="mx-gutter py-16">
  <h1 class="text-page-title font-bold text-accent-light">{page.status}</h1>
  <p class="mt-4 text-muted">{page.error?.message ?? "Something went wrong."}</p>
  <a class="mt-6 inline-block text-accent-light hover:underline" href="/">Back to games</a>
</main>
