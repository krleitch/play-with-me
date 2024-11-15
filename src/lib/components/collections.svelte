<script lang="ts">
  import type { Collection } from '$lib/types';

  export let collections: Collection[];
</script>

<div class="w-96 bg-slate-950 p-2 text-white">

  {#each collections as collection}
      {collection.title}
  {/each}

</div>
