<script lang="ts">
  import { tick } from "svelte";
  import { equipmentIconPath } from "#lib/equipment.ts";
  import type { GameId } from "#lib/games.ts";
  import type { getOutfit } from "#lib/remote/outfits.remote.ts";

  type EquipmentPiece = Awaited<ReturnType<typeof getOutfit>>["equipmentPieces"][number];

  let {
    gameId,
    position,
    label,
    equipment,
    value = "",
  }: {
    gameId: GameId;
    position: EquipmentPiece["position"];
    label: string;
    equipment: EquipmentPiece[];
    value?: string;
  } = $props();

  const selected = $derived(equipment.find((piece) => piece.id === value));
  let picker = $state<HTMLDialogElement>();
  let searchInput = $state<HTMLInputElement>();
  let search = $state("");
  const matches = $derived(
    equipment.filter((piece) => piece.name.toLowerCase().includes(search.trim().toLowerCase())),
  );

  const openPicker = async () => {
    search = "";
    await tick();
    picker?.showModal();
    searchInput?.focus();
  };

  const selectEquipment = ({ id }: { id: string }) => {
    value = id;
    picker?.close();
  };
</script>

<div class="grid min-w-0 gap-2">
  <span class="text-sm text-muted" id={`${position}-label`}>{label}</span>
  <input type="hidden" name={position} {value} />
  <button
    class="flex form-field items-center justify-between gap-3 text-left"
    type="button"
    aria-labelledby={`${position}-label ${position}-selection`}
    aria-haspopup="dialog"
    onclick={openPicker}
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
    <span class="shrink-0 text-muted" aria-hidden="true">⌄</span>
  </button>
</div>

<dialog
  bind:this={picker}
  class="fixed inset-0 m-auto h-[42rem] max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg overflow-hidden rounded-sm border border-line bg-panel p-4 text-foreground backdrop:bg-black/80 sm:p-6"
  aria-label={`Choose ${label.toLowerCase()} equipment`}
  onclick={(event) => {
    if (event.target !== event.currentTarget) return;

    // A native dialog receives backdrop clicks as clicks on the dialog itself.
    const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < left ||
      event.clientX > right ||
      event.clientY < top ||
      event.clientY > bottom
    ) {
      picker?.close();
    }
  }}
>
  <div class="flex h-full flex-col gap-4">
    <div class="flex shrink-0 items-center justify-between gap-4">
      <h2 class="min-w-0 font-semibold wrap-anywhere">{label}</h2>
      <button
        class="form-field w-auto shrink-0 hover:bg-panel-raised"
        type="button"
        onclick={() => picker?.close()}>Close</button
      >
    </div>
    <label class="sr-only" for={`${position}-search`}>Search {label.toLowerCase()} equipment</label>
    <input
      bind:this={searchInput}
      bind:value={search}
      class="form-field shrink-0"
      id={`${position}-search`}
      type="search"
      placeholder="Search equipment"
      onkeydown={(event) => {
        // Searching inside the dialog must not submit the surrounding collection form.
        if (event.key === "Enter") event.preventDefault();
      }}
    />
    <ul class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1">
      <li>
        <button
          class="min-h-11 w-full rounded-sm px-3 py-3 text-left text-sm leading-snug wrap-anywhere hover:bg-panel-raised aria-pressed:bg-panel-raised aria-pressed:text-accent-light"
          type="button"
          aria-pressed={!value}
          onclick={() => selectEquipment({ id: "" })}>Any</button
        >
      </li>
      {#each matches as piece (piece.id)}
        <li>
          <button
            class="flex min-h-14 w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm leading-snug hover:bg-panel-raised aria-pressed:bg-panel-raised aria-pressed:text-accent-light"
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
      {/each}
      {#if matches.length === 0}
        <li class="px-3 py-3 text-sm text-muted">No matching equipment.</li>
      {/if}
    </ul>
  </div>
</dialog>
