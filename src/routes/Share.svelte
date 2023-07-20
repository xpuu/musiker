<div class="flex gap-4">
  <label class="label grow">
    <span>Share</span>
    <input
      class="input"
      title="Input (text)"
      type="text"
      placeholder="input text"
      bind:value={video}
      on:input={onShare}
    />
  </label>
  <label class="label grow">
    <span>Search</span>
    <input
      class="input"
      title="Input (text)"
      type="text"
      placeholder="input text"
      bind:value={find}
      on:input={onFind}
    />
  </label>
</div>
<pre>{JSON.stringify(song, null, 2)}</pre>
{#each Object.keys(song) as key}
  <div class="flex">
    <input type="text" value={key} readonly class="w-24" />
    <input type="text" bind:value={song[key]} class="grow" />
  </div>
{/each}

<!-- {#if ydata}<pre>{JSON.stringify(ydata, null, 2)}</pre>{/if}
{#if ymeta}<pre>{JSON.stringify(ymeta, null, 2)}</pre>{/if} -->

<script>
  import { api } from '$lib/api'

  const ytk = 'AIzaSyBC6L5olrntP15e_KUP0r7ax_ye2VRyU4w'

  let video = 'https://www.youtube.com/watch?v=-I8weN2aEmU'
  let find = ''

  let ydata = null
  let ymeta = null
  let song = {
    artist: '',
    song: '',
    album: '',
  }

  function onFind() {
    console.log(find)
  }

  async function onShare() {
    console.log(video)
    const m = video.match(/(?<=v=|v\/|vi=|vi\/|youtu\.be\/)[a-zA-Z0-9_-]{11}/)
    if (m) {
      const id = m[0]
      // api('https://www.googleapis.com/youtube/v3/videos?key={{ytApiKey}}&part=snippet&id=gccc9SaClPI')

      ;[ydata, ymeta] = await Promise.allSettled([
        api('https://www.googleapis.com/youtube/v3/videos')
          .query({
            key: ytk,
            part: 'snippet',
            id,
          })
          .get(),
        api('/scrape')
          .query({
            id,
          })
          .get(),
      ])
      if (ymeta.status === 'fulfilled') {
        song = Object.assign({}, ymeta.value)
      }
    }
  }
</script>
