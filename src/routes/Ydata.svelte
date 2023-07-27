{#if $ydata}
  <div class="max-w-md">
    <div>
      <strong>{$ydata.title}</strong>
      [{$ydata.duration}]
    </div>
    <div class="text-sm mt-2">{$ydata.tags?.map(v => '#' + v).join(', ') || '-'}</div>
  </div>
  <div>
    <strong>Description</strong>
    <div class="text-sm mt-2">{$ydata.description || '-'}</div>
  </div>
{:else}
  Video not found
{/if}

<!-- {JSON.stringify($ydata, null, 2)} -->

<script lang="ts">
  import { ydata } from '~/stores/share'
</script>
