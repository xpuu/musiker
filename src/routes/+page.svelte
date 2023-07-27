<div class="container mx-auto flex flex-col gap-8 p-8">
  <header>
    <h1 class="mb-4">Musiker</h1>

    <Share />
  </header>
  {#if 0}<div>Error</div>{/if}
  <div class="grow overflow-auto">
    <Feed />
  </div>
</div>

<script>
  import Share from './Share.svelte'
  import Feed from './Feed.svelte'
</script>
