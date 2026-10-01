<script lang="ts">
  import { tick } from "svelte";
  import { equipmentIconPath } from "#lib/equipment.ts";
  import type { GameId } from "#lib/games.ts";
  import type { OutfitEquipment } from "#lib/server/db/schema/outfit.ts";
  import type { listEquipment } from "#lib/remote/equipment.remote.ts";

  let {
    gameId,
    position,
    label,
    equipment,
    value = "",
  }: {
    gameId: GameId;
    position: OutfitEquipment["position"];
    label: string;
    equipment: Awaited<ReturnType<typeof listEquipment>>;
    value?: string;
  } = $props();

  const selected = $derived(equipment.find((piece) => piece.id === value));
  let toggleButton = $state<HTMLButtonElement>();
  let searchInput = $state<HTMLInputElement>();
  let open = $state(false);
  let search = $state("");
  const matches = $derived(
    equipment.filter((piece) => piece.name.toLowerCase().includes(search.trim().toLowerCase())),
  );

  const togglePicker = async () => {
    open = !open;
    search = "";
    if (!open) return;

    await tick();
    searchInput?.focus();
  };

  const selectEquipment = ({ id }: { id: string }) => {
    value = id;
    open = false;
    toggleButton?.focus();
  };
</script>

<div class="grid min-w-0 gap-2">
  <span class="text-sm text-muted" id={`${position}-label`}>{label}</span>
  <input type="hidden" name={position} {value} />
  <button
    bind:this={toggleButton}
    class="flex form-field items-center justify-between gap-3 text-left"
    type="button"
    aria-labelledby={`${position}-label ${position}-selection`}
    aria-expanded={open}
    aria-controls={`${position}-options`}
    onclick={togglePicker}
  >
    <span class="flex min-w-0 flex-1 items-center gap-2" id={`${position}-selection`}>
      {#if selected}
        <img
          class="size-8 shrink-0 object-contain"
          src={equipmentIconPath(gameId, selected.id)}
          alt=""
          loading="lazy"
          width="32"
          height="32"
        />
      {/if}
      <span class="min-w-0 leading-snug wrap-anywhere">
        {selected?.name ?? (value || "Any")}
      </span>
    </span>
    <span class="shrink-0 text-muted" aria-hidden="true">{open ? "−" : "+"}</span>
  </button>

  {#if open}
    <div
      class="grid min-w-0 gap-2 rounded-sm border border-line bg-panel-raised p-2"
      id={`${position}-options`}
    >
      <label class="sr-only" for={`${position}-search`}>
        Search {label.toLowerCase()} equipment
      </label>
      <input
        bind:this={searchInput}
        bind:value={search}
        class="form-field"
        id={`${position}-search`}
        type="search"
        placeholder="Search equipment"
        onkeydown={(event) => {
          // Search narrows the choices; only Apply filters submits the collection form.
          if (event.key === "Enter") event.preventDefault();
          if (event.key === "Escape") {
            open = false;
            toggleButton?.focus();
          }
        }}
      />
      <ul class="max-h-64 overflow-y-auto overscroll-contain">
        <li>
          <button
            class="min-h-11 w-full rounded-sm px-3 py-3 text-left text-sm leading-snug hover:bg-panel aria-pressed:bg-panel aria-pressed:text-accent-light"
            type="button"
            aria-pressed={!value}
            onclick={() => selectEquipment({ id: "" })}>Any</button
          >
        </li>
        {#each matches as piece (piece.id)}
          <li class="[contain-intrinsic-block-size:auto_4rem] [content-visibility:auto]">
            <button
              class="flex min-h-14 w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm leading-snug hover:bg-panel aria-pressed:bg-panel aria-pressed:text-accent-light"
              type="button"
              aria-pressed={value === piece.id}
              onclick={() => selectEquipment({ id: piece.id })}
            >
              <img
                class="size-12 shrink-0 object-contain"
                src={equipmentIconPath(gameId, piece.id)}
                alt=""
                loading="lazy"
                width="48"
                height="48"
              />
              <span class="min-w-0 wrap-anywhere">{piece.name}</span>
            </button>
          </li>
        {:else}
          <li class="px-3 py-3 text-sm text-muted">No matching equipment.</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
