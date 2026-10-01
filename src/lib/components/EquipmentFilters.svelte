<script lang="ts">
  import type { ComponentProps } from "svelte";
  import type { GameId } from "#lib/games.ts";
  import type { getOutfit } from "#lib/remote/outfits.remote.ts";
  import { equipmentFields } from "./equipment.ts";
  import EquipmentPicker from "./EquipmentPicker.svelte";

  type EquipmentPiece = Awaited<ReturnType<typeof getOutfit>>["equipmentPieces"][number];

  let {
    gameId,
    equipment,
    selected,
    disabled = false,
  }: {
    gameId: GameId;
    equipment: ComponentProps<typeof EquipmentPicker>["equipment"];
    selected: Partial<Record<EquipmentPiece["position"], EquipmentPiece["id"]>>;
    disabled?: boolean;
  } = $props();
</script>

<fieldset {disabled}>
  <legend class="mb-5 font-semibold">Equipment</legend>
  <div class="grid gap-4">
    {#each equipmentFields as { position, label } (position)}
      {@const slot = position.endsWith("-hand") ? "armament" : position}
      <EquipmentPicker
        {gameId}
        {position}
        {label}
        equipment={equipment.filter((piece) => piece.slot === slot)}
        value={selected[position] ?? ""}
      />
    {/each}
  </div>
</fieldset>
