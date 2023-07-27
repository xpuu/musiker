<div class="flex flex-col gap-4">
  <div class="flex gap-4">
    <label class="label grow">
      <span>Share</span>
      <input
        class="input"
        type="text"
        placeholder="paste youtube video"
        bind:value={video}
        on:input={onShare}
      />
    </label>
    <label class="label grow">
      <span>Search</span>
      <input
        class="input"
        type="text"
        placeholder="input text"
        bind:value={find}
        on:input={onFind}
      />
    </label>
  </div>
  {#if $id}
    <div class="flex gap-4 items-start">
      <img
        src="https://i.ytimg.com/vi/{$id}/default.jpg"
        width="120"
        height="90"
        class="border border-gray-600 rounded-[4px]"
        alt="thumbnail"
      />
      <Ydata />
      <button class="btn btn-sm variant-filled-primary ml-auto" on:click={onShare}>Reload</button>
    </div>
    <Meta />
    <button class="btn variant-filled-primary self-start" on:click={doShare}>Share</button>
  {/if}
</div>

<script lang="ts">
  import { id, doShare } from '~/stores/share'
  import Ydata from './Ydata.svelte'
  import Meta from './Meta.svelte'

  let video = ''
  let find = ''

  function onFind() {
    console.log(find)
  }

  function onShare() {
    const m = video.match(/(?<=v=|v\/|vi=|vi\/|youtu\.be\/)[a-zA-Z0-9_-]{11}/)
    if (m) $id = m[0]
  }
</script>
