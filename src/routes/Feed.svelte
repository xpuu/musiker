<div class="grid grid-cols-3 gap-4">
  {#each $feed as item (item.id)}
    <div
      class="flex bg-gray-300 gap-4 p-4 rounded-sm items-start cursor-hand"
      on:click={() => onClick(item.id)}
    >
      <img
        src="https://i.ytimg.com/vi/{item.id}/default.jpg"
        width="120"
        height="90"
        class="border border-gray-600 rounded-[4px]"
        alt="thumbnail"
      />
      <div>
        <h1>{item.title}</h1>
        <div class="text-sm">{item.meta.notes || item.description}</div>
      </div>
    </div>
  {/each}
</div>

<script lang="ts">
  import { onMount } from 'svelte'

  import { feed, doGetFeed } from '~/stores/feed'

  onMount(doGetFeed)

  function onClick(id: string) {
    window.open('https://www.youtube.com/watch?v=' + id, '_blank')
  }
</script>
