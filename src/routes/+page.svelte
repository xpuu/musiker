<div class="container mx-auto flex flex-col gap-8 p-8">
  <header class="overflow-auto">
    <h1 class="mb-4">Musiker</h1>

    <Share />
  </header>
  <div>Error</div>
  <div class="grow overflow-auto">
    <Feed />
  </div>
</div>

<script>
  import Share from './Share.svelte'
  import Feed from './Feed.svelte'
</script>
