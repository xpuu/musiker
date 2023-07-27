<div class="flex gap-4 items-stretch">
  <div class="w-1/2 grid grid-cols-[130px_1fr] gap-2 items-center">
    <div class="text-right">artist</div>
    <div>
      <input class="input" type="text" bind:value={$artist} />
    </div>
    <div class="text-right">song</div>
    <div>
      <input class="input" type="text" bind:value={$song} />
    </div>
    {#each $meta as [key, val], idx}
      <div class="text-right">
        <input class="input text-right" type="text" bind:value={key} placeholder="metakey" />
      </div>
      <div class="flex gap-2">
        <input class="input" type="text" bind:value={val} placeholder="?" />
        {#if val || key}
          <button type="button" class="btn-icon btn-icon-sm" on:click={() => onRemoveMeta(idx)}
            >❌</button
          >
        {/if}
      </div>
    {/each}
  </div>
  <div class="w-1/2 grid grid-cols-[50px_1fr] gap-2">
    <div class="text-right mt-2">notes</div>
    <div>
      <textarea
        class="textarea h-full"
        bind:value={$notes}
        placeholder="your personal relation to the music"
      />
    </div>
    <div class="text-right mt-2">plot</div>
    <div>
      <textarea
        class="textarea h-full"
        bind:value={$plot}
        placeholder="what's happening in the song or video"
      />
    </div>
  </div>
</div>

<!-- {JSON.stringify($meta, null, 2)} -->

<script lang="ts">
  // TODO Autocomplete for metadata keys
  // import { Autocomplete } from '@skeletonlabs/skeleton'
  // import type { AutocompleteOption } from '@skeletonlabs/skeleton'

  import { artist, song, notes, plot, meta } from '~/stores/share'

  function onRemoveMeta(idx: number) {
    $meta = $meta.filter((v, k) => k !== idx)
  }
</script>
